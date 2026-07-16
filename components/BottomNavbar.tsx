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
    <nav className="fixed bottom-0 left-1/2 z-50 w-full max-w-sm -translate-x-1/2 border-x bg-white px-12 pb-7 pt-3">
      <div className="flex items-center justify-between">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={isActive ? "text-[#19b75b]" : "text-black"}
              aria-label={item.label}
            >
              <Icon size={25} strokeWidth={1.8} />
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
