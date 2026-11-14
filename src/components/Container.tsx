import React from "react";

interface ContainerProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
}

export function Container({
  children,
  className = "",
  as: Component = "div",
  style,
  ...rest
}: ContainerProps) {
  return (
    <Component
      data-stage-container=""
      suppressHydrationWarning
      style={{ maxWidth: "1340px", ...style }}
      className={`mx-auto w-full max-w-[1340px] px-4 sm:px-6 lg:px-8 ${className}`.trim()}
      {...rest}
    >
      {children}
    </Component>
  );
}

