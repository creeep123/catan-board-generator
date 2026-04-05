// Note: No React import needed — modern Next.js uses automatic JSX transform

type ResourceType = 'ore' | 'brick' | 'sheep' | 'wood' | 'wheat' | 'desert';

// Note: `size` prop from spec is intentionally omitted — SVGs use w-full h-full
// and inherit correct sizing from the parent hex div (w-16 h-16 or w-14 h-14).

interface TileIllustrationProps {
  resource: ResourceType;
}

// All illustrations use viewBox="0 0 100 100" and are vertically centered
// in the usable area of the hex (roughly y=10 to y=90) to avoid clipping by
// the hex clip-path which cuts triangular regions at top and bottom.

function WoodIllustration() {
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full" aria-hidden="true">
      {/* Background trees - darker layer */}
      <polygon points="25,78 30,38 35,78" fill="#1B5E20" opacity="0.6" />
      <polygon points="20,78 27,43 34,78" fill="#1B5E20" opacity="0.6" />
      {/* Foreground trees */}
      <polygon points="58,82 66,22 74,82" fill="#2E7D32" />
      <polygon points="53,82 60,27 67,82" fill="#388E3C" />
      {/* Tree trunks */}
      <rect x="64" y="67" width="4" height="15" fill="#5D4037" />
      <rect x="57" y="70" width="3" height="12" fill="#5D4037" />
      <rect x="29" y="65" width="2" height="13" fill="#4E342E" opacity="0.6" />
      {/* Small accent tree */}
      <polygon points="40,82 44,47 48,82" fill="#43A047" opacity="0.7" />
      <rect x="43" y="72" width="2" height="10" fill="#5D4037" opacity="0.7" />
    </svg>
  );
}

function SheepIllustration() {
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full" aria-hidden="true">
      {/* Grass dots */}
      <circle cx="20" cy="78" r="2" fill="#558B2F" opacity="0.5" />
      <circle cx="45" cy="82" r="1.5" fill="#558B2F" opacity="0.5" />
      <circle cx="75" cy="80" r="2" fill="#558B2F" opacity="0.5" />
      <circle cx="85" cy="84" r="1.5" fill="#558B2F" opacity="0.4" />
      <circle cx="10" cy="84" r="1" fill="#558B2F" opacity="0.4" />
      {/* Sheep body */}
      <ellipse cx="35" cy="62" rx="14" ry="10" fill="white" opacity="0.9" />
      <ellipse cx="40" cy="60" rx="12" ry="9" fill="white" opacity="0.85" />
      {/* Sheep head */}
      <circle cx="50" cy="57" r="6" fill="#F5F5F5" />
      {/* Sheep legs */}
      <rect x="28" y="69" width="2" height="8" fill="#9E9E9E" rx="1" />
      <rect x="33" y="70" width="2" height="7" fill="#9E9E9E" rx="1" />
      <rect x="38" y="70" width="2" height="7" fill="#9E9E9E" rx="1" />
      <rect x="43" y="69" width="2" height="8" fill="#9E9E9E" rx="1" />
      {/* Second smaller sheep */}
      <ellipse cx="72" cy="72" rx="10" ry="7" fill="white" opacity="0.7" />
      <circle cx="80" cy="69" r="4.5" fill="#F5F5F5" opacity="0.7" />
    </svg>
  );
}

function WheatIllustration() {
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full" aria-hidden="true">
      {/* Wheat stalk 1 - left */}
      <line x1="25" y1="85" x2="25" y2="18" stroke="#8D6E37" strokeWidth="2" />
      <ellipse cx="25" cy="18" rx="3" ry="8" fill="#F9A825" transform="rotate(-5 25 18)" />
      <ellipse cx="25" cy="32" rx="3" ry="7" fill="#FBC02D" transform="rotate(5 25 32)" />
      <ellipse cx="25" cy="44" rx="2.5" ry="6" fill="#F9A825" transform="rotate(-3 25 44)" />
      {/* Wheat stalk 2 - center */}
      <line x1="50" y1="85" x2="50" y2="14" stroke="#8D6E37" strokeWidth="2" />
      <ellipse cx="50" cy="14" rx="3.5" ry="9" fill="#F9A825" transform="rotate(3 50 14)" />
      <ellipse cx="50" cy="28" rx="3" ry="7.5" fill="#FBC02D" transform="rotate(-4 50 28)" />
      <ellipse cx="50" cy="41" rx="2.5" ry="6.5" fill="#F9A825" transform="rotate(2 50 41)" />
      <ellipse cx="50" cy="52" rx="2" ry="5" fill="#FBC02D" transform="rotate(-2 50 52)" />
      {/* Wheat stalk 3 - right */}
      <line x1="75" y1="85" x2="75" y2="22" stroke="#8D6E37" strokeWidth="2" />
      <ellipse cx="75" cy="22" rx="3" ry="8" fill="#FBC02D" transform="rotate(-4 75 22)" />
      <ellipse cx="75" cy="35" rx="2.5" ry="7" fill="#F9A825" transform="rotate(3 75 35)" />
      <ellipse cx="75" cy="46" rx="2" ry="5.5" fill="#FBC02D" transform="rotate(-2 75 46)" />
    </svg>
  );
}

