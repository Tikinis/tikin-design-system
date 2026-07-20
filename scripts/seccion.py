#!/usr/bin/env python3
"""Extrae una seccion del documento de diseño.

El documento pesa 720 KB. Leerlo entero para trabajar en un solo componente
desperdicia contexto, asi que esto saca unicamente la seccion pedida.

    python3 scripts/seccion.py toggle           # texto legible (por defecto)
    python3 scripts/seccion.py toggle --html    # HTML crudo, con estilos inline
    python3 scripts/seccion.py --listar         # todas las secciones

El prototipo aplica los estilos INLINE, no con clases: los valores exactos
(alturas, radios, colores, tipografias) estan en los atributos style=, asi que
para sacar medidas hay que mirar --html, no el texto.
"""

import argparse
import pathlib
import re
import sys

DOC = pathlib.Path(__file__).resolve().parent.parent / "docs" / "Sistema de Diseño.dc.html"


def cargar() -> str:
    if not DOC.exists():
        sys.exit(f"No encuentro el documento en {DOC}")
    return DOC.read_text(encoding="utf-8")


def secciones(html: str) -> list[tuple[str, int, int]]:
    marcas = [(m.group(1), m.start()) for m in re.finditer(r'<section[^>]*id="([^"]+)"', html)]
    return [
        (nombre, ini, marcas[i + 1][1] if i + 1 < len(marcas) else len(html))
        for i, (nombre, ini) in enumerate(marcas)
    ]


def a_texto(fragmento: str) -> str:
    # Los <style> y <script> no aportan nada legible y ensucian mucho.
    fragmento = re.sub(r"<(style|script)[^>]*>.*?</\1>", " ", fragmento, flags=re.S)
    texto = re.sub(r"<[^>]+>", " ", fragmento)
    texto = texto.replace("&nbsp;", " ").replace("&amp;", "&").replace("&lt;", "<").replace("&gt;", ">")
    return re.sub(r"[ \t]+", " ", re.sub(r"\s*\n\s*", "\n", texto)).strip()


def main() -> None:
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument("seccion", nargs="?", help="id de la seccion, p. ej. toggle")
    p.add_argument("--html", action="store_true", help="HTML crudo en vez de texto")
    p.add_argument("--listar", action="store_true", help="lista las secciones y su tamaño")
    args = p.parse_args()

    html = cargar()
    todas = secciones(html)

    if args.listar or not args.seccion:
        print(f"{len(todas)} secciones:\n")
        for i, (nombre, ini, fin) in enumerate(todas, 1):
            print(f"  {i:2d}. {nombre:<14} {fin - ini:>7,} chars")
        return

    for nombre, ini, fin in todas:
        if nombre == args.seccion:
            fragmento = html[ini:fin]
            print(fragmento if args.html else a_texto(fragmento))
            return

    disponibles = ", ".join(n for n, _, _ in todas)
    sys.exit(f"No existe la seccion '{args.seccion}'.\n\nDisponibles: {disponibles}")


if __name__ == "__main__":
    main()
