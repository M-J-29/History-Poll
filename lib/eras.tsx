import type { ReactElement, ReactNode, SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

function IconBase({ children, ...props }: IconProps & { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {children}
    </svg>
  );
}

export function CossackIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M14 50 L42 16" />
      <path d="M42 16 Q50 14 47 22" />
      <path d="M10 54 L17 47" />
      <path d="M8 58 L12 54" />
      <path d="M13 46 L21 54" />
    </IconBase>
  );
}

export function MayaIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M8 54 H56" />
      <path d="M14 54 V46 H50 V54" />
      <path d="M20 46 V38 H44 V46" />
      <path d="M26 38 V30 H38 V38" />
      <path d="M30 30 V22 H34 V30" />
      <rect x="30" y="15" width="4" height="7" />
    </IconBase>
  );
}

export function ShipWheelIcon(props: IconProps) {
  const spokes = Array.from({ length: 8 }, (_, i) => {
    const angle = (Math.PI / 4) * i;
    const x1 = 32 + Math.cos(angle) * 7;
    const y1 = 32 + Math.sin(angle) * 7;
    const x2 = 32 + Math.cos(angle) * 25;
    const y2 = 32 + Math.sin(angle) * 25;
    return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />;
  });
  return (
    <IconBase {...props}>
      <circle cx="32" cy="32" r="18" />
      <circle cx="32" cy="32" r="6" />
      {spokes}
    </IconBase>
  );
}

export function PoppyIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <circle cx="32" cy="24" r="4" />
      <ellipse cx="22" cy="20" rx="8" ry="6" transform="rotate(-20 22 20)" />
      <ellipse cx="42" cy="20" rx="8" ry="6" transform="rotate(20 42 20)" />
      <ellipse cx="24" cy="30" rx="8" ry="6" transform="rotate(30 24 30)" />
      <ellipse cx="40" cy="30" rx="8" ry="6" transform="rotate(-30 40 30)" />
      <path d="M32 30 V54" />
      <path d="M32 42 Q24 42 22 48" />
      <path d="M32 46 Q40 46 42 52" />
    </IconBase>
  );
}

export function DomeIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M20 40 Q20 18 32 13 Q44 18 44 40 Z" />
      <rect x="23" y="40" width="18" height="14" />
      <line x1="32" y1="13" x2="32" y2="5" />
      <circle cx="32" cy="4" r="2" fill="currentColor" stroke="none" />
    </IconBase>
  );
}

export function TowerIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M20 54 L27 14 H37 L44 54 Z" />
      <line x1="18" y1="54" x2="46" y2="54" />
      <rect x="29" y="43" width="6" height="11" />
      <line x1="24" y1="44" x2="40" y2="44" />
      <line x1="25.5" y1="34" x2="38.5" y2="34" />
      <line x1="27" y1="24" x2="37" y2="24" />
    </IconBase>
  );
}

export function GenieLampIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M8 46 Q8 38 18 38 H32 Q32 28 44 28 Q55 28 55 39 Q55 46 46 46 H8 Z" />
      <path d="M8 46 L2 44" />
      <circle cx="1" cy="44" r="1.6" fill="currentColor" stroke="none" />
      <path d="M18 38 Q18 31 24 27" />
      <path d="M44 28 Q42 18 38 11 Q46 14 48 21 Q50 15 46 8" />
    </IconBase>
  );
}

export type EraTheme = {
  orderIndex: number;
  slug: string;
  shortName: string;
  bgGradient: string;
  cardBorder: string;
  accentText: string;
  glow: string;
  Icon: (props: IconProps) => ReactElement;
};

export const ERA_THEMES: EraTheme[] = [
  {
    orderIndex: 1,
    slug: "cossack",
    shortName: "Cossack Ukraine",
    bgGradient: "bg-gradient-to-br from-[#132a5e] via-[#1e3a78] to-[#d4a017]",
    cardBorder: "border-yellow-500/40",
    accentText: "text-yellow-400",
    glow: "shadow-[0_0_60px_-10px_rgba(234,179,8,0.35)]",
    Icon: CossackIcon,
  },
  {
    orderIndex: 2,
    slug: "maya",
    shortName: "Maya Civilization",
    bgGradient: "bg-gradient-to-br from-[#074a37] via-[#0e6b4a] to-[#3f9e5e]",
    cardBorder: "border-emerald-400/40",
    accentText: "text-emerald-300",
    glow: "shadow-[0_0_60px_-10px_rgba(52,211,153,0.35)]",
    Icon: MayaIcon,
  },
  {
    orderIndex: 3,
    slug: "pirate",
    shortName: "Pirate Port Royal",
    bgGradient: "bg-gradient-to-br from-[#04303d] via-[#0d5a6b] to-[#e0a83e]",
    cardBorder: "border-teal-400/40",
    accentText: "text-teal-300",
    glow: "shadow-[0_0_60px_-10px_rgba(45,212,191,0.35)]",
    Icon: ShipWheelIcon,
  },
  {
    orderIndex: 4,
    slug: "opium-wars",
    shortName: "The Opium Wars",
    bgGradient: "bg-gradient-to-br from-[#5a0e0e] via-[#7a1616] to-[#d4a017]",
    cardBorder: "border-rose-400/40",
    accentText: "text-rose-300",
    glow: "shadow-[0_0_60px_-10px_rgba(251,113,133,0.35)]",
    Icon: PoppyIcon,
  },
  {
    orderIndex: 5,
    slug: "mughal",
    shortName: "The Mughal Empire",
    bgGradient: "bg-gradient-to-br from-[#4a0f52] via-[#7a1a85] to-[#d4a017]",
    cardBorder: "border-fuchsia-400/40",
    accentText: "text-fuchsia-300",
    glow: "shadow-[0_0_60px_-10px_rgba(232,121,249,0.35)]",
    Icon: DomeIcon,
  },
  {
    orderIndex: 6,
    slug: "zimbabwe",
    shortName: "Great Zimbabwe",
    bgGradient: "bg-gradient-to-br from-[#5c2e0a] via-[#8a4513] to-[#d4a017]",
    cardBorder: "border-orange-400/40",
    accentText: "text-orange-300",
    glow: "shadow-[0_0_60px_-10px_rgba(251,146,60,0.35)]",
    Icon: TowerIcon,
  },
];

const DEFAULT_THEME: EraTheme = {
  orderIndex: 0,
  slug: "default",
  shortName: "Somewhere in History",
  bgGradient: "bg-gradient-to-br from-[#0b0b16] via-[#1a1030] to-[#3a2a12]",
  cardBorder: "border-yellow-500/30",
  accentText: "text-yellow-400",
  glow: "shadow-[0_0_60px_-10px_rgba(234,179,8,0.25)]",
  Icon: GenieLampIcon,
};

export function getEraTheme(orderIndex: number | null | undefined): EraTheme {
  if (orderIndex == null) return DEFAULT_THEME;
  return ERA_THEMES.find((t) => t.orderIndex === orderIndex) ?? DEFAULT_THEME;
}
