import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuthStore, useAlertStore } from "../store"
import { Leaf, Stethoscope, UtensilsCrossed, ShieldCheck, User, Sparkles, ArrowRight, Eye, EyeOff } from "lucide-react"

// Demo accounts — firstname@nutrisync.com / Patient@123 for patients
const DEMO_CREDENTIALS = [
  { role: "Doctor",  email: "doctor@nutrisync.com",  pass: "Doctor@123",  icon: Stethoscope,    color: "text-blue-600" },
  { role: "Kitchen", email: "kitchen@nutrisync.com", pass: "Kitchen@123", icon: UtensilsCrossed, color: "text-orange-500" },
  { role: "Patient", email: "arjun@nutrisync.com",   pass: "Patient@123", icon: User,            color: "text-violet-500" },
  { role: "Admin",   email: "admin@nutrisync.com",   pass: "Admin@123",   icon: ShieldCheck,    color: "text-emerald-600" },
]

type Design = 1 | 2 | 3

// ─── Shared form logic hook ───────────────────────────────────────────────────
function useLoginForm() {
  const [email, setEmail] = useState("doctor@nutrisync.com")
  const [password, setPassword] = useState("Doctor@123")
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const login = useAuthStore((s) => s.login)
  const push = useAlertStore((s) => s.push)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await login(email, password)
      // Role-based redirect
      const user = useAuthStore.getState().user
      const role = user?.role
      if (role === "patient") navigate("/my-dashboard")
      else if (role === "kitchen_staff") navigate("/kitchen")
      else navigate("/doctor")
    } catch {
      push({ type: "error", message: "Invalid credentials. Please try again." })
    } finally {
      setLoading(false)
    }
  }

  return { email, setEmail, password, setPassword, showPw, setShowPw, loading, handleSubmit }
}

