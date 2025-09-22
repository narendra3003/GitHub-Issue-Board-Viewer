"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { GlobalSearch } from "@/components/global-search"
import { Search, Github, Star, GitFork, Users, ArrowRight, Code, Heart, Zap } from "lucide-react"
import { useRouter } from "next/navigation"

export default function LandingPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchError, setSearchError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  // Handler for search submit
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setSearchError(null)
    const trimmed = searchQuery.trim()
    if (!/^([\w-]+)\/[\w.-]+$/.test(trimmed)) {
      setSearchError("Please enter in the format owner/repo")
      return
    }
    setLoading(true)
    try {
      const res = await fetch(`https://api.github.com/repos/${trimmed}`)
      if (!res.ok) {
        setSearchError("Repository not found or is private.")
        setLoading(false)
        return
      }
      // Success: navigate
      router.push(`/projects/${trimmed}`)
    } catch {
      setSearchError("Network error. Try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center">
      <div className="w-full max-w-md p-8 bg-card rounded-lg shadow-lg mt-24">
        <h1 className="text-3xl font-bold text-center mb-6">Search GitHub Repository</h1>
        <form onSubmit={handleSearch} className="flex flex-col gap-4">
          <input
            type="text"
            className="border rounded px-4 py-2 text-lg"
            placeholder="owner/repo"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            disabled={loading}
          />
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Searching..." : "Go to Repository"}
          </Button>
          {searchError && <div className="text-red-500 text-sm text-center">{searchError}</div>}
        </form>
      </div>
    </div>
  )
}
