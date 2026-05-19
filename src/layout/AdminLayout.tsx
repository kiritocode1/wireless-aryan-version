import { useMemo, useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LogOut, Home, LayoutDashboard, Settings, Search } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { resourceConfigs } from "@/lib/admin/resources";
import { cn } from "@/lib/utils";

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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <header className="border-b bg-white dark:bg-gray-900 dark:border-gray-800 sticky top-0 z-10">
        <div className="px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link to="/admin" className="font-semibold text-gray-900 dark:text-gray-100">
            Admin Panel
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground hidden sm:inline">
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
              groups.map(([group, items]) => (
                <div key={group} className="space-y-1">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide px-3">
                    {group}
                  </p>
                  {items.map((cfg) => (
                    <NavItem key={cfg.slug} to={`/admin/${cfg.slug}`}>
                      {cfg.plural}
                    </NavItem>
                  ))}
                </div>
              ))
            )}
          </nav>
        </aside>

        <main className="flex-1 p-6 lg:p-8 min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
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
            ? "bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-medium"
            : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
        )
      }
    >
      {icon}
      <span className="truncate">{children}</span>
    </NavLink>
  );
}
