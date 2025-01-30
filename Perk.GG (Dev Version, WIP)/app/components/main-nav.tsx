"use client";
import Link from "next/link";

import { usePathname } from "next/navigation";
import { cn } from "~/lib/utils";

const routes = [
  {
    name: "Overview",
    href: "/",
  },
  {
    name: "Clusters",
    href: "/clusters",
  },
  {
    name: "SDKs",
    href: "/sdk",
  },
];

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname();
  return (
    <nav
      className={cn("flex items-center space-x-4 lg:space-x-6", className)}
      {...props}
    >
      {routes.map((route) => (
        <Link
          key={route.name}
          href={route.href}
          className={cn(
            "transition-colors hover:text-foreground/80",
            pathname == route.href ? "text-foreground" : "text-foreground/60",
          )}
        >
          {route.name}
        </Link>
      ))}
    </nav>
  );
}
