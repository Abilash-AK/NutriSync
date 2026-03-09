import { NavLink, Outlet, useNavigate } from "react-router-dom"
import { useAuthStore, useAlertStore } from "../store"
import {
  Users, UtensilsCrossed, BarChart3, Package,
  LogOut, Bell, Stethoscope, Leaf, ChevronRight, Heart, ClipboardList,
} from "lucide-react"
import { cn } from "@/lib/utils"

const NAV_ITEMS = [
  { to: "/my-dashboard", label: "My Dashboard", icon: Heart,           roles: ["patient"] },
  { to: "/doctor",    label: "Doctor",    icon: Stethoscope,    roles: ["admin", "doctor"] },
  { to: "/patient",   label: "Patient",   icon: Users,          roles: ["admin", "doctor"] },
  { to: "/kitchen",   label: "Kitchen",   icon: UtensilsCrossed,roles: ["admin", "kitchen_staff"] },
  { to: "/analytics", label: "Analytics", icon: BarChart3,      roles: ["admin", "doctor"] },
  { to: "/orders",    label: "Orders",    icon: ClipboardList,  roles: ["admin", "kitchen_staff"] },
  { to: "/inventory", label: "Inventory", icon: Package,        roles: ["admin", "kitchen_staff"] },
]

export default function AppLayout() {
  const { user, logout } = useAuthStore()
  const alerts = useAlertStore((s) => s.alerts)
  const dismiss = useAlertStore((s) => s.dismiss)
  const navigate = useNavigate()

  const visibleNav = NAV_ITEMS.filter((n) => !user || n.roles.includes(user.role))

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* ── Left gradient panel ── */}
      <aside className="flex w-60 flex-col bg-linear-to-b from-teal-600 via-teal-700 to-emerald-800 shadow-xl">

        {/* Logo */}
        <div className="flex h-16 items-center gap-3 px-5 border-b border-white/10">
          <div className="flex size-9 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm shadow-inner">
            <Leaf size={18} className="text-white" />
          </div>
          <div>
            <p className="text-base font-extrabold text-white tracking-tight leading-none">NutriSync</p>
            <p className="text-[10px] text-teal-200 mt-0.5 tracking-widest uppercase">Clinical AI</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex flex-1 flex-col gap-1 p-3 pt-4">
          {visibleNav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  "group flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all",
                  isActive
                    ? "bg-white text-teal-700 shadow-sm"
                    : "text-white/75 hover:bg-white/10 hover:text-white"
                )
              }
            >
              <item.icon size={16} />
              {item.label}
              <ChevronRight size={13} className="ml-auto opacity-40 group-hover:opacity-70 transition" />
            </NavLink>
          ))}
        </nav>

        {/* User section */}
        <div className="border-t border-white/10 p-3 space-y-1">
          <div className="rounded-xl bg-white/10 px-3 py-2.5">
            <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
            <p className="text-xs text-teal-200 capitalize mt-0.5">{user?.role?.replace("_", " ")}</p>
          </div>
          <button
            onClick={() => { logout(); navigate("/login") }}
            className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-white/70 hover:bg-red-500/20 hover:text-red-200 transition"
          >
            <LogOut size={14} />
            Sign out
          </button>
        </div>
      </aside>

      {/* ── Right content panel ── */}
      <div className="flex flex-1 flex-col overflow-hidden">

        {/* Top bar */}
        <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6 shadow-sm">
          <div className="flex items-center gap-2">
            <div className="h-5 w-1 rounded-full bg-linear-to-b from-teal-500 to-emerald-600" />
            <h2 className="text-sm font-semibold text-gray-600 tracking-tight">
              Clinical Nutrition Management System
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative text-gray-400 hover:text-gray-600 transition">
              <Bell size={18} />
              {alerts.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 inline-flex size-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                  {alerts.length}
                </span>
              )}
            </button>
            <div className="h-8 w-px bg-gray-200" />
            <div className="flex size-8 items-center justify-center rounded-full bg-teal-100 text-teal-700 text-xs font-bold">
              {user?.name?.[0]?.toUpperCase() ?? "?"}
            </div>
          </div>
        </header>

        {/* Toast alerts */}
        {alerts.length > 0 && (
          <div className="absolute right-4 top-20 z-50 flex flex-col gap-2">
            {alerts.map((a) => (
              <div
                key={a.id}
                onClick={() => dismiss(a.id)}
                className={cn(
                  "cursor-pointer rounded-xl px-4 py-3 text-sm font-medium shadow-lg border",
                  a.type === "error"   && "bg-red-50 border-red-200 text-red-700",
                  a.type === "success" && "bg-emerald-50 border-emerald-200 text-emerald-700",
                  a.type === "warning" && "bg-amber-50 border-amber-200 text-amber-700",
                  a.type === "info"    && "bg-blue-50 border-blue-200 text-blue-700"
                )}
              >
                {a.message}
              </div>
            ))}
          </div>
        )}

        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
