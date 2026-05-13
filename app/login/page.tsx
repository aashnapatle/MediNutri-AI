"use client"

import { useState, useEffect, useRef } from "react"
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import { Mail, Lock, Eye, EyeOff, Heart, Droplets, Moon, Footprints } from "lucide-react"

export default function LoginPage() {
  const [mounted, setMounted] = useState(false)

useEffect(() => {
  setMounted(true)
}, [])
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 })
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 })
  const cardX = useTransform(springX, [-0.5, 0.5], [18, -18])
  const cardY = useTransform(springY, [-0.5, 0.5], [12, -12])
  
  const sphereX = useTransform(springX, [-0.5, 0.5], [-20, 20])
  const sphereY = useTransform(springY, [-0.5, 0.5], [-20, 20])
  const cardRotateX = useTransform(springY, [-0.5, 0.5], [5, -5])
  const cardRotateY = useTransform(springX, [-0.5, 0.5], [-5, 5])
const waterX = useTransform(springX, [-0.5, 0.5], [22, -22])
const waterY = useTransform(springY, [-0.5, 0.5], [-8, 8])

const heartX = useTransform(springX, [-0.5, 0.5], [-22, 22])
const heartY = useTransform(springY, [-0.5, 0.5], [10, -10])

const stepsX = useTransform(springX, [-0.5, 0.5], [16, -16])
const stepsY = useTransform(springY, [-0.5, 0.5], [-12, 12])

const sleepX = useTransform(springX, [-0.5, 0.5], [-16, 16])
const sleepY = useTransform(springY, [-0.5, 0.5], [14, -14])

const syringeX = useTransform(springX, [-0.5, 0.5], [8, -8])
const dnaX = useTransform(springX, [-0.5, 0.5], [-10, 10])
const stethoX = useTransform(springX, [-0.5, 0.5], [6, -6])
const pillX = useTransform(springX, [-0.5, 0.5], [5, -5])
const crossX = useTransform(springX, [-0.5, 0.5], [-7, 7])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        const x = (e.clientX - rect.left) / rect.width - 0.5
        const y = (e.clientY - rect.top) / rect.height - 0.5
        mouseX.set(x)
        mouseY.set(y)
      }
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [mouseX, mouseY])
 

