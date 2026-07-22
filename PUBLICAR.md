# Publicar

Todo está listo para publicar: los paquetes compilan, `exports` está bien
puesto, el versionado va con changesets y el CI verifica que el tarball se
instala en un proyecto limpio.

Lo único que falta es **elegir destino**. Abajo están las tres rutas con los
pasos exactos. Elige una, haz sus cambios y ejecuta el release.

---

## Antes de nada, en cualquiera de las tres

Sustituye la URL del registry, que ahora mismo es un marcador de posición:

```bash
# en el sitio donde vayáis a desplegar el Storybook
export TIKIN_REGISTRY_URL="https://nicolasgardila.github.io/tikin-design-system"
pnpm registry
```

Esa variable es la que se escribe dentro de los JSON del registry, así que
tiene que apuntar al dominio real **antes** de generarlos. Cámbiala también en
el `README.md`, donde aparece en los ejemplos de instalación.

---

## Opción A — npm privado, scope `@tikin`

La más estándar y la más cómoda de consumir. Requiere una cuenta npm de pago
para paquetes privados.

```bash
npm login                      # con la cuenta de la organización
npm org create tikin           # si el scope no existe todavía
```

No hay que tocar nada más: `access: "restricted"` ya está puesto en
`.changeset/config.json`, que es lo que mantiene los paquetes privados.

```bash
pnpm changeset                 # describe el cambio, elige minor para la 0.1.0
pnpm version                   # aplica versiones y escribe los changelogs
pnpm release                   # compila y publica
```

Para consumirlo no hace falta nada especial: `npm install @tikin/ui`.

## Opción B — GitHub Packages

Gratis para repositorios privados. El coste se traslada a los consumidores:
cada persona necesita un token configurado.

En la raíz, crea `.npmrc`:

```
@tikin:registry=https://npm.pkg.github.com
```

Y en `packages/ui/package.json` y `packages/tokens/package.json`:

```json
"publishConfig": { "registry": "https://npm.pkg.github.com" }
```

Cada consumidor necesita su propio `.npmrc` con un token de lectura:

```
@tikin:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

Después, el mismo `pnpm changeset` → `pnpm version` → `pnpm release`.

## Opción C — solo registry, sin publicar paquete

Cero infraestructura de publicación. Se consume copiando el código:

```bash
npx shadcn@latest add https://nicolasgardila.github.io/tikin-design-system/r/button.json
```

Requiere Tailwind 4 en cada proyecto consumidor. Con esta ruta pierdes la
actualización centralizada: lo que se copia deja de recibir correcciones.

Basta con desplegar `apps/storybook/storybook-static` en cualquier hosting
estático — los JSON del registry salen en `/r/` dentro de ese mismo build, así
que documentación y registry viajan juntos con un solo despliegue.

---

## Publicar automáticamente desde el CI

Cuando la ruta esté decidida, `.github/workflows/release.yml` ya está escrito
pero **desactivado a propósito**: publicar es irreversible y no debe activarse
sin que alguien lo decida. Para encenderlo, quita la condición `if: false` de su
único job y añade el secreto `NPM_TOKEN` al repositorio.

---

## Antes del primer release

- [ ] Elegir destino y aplicar sus cambios
- [ ] `TIKIN_REGISTRY_URL` con el dominio real, y regenerar el registry
- [ ] Actualizar las URLs del `README.md`
- [ ] Desplegar el Storybook (es la documentación y además sirve el registry)
- [ ] Revisar `pnpm storybook` a ojo: la auditoría automática detecta lo
      mecánico, no si algo es feo
