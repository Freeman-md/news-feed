"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "./Icon";

const destinations = [
  { href: "/", label: "Home", icon: "home" },
  { href: "/create", label: "Create", icon: "plus" },
  { href: "/profile", label: "Profile", icon: "user" },
] as const;

export function BottomNavigation() {
  const pathname = usePathname();

  return (
    <nav className="bottom-navigation" aria-label="Main navigation">
      {destinations.map(({ href, label, icon }) => (
        <Link
          key={href}
          href={href}
          aria-current={pathname === href ? "page" : undefined}
          className={`nav-link${href === "/create" ? " nav-create" : ""}`}
        >
          <span className={href === "/create" ? "create-icon" : "nav-icon"}>
            <Icon name={icon} />
          </span>
          <span>{label}</span>
        </Link>
      ))}
    </nav>
  );
}
