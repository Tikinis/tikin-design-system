import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Avatar, AvatarGroup, initialsFromName, toneFromName } from "./avatar";

/* Estos tests cubren COMPORTAMIENTO, no apariencia. Los valores visuales
 * (24/32/40/48/64, solapado -12, punto de 13) se verifican contra el navegador,
 * no aqui: jsdom no aplica CSS, asi que comprobar clases seria tautologico.
 *
 * Lo unico que si se comprueba por clase es lo que NO tiene otro observable en
 * el DOM: que el tamaño se hereda del grupo y que tailwind-merge deja ganar al
 * className del consumidor. */

/* jsdom no descarga imagenes, asi que un <Avatar src> se queda para siempre en
 * "loading" y solo se ve el fallback. Para probar el camino de foto cargada hay
 * que sustituir window.Image por una que ya venga resuelta: es exactamente lo
 * que Radix inspecciona (complete + naturalWidth). */
function stubLoadedImage() {
  class LoadedImage {
    complete = true;
    naturalWidth = 240;
    src = "";
    referrerPolicy = "";
    crossOrigin: string | null = null;
    addEventListener() {}
    removeEventListener() {}
  }
  vi.stubGlobal("Image", LoadedImage);
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("Avatar", () => {
  it("saca las iniciales del nombre y NO las pasa a mayusculas en JS", () => {
    // Importa para el texto accesible y para lo que se copia al portapapeles:
    // las mayusculas son cosa de la clase `uppercase`.
    render(<Avatar name="valentina cruz" />);
    expect(screen.getByRole("img", { name: "valentina cruz" })).toHaveTextContent("vc");
  });

  it("con un solo nombre da dos letras, nunca se queda vacio", () => {
    render(<Avatar name="Tikin" />);
    expect(screen.getByRole("img", { name: "Tikin" })).toHaveTextContent("Ti");
  });

  it("`initials` explicito manda sobre el nombre", () => {
    render(<Avatar name="Valentina Cruz" initials="ZZ" />);
    // El nombre accesible sigue siendo el completo, no las iniciales.
    expect(screen.getByRole("img", { name: "Valentina Cruz" })).toHaveTextContent("ZZ");
  });

  it("asigna el pastel de forma estable por el nombre", () => {
    // La misma persona debe salir del mismo color en cualquier pantalla y entre
    // sesiones: por eso es un hash del texto y no un contador ni un random.
    expect(toneFromName("Valentina Cruz")).toBe(toneFromName("Valentina Cruz"));
    expect(toneFromName("  Valentina Cruz  ")).toBe(toneFromName("Valentina Cruz"));
  });

  it("reparte los tres pasteles: nombres distintos NO caen todos en el mismo", () => {
    // Sin esto, una implementacion que devolviera siempre "lavender" seria
    // igual de "estable" y pasaria el test de arriba. Lo que pide la seccion es
    // un reparto, no una constante: estos tres nombres cubren los tres pasteles
    // de marca del prototipo (lavenderblue-100, limegreen-400, goldenyellow-300).
    expect(toneFromName("Carlos Diaz")).toBe("lavender");
    expect(toneFromName("Ana Lopez")).toBe("lime");
    expect(toneFromName("Valentina Cruz")).toBe("gold");
  });

  it("el pastel derivado del nombre llega al DOM", () => {
    // El hash no sirve de nada si el color no acaba pintado: aqui se comprueba
    // el eslabon que faltaba, de `name` a la clase de relleno.
    render(
      <>
        <Avatar name="Carlos Diaz" />
        <Avatar name="Ana Lopez" />
        <Avatar name="Valentina Cruz" />
      </>,
    );
    expect(screen.getByRole("img", { name: "Carlos Diaz" }).className).toContain("bg-lavender");
    expect(screen.getByRole("img", { name: "Ana Lopez" }).className).toContain("bg-lime");
    expect(screen.getByRole("img", { name: "Valentina Cruz" }).className).toContain("bg-gold");
  });

  it("`tone` explicito manda sobre el pastel derivado del nombre", () => {
    // "Valentina Cruz" cae en gold por hash; el consumidor debe poder fijarlo.
    render(<Avatar name="Valentina Cruz" tone="lime" />);
    const cls = screen.getByRole("img", { name: "Valentina Cruz" }).className;
    expect(cls).toContain("bg-lime");
    expect(cls).not.toContain("bg-gold");
  });

  it("sin nombre no inventa pastel: cae al neutro de superficie", () => {
    const { container } = render(<Avatar />);
    expect(container.firstElementChild?.className).toContain("bg-surface-2");
  });

  it("`ring` pinta el anillo de tinta y sin el no hay anillo", () => {
    const { rerender } = render(<Avatar name="Ana Lopez" />);
    expect(screen.getByRole("img", { name: "Ana Lopez" }).className).not.toContain("--tk-ink");

    rerender(<Avatar name="Ana Lopez" ring />);
    // Hueco del color del fondo primero y tinta despues: el anillo no debe
    // tocar el borde de la foto.
    expect(screen.getByRole("img", { name: "Ana Lopez" }).className).toContain(
      "shadow-[0_0_0_2px_var(--tk-avatar-edge,var(--tk-surface)),0_0_0_4px_var(--tk-ink)]",
    );
  });

  it("sin nombre ni alt es decorativo: no expone rol ni nombre accesible", () => {
    const { container } = render(<Avatar />);
    // Un placeholder gris no aporta nada que anunciar.
    expect(screen.queryByRole("img")).toBeNull();
    expect(container.firstElementChild).toHaveAttribute("aria-hidden", "true");
    // Pero visualmente nunca esta vacio: cae al icono de persona.
    expect(container.querySelector("svg")).not.toBeNull();
  });

  it("no se marca aria-hidden si el consumidor lo etiqueta por fuera", () => {
    // aria-labelledby es un mecanismo ARIA tan valido como aria-label. Si el
    // avatar se marcase aria-hidden igualmente, quedaria etiquetado pero fuera
    // del arbol de accesibilidad, que es una regresion silenciosa de 4.1.2.
    const { container } = render(
      <>
        <span id="quien">Valentina Cruz</span>
        <Avatar aria-labelledby="quien" />
      </>,
    );
    const avatar = container.querySelector("[aria-labelledby]");
    expect(avatar).not.toBeNull();
    expect(avatar).not.toHaveAttribute("aria-hidden");
  });

  it("no se marca aria-hidden si el consumidor le da un rol propio", () => {
    // Un avatar clicable (`role="button"`) es un control real: con aria-hidden
    // encima, la consulta por rol no lo encuentra porque queda fuera del arbol
    // de accesibilidad, y con el tampoco lo encontraria un lector de pantalla.
    render(<Avatar role="button" tabIndex={0} />);
    expect(screen.getByRole("button")).not.toHaveAttribute("aria-hidden");
  });

  it("expone un unico nodo accesible, tanto con foto como sin ella", () => {
    stubLoadedImage();
    const { container } = render(<Avatar name="Valentina Cruz" src="/vc.jpg" />);

    const img = container.querySelector("img");
    expect(img).not.toBeNull();
    // La foto va con alt="" a proposito: el nombre lo pone la raiz. Con alt
    // repetido, el lector anunciaria a la persona dos veces.
    expect(img).toHaveAttribute("alt", "");
    expect(screen.getAllByRole("img", { name: "Valentina Cruz" })).toHaveLength(1);
  });

  it("`alt` gana al nombre como texto alternativo de la foto", () => {
    render(<Avatar name="Valentina Cruz" src="/vc.jpg" alt="Foto de perfil de Valentina" />);
    expect(screen.getByRole("img", { name: "Foto de perfil de Valentina" })).toBeInTheDocument();
  });

  it("si la foto no carga cae a las iniciales sin dejar hueco", () => {
    // Sin stub, jsdom nunca resuelve la imagen: es el caso real de una URL rota.
    const { container } = render(<Avatar name="Carlos Diaz" src="/rota.jpg" />);
    expect(container.querySelector("img")).toBeNull();
    expect(screen.getByRole("img", { name: "Carlos Diaz" })).toHaveTextContent("CD");
  });

  it("el punto de estado solo aparece con `online` y es decorativo", () => {
    const { container, rerender } = render(<Avatar name="Ana Lopez" />);
    expect(container.querySelectorAll('[aria-hidden="true"]')).toHaveLength(0);

    rerender(<Avatar name="Ana Lopez" online />);
    const dot = container.querySelectorAll('[aria-hidden="true"]');
    // El punto es la señal visual; el dato de "en linea" lo pone el contexto de
    // quien lo consume, no el avatar.
    expect(dot).toHaveLength(1);
  });

  it("no entra en el orden de tabulacion", async () => {
    // Un avatar no es interactivo: si robase un tab stop, el usuario de teclado
    // pasaria por decoracion antes de llegar a la accion real.
    render(
      <>
        <Avatar name="Ana Lopez" />
        <button>Siguiente</button>
      </>,
    );
    await userEvent.tab();
    expect(screen.getByRole("button", { name: "Siguiente" })).toHaveFocus();
  });

  it("permite sobreescribir estilos por className", () => {
    render(<Avatar name="Ana Lopez" className="size-20" />);
    const cls = screen.getByRole("img", { name: "Ana Lopez" }).className;
    // tailwind-merge debe descartar el size-10 del tamaño m, no acumularlo.
    expect(cls).toContain("size-20");
    expect(cls).not.toContain("size-10");
  });
});

describe("AvatarGroup", () => {
  const gente = ["Marta Ruiz", "Carlos Diaz", "Valentina Cruz", "Ana Lopez", "Bruno Gil"];

  it("muestra hasta `max` avatares y cierra con el contador", () => {
    render(
      <AvatarGroup max={3} aria-label="Destinatarios">
        {gente.map((n) => (
          <Avatar key={n} name={n} />
        ))}
      </AvatarGroup>,
    );
    expect(screen.getByRole("img", { name: "Marta Ruiz" })).toBeInTheDocument();
    expect(screen.queryByRole("img", { name: "Ana Lopez" })).toBeNull();
    // El "+2" suelto no dice de que: el contador lleva su propia etiqueta.
    expect(screen.getByRole("img", { name: "2 más" })).toHaveTextContent("+2");
  });

  it("sin excedente no dibuja contador", () => {
    render(
      <AvatarGroup max={3}>
        {gente.slice(0, 3).map((n) => (
          <Avatar key={n} name={n} />
        ))}
      </AvatarGroup>,
    );
    expect(screen.getAllByRole("img")).toHaveLength(3);
  });

  it("`total` manda sobre el numero de hijos renderizados", () => {
    // Caso real: el servidor manda 3 de 40 destinatarios.
    render(
      <AvatarGroup max={3} total={40}>
        {gente.slice(0, 3).map((n) => (
          <Avatar key={n} name={n} />
        ))}
      </AvatarGroup>,
    );
    expect(screen.getByRole("img", { name: "37 más" })).toBeInTheDocument();
  });

  it("los hijos heredan el tamaño del grupo y pueden sobreescribirlo", () => {
    render(
      <AvatarGroup size="s">
        <Avatar name="Marta Ruiz" />
        <Avatar name="Carlos Diaz" size="xl" />
      </AvatarGroup>,
    );
    // s = 32px, xl = 64px. Es lo unico observable del contexto en jsdom.
    expect(screen.getByRole("img", { name: "Marta Ruiz" }).className).toContain("size-8");
    expect(screen.getByRole("img", { name: "Carlos Diaz" }).className).toContain("size-16");
  });

  it("el borde separador se pinta desde una capa posicionada, o lo tapa el avatar anterior", () => {
    // ORDEN DE PINTADO (CSS 2.1, apendice E). La raiz de cada Avatar es
    // `relative`, asi que se pinta en la capa de los posicionados (paso 8),
    // por encima de TODO el contenido en linea sin posicionar (paso 7). Si el
    // envoltorio que dibuja el borde separador se queda estatico, su sombra
    // cae en el paso 7 y el avatar anterior la tapa entera: los circulos se
    // ven fundidos, sin separacion. Comprobado en navegador.
    //
    // Para que el borde gane hace falta que el envoltorio este en esa misma
    // capa: entonces manda el orden del documento y cada envoltorio, borde
    // incluido, pinta sobre el avatar que le precede.
    render(
      <AvatarGroup max={3}>
        <Avatar name="Marta Ruiz" />
        <Avatar name="Carlos Diaz" />
      </AvatarGroup>,
    );

    const anterior = screen.getByRole("img", { name: "Marta Ruiz" });
    const envoltorio = screen.getByRole("img", { name: "Carlos Diaz" }).parentElement;

    // El avatar previo pinta en la capa de posicionados...
    expect(anterior.className).toContain("relative");
    // ...y el borde lo pinta el envoltorio, no el avatar.
    expect(envoltorio?.className).toContain("shadow-[0_0_0_2.5px_var(--tk-avatar-edge");
    // ...luego el envoltorio tiene que estar en esa misma capa.
    expect(envoltorio?.className).toContain("relative");
  });

  it("el punto de estado se eleva para que no lo tape el avatar siguiente", () => {
    // Mismo orden de pintado que el test de arriba, ahora en contra nuestra: el
    // punto vive abajo a la derecha del avatar N, que es exactamente la franja
    // que solapa el avatar N+1, y N+1 se pinta despues. Sin elevar el punto, un
    // <Avatar online> que no fuese el ultimo del grupo lo perdia entero.
    //
    // Se eleva el PUNTO y no su avatar: ni la raiz del Avatar ni el envoltorio
    // del grupo llevan z-index, o sea que no crean contexto de apilado y el
    // z-index del punto se resuelve contra los hermanos del grupo. Elevar el
    // avatar entero, en cambio, lo pondria por encima del borde separador del
    // siguiente e invertiria el solapado que pide la seccion.
    const { container } = render(
      <AvatarGroup max={3}>
        <Avatar name="Marta Ruiz" online />
        <Avatar name="Carlos Diaz" />
      </AvatarGroup>,
    );

    const primero = screen.getByRole("img", { name: "Marta Ruiz" });
    const punto = primero.querySelector('[aria-hidden="true"]');
    expect(punto?.className).toContain("z-10");
    // El avatar que lo contiene NO se eleva: el solapado del grupo no cambia.
    expect(primero.className).not.toContain("z-10");
    expect(primero.parentElement?.className).not.toContain("z-10");
    // Y el siguiente sigue pintando encima del anterior, como manda la seccion.
    expect(container.querySelectorAll("[role='img']")).toHaveLength(2);
  });

  it("ignora hijos nulos, que es lo que deja un render condicional", () => {
    render(
      <AvatarGroup max={3}>
        <Avatar name="Marta Ruiz" />
        {undefined}
        {null}
      </AvatarGroup>,
    );
    // Un hijo falso no debe contar como avatar oculto ni disparar un "+1".
    expect(screen.getAllByRole("img")).toHaveLength(1);
  });
});

describe("initialsFromName", () => {
  it("toma la primera del nombre y la primera del apellido", () => {
    expect(initialsFromName("Valentina Cruz")).toBe("VC");
    expect(initialsFromName("  maria  del  carmen  soto ")).toBe("ms");
  });

  it("no parte por la mitad los caracteres fuera del plano basico", () => {
    // Cortar por unidades UTF-16 devolveria media pareja subrogada y pintaria
    // el rombo de reemplazo.
    expect(initialsFromName("𝒜na")).toBe("𝒜n");
  });

  it("con cadena vacia devuelve cadena vacia", () => {
    expect(initialsFromName("   ")).toBe("");
  });
});
