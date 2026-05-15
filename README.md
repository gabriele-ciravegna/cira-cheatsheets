# CIRA Cheatsheet Library

9 cheatsheet HTML per lo stack `/costruiamo` CIRA: 282 comandi indicizzati cross-tool, ricerca FTS client-side, tema Ardea dark (Modello C Mercurio variant).

## Apri locale

```bash
open ~/WORK/SITI/cheatsheets/index.html
```

## Cosa contiene

| Cheatsheet | Comandi | Note |
|---|---|---|
| GSD | 88 + 33 agent | Spec-driven dev, v1.42.2 |
| Gstack | 51 skill | Ship-first toolkit |
| Superpowers | 11 | TDD + brainstorming (Obra) |
| Ruflo | 20+ | Sandbox parallel iterations |
| Compound Engineering | 20 + 48 agent | Plugin `ce-*`, v3.8.2 |
| Agent Teams | 3 | Teams vs Subagents built-in CC |
| CIRA Custom | 14 | orchestra, /costruiamo, mentori |
| Claude Code basics | 71 | CLI ufficiale Anthropic |
| Bash + macOS | 66 | Shell + launchd quotidiano |

## Architettura

- `index.html` — landing + decision matrix
- `daily-10.html` — top 10 comandi quotidiani
- `workflows-cira.html` — 10 sequenze cross-tool reali
- `<tool>/index.html` — un cheatsheet per tool
- `assets/style.css` — tema Ardea dark
- `assets/copy.js` — copy button su tutti i `<pre>`
- `assets/search.js` — FTS client-side cross-tool
- `assets/glossary.js` — right-rail "per chi non è tecnico"
- `assets/print.css` — print/PDF styles
- `assets/data/all-commands.json` — index search (67KB, 282 entry)
- `assets/data/glossary-data.json` — testi tooltip non-tech
- `assets/data/versions.json` — versioni tool tracciate

## Generazione

Build via 9 sub-agent paralleli (Haiku research → Sonnet HTML synthesis).
Tempo wall-clock ~60-75 min. Token ~150k.

## Tema Ardea

Sorgente: [`BUSINESS-OS/brand/ARDEA VISUAL/VISUAL-SYSTEM.md`](../../BUSINESS-OS/brand/ARDEA%20VISUAL/VISUAL-SYSTEM.md).
Variante dark Mercurio. Tipografia Instrument Serif (display) + DM Sans (body) + JetBrains Mono (code).

## Hook staleness

`~/.claude/hooks/cheatsheet-staleness.sh` controlla a ogni SessionStart se `assets/data/versions.json` matcha la versione corrente GSD installata. Flag warning se diverso.

## Auto-update

Ri-genera dopo bump versione tool (GSD update, ecc.) ripetendo il workflow `/costruiamo cheatsheet library` o manualmente:

```bash
# Phase 1 — research (9× Haiku parallel)
# Phase 2 — template (assets/)
# Phase 3 — synthesis (9× Sonnet parallel)
# Phase 4 — index + daily-10 + workflows-cira
```

---

Generato 2026-05-15 · CIRA Management
