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
  const isFewItems = items.length <= 3;

  return (
    <nav className="fixed bottom-0 left-1/2 z-50 w-full max-w-sm -translate-x-1/2 bg-white px-8 pb-5 pt-3.5 border-t border-gray-100 shadow-[0_-4px_16px_rgba(0,0,0,0.03)]">
      <div className={`flex items-center ${isFewItems ? "justify-center gap-20" : "justify-between"}`}>
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== "/home" && pathname.startsWith(`${item.href}/`));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 transition-all ${
                isActive ? "text-[#2e7d32]" : "text-gray-400 hover:text-gray-900"
              }`}
              aria-label={item.label}
            >
              <Icon 
                size={22} 
                strokeWidth={2} 
                fill={isActive && (item.label === "Home" || item.href === "/home" || item.href === "/psikolog/home") ? "currentColor" : "none"} 
              />
              <span className={`text-[10px] font-black uppercase tracking-wider ${isActive ? "text-[#2e7d32]" : "text-gray-400"}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
