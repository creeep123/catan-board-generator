# Catan Board Tile Illustrations Design

**Date**: 2026-04-04
**Status**: Approved

## Problem

The Catan Board Generator renders hex tiles as solid-colored divs with CSS clip-path. This looks plain and does not resemble the visual richness of a real Catan board game.

## Decision

Add flat-style SVG illustrations for each resource type, rendered as inline React SVG components inside the existing hex tile divs.

## Approach

**Inline SVG React Components** (chosen over static files and pure CSS enhancement):
- Zero extra HTTP requests
- Resolution-independent rendering
- Customizable via props (size)
- Perfect compatibility with existing CSS clip-path architecture
- Small bundle impact

## Component Architecture

### New file: `src/themes/default/blocks/tile-illustrations.tsx`

Contains:
- `TileIllustration({ resource, size })` — dispatcher component that renders the correct SVG based on resource type
- 6 illustration components: `OreIllustration`, `BrickIllustration`, `SheepIllustration`, `WoodIllustration`, `WheatIllustration`, `DesertIllustration`
- Each component accepts a `size` number prop (16 for normal mode, 14 for expanded mode)

### Modified file: `src/themes/default/blocks/catan-generator.tsx`

Changes:
1. Import `TileIllustration` from `tile-illustrations.tsx`
2. Replace `RESOURCE_COLORS` (solid colors) with gradient color pairs: `{ from: string, to: string }`
3. Hex div background changes from solid color to `linear-gradient`
4. Add `TileIllustration` as an absolutely-positioned SVG layer inside each hex div, below the chit
5. Remove desert emoji, replace with `DesertIllustration`
6. Number chit rendering stays unchanged
7. Resource label rendering (separate pass outside tiles) stays unchanged

## Visual Design Per Resource

| Resource  | Background Gradient         | Illustration Elements                              |
|-----------|-----------------------------|----------------------------------------------------|
| Wood      | `#1B5E20` → `#2E7D32`      | 2-3 simple pine tree silhouettes, layered greens    |
| Sheep     | `#689F38` → `#7CB342`      | 1-2 white circular sheep shapes, light grass dots  |
| Wheat     | `#F9A825` → `#E8B830`      | 2-3 wheat stalk silhouettes, golden gradient        |
| Brick     | `#BF360C` → `#C75B39`      | 2-3 stacked brick shapes, terracotta red           |
| Ore       | `#5D4037` → `#7A6B5D`      | Mountain silhouette + ore crystal shapes            |
| Desert    | `#E0C068` → `#E8C872`      | Sand dune curves + small cactus silhouette          |

Design principles:
- Illustrations cover 60-70% of tile area, leaving room for the number chit
- Colors have more depth than current flat colors but maintain overall palette coherence
- Simple lines, no strokes or complex details — flat illustration style
- SVG uses `<path>` and basic shapes only, no external dependencies

## Rendering Structure (Before → After)

Before:
```
hex div (clip-path, solid color background)
  ├── number chit (circular badge)
  └── desert emoji (desert only)
```

After:
```
hex div (clip-path, linear-gradient background)
  ├── TileIllustration SVG (absolute, opacity 0.85, pointer-events-none)
  ├── number chit (circular badge, unchanged)
  └── DesertIllustration SVG (replaces emoji for desert)
```

## Unchanged Components

- Tile positioning calculations (`getTileOffsets`)
- Layout mode switching (normal/expanded)
- Rule engine and board generation logic
- Resource label rendering (separate pass)
- Examples page
- All other components and pages

## Constraints

- Must work in both normal mode (16x16 tiles) and expanded mode (14x14 tiles)
- Must not impact page load performance (inline SVG, no external requests)
- Number chits must remain clearly readable on top of illustrations
- SVG illustrations must be clipped by the existing CSS clip-path hex shape
