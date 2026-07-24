# Skill `tikin-ui` para Claude Code

Hace que Claude, en **cualquier repo**, sepa que el front de Tikin se construye
con `@tikin/ui` y lo use en vez de inventar componentes. Es un único archivo
autocontenido (`tikin-ui/SKILL.md`); se auto-activa cuando la tarea es de UI.

## Instalar para todas tus sesiones (personal)

```bash
mkdir -p ~/.claude/skills/tikin-ui
curl -sL https://raw.githubusercontent.com/Tikinis/tikin-design-system/main/skills/tikin-ui/SKILL.md \
  -o ~/.claude/skills/tikin-ui/SKILL.md
```

Reinicia Claude Code. Comprueba con `/skills` que aparece `tikin-ui`.

## Instalar en un repo (compartida con el equipo de esa app)

Cométela dentro del repo consumidor (Tikin.app, admin, landing…) para que
cualquiera que lo clone la tenga:

```bash
mkdir -p .claude/skills/tikin-ui
curl -sL https://raw.githubusercontent.com/Tikinis/tikin-design-system/main/skills/tikin-ui/SKILL.md \
  -o .claude/skills/tikin-ui/SKILL.md
git add .claude/skills/tikin-ui/SKILL.md && git commit -m "Añadir skill tikin-ui"
```

## Actualizar

Vuelve a correr el `curl`; sobrescribe el archivo con la última versión. La
fuente de verdad es este repo (`skills/tikin-ui/SKILL.md`), así que la skill
evoluciona con el DS.

## Qué hace

- Le da a Claude el **catálogo de 37 componentes** y sus símbolos de import.
- Le dice **cómo instalar** el DS (npm o registry) y cómo montar el theming.
- Fija las **reglas del sistema** (no inventar componentes, `tone=` en Chip,
  iconos Phosphor, mayúsculas por CSS…).
- Apunta al **Storybook y al registry en vivo** como fuente de verdad para las
  props exactas.