if (!mounted) return null


  return (
    <div ref={containerRef} className="min-h-screen bg-[#050505] relative overflow-hidden flex items-center justify-center">
      {/* Background Gradient Blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div 
          className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-pink-600/30 blur-[140px]"
          animate={{ x: [0, 50, 0], y: [0, 30, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          style={{ x: cardX, y: cardY }}
          className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-fuchsia-600/25 blur-[140px]"
          animate={{ x: [0, -40, 0], y: [0, 50, 0], scale: [1, 1.15, 1] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute bottom-[-10%] right-[20%] w-[450px] h-[450px] rounded-full bg-purple-600/20 blur-[140px]"
          animate={{ x: [0, 30, 0], y: [0, -40, 0], scale: [1, 1.08, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Floating Particle Emojis */}
      {[
        { icon: "❤️", left: "8%", top: "12%", delay: 0 },
        { icon: "💊", left: "88%", top: "18%", delay: 1 },
        { icon: "🩺", left: "12%", top: "75%", delay: 2 },
        { icon: "💧", left: "85%", top: "78%", delay: 0.5 },
        { icon: "🫀", left: "4%", top: "42%", delay: 1.5 },
        { icon: "🧬", left: "94%", top: "48%", delay: 2.5 },
        { icon: "🏃", left: "18%", top: "88%", delay: 3 },
        { icon: "⚡", left: "78%", top: "8%", delay: 0.8 },
        { icon: "🌡️", left: "90%", top: "88%", delay: 1.2 },
        { icon: "💉", left: "6%", top: "28%", delay: 2.2 },
        { icon: "❤️", left: "52%", top: "4%", delay: 0.3 },
        { icon: "💊", left: "28%", top: "92%", delay: 1.8 },
        { icon: "🧬", left: "72%", top: "90%", delay: 2.8 },
        { icon: "💧", left: "22%", top: "8%", delay: 0.7 },
        { icon: "🫀", left: "62%", top: "94%", delay: 1.3 },
        { icon: "🩺", left: "95%", top: "35%", delay: 0.4 },
        { icon: "💉", left: "3%", top: "58%", delay: 1.9 },
        { icon: "⚡", left: "35%", top: "3%", delay: 2.1 },
      ].map((particle, i) => (
        <motion.div
          key={i}
          className="absolute text-lg pointer-events-none"
          style={{ left: particle.left, top: particle.top }}
          animate={{ y: [0, -25, 0], opacity: [0.15, 0.4, 0.15] }}
          transition={{ duration: 5 + Math.random() * 3, repeat: Infinity, ease: "easeInOut", delay: particle.delay }}
        >
          {particle.icon}
        </motion.div>
      ))}

      {/* Floating Glowing Particles */}
      {[...Array(35)].map((_, i) => (
        <motion.div
          key={`p-${i}`}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: `${2 + Math.random() * 4}px`,
            height: `${2 + Math.random() * 4}px`,
            background: `radial-gradient(circle, rgba(255,45,149,${0.5 + Math.random() * 0.4}) 0%, transparent 70%)`,
            boxShadow: "0 0 10px rgba(255,45,149,0.6)",
          }}
          animate={{ y: [0, -35, 0], opacity: [0.2, 0.8, 0.2], scale: [0.8, 1.3, 0.8] }}
          transition={{ duration: 4 + Math.random() * 4, repeat: Infinity, ease: "easeInOut", delay: Math.random() * 5 }}
        />
      ))}

      {/* ECG Line - Left Side */}
      <svg className="absolute left-0 top-[44%] w-[26%] h-[70px] opacity-55" viewBox="0 0 400 70" preserveAspectRatio="none">
        <defs>
          <filter id="ecgGlow">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        <motion.path
          d="M0 35 L80 35 L95 35 L105 12 L115 58 L125 35 L200 35 L215 35 L225 12 L235 58 L245 35 L320 35 L335 35 L345 12 L355 58 L365 35 L400 35"
          fill="none"
          stroke="#ff2d95"
          strokeWidth="2.5"
          filter="url(#ecgGlow)"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: [0, 1, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        />
      </svg>

      {/* ECG Line - Right Side */}
      <svg className="absolute right-0 top-[44%] w-[26%] h-[70px] opacity-55" viewBox="0 0 400 70" preserveAspectRatio="none">
        <motion.path
          d="M0 35 L80 35 L95 35 L105 12 L115 58 L125 35 L200 35 L215 35 L225 12 L235 58 L245 35 L320 35 L335 35 L345 12 L355 58 L365 35 L400 35"
          fill="none"
          stroke="#ff2d95"
          strokeWidth="2.5"
          filter="url(#ecgGlow)"
          initial={{ pathLength: 1 }}
          animate={{ pathLength: [1, 0, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        />
      </svg>

      {/* Central Glowing Sphere */}
      <motion.div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{ x: sphereX, y: sphereY }}
      >
        <motion.div 
          className="absolute inset-[-120px] rounded-full bg-pink-500/25 blur-[120px]"
          animate={{ scale: [1, 1.08, 1], opacity: [0.4, 0.6, 0.4] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        />
        
        <div className="relative w-[500px] h-[500px]">
          <motion.div 
            className="absolute inset-0 rounded-full bg-gradient-to-br from-pink-400/60 via-pink-500/50 to-fuchsia-600/40 blur-[50px]"
            animate={{ scale: [1, 1.04, 1], opacity: [0.6, 0.8, 0.6] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div 
            className="absolute inset-6 rounded-full bg-gradient-to-tr from-pink-300/50 via-pink-500/60 to-fuchsia-500/50 blur-[35px]"
            animate={{ scale: [1, 1.03, 1], opacity: [0.5, 0.75, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
          />
          <motion.div 
            className="absolute inset-14 rounded-full bg-pink-400/55 blur-[20px]"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          />
          
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 500 500">
            <defs>
              <radialGradient id="sphereGrad" cx="40%" cy="35%" r="55%">
                <stop offset="0%" stopColor="#ff6eb4" stopOpacity="0.95" />
                <stop offset="35%" stopColor="#ff2d95" stopOpacity="0.85" />
                <stop offset="65%" stopColor="#d6006f" stopOpacity="0.65" />
                <stop offset="100%" stopColor="#8b0048" stopOpacity="0.35" />
              </radialGradient>
              <filter id="sphereGlow2">
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>
            
            <motion.circle 
              cx="250" cy="250" r="190" 
              fill="url(#sphereGrad)" 
              filter="url(#sphereGlow2)"
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            />
            
            <g stroke="rgba(255,255,255,0.3)" strokeWidth="0.8" fill="none">
              <motion.ellipse 
                cx="250" cy="250" rx="180" ry="65"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                style={{ transformOrigin: "250px 250px" }}
              />
              <motion.ellipse 
                cx="250" cy="250" rx="180" ry="65" 
                transform="rotate(60 250 250)"
                animate={{ rotate: -360 }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                style={{ transformOrigin: "250px 250px" }}
              />
              <motion.ellipse 
                cx="250" cy="250" rx="180" ry="65" 
                transform="rotate(120 250 250)"
                animate={{ rotate: 360 }}
                transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
                style={{ transformOrigin: "250px 250px" }}
              />
              <motion.ellipse 
                cx="250" cy="250" rx="145" ry="52"
                animate={{ rotate: -360 }}
                transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
                style={{ transformOrigin: "250px 250px" }}
              />
              <motion.ellipse 
                cx="250" cy="250" rx="145" ry="52" 
                transform="rotate(60 250 250)"
                animate={{ rotate: 360 }}
                transition={{ duration: 23, repeat: Infinity, ease: "linear" }}
                style={{ transformOrigin: "250px 250px" }}
              />
              <motion.ellipse 
                cx="250" cy="250" rx="105" ry="38"
                animate={{ rotate: 360 }}
                transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
                style={{ transformOrigin: "250px 250px" }}
              />
            </g>

            {[
              { cx: 250, cy: 75 }, { cx: 100, cy: 170 }, { cx: 400, cy: 170 },
              { cx: 70, cy: 270 }, { cx: 430, cy: 270 }, { cx: 120, cy: 380 },
              { cx: 380, cy: 380 }, { cx: 250, cy: 430 }, { cx: 180, cy: 120 },
              { cx: 320, cy: 120 }
            ].map((pos, i) => (
              <motion.circle 
                key={i} 
                cx={pos.cx} 
                cy={pos.cy} 
                r="5" 
                fill="#fff"
                animate={{ r: [4, 6, 4], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: i * 0.2 }}
              />
            ))}
          </svg>

          <motion.div 
            className="absolute inset-[25px] rounded-full border-2 border-pink-400/50"
            animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeOut" }}
          />
          <motion.div 
            className="absolute inset-[25px] rounded-full border-2 border-pink-400/40"
            animate={{ scale: [1, 1.7], opacity: [0.4, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeOut", delay: 0.6 }}
          />
          <motion.div 
            className="absolute inset-[25px] rounded-full border border-pink-400/30"
            animate={{ scale: [1, 1.9], opacity: [0.3, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeOut", delay: 1.2 }}
          />
        </div>
      </motion.div>

      {/* Bottom Grid Rings */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[280px] pointer-events-none">
        <svg viewBox="0 0 1200 280" className="w-full h-full" preserveAspectRatio="xMidYMax slice">
          <defs>
            <linearGradient id="ringGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ff2d95" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#ff2d95" stopOpacity="0" />
            </linearGradient>
          </defs>
          
          <motion.ellipse cx="600" cy="265" rx="480" ry="125" fill="none" stroke="url(#ringGrad)" strokeWidth="1.5" animate={{ opacity: [0.3, 0.55, 0.3] }} transition={{ duration: 2, repeat: Infinity }} />
          <motion.ellipse cx="600" cy="265" rx="400" ry="105" fill="none" stroke="url(#ringGrad)" strokeWidth="1.5" animate={{ opacity: [0.35, 0.6, 0.35] }} transition={{ duration: 2, repeat: Infinity, delay: 0.25 }} />
          <motion.ellipse cx="600" cy="265" rx="320" ry="85" fill="none" stroke="url(#ringGrad)" strokeWidth="1.5" animate={{ opacity: [0.3, 0.55, 0.3] }} transition={{ duration: 2, repeat: Infinity, delay: 0.5 }} />
          <motion.ellipse cx="600" cy="265" rx="240" ry="65" fill="none" stroke="url(#ringGrad)" strokeWidth="1.5" animate={{ opacity: [0.35, 0.6, 0.35] }} transition={{ duration: 2, repeat: Infinity, delay: 0.75 }} />
          <motion.ellipse cx="600" cy="265" rx="160" ry="45" fill="none" stroke="url(#ringGrad)" strokeWidth="1.5" animate={{ opacity: [0.3, 0.55, 0.3] }} transition={{ duration: 2, repeat: Infinity, delay: 1 }} />
          <motion.ellipse cx="600" cy="265" rx="80" ry="22" fill="none" stroke="url(#ringGrad)" strokeWidth="1.5" animate={{ opacity: [0.35, 0.6, 0.35] }} transition={{ duration: 2, repeat: Infinity, delay: 1.25 }} />
          
          {[...Array(24)].map((_, i) => {
            const angle = (i * 15 * Math.PI) / 180
            return <line key={i} x1="600" y1="265" x2={600 + Math.cos(angle - Math.PI/2) * 480} y2={265 + Math.sin(angle - Math.PI/2) * 125 * 0.85} stroke="#ff2d95" strokeWidth="0.5" opacity="0.22" />
          })}

          <ellipse cx="600" cy="155" rx="140" ry="22" fill="#ff2d95" opacity="0.45" filter="url(#ecgGlow)" />
          
          <motion.path 
            d="M170 248 C170 242 164 236 158 236 C148 236 145 248 145 248 C145 260 170 278 170 278 C170 278 195 260 195 248 C195 248 192 236 182 236 C176 236 170 242 170 248" 
            fill="none" stroke="#ff2d95" strokeWidth="1.2" opacity="0.4"
            animate={{ scale: [1, 1.12, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            style={{ transformOrigin: "170px 257px" }}
          />
          <motion.path 
            d="M1030 248 C1030 242 1024 236 1018 236 C1008 236 1005 248 1005 248 C1005 260 1030 278 1030 278 C1030 278 1055 260 1055 248 C1055 248 1052 236 1042 236 C1036 236 1030 242 1030 248" 
            fill="none" stroke="#ff2d95" strokeWidth="1.2" opacity="0.4"
            animate={{ scale: [1, 1.12, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.6 }}
            style={{ transformOrigin: "1030px 257px" }}
          />
        </svg>
      </div>

      {/* Header Logo */}
      <div className="absolute top-5 left-1/2 -translate-x-1/2 text-center z-20">
        <div className="flex items-center justify-center gap-3 mb-1">
          <motion.div animate={{ scale: [1, 1.18, 1, 1.12, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>
            <Heart className="w-10 h-10 text-pink-500 fill-pink-500 drop-shadow-[0_0_12px_rgba(255,45,149,0.8)]" />
          </motion.div>
          <h1 className="text-3xl font-bold text-white tracking-wide drop-shadow-[0_0_25px_rgba(255,45,149,0.5)]">
            MEDI<span className="text-pink-400 mx-1">·</span>NUTRI AI
          </h1>
        </div>
        <p className="text-pink-300/80 text-sm tracking-widest">The Future of Intelligent Healthcare</p>
      </div>

      {/* BMI Card - Top Left */}
      <motion.div 
        className="absolute top-[15%] left-[6%] z-10"
        animate={{ y: [0, -12, 0] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
        style={{ x: cardX, y: cardY }}
      >
        <div className="relative bg-[rgba(18,8,28,0.8)] backdrop-blur-xl rounded-[18px] p-4 border border-pink-500/40 w-[168px] shadow-[0_0_35px_rgba(255,45,149,0.18)] hover:border-pink-400/70 transition-all">
          <div className="absolute top-2 right-1 opacity-45">
            <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
              <circle cx="32" cy="9" r="6" fill="#ff2d95" />
              <motion.g animate={{ x: [0, 2, 0] }} transition={{ duration: 0.4, repeat: Infinity }}>
                <path d="M20 22 L30 27 L40 19 M30 27 L30 38 L22 50 M30 38 L42 48" stroke="#ff2d95" strokeWidth="2.8" strokeLinecap="round" />
              </motion.g>
            </svg>
          </div>
          <div className="flex items-center gap-2 mb-1">
            <svg className="w-4 h-4 text-pink-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>
            <span className="text-white/85 text-sm font-medium">BMI</span>
          </div>
          <div className="text-[40px] font-bold text-white leading-none">22.5</div>
          <div className="text-white/50 text-sm">kg/m²</div>
          <div className="text-green-400 text-sm mt-0.5 font-semibold">Normal</div>
        </div>
      </motion.div>

      {/* Calories Card - Top Right */}
      <motion.div 
  className="absolute top-[15%] right-[6%] z-10"
  animate={{ y: [0, -10, 0] }}
  transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
  style={{ x: cardX, y: cardY }}
>
        
        <div className="relative bg-[rgba(18,8,28,0.8)] backdrop-blur-xl rounded-[18px] p-4 border border-pink-500/40 w-[168px] shadow-[0_0_35px_rgba(255,45,149,0.18)] hover:border-pink-400/70 transition-all">
          <div className="absolute top-1 right-1 opacity-65">
            <svg width="52" height="52" viewBox="0 0 52 52">
              <ellipse cx="26" cy="38" rx="20" ry="9" fill="#ff2d95" opacity="0.25" />
              <ellipse cx="26" cy="32" rx="18" ry="11" fill="none" stroke="#ff2d95" strokeWidth="1.5" />
              <motion.circle cx="18" cy="28" r="4" fill="#22c55e" animate={{ y: [0, -3, 0] }} transition={{ duration: 1.3, repeat: Infinity }} />
              <motion.circle cx="26" cy="24" r="3.5" fill="#ef4444" animate={{ y: [0, -3, 0] }} transition={{ duration: 1.3, repeat: Infinity, delay: 0.15 }} />
              <motion.circle cx="34" cy="28" r="3" fill="#eab308" animate={{ y: [0, -3, 0] }} transition={{ duration: 1.3, repeat: Infinity, delay: 0.3 }} />
            </svg>
          </div>
          <div className="flex items-center gap-2 mb-1">
            <svg className="w-4 h-4 text-pink-400" viewBox="0 0 24 24" fill="currentColor"><path d="M12 23a7.5 7.5 0 0 1-5.138-12.963C8.204 8.774 11.5 6.5 11.5 1.5c0 0 2.5 1.846 2.5 6.962 0 3.827-1.619 4.57-1.619 4.57s2.119-1.058 2.119-3.532c0-2.268-.97-3.39-.97-3.39s4.47 2.837 4.47 9.39A7.5 7.5 0 0 1 12 23z" /></svg>
            <span className="text-white/85 text-sm font-medium">Calories</span>
          </div>
          <div className="text-[40px] font-bold text-white leading-none">1,850</div>
          <div className="text-white/50 text-sm">kcal</div>
        </div>
      </motion.div>

      {/* Water Intake Card - Left Middle */}
      <motion.div 
        className="absolute top-[40%] left-[4%] z-10"
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut" }}
        style={{ x: waterX, y: waterY }}
      >
        <div className="relative bg-[rgba(18,8,28,0.8)] backdrop-blur-xl rounded-[18px] p-4 border border-pink-500/40 w-[168px] shadow-[0_0_35px_rgba(255,45,149,0.18)] hover:border-pink-400/70 transition-all">
          <div className="absolute top-2 right-2 opacity-75">
            <svg width="38" height="50" viewBox="0 0 38 50">
              <path d="M8 5 L5 44 Q5 48 10 48 L28 48 Q33 48 33 44 L30 5 Z" fill="none" stroke="#60a5fa" strokeWidth="1.5" />
              <motion.path 
                d="M7 32 Q19 36 31 32 L30 44 Q30 46 28 46 L10 46 Q8 46 8 44 Z" 
                fill="#60a5fa" 
                opacity="0.5"
                animate={{ d: ["M7 32 Q19 36 31 32 L30 44 Q30 46 28 46 L10 46 Q8 46 8 44 Z", "M7 30 Q19 26 31 30 L30 44 Q30 46 28 46 L10 46 Q8 46 8 44 Z", "M7 32 Q19 36 31 32 L30 44 Q30 46 28 46 L10 46 Q8 46 8 44 Z"] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              />
            </svg>
          </div>
          <div className="flex items-center gap-2 mb-1">
            <Droplets className="w-4 h-4 text-blue-400" />
            <span className="text-white/85 text-sm font-medium">Water Intake</span>
          </div>
          <div className="text-[40px] font-bold text-white leading-none">8</div>
          <div className="text-white/50 text-sm mb-2">Glasses</div>
          <div className="w-full bg-white/10 rounded-full h-2">
            <motion.div 
              className="bg-gradient-to-r from-blue-400 to-cyan-400 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: "80%" }}
              transition={{ duration: 2, ease: "easeOut" }}
            />
          </div>
          <div className="text-white/50 text-xs mt-1 text-right">80%</div>
        </div>
      </motion.div>

      {/* Heart Rate Card - Right Middle */}
      <motion.div 
        className="absolute top-[40%] right-[4%] z-10"
        animate={{ y: [0, -14, 0] }}
        transition={{ duration: 5.2, repeat: Infinity, ease: "easeInOut" }}
        style={{ x: heartX, y: heartY }}
      >
        <div className="relative bg-[rgba(18,8,28,0.8)] backdrop-blur-xl rounded-[18px] p-4 border border-pink-500/40 w-[168px] shadow-[0_0_35px_rgba(255,45,149,0.18)] hover:border-pink-400/70 transition-all">
          <div className="absolute top-1 right-0 opacity-55">
            <motion.svg width="58" height="58" viewBox="0 0 58 58" animate={{ scale: [1, 1.06, 1] }} transition={{ duration: 0.9, repeat: Infinity }}>
              <path d="M29 12 C24 4 12 4 9 14 C6 26 20 36 29 50 C38 36 52 26 49 14 C46 4 34 4 29 12" fill="#ff2d95" opacity="0.65" />
              <path d="M29 12 C24 4 12 4 9 14 C6 26 20 36 29 50" fill="none" stroke="#ff6eb4" strokeWidth="1" />
              <path d="M18 18 Q29 14 40 18" fill="none" stroke="#ff6eb4" strokeWidth="0.6" opacity="0.5" />
              <path d="M15 26 Q29 22 43 26" fill="none" stroke="#ff6eb4" strokeWidth="0.5" opacity="0.4" />
            </motion.svg>
          </div>
          <div className="flex items-center gap-2 mb-1">
            <motion.div animate={{ scale: [1, 1.25, 1] }} transition={{ duration: 0.8, repeat: Infinity }}>
              <Heart className="w-4 h-4 text-pink-400 fill-pink-400" />
            </motion.div>
            <span className="text-white/85 text-sm font-medium">Heart Rate</span>
          </div>
          <div className="text-[40px] font-bold text-white leading-none">72</div>
          <div className="text-white/50 text-sm mb-1">BPM</div>
          <svg className="w-full h-5" viewBox="0 0 130 20">
            <motion.path 
              d="M0 10 L22 10 L27 10 L32 3 L37 17 L42 10 L65 10 L70 10 L75 3 L80 17 L85 10 L108 10 L113 10 L118 3 L123 17 L128 10 L130 10" 
              fill="none" 
              stroke="#ff2d95" 
              strokeWidth="1.5"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "linear" }}
            />
          </svg>
        </div>
      </motion.div>

      {/* Steps Card - Bottom Left */}
      <motion.div 
        className="absolute bottom-[10%] left-[6%] z-10"
        animate={{ y: [0, -9, 0] }}
        transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
        style={{ x: stepsX, y: stepsY }}
      >
        <div className="relative bg-[rgba(18,8,28,0.8)] backdrop-blur-xl rounded-[18px] p-4 border border-pink-500/40 w-[178px] shadow-[0_0_35px_rgba(255,45,149,0.18)] hover:border-pink-400/70 transition-all">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <Footprints className="w-4 h-4 text-pink-400" />
              <span className="text-white/85 text-sm font-medium">Steps</span>
            </div>
            <div className="relative w-10 h-10">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 40 40">
                <circle cx="20" cy="20" r="15" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="3.5" />
                <motion.circle 
                  cx="20" cy="20" r="15" fill="none" stroke="#ff2d95" strokeWidth="3.5"
                  strokeDasharray="94.2"
                  initial={{ strokeDashoffset: 94.2 }}
                  animate={{ strokeDashoffset: 14 }}
                  transition={{ duration: 1.8, ease: "easeOut" }}
                  strokeLinecap="round"
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-[9px] text-pink-400 font-bold">85%</span>
            </div>
          </div>
          <div className="text-[34px] font-bold text-white leading-none">8,492</div>
          <div className="text-white/50 text-xs mb-2">Steps Today</div>
          <div className="flex items-end gap-1.5 h-9">
            {[48, 68, 88, 78, 98, 58, 72].map((h, i) => (
              <motion.div 
                key={i} 
                className="flex-1 bg-gradient-to-t from-pink-600 to-pink-400 rounded-sm"
                initial={{ height: 0 }}
                animate={{ height: `${h}%` }}
                transition={{ duration: 0.8, delay: i * 0.08, ease: "easeOut" }}
              />
            ))}
          </div>
          <div className="flex justify-between text-[8px] text-white/40 mt-1">
            <span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span><span>S</span>
          </div>
        </div>
      </motion.div>

      {/* Sleep Card - Bottom Right */}
      <motion.div 
        className="absolute bottom-[10%] right-[6%] z-10"
        animate={{ y: [0, -11, 0] }}
        transition={{ duration: 4.6, repeat: Infinity, ease: "easeInOut" }}
        style={{ x: waterX, y: waterY }}
      >
        <div className="relative bg-[rgba(18,8,28,0.8)] backdrop-blur-xl rounded-[18px] p-4 border border-pink-500/40 w-[168px] shadow-[0_0_35px_rgba(255,45,149,0.18)] hover:border-pink-400/70 transition-all">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <Moon className="w-4 h-4 text-purple-400" />
              <span className="text-white/85 text-sm font-medium">Sleep</span>
            </div>
            <div className="relative w-10 h-10">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 40 40">
                <circle cx="20" cy="20" r="15" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="3.5" />
                <motion.circle 
                  cx="20" cy="20" r="15" fill="none" stroke="#a855f7" strokeWidth="3.5"
                  strokeDasharray="94.2"
                  initial={{ strokeDashoffset: 94.2 }}
                  animate={{ strokeDashoffset: 23.5 }}
                  transition={{ duration: 1.8, ease: "easeOut" }}
                  strokeLinecap="round"
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-[9px] text-purple-400 font-bold">75%</span>
            </div>
          </div>
          <div className="text-[34px] font-bold text-white leading-none">7h 45m</div>
          <div className="text-white/50 text-xs">Sleep Time</div>
          <div className="text-green-400 text-sm mt-0.5 font-semibold">Good Quality</div>
        </div>
      </motion.div>

      {/* Syringe */}
      <motion.div 
        className="absolute top-[26%] left-[20%] opacity-45 z-5"
        animate={{ y: [0, -10, 0], rotate: [-45, -40, -45] }}
        transition={{ duration: 5, repeat: Infinity }}
       style={{ x: heartX, y: heartY }}
      >
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#ff2d95" strokeWidth="1.5">
          <path d="M18 2l4 4-2 2-4-4z M7.5 13.5L11 10 M5 16l2.5-2.5 M2 19l3-3 M10 7l7 7" />
        </svg>
      </motion.div>

      {/* DNA Helix */}
      <motion.div 
        className="absolute top-[13%] right-[20%] opacity-55 z-5"
        animate={{ y: [0, -8, 0], rotateY: [0, 180, 360] }}
        transition={{ duration: 7, repeat: Infinity }}
      style={{ x: dnaX }}
      >
        <svg width="38" height="52" viewBox="0 0 38 52" fill="none" stroke="#ff2d95" strokeWidth="1.5">
          <path d="M10 4 Q26 12 10 20 Q-6 28 10 36 Q26 44 10 52" />
          <path d="M28 4 Q12 12 28 20 Q44 28 28 36 Q12 44 28 52" />
          <line x1="10" y1="12" x2="28" y2="12" opacity="0.5" />
          <line x1="10" y1="28" x2="28" y2="28" opacity="0.5" />
          <line x1="10" y1="44" x2="28" y2="44" opacity="0.5" />
        </svg>
      </motion.div>

      {/* Stethoscope */}
      <motion.div 
        className="absolute bottom-[34%] left-[15%] opacity-45 z-5"
        animate={{ y: [0, -7, 0], rotate: [0, 8, 0] }}
        transition={{ duration: 4.5, repeat: Infinity }}
        style={{ x: stepsX, y: stepsY }}
      >
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#ff2d95" strokeWidth="1.5">
          <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3" />
          <path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4" />
          <circle cx="20" cy="10" r="2" />
        </svg>
      </motion.div>

      {/* Pill */}
      <motion.div 
        className="absolute top-[53%] left-[23%] opacity-40 z-5"
        animate={{ y: [0, -6, 0], rotate: [-20, 20, -20] }}
        transition={{ duration: 3.8, repeat: Infinity }}
       style={{ x: sleepX, y: sleepY }}
      >
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#ff2d95" strokeWidth="1.5">
          <path d="M10.5 20.5L3.5 13.5a4.95 4.95 0 1 1 7-7l7 7a4.95 4.95 0 1 1-7 7z" />
          <path d="M8.5 8.5l7 7" />
        </svg>
      </motion.div>

      {/* Medical Cross */}
      <motion.div 
        className="absolute top-[28%] right-[26%] opacity-40 z-5"
        animate={{ y: [0, -9, 0] }}
        transition={{ duration: 5.2, repeat: Infinity }}
        style={{ x: syringeX }}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ff2d95" strokeWidth="1.5">
          <path d="M9 3h6v6h6v6h-6v6H9v-6H3V9h6V3z" />
        </svg>
      </motion.div>

      {/* Main Login Card */}
      <motion.div 
        className="relative z-30 w-full max-w-[395px] mx-4"
        style={{ x: dnaX }}
      >
        <div className="bg-white/[0.94] backdrop-blur-2xl rounded-[26px] p-7 shadow-[0_0_70px_rgba(255,45,149,0.22)] border border-pink-200/40">
          <div className="text-center mb-6">
            <h2 className="text-[25px] font-bold text-gray-800 mb-1.5">Welcome Back</h2>
            <p className="text-gray-500 text-sm">Sign in to continue your health journey</p>
          </div>
         <form
  className="space-y-3.5"
  onSubmit={(e) => {
    e.preventDefault()
    if (!email || !password) {
      alert("Please fill all fields")
      return
    }
    window.location.href = "/dashboard"
  }}
>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                type="email" 
                placeholder="hello@aihealthexpert.com" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                className="w-full bg-pink-50/70 border border-pink-200/90 rounded-xl py-3.5 pl-12 pr-4 text-gray-700 placeholder-gray-400 focus:outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-200 transition-all text-sm" 
              />
            </div>
            
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="••••••••••••" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                className="w-full bg-pink-50/70 border border-pink-200/90 rounded-xl py-3.5 pl-12 pr-12 text-gray-700 placeholder-gray-400 focus:outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-200 transition-all text-sm" 
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            
            <div className="flex items-center justify-between text-sm pt-0.5">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} className="w-4 h-4 rounded border-gray-300 text-pink-500 focus:ring-pink-400" />
                <span className="text-gray-600">Remember me</span>
              </label>
              <a href="#" className="text-gray-500 hover:text-pink-500 transition-colors">Forgot Password?</a>
            </div>
            
            <motion.button 
              type="submit" 
              className="w-full bg-gradient-to-r from-pink-400 via-pink-500 to-pink-500 hover:from-pink-500 hover:via-pink-600 hover:to-pink-600 text-white font-semibold py-3.5 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-[0_6px_25px_rgba(255,45,149,0.35)] hover:shadow-[0_8px_35px_rgba(255,45,149,0.45)] mt-1"
              whileHover={{ scale: 1.015, y: -1 }}
              whileTap={{ scale: 0.985 }}
            >
              <span className="text-[15px]">Login</span>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </motion.button>
          </form>
          
          <div className="flex items-center gap-4 my-5">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-gray-400 text-sm">or continue with</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>
          
          <div className="flex justify-center gap-4">
            <motion.button 
              className="w-12 h-12 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-sm hover:shadow-md transition-all"
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.94 }}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="#EA4335" d="M5.27 9.76A7.08 7.08 0 0 1 12 4.91c1.69 0 3.22.6 4.42 1.58l3.49-3.49A11.93 11.93 0 0 0 12 0 12 12 0 0 0 1.24 6.65l4.03 3.11z" /><path fill="#34A853" d="M16.04 18.01A7.4 7.4 0 0 1 12 19.09a7.08 7.08 0 0 1-6.73-4.82l-4.03 3.07A11.95 11.95 0 0 0 12 24c2.93 0 5.7-1.04 7.83-3l-3.79-2.99z" /><path fill="#4A90E2" d="M19.83 21c2.2-2.05 3.62-5.1 3.62-9 0-.71-.11-1.47-.27-2.18H12v4.63h6.44a5.9 5.9 0 0 1-2.4 3.56l3.79 2.99z" /><path fill="#FBBC05" d="M5.27 14.27A7.1 7.1 0 0 1 4.91 12c0-.78.13-1.53.36-2.24L1.24 6.65A11.93 11.93 0 0 0 0 12c0 1.92.44 3.73 1.24 5.33l4.03-3.06z" /></svg>
            </motion.button>
            <motion.button 
              className="w-12 h-12 rounded-full bg-black flex items-center justify-center shadow-sm hover:shadow-md transition-all"
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.94 }}
            >
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" /></svg>
            </motion.button>
            <motion.button 
              className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-400 to-pink-500 flex items-center justify-center shadow-lg shadow-pink-300/50 hover:shadow-pink-400/60 transition-all"
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.94 }}
            >
              <Heart className="w-5 h-5 text-white fill-white" />
            </motion.button>
          </div>
          
          <p className="text-center mt-5 text-gray-500 text-sm">
            {"Don't have an account? "}
            <a href="#" className="text-pink-500 hover:text-pink-600 transition-colors font-semibold hover:underline">Sign up</a>
          </p>
        </div>
      </motion.div>
    </div>
  )
}   