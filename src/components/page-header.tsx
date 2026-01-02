import { cn } from "@/lib/utils";

interface PageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
}

export function PageHeader({ title, description, className, children, ...props }: PageHeaderProps) {
  return (
    <section
      className={cn("container pt-8 pb-6 md:pt-12 md:pb-8", className)}
      {...props}
    >
      <div className="flex flex-col items-start gap-4 md:flex-row md:justify-between md:items-center">
        <div className="flex-1">
          <h1 className="text-3xl font-bold leading-tight tracking-tighter md:text-4xl font-headline">
            {title}
          </h1>
          {description && (
            <p className="mt-2 max-w-[750px] text-lg text-muted-foreground sm:text-xl">
              {description}
            </p>
          )}
        </div>
        {children && <div className="flex-shrink-0">{children}</div>}
      </div>
    </section>
  );
}
