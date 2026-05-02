import { clsx } from "clsx";
import type { ReactNode } from "react";

export function Section({
  id,
  eyebrow,
  title,
  children,
  className
}: {
  id?: string;
  eyebrow?: string;
  title?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={clsx("px-5 py-20 sm:px-8 lg:px-12", className)}>
      <div className="mx-auto max-w-6xl">
        <div className="reveal mb-12 flex items-center gap-4 text-sage/55" aria-hidden="true">
          <span className="h-px flex-1 bg-gradient-to-r from-transparent via-sage/35 to-transparent" />
          <span className="font-serif text-2xl leading-none">✦</span>
          <span className="h-px flex-1 bg-gradient-to-r from-transparent via-lavender/35 to-transparent" />
        </div>
        {(eyebrow || title) && (
          <div className="reveal mb-10 max-w-2xl">
            {eyebrow && (
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-sage">
                {eyebrow}
              </p>
            )}
            {title && (
              <h2 className="font-serif text-4xl leading-none text-charcoal sm:text-6xl">
                {title}
              </h2>
            )}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}
