import Image from "next/image";

/**
 * The Luma Films script wordmark (461×120 source). `variant` follows the
 * background: dark logo on light sections, white logo on ink sections.
 */
export default function Logo({
  variant = "dark",
  size = "md",
}: {
  variant?: "dark" | "light";
  size?: "sm" | "md";
}) {
  const height = size === "md" ? 34 : 26;
  return (
    <Image
      src={`/images/brand/luma-${variant === "dark" ? "dark" : "white"}.png`}
      alt="Luma Films"
      width={Math.round(height * (461 / 120))}
      height={height}
      priority={size === "md"}
    />
  );
}
