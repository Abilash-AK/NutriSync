"use client"

import React, { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { BorderBeam } from "@/components/ui/border-beam"

// ─── Feature data ───────────────────────────────────────────────────────────

const features = [
  {
    icon: "🥗",
    title: "Smart Meal Planning",
    description:
      "AI-powered meal suggestions tailored to your nutritional goals, dietary restrictions, and personal taste preferences.",
  },
  {
    icon: "📊",
    title: "Macro Tracking",
    description:
      "Track proteins, carbs, and fats in real time. Visualise your daily intake with beautiful, easy-to-read charts.",
  },
  {
    icon: "🏃",
    title: "Activity Sync",
    description:
      "Connect your fitness wearable and automatically adjust your calorie targets based on today's activity.",
  },
]

// ─── Animated badge ──────────────────────────────────────────────────────────

function AnimatedBadge({ children }: { children: React.ReactNode }) {
  return (
    <motion.span
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs font-medium text-neutral-600 shadow-sm dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400"
    >
      {children}
    </motion.span>
  )
}

// ─── Feature card ───────────────────────────────────────────────────────────

function FeatureCard({
  icon,
  title,
  description,
  delay,
}: {
  icon: string
  title: string
  description: string
  delay: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="relative"
    >
      <Card className="relative overflow-hidden">
        <CardHeader>
          <div className="mb-2 text-3xl">{icon}</div>
          <CardTitle className="text-base">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <BorderBeam size={150} duration={10} delay={delay * 2} />
      </Card>
    </motion.div>
  )
}

// ─── Sign-up / login tab content ─────────────────────────────────────────────

function AuthPanel() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  return (
    <Tabs defaultValue="signup" className="w-full max-w-sm">
      <TabsList className="w-full">
        <TabsTrigger value="signup" className="flex-1">
          Get started
        </TabsTrigger>
        <TabsTrigger value="login" className="flex-1">
          Sign in
        </TabsTrigger>
      </TabsList>

      {/* Sign up */}
      <TabsContent value="signup">
        <Card>
          <CardHeader>
            <CardTitle>Create your account</CardTitle>
            <CardDescription>
              Start your nutrition journey — it's free.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="signup-email">Email</Label>
              <Input
                id="signup-email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="signup-password">Password</Label>
              <Input
                id="signup-password"
                type="password"
                placeholder="Min. 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full">Create account</Button>
          </CardFooter>
        </Card>
      </TabsContent>

      {/* Sign in */}
      <TabsContent value="login">
        <Card>
          <CardHeader>
            <CardTitle>Welcome back</CardTitle>
            <CardDescription>Sign in to track your progress.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="login-email">Email</Label>
              <Input
                id="login-email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="login-password">Password</Label>
              <Input
                id="login-password"
                type="password"
                placeholder="Your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full">Sign in</Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  )
}

// ─── Hero 195 ────────────────────────────────────────────────────────────────

export function Hero195() {
  return (
    <section className="relative overflow-hidden bg-background py-24 px-4 md:px-8">
      {/* Background gradient blobs */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
      >
        <div className="h-150 w-150 rounded-full bg-linear-to-tr from-violet-500/10 via-fuchsia-500/10 to-sky-500/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl">
        {/* Top badge */}
        <div className="mb-6 flex justify-center">
          <AnimatedBadge>
            <span className="size-2 rounded-full bg-green-400" />
            Now powered by AI nutrition intelligence
          </AnimatedBadge>
        </div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mx-auto mb-4 max-w-3xl text-balance text-center text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl md:text-6xl"
        >
          Eat smarter.{" "}
          <span className="bg-linear-to-r from-violet-500 to-fuchsia-500 bg-clip-text text-transparent">
            Live better.
          </span>
        </motion.h1>

        {/* Sub-headline */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mx-auto mb-10 max-w-xl text-center text-base text-muted-foreground md:text-lg"
        >
          NutriSync helps you build sustainable eating habits with personalised
          meal plans, macro tracking, and intelligent grocery lists — all in one
          place.
        </motion.p>

        {/* CTA row + auth panel */}
        <div className="flex flex-col items-center gap-12 lg:flex-row lg:items-start lg:justify-between">
          {/* Left: CTA buttons + feature cards */}
          <div className="flex flex-1 flex-col gap-8">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-wrap justify-center gap-3 lg:justify-start"
            >
              <Button size="lg" className="gap-2">
                Start for free
              </Button>
              <Button size="lg" variant="outline" className="gap-2">
                View demo
              </Button>
            </motion.div>

            {/* Feature cards */}
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {features.map((f, i) => (
                <FeatureCard key={f.title} {...f} delay={0.35 + i * 0.1} />
              ))}
            </div>
          </div>

          {/* Right: Auth panel */}
          <motion.div
            initial={{ opacity: 0, x: 32 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="w-full shrink-0 lg:w-auto"
          >
            <AuthPanel />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
