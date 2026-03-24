'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, PenLine, BarChart2, User } from 'lucide-react';

export function BottomNav() {
  const pathname = usePathname();

  if (pathname === '/auth') return null;

  const links = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Log', href: '/log', icon: PenLine },
    { name: 'Analytics', href: '/analytics', icon: BarChart2 },
    { name: 'Profile', href: '/profile', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 w-full bg-card border-t border-[#f0f0f0] px-6 py-4 flex justify-between items-center rounded-t-[24px] shadow-[0_-4px_20px_-5px_rgba(0,0,0,0.05)] z-50">
      {links.map((link) => {
        const Icon = link.icon;
        const isActive = pathname === link.href;
        return (
          <Link
            key={link.name}
            href={link.href}
            className={`flex flex-col items-center gap-1.5 transition-colors ${isActive ? 'text-foreground' : 'text-gray-400'}`}
          >
            <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
            <span className="text-[10px] font-sans font-semibold tracking-wide uppercase">{link.name}</span>
          </Link>
        );
      })}
    </nav>
  );
}