// ─── Design 1: Minimal Clean ─────────────────────────────────────────────────
function Design1({ onSwitch }: { onSwitch: (d: Design) => void }) {
  const { email, setEmail, password, setPassword, showPw, setShowPw, loading, handleSubmit } = useLoginForm()

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top accent bar */}
      <div className="h-1.5 bg-linear-to-r from-emerald-400 via-teal-500 to-cyan-500" />

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          {/* Logo */}
          <div className="flex items-center gap-2.5 mb-8">
            <div className="w-9 h-9 bg-emerald-500 rounded-xl flex items-center justify-center shadow-sm">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 leading-none">NutriSync</h1>
              <p className="text-[11px] text-gray-400 tracking-wide uppercase mt-0.5">Clinical Nutrition AI</p>
            </div>
          </div>

          {/* Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-7">
            <h2 className="text-xl font-semibold text-gray-800 mb-1">Welcome back</h2>
            <p className="text-sm text-gray-400 mb-6">Sign in to your account</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">Email</label>
                <input
                  type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                  className="mt-1.5 w-full rounded-lg border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">Password</label>
                <div className="relative mt-1.5">
                  <input
                    type={showPw ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} required
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3.5 py-2.5 pr-10 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition"
                  />
                  <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <button
                type="submit" disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-60 text-white font-medium py-2.5 rounded-lg text-sm transition shadow-sm shadow-emerald-200 mt-2"
              >
                {loading ? "Signing in…" : <><span>Sign in</span><ArrowRight className="w-4 h-4" /></>}
              </button>
            </form>

            {/* Quick fill */}
            <div className="mt-5 pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-400 mb-2.5 text-center">Quick demo login</p>
              <div className="grid grid-cols-2 gap-2">
                {DEMO_CREDENTIALS.map((c) => (
                  <button key={c.role} onClick={() => { setEmail(c.email); setPassword(c.pass) }}
                    className="flex flex-col items-center gap-1 py-2 rounded-lg border border-gray-100 hover:border-emerald-200 hover:bg-emerald-50 text-xs text-gray-500 hover:text-emerald-700 transition"
                  >
                    <c.icon className={`w-3.5 h-3.5 ${c.color}`} />
                    {c.role}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <DesignSwitcher current={1} onSwitch={onSwitch} />
        </div>
      </div>
    </div>
  )
}

// ─── Design 2: Split Screen ───────────────────────────────────────────────────
function Design2({ onSwitch }: { onSwitch: (d: Design) => void }) {
  const { email, setEmail, password, setPassword, showPw, setShowPw, loading, handleSubmit } = useLoginForm()

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-[42%] xl:w-[45%] bg-linear-to-br from-teal-500 via-emerald-500 to-cyan-600 flex-col justify-between p-10 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-20 -left-20 w-96 h-96 rounded-full bg-white" />
          <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-white" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-white" />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <span className="text-white font-bold text-xl">NutriSync</span>
          </div>
          <p className="text-white/60 text-xs tracking-widest uppercase">Clinical Nutrition AI</p>
        </div>

        <div className="relative z-10 space-y-8">
          <div>
            <h2 className="text-3xl font-bold text-white leading-snug">Intelligent nutrition<br />for better patient care</h2>
            <p className="mt-3 text-white/70 text-sm leading-relaxed">AI-powered meal planning, real-time tracking, and clinical-grade dietary management — all in one platform.</p>
          </div>
          <div className="grid grid-cols-1 gap-3">
            {[
              { icon: Sparkles, label: "AI-generated personalised meal plans" },
              { icon: Stethoscope, label: "Clinical diet protocols built-in" },
              { icon: ShieldCheck, label: "Role-based access for your whole team" },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
                  <Icon className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="text-sm text-white/80">{label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10">
          <p className="text-white/40 text-xs">© 2026 NutriSync. All rights reserved.</p>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 bg-white flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-emerald-500 rounded-xl flex items-center justify-center">
              <Leaf className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-gray-900">NutriSync</span>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-1">Sign in</h2>
          <p className="text-sm text-gray-500 mb-7">Enter your credentials to continue.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email address</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <input type={showPw ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} required
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 pr-11 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition"
                />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-linear-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 disabled:opacity-60 text-white font-semibold py-3 rounded-xl text-sm transition shadow-md shadow-emerald-100 flex items-center justify-center gap-2 mt-1"
            >
              {loading ? "Signing in…" : <><span>Continue</span><ArrowRight className="w-4 h-4" /></>}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-gray-100">
            <p className="text-xs text-center text-gray-400 mb-3">Demo accounts</p>
            <div className="grid grid-cols-2 gap-2">
              {DEMO_CREDENTIALS.map((c) => (
                <button key={c.role} onClick={() => { setEmail(c.email); setPassword(c.pass) }}
                  className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-gray-100 hover:border-teal-200 hover:bg-teal-50 text-xs text-gray-500 hover:text-teal-700 transition font-medium"
                >
                  <c.icon className={`w-3.5 h-3.5 ${c.color}`} />
                  {c.role}
                </button>
              ))}
            </div>
          </div>

          <DesignSwitcher current={2} onSwitch={onSwitch} />
        </div>
      </div>
    </div>
  )
}

// ─── Design 3: Warm Card ─────────────────────────────────────────────────────
function Design3({ onSwitch }: { onSwitch: (d: Design) => void }) {
  const { email, setEmail, password, setPassword, showPw, setShowPw, loading, handleSubmit } = useLoginForm()

  return (
    <div className="min-h-screen bg-amber-50 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Soft blobs */}
      <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-orange-100 opacity-60" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-yellow-100 opacity-60" />
      <div className="absolute top-1/4 left-1/4 w-48 h-48 rounded-full bg-amber-100 opacity-40" />

      <div className="relative z-10 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-7">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-white rounded-2xl shadow-md mb-4">
            <Leaf className="w-7 h-7 text-amber-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">NutriSync</h1>
          <p className="text-sm text-gray-500 mt-1">Clinical Nutrition AI Platform</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-xl shadow-amber-100 border border-amber-100 overflow-hidden">
          {/* Card top strip */}
          <div className="h-1 bg-linear-to-r from-amber-400 via-orange-400 to-yellow-400" />

          <div className="p-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-5">Sign in to continue</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                  className="mt-1.5 w-full rounded-xl border border-gray-200 bg-amber-50/50 px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-300 transition"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Password</label>
                <div className="relative mt-1.5">
                  <input type={showPw ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} required
                    className="w-full rounded-xl border border-gray-200 bg-amber-50/50 px-4 py-2.5 pr-10 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-300 transition"
                  />
                  <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <button type="submit" disabled={loading}
                className="w-full bg-linear-to-r from-amber-400 to-orange-400 hover:from-amber-500 hover:to-orange-500 disabled:opacity-60 text-white font-semibold py-3 rounded-xl text-sm transition shadow-md shadow-amber-200 flex items-center justify-center gap-2 mt-2"
              >
                {loading ? "Signing in…" : <><span>Sign in</span><ArrowRight className="w-4 h-4" /></>}
              </button>
            </form>

            <div className="mt-6 pt-5 border-t border-gray-100">
              <p className="text-xs text-center text-gray-400 mb-3">Quick demo access</p>
              <div className="grid grid-cols-2 gap-2">
                {DEMO_CREDENTIALS.map((c) => (
                  <button key={c.role} onClick={() => { setEmail(c.email); setPassword(c.pass) }}
                    className="flex flex-col items-center gap-1.5 py-2.5 rounded-xl border border-gray-100 hover:border-amber-300 hover:bg-amber-50 text-xs text-gray-500 hover:text-amber-700 transition"
                  >
                    <c.icon className={`w-4 h-4 ${c.color}`} />
                    <span className="font-medium">{c.role}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <DesignSwitcher current={3} onSwitch={onSwitch} />
      </div>
    </div>
  )
}

// ─── Design Switcher ─────────────────────────────────────────────────────────
function DesignSwitcher({ current, onSwitch }: { current: Design; onSwitch: (d: Design) => void }) {
  const designs: { id: Design; label: string; colors: string }[] = [
    { id: 1, label: "Minimal", colors: "bg-emerald-400" },
    { id: 2, label: "Split", colors: "bg-teal-500" },
    { id: 3, label: "Warm", colors: "bg-amber-400" },
  ]
  return (
    <div className="mt-6 flex items-center justify-center gap-3">
      <span className="text-xs text-gray-400">Theme:</span>
      {designs.map((d) => (
        <button key={d.id} onClick={() => onSwitch(d.id)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition border ${current === d.id ? "border-gray-300 bg-white text-gray-700 shadow-sm" : "border-transparent text-gray-400 hover:text-gray-600"}`}
        >
          <span className={`w-2 h-2 rounded-full ${d.colors}`} />
          {d.label}
        </button>
      ))}
    </div>
  )
}

// ─── Main export ─────────────────────────────────────────────────────────────
export default function LoginPage() {
  const [design, setDesign] = useState<Design>(() => {
    const saved = localStorage.getItem("ns_login_design")
    return (saved === "1" || saved === "2" || saved === "3") ? (Number(saved) as Design) : 1
  })

  const switchDesign = (d: Design) => {
    setDesign(d)
    localStorage.setItem("ns_login_design", String(d))
  }

  if (design === 2) return <Design2 onSwitch={switchDesign} />
  if (design === 3) return <Design3 onSwitch={switchDesign} />
  return <Design1 onSwitch={switchDesign} />
}
