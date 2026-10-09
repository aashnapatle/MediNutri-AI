"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useLanguage } from "@/context/LanguageContext"
import { auth } from "@/lib/auth"
import { db } from "@/lib/firestore"
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
  deleteUser,
  signOut,
} from "firebase/auth"
import { doc, deleteDoc } from "firebase/firestore"
import { Moon, Sun, Globe, Lock, AlertTriangle, ChevronDown, Check } from "lucide-react"

export default function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const { language, setLanguage, t } = useLanguage()
  const router = useRouter()

  const [mounted, setMounted] = useState(false)

  // Modals state
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  // Password change form state
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [passwordError, setPasswordError] = useState("")
  const [passwordSuccess, setPasswordSuccess] = useState("")

  // Delete account form state
  const [deletePassword, setDeletePassword] = useState("")
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [deleteError, setDeleteError] = useState("")

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const user = auth.currentUser
  const isEmailPasswordUser =
    user?.providerData?.some((p) => p.providerId === "password") ?? true

  // Handle Password Change
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordError("")
    setPasswordSuccess("")

    if (!user || !user.email) {
      setPasswordError(t("userNotFound"))
      return
    }
    if (!isEmailPasswordUser) {
      setPasswordError(t("notPasswordUser"))
      return
    }
    if (!currentPassword) {
      setPasswordError(t("enterCurrentPassword"))
      return
    }
    if (newPassword.length < 6) {
      setPasswordError(t("passwordTooShort"))
      return
    }
    if (newPassword !== confirmPassword) {
      setPasswordError(t("passwordsDoNotMatch"))
      return
    }

    try {
      setPasswordLoading(true)
      const credential = EmailAuthProvider.credential(user.email, currentPassword)
      await reauthenticateWithCredential(user, credential)
      await updatePassword(user, newPassword)

      setPasswordSuccess(t("passwordUpdatedSuccess"))
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
      setTimeout(() => {
        setIsPasswordDialogOpen(false)
        setPasswordSuccess("")
      }, 1500)
    } catch (err: any) {
      if (err.code === "auth/wrong-password" || err.code === "auth/invalid-credential") {
        setPasswordError(t("incorrectPassword"))
      } else {
        setPasswordError(err.message || t("failedToUpdatePassword"))
      }
    } finally {
      setPasswordLoading(false)
    }
  }

  // Handle Account Deletion
  const handleDeleteAccount = async (e: React.FormEvent) => {
    e.preventDefault()
    setDeleteError("")

    if (!user) {
      setDeleteError(t("userNotFound"))
      return
    }

    try {
      setDeleteLoading(true)
      if (isEmailPasswordUser && user.email) {
        if (!deletePassword) {
          setDeleteError(t("enterPasswordToDelete"))
          setDeleteLoading(false)
          return
        }
        const credential = EmailAuthProvider.credential(user.email, deletePassword)
        await reauthenticateWithCredential(user, credential)
      }

      try {
        await deleteDoc(doc(db, "users", user.uid))
      } catch (docErr) {
        console.warn("Could not delete user document:", docErr)
      }

      await deleteUser(user)
      await signOut(auth)
      router.push("/login")
    } catch (err: any) {
      if (err.code === "auth/wrong-password" || err.code === "auth/invalid-credential") {
        setDeleteError(t("incorrectPassword"))
      } else if (err.code === "auth/requires-recent-login") {
        setDeleteError(t("requiresRecentLogin"))
      } else {
        setDeleteError(err.message || t("failedToDeleteAccount"))
      }
    } finally {
      setDeleteLoading(false)
    }
  }

  return (
    <DashboardLayout title={t("settingsTitle")} subtitle={t("settingsSubtitle")}>
      <div className="space-y-6 max-w-4xl mx-auto">

        {/* ── 1. PREFERENCES ── */}
        <Card className="nature-card p-6 bg-white/95 border border-[#E5E7DE] rounded-3xl shadow-xs">
          <h3 className="text-xs font-bold text-[#172C23] uppercase tracking-wider mb-5 flex items-center gap-2">
            <span>🌿</span>
            <span>{t("preferences")}</span>
          </h3>

          <div className="space-y-4">
            {/* Dark Mode */}
            <div className="flex items-center justify-between p-4.5 rounded-2xl bg-[#FAF8F0] border border-[#E5E7DE]">
              <div className="flex items-center gap-3.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#172C23] shadow-2xs border border-[#E5E7DE]">
                  {theme === "dark" ? <Moon className="h-5 w-5 text-[#7EAA82]" /> : <Sun className="h-5 w-5 text-[#D97706]" />}
                </div>
                <div>
                  <p className="text-sm font-bold text-[#172C23]">{t("darkMode")}</p>
                  <p className="text-xs text-[#63736A] mt-0.5">{t("darkModeDesc")}</p>
                </div>
              </div>

              <Switch
                checked={theme === "dark"}
                onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
                aria-label="Toggle dark mode"
                className="data-[state=checked]:bg-[#173B2D]"
              />
            </div>

            {/* Language */}
            <div className="flex items-center justify-between p-4.5 rounded-2xl bg-[#FAF8F0] border border-[#E5E7DE]">
              <div className="flex items-center gap-3.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#172C23] shadow-2xs border border-[#E5E7DE]">
                  <Globe className="h-5 w-5 text-[#2E8BC0]" />
                </div>
                <div>
                  <p className="text-sm font-bold text-[#172C23]">{t("language")}</p>
                  <p className="text-xs text-[#63736A] mt-0.5">
                    {language === "en" ? "English (US)" : "हिन्दी (Hindi)"}
                  </p>
                </div>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="rounded-xl flex items-center gap-2 border-[#E5E7DE] bg-white text-xs font-semibold text-[#172C23] hover:bg-[#FAF8F0] h-9 px-3.5 cursor-pointer"
                  >
                    <span>{t("change")}</span>
                    <ChevronDown className="h-3.5 w-3.5 text-[#63736A]" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-44 rounded-2xl p-1.5 shadow-xl border-[#E5E7DE] bg-white">
                  <DropdownMenuItem
                    onClick={() => setLanguage("en")}
                    className="flex items-center justify-between cursor-pointer rounded-xl py-2 px-3 text-xs font-semibold text-[#172C23] hover:bg-[#FAF8F0]"
                  >
                    <span>English</span>
                    {language === "en" && <Check className="h-4 w-4 text-[#7EAA82]" />}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setLanguage("hi")}
                    className="flex items-center justify-between cursor-pointer rounded-xl py-2 px-3 text-xs font-semibold text-[#172C23] hover:bg-[#FAF8F0]"
                  >
                    <span>हिन्दी (Hindi)</span>
                    {language === "hi" && <Check className="h-4 w-4 text-[#7EAA82]" />}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </Card>

        {/* ── 2. SECURITY ── */}
        <Card className="nature-card p-6 bg-white/95 border border-[#E5E7DE] rounded-3xl shadow-xs">
          <h3 className="text-xs font-bold text-[#172C23] uppercase tracking-wider mb-5 flex items-center gap-2">
            <span>🔐</span>
            <span>{t("security")}</span>
          </h3>

          <div className="flex items-center justify-between p-4.5 rounded-2xl bg-[#FAF8F0] border border-[#E5E7DE]">
            <div className="flex items-center gap-3.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#172C23] shadow-2xs border border-[#E5E7DE]">
                <Lock className="h-5 w-5 text-[#38664F]" />
              </div>
              <div>
                <p className="text-sm font-bold text-[#172C23]">{t("changePassword")}</p>
                <p className="text-xs text-[#63736A] mt-0.5">Update your account credentials</p>
              </div>
            </div>

            <Button
              variant="outline"
              onClick={() => {
                setPasswordError("")
                setPasswordSuccess("")
                setCurrentPassword("")
                setNewPassword("")
                setConfirmPassword("")
                setIsPasswordDialogOpen(true)
              }}
              className="rounded-xl border-[#E5E7DE] bg-white text-xs font-semibold text-[#172C23] hover:bg-[#FAF8F0] h-9 px-3.5 cursor-pointer"
            >
              <span>{t("change")}</span>
            </Button>
          </div>
        </Card>

        {/* ── 3. DANGER ZONE ── */}
        <Card className="nature-card p-6 border-[#F8DFD9] bg-[#FDF5F3] rounded-3xl shadow-xs">
          <h3 className="text-xs font-bold text-[#E05A5A] uppercase tracking-wider mb-2 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-[#E05A5A]" />
            <span>{t("dangerZone")}</span>
          </h3>
          <p className="text-xs text-[#63736A] mb-4">
            {t("dangerZoneDesc")}
          </p>

          <Button
            variant="destructive"
            onClick={() => {
              setDeleteError("")
              setDeletePassword("")
              setIsDeleteDialogOpen(true)
            }}
            className="rounded-xl bg-[#E05A5A] hover:bg-[#C94A4A] text-white text-xs font-semibold h-9 px-4 cursor-pointer shadow-xs"
          >
            <span>{t("deleteAccount")}</span>
          </Button>
        </Card>

      </div>

      {/* ── MODAL: CHANGE PASSWORD ── */}
      <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
        <DialogContent className="sm:max-w-md rounded-3xl border-[#E5E7DE] bg-white p-6 shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-[#172C23] flex items-center gap-2 font-serif text-lg">
              <Lock className="h-5 w-5 text-[#38664F]" />
              <span>{t("changePassword")}</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-[#63736A]">
              Enter your current password to set a new one.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handlePasswordChange} className="space-y-4 py-2">
            {passwordError && (
              <p className="text-xs text-[#E05A5A] bg-[#FCE8E5] p-2.5 rounded-xl border border-[#F8DFD9]">
                {passwordError}
              </p>
            )}
            {passwordSuccess && (
              <p className="text-xs text-[#2E6B40] bg-[#E5F0DF] p-2.5 rounded-xl border border-[#DEECDA]">
                {passwordSuccess}
              </p>
            )}

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#63736A]">
                {t("currentPassword")}
              </label>
              <Input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                className="mt-1.5 rounded-xl border-[#E5E7DE] bg-[#FAF8F0] text-sm"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#63736A]">
                {t("newPassword")}
              </label>
              <Input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="mt-1.5 rounded-xl border-[#E5E7DE] bg-[#FAF8F0] text-sm"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#63736A]">
                {t("confirmPassword")}
              </label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="mt-1.5 rounded-xl border-[#E5E7DE] bg-[#FAF8F0] text-sm"
              />
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsPasswordDialogOpen(false)}
                className="rounded-xl border-[#E5E7DE] text-[#63736A] hover:bg-[#F5F0E5]"
              >
                {t("cancel")}
              </Button>
              <Button
                type="submit"
                disabled={passwordLoading}
                className="rounded-xl bg-[#173B2D] hover:bg-[#102F24] text-white font-semibold"
              >
                {passwordLoading ? "Saving..." : t("change")}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ── MODAL: DELETE ACCOUNT ── */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md rounded-3xl border-[#F8DFD9] bg-white p-6 shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-[#E05A5A] flex items-center gap-2 font-serif text-lg">
              <AlertTriangle className="h-5 w-5 text-[#E05A5A]" />
              <span>{t("deleteAccount")}</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-[#63736A]">
              This action is permanent and cannot be undone. All your health data will be deleted.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleDeleteAccount} className="space-y-4 py-2">
            {deleteError && (
              <p className="text-xs text-[#E05A5A] bg-[#FCE8E5] p-2.5 rounded-xl border border-[#F8DFD9]">
                {deleteError}
              </p>
            )}

            {isEmailPasswordUser && (
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#63736A]">
                  {t("enterPasswordToConfirm")}
                </label>
                <Input
                  type="password"
                  value={deletePassword}
                  onChange={(e) => setDeletePassword(e.target.value)}
                  required
                  className="mt-1.5 rounded-xl border-[#E5E7DE] bg-[#FAF8F0] text-sm"
                />
              </div>
            )}

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDeleteDialogOpen(false)}
                className="rounded-xl border-[#E5E7DE] text-[#63736A] hover:bg-[#F5F0E5]"
              >
                {t("cancel")}
              </Button>
              <Button
                type="submit"
                disabled={deleteLoading}
                className="rounded-xl bg-[#E05A5A] hover:bg-[#C94A4A] text-white font-semibold"
              >
                {deleteLoading ? "Deleting..." : t("deleteAccount")}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  )
}