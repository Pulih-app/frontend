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
            {/* Header Profile Summary */}
            <header className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="relative h-11 w-11 shrink-0 rounded-full border border-[#d2f3df] bg-[#effbf4] flex items-center justify-center text-[#0b744f] font-black text-sm shadow-sm">
                        Dr
                    </div>
                    <div>
                        <h1 className="text-[15px] font-black text-gray-900 leading-none">Dr. Jane Doe</h1>
                        <p className="text-[10px] font-extrabold text-[#008762] uppercase tracking-wider mt-1.5">
                            Clinical Psychologist
                        </p>
                    </div>
                </div>
                <Image src="/assets/logo.png" width={32} height={32} alt="Pulih Logo" className="object-contain" priority />
            </header>
            
            {children}
            
            <BottomNavbar items={navItems} />
        </main>
    );
}
