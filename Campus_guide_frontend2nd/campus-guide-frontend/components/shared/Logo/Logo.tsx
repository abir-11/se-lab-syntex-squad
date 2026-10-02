import React from "react";

// UIU Campus Guide logo: animated three-bar graphic in UIU orange (#F68B1F).
export default function Logo({
  size = 32,
  withText = true,
  textClass = "text-2xl font-extrabold text-white",
}: {
  size?: number;
  withText?: boolean;
  textClass?: string;
}) {
  return (
    <span className="inline-flex items-center gap-2">
      <svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
        aria-hidden="true"
      >
        {/* three bars */}
        <rect x="6" y="10" width="10" height="28" rx="3" fill="#F68B1F" />
        <rect
          x="19"
          y="6"
          width="10"
          height="36"
          rx="3"
          fill="#F68B1F"
          opacity="0.8"
        />
        <rect x="32" y="14" width="10" height="24" rx="3" fill="#F68B1F" opacity="0.6" />
      </svg>
      {withText && (
        <span className={textClass}>
          Campus<span className="text-brand">Guide</span>
        </span>
      )}
    </span>
  );
}
