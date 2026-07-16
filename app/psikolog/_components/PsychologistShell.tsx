import Image from "next/image";
import { Hexagon, Home } from "lucide-react";
import BottomNavbar from "@/components/BottomNavbar";

const navItems = [
  { label: "Home", href: "/psikolog/home", icon: Home },
  { label: "Profile", href: "/psikolog/profile", icon: Hexagon },
];

export function PsychologistShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="relative mx-auto flex min-h-screen w-full max-w-sm flex-col border bg-white px-5 pb-28 pt-7 text-black">
      <Image src="/assets/logo.png" width={34} height={34} alt="Pulih" className="mb-5 ml-2" priority />
      <section className="mb-7 flex items-center gap-4 rounded-2xl bg-[#d9d9d9] px-4 py-4">
        <div className="h-16 w-16 shrink-0 rounded-full bg-white" />
        <div>
          <h1 className="text-sm font-bold">Nama Psikolog</h1>
          <span className="mt-1 inline-flex rounded-full bg-[#008762] px-2 py-1 text-[9px] font-semibold text-white">
            Psikolog Klinis
          </span>
        </div>
      </section>
      {children}
      <BottomNavbar items={navItems} />
    </main>
  );
}
