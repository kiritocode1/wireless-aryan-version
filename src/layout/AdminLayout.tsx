import { useMemo, useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LogOut, Home, LayoutDashboard, Settings, Search } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { resourceConfigs } from "@/lib/admin/resources";
import { getGroupTheme } from "@/lib/admin/group-theme";
import { cn } from "@/lib/utils";
import CommandPalette from "@/components/admin/CommandPalette";

export default function AdminLayout() {
  const { signOut, session } = useAuth();
  const navigate = useNavigate();

  const [navQuery, setNavQuery] = useState("");

  const groups = useMemo(() => {
    const q = navQuery.trim().toLowerCase();
    const filtered = q
      ? resourceConfigs.filter(
          (c) => c.plural.toLowerCase().includes(q) || c.group.toLowerCase().includes(q),
        )
      : resourceConfigs;
    const map = new Map<string, typeof resourceConfigs>();
    for (const c of filtered) {
      const list = map.get(c.group) ?? [];
      list.push(c);
      map.set(c.group, list);
    }
    return Array.from(map.entries());
  }, [navQuery]);

  const handleSignOut = async () => {
    await signOut();
    navigate("/admin/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-[#fafaf9] dark:bg-gray-950">
      <header className="border-b bg-white/80 backdrop-blur-md dark:bg-gray-900/80 dark:border-gray-800 sticky top-0 z-10">
        <div className="px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link to="/admin" className="flex items-center gap-2 font-semibold text-gray-900 dark:text-gray-100">
            <span className="w-6 h-6 rounded-md bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-white text-[10px] font-bold tracking-tighter shadow-sm shadow-indigo-500/30">
              MP
            </span>
            <span>Admin</span>
          </Link>
          <div className="flex items-center gap-2">
            <KbdHint />
            <span className="text-sm text-muted-foreground hidden md:inline">
              {session?.user.email}
            </span>
            <Link to="/">
              <Button variant="ghost" size="sm">
                <Home className="w-4 h-4 mr-1.5" /> Site
              </Button>
            </Link>
            <Button variant="ghost" size="sm" onClick={handleSignOut}>
              <LogOut className="w-4 h-4 mr-1.5" /> Sign out
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        <aside className="w-64 shrink-0 border-r bg-white dark:bg-gray-900 dark:border-gray-800 min-h-[calc(100vh-56px)] sticky top-14 self-start">
          <nav className="p-4 space-y-5">
            <div className="space-y-1">
              <NavItem to="/admin" end icon={<LayoutDashboard className="w-4 h-4" />}>
                Dashboard
              </NavItem>
              <NavItem to="/admin/site-settings" icon={<Settings className="w-4 h-4" />}>
                Site settings
              </NavItem>
            </div>

            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <Input
                value={navQuery}
                onChange={(e) => setNavQuery(e.target.value)}
                placeholder="Filter collections…"
                className="pl-8 h-9 text-sm"
              />
            </div>

            {groups.length === 0 ? (
              <p className="text-xs text-muted-foreground px-3">No matches.</p>
            ) : (
              groups.map(([group, items]) => {
                const theme = getGroupTheme(group);
                return (
                  <div key={group} className="space-y-1">
                    <p className="text-xs font-semibold uppercase tracking-wider px-3 flex items-center gap-2">
                      <span className={cn("w-1.5 h-1.5 rounded-full", theme.dot)} />
                      <span className={theme.text}>{group}</span>
                    </p>
                    {items.map((cfg) => (
                      <NavItem key={cfg.slug} to={`/admin/${cfg.slug}`}>
                        {cfg.plural}
                      </NavItem>
                    ))}
                  </div>
                );
              })
            )}
          </nav>
        </aside>

        <main className="flex-1 p-6 lg:p-8 min-w-0">
          <Outlet />
        </main>
      </div>

      <CommandPalette />
    </div>
  );
}

function KbdHint() {
  const isMac = typeof navigator !== "undefined" && /Mac|iPhone|iPad|iPod/.test(navigator.userAgent);
  return (
    <button
      type="button"
      onClick={() => {
        // dispatch a keydown to trigger CommandPalette's mod+k hotkey
        window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: isMac, ctrlKey: !isMac }));
      }}
      className="hidden md:inline-flex items-center gap-1.5 text-xs text-muted-foreground rounded-md border bg-white/60 dark:bg-gray-900/60 dark:border-gray-800 px-2 py-1 hover:bg-white dark:hover:bg-gray-900 transition"
      aria-label="Open command palette"
    >
      <span>Quick jump</span>
      <kbd className="font-sans text-[10px] px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-800 border dark:border-gray-700">
        {isMac ? "⌘" : "Ctrl"} K
      </kbd>
    </button>
  );
}

function NavItem({
  to,
  end,
  icon,
  children,
}: {
  to: string;
  end?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-2 px-3 py-2 rounded-md text-sm transition",
          isActive
            ? "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-200 font-medium ring-1 ring-inset ring-indigo-200/60 dark:ring-indigo-800/50"
            : "text-gray-700 dark:text-gray-300 hover:bg-gray-100/70 dark:hover:bg-gray-800"
        )
      }
    >
      {icon}
      <span className="truncate">{children}</span>
    </NavLink>
  );
}
