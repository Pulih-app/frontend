import Image from "next/image";
import { Hexagon, Home } from "lucide-react";
import BottomNavbar from "@/components/BottomNavbar";

const navItems = [
    { label: "Home", href: "/psikolog/home", icon: Home },
    { label: "Profile", href: "/psikolog/profile", icon: Hexagon },
];

export function PsychologistShell({ children }: { children: React.ReactNode }) {
    return (
        <main className="relative mx-auto flex min-h-screen w-full max-w-sm flex-col border-x bg-white px-6 pb-28 pt-6 text-black">
            {/* Header */}
            <header className="mb-6 flex justify-start items-center">
                <Image src="/assets/logo.png" width={32} height={32} alt="Pulih Logo" className="object-contain" priority />
            </header>
            
            {children}
            
            <BottomNavbar items={navItems} />
        </main>
    );
}
