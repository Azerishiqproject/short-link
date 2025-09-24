import React from "react";
import clsx from "clsx";

type BlurSpotProps = {
  className?: string;
  color?: string;
  size?: number;
  opacity?: number;
};

export function BlurSpot({ className, color = "#60a5fa", size = 320, opacity = 0.35 }: BlurSpotProps) {
  return (
    <div
      className={clsx("pointer-events-none select-none absolute blur-3xl", className)}
      style={{
        background: `radial-gradient(${color} 0%, transparent 60%)`,
        width: size,
        height: size,
        opacity,
        filter: "blur(64px)",
      }}
    />
  );
}

export default BlurSpot;




