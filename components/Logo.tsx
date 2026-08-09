type LogoProps = {
  variant?: "small" | "large";
};

export default function Logo({ variant = "small" }: LogoProps) {
  return (
    <div className={`logoMark ${variant === "large" ? "logoMarkLarge" : ""}`} aria-label="Kusuma Sari">
      <span className="logoCross">✚</span>
      <span className="logoText">APOTEK</span>
      <span className="logoSubText">KUSUMA SARI</span>
    </div>
  );
}
