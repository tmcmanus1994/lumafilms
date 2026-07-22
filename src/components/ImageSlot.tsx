import Image from "next/image";

type Props = {
  src?: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  /** CSS object-position for the cover crop, e.g. "65% 50%" to favor the right side. */
  objectPosition?: string;
  /** Shown inside the placeholder block until real imagery lands. */
  placeholderLabel?: string;
};

/**
 * Renders next/image when a real asset exists, and a quiet sand-toned
 * placeholder block when it doesn't — so the whole site can ship before
 * final imagery is dropped into /public/images.
 */
export default function ImageSlot({
  src,
  alt,
  className = "",
  sizes = "100vw",
  priority = false,
  objectPosition,
  placeholderLabel,
}: Props) {
  if (src) {
    return (
      <div className={`relative overflow-hidden ${className}`}>
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover"
          style={objectPosition ? { objectPosition } : undefined}
        />
      </div>
    );
  }
  return (
    <div
      role="img"
      aria-label={alt}
      className={`relative flex items-center justify-center overflow-hidden bg-sand ${className}`}
    >
      <span className="eyebrow px-6 text-center text-taupe-light">
        {placeholderLabel ?? alt}
      </span>
    </div>
  );
}
