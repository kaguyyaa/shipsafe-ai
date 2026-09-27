'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  ShieldAlert, 
  LayoutDashboard, 
  FolderGit2, 
  GitPullRequest, 
  AlertTriangle, 
  Bot, 
  FileText, 
  Settings, 
  UserCircle 
} from 'lucide-react';
import { clsx } from 'clsx';

export function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { label: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Repositories', href: '/repositories', icon: FolderGit2 },
    { label: 'Releases', href: '/releases/184', icon: GitPullRequest },
    { label: 'Issues', href: '/issues', icon: AlertTriangle },
    { label: 'Bob Actions', href: '/bob', icon: Bot },
    { label: 'Reports', href: '/reports', icon: FileText },
  ];

  return (
    <aside className="w-64 bg-slate-950 border-r border-slate-800 flex flex-col justify-between h-screen sticky top-0 text-slate-300 z-30 select-none">
      <div>
        {/* Brand Header */}
        <div className="h-16 flex items-center px-6 border-b border-slate-800/80 gap-3">
          <div className="h-9 w-9 rounded-lg bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 font-bold shadow-sm shadow-blue-500/10">
            🛡
          </div>
          <div>
            <div className="font-bold text-white text-base tracking-tight flex items-center gap-1.5">
              ShipSafe <span className="text-xs px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 font-mono font-medium">AI</span>
            </div>
            <div className="text-[11px] text-slate-400">Release Safety Engineer</div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  'flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all duration-150',
                  isActive
                    ? 'bg-blue-600/15 text-blue-400 border border-blue-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                )}
              >
                <Icon className={clsx('w-4 h-4', isActive ? 'text-blue-400' : 'text-slate-500')} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div>
        <div className="px-3">
          <div className="h-[1px] bg-slate-800/80 my-2" />
          <Link
            href="/settings"
            className={clsx(
              'flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all duration-150',
              pathname === '/settings'
                ? 'bg-blue-600/15 text-blue-400 border border-blue-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            )}
          >
            <Settings className="w-4 h-4 text-slate-500" />
            <span>Settings</span>
          </Link>
        </div>

        {/* User Profile Footer */}
        <div className="p-4 border-t border-slate-800/80 mt-3 bg-slate-950/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-xs text-blue-400">
                AM
              </div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-slate-950" />
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-200">Alex Morgan</div>
              <div className="text-[11px] text-slate-500 font-mono">Lead Developer</div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