function BrickIllustration() {
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full" aria-hidden="true">
      {/* Bottom row of bricks */}
      <rect x="10" y="65" width="22" height="12" rx="1" fill="#D84315" />
      <rect x="36" y="65" width="22" height="12" rx="1" fill="#E64A19" />
      <rect x="62" y="65" width="22" height="12" rx="1" fill="#D84315" />
      {/* Middle row - offset */}
      <rect x="5" y="49" width="22" height="12" rx="1" fill="#BF360C" />
      <rect x="31" y="49" width="22" height="12" rx="1" fill="#C75B39" />
      <rect x="57" y="49" width="22" height="12" rx="1" fill="#BF360C" />
      <rect x="83" y="49" width="10" height="12" rx="1" fill="#C75B39" />
      {/* Top row */}
      <rect x="10" y="33" width="22" height="12" rx="1" fill="#E64A19" />
      <rect x="36" y="33" width="22" height="12" rx="1" fill="#D84315" />
      <rect x="62" y="33" width="22" height="12" rx="1" fill="#E64A19" />
      {/* Top accent row */}
      <rect x="18" y="20" width="18" height="10" rx="1" fill="#C75B39" opacity="0.7" />
      <rect x="40" y="20" width="18" height="10" rx="1" fill="#BF360C" opacity="0.7" />
      {/* Mortar lines (subtle) */}
      <line x1="10" y1="65" x2="84" y2="65" stroke="#FFF3E0" strokeWidth="0.5" opacity="0.4" />
      <line x1="5" y1="49" x2="93" y2="49" stroke="#FFF3E0" strokeWidth="0.5" opacity="0.4" />
      <line x1="10" y1="33" x2="84" y2="33" stroke="#FFF3E0" strokeWidth="0.5" opacity="0.4" />
    </svg>
  );
}

function OreIllustration() {
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full" aria-hidden="true">
      {/* Mountain body */}
      <polygon points="10,80 50,10 90,80" fill="#6D4C41" />
      <polygon points="25,80 50,20 75,80" fill="#795548" />
      {/* Snow cap */}
      <polygon points="42,20 50,10 58,20 53,25 47,25" fill="#ECEFF1" opacity="0.6" />
      {/* Rock face details */}
      <polygon points="30,60 40,45 50,60" fill="#5D4037" opacity="0.5" />
      <polygon points="55,65 65,47 75,65" fill="#5D4037" opacity="0.4" />
      {/* Ore crystals */}
      <polygon points="38,68 42,60 46,68 42,72" fill="#B0BEC5" />
      <polygon points="52,73 56,65 60,73 56,77" fill="#CFD8DC" />
      <polygon points="45,76 48,69 51,76 48,80" fill="#90A4AE" opacity="0.8" />
      {/* Small crystals */}
      <circle cx="32" cy="75" r="3" fill="#B0BEC5" opacity="0.6" />
      <circle cx="65" cy="77" r="2.5" fill="#CFD8DC" opacity="0.5" />
    </svg>
  );
}

function DesertIllustration() {
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full" aria-hidden="true">
      {/* Sand dunes - back */}
      <path d="M0,68 Q25,48 50,63 Q75,78 100,58 L100,90 L0,90 Z" fill="#D4A843" opacity="0.5" />
      {/* Sand dunes - front */}
      <path d="M0,78 Q30,58 60,73 Q85,83 100,68 L100,90 L0,90 Z" fill="#C6973B" opacity="0.6" />
      {/* Cactus */}
      <rect x="30" y="38" width="6" height="30" rx="3" fill="#558B2F" />
      <rect x="22" y="45" width="10" height="5" rx="2.5" fill="#558B2F" />
      <rect x="22" y="38" width="5" height="12" rx="2.5" fill="#558B2F" />
      <rect x="36" y="41" width="8" height="5" rx="2.5" fill="#558B2F" />
      <rect x="39" y="33" width="5" height="13" rx="2.5" fill="#558B2F" />
      {/* Small rocks */}
      <ellipse cx="70" cy="80" rx="6" ry="3" fill="#A1887F" opacity="0.5" />
      <ellipse cx="80" cy="84" rx="4" ry="2" fill="#8D6E63" opacity="0.4" />
      {/* Sun glow */}
      <circle cx="80" cy="20" r="10" fill="#FFF9C4" opacity="0.5" />
      <circle cx="80" cy="20" r="6" fill="#FFEE58" opacity="0.6" />
    </svg>
  );
}

export function TileIllustration({ resource }: TileIllustrationProps) {
  switch (resource) {
    case 'wood': return <WoodIllustration />;
    case 'sheep': return <SheepIllustration />;
    case 'wheat': return <WheatIllustration />;
    case 'brick': return <BrickIllustration />;
    case 'ore': return <OreIllustration />;
    case 'desert': return <DesertIllustration />;
  }
}