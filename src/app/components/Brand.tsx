interface BrandMarkProps {
  className?: string;
}

export function BrandMark({ className = "" }: BrandMarkProps) {
  return (
    <img
      src="/icons/icon.svg?v=2"
      alt=""
      aria-hidden="true"
      className={className}
    />
  );
}

interface BrandWordmarkProps {
  className?: string;
}

export function BrandWordmark({ className = "" }: BrandWordmarkProps) {
  return (
    <span
      aria-label="BayadTayoOpo"
      className={`inline-flex items-baseline whitespace-nowrap leading-none tracking-[-0.055em] ${className}`}
      style={{
        fontFamily:
          '"Avenir Next", Avenir, "Century Gothic", Futura, system-ui, sans-serif',
      }}
    >
      <span className="font-extrabold">BayadTayo</span>
      <span className="font-normal tracking-[-0.075em]">Opo</span>
    </span>
  );
}
