"use client";

interface SidebarProps {
  active: "users" | "pricing" | "payments";
  onChange: (tab: "users" | "pricing" | "payments") => void;
  onLogout: () => void;
}

export default function AdminSidebar({ active, onChange, onLogout }: SidebarProps) {
  return (
    <aside className="w-72 shrink-0 p-4 border-r border-black/10 dark:border-white/10 bg-white/70 dark:bg-slate-800/70 rounded-l-2xl flex flex-col justify-between">
      <div>
        <div className="font-semibold text-slate-900 dark:text-white mb-3">Secret Dashboard</div>
        <nav className="space-y-2 text-sm">
          {([
            { key: "users", label: "Kullanıcılar" },
            { key: "pricing", label: "Fiyatlandırma" },
            { key: "payments", label: "Ödemeler" },
          ] as const).map((item) => (
            <button
              key={item.key}
              className={`block w-full text-left px-3 py-2 rounded-lg ${active === item.key ? "bg-slate-900 text-white" : "hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300"}`}
              onClick={() => onChange(item.key)}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </div>
      <div className="pt-4">
        <button onClick={onLogout} className="w-full h-12 rounded-xl bg-slate-800/10 dark:bg-slate-50/5 text-slate-700 dark:text-slate-300">Çıkış Yap</button>
      </div>
    </aside>
  );
}


