import React from "react";
import clsx from "clsx";

type SectionProps = React.HTMLAttributes<HTMLDivElement> & {
  container?: boolean;
};

export function Section({ className, container = true, children, ...props }: SectionProps) {
  return (
    <section className={clsx(className)} {...props}>
      {container ? (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">{children}</div>
      ) : (
        children
      )}
    </section>
  );
}

export default Section;




