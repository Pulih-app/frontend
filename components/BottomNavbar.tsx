"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";

type BottomNavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

type BottomNavbarProps = {
  items: BottomNavItem[];
};

export default function BottomNavbar({ items }: BottomNavbarProps) {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-1/2 z-50 w-full max-w-sm -translate-x-1/2 bg-white px-10 pb-7 pt-3 shadow-[0_-4px_16px_rgba(0,0,0,0.04)]">
      <div className="flex items-center justify-between">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== "/home" && pathname.startsWith(`${item.href}/`));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={isActive ? "text-[#2e7d32]" : "text-gray-400 hover:text-gray-900 transition-colors"}
              aria-label={item.label}
            >
              <Icon 
                size={26} 
                strokeWidth={1.8} 
                fill={isActive && (item.label === "Home" || item.href === "/home" || item.href === "/psikolog/home") ? "currentColor" : "none"} 
              />
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
