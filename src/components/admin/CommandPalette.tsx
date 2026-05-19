import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { LayoutDashboard, Settings, ExternalLink, Plus } from "lucide-react";
import { resourceConfigs } from "@/lib/admin/resources";
import { getGroupTheme } from "@/lib/admin/group-theme";
import { cn } from "@/lib/utils";
import { useHotkey } from "@/hooks/useHotkey";

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useHotkey(["mod", "k"], () => setOpen((v) => !v), { allowInInput: true });

  const go = (path: string) => {
    setOpen(false);
    navigate(path);
  };

  const groups = new Map<string, typeof resourceConfigs>();
  for (const c of resourceConfigs) {
    const list = groups.get(c.group) ?? [];
    list.push(c);
    groups.set(c.group, list);
  }

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Search collections, actions, settings…" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        <CommandGroup heading="Jump to">
          <CommandItem onSelect={() => go("/admin")}>
            <LayoutDashboard className="w-4 h-4 mr-2" />
            Dashboard
          </CommandItem>
          <CommandItem onSelect={() => go("/admin/site-settings")}>
            <Settings className="w-4 h-4 mr-2" />
            Site settings
          </CommandItem>
          <CommandItem onSelect={() => window.open("/", "_blank", "noopener,noreferrer")}>
            <ExternalLink className="w-4 h-4 mr-2" />
            View public site
            <CommandShortcut>↗</CommandShortcut>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        {Array.from(groups.entries()).map(([group, items]) => {
          const theme = getGroupTheme(group);
          return (
            <CommandGroup key={group} heading={group}>
              {items.map((cfg) => (
                <CommandItem
                  key={cfg.slug}
                  onSelect={() => go(`/admin/${cfg.slug}`)}
                  keywords={[cfg.singular, cfg.plural, cfg.table]}
                >
                  <span className={cn("w-1.5 h-1.5 rounded-full mr-2.5", theme.dot)} />
                  {cfg.plural}
                </CommandItem>
              ))}
            </CommandGroup>
          );
        })}

        <CommandSeparator />

        <CommandGroup heading="Quick create">
          {resourceConfigs.slice(0, 5).map((cfg) => (
            <CommandItem
              key={`new-${cfg.slug}`}
              onSelect={() => go(`/admin/${cfg.slug}?new=1`)}
              keywords={["new", "create", cfg.singular]}
            >
              <Plus className="w-4 h-4 mr-2 text-muted-foreground" />
              New {cfg.singular.toLowerCase()}
              <span className="ml-auto text-xs text-muted-foreground">{cfg.plural}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
