"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Search, Github } from "lucide-react"

interface RepoSearchProps {
  onSearch: (repo: string) => void
  loading: boolean
}

export function RepoSearch({ onSearch, loading }: RepoSearchProps) {
  const [repo, setRepo] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (repo.trim()) {
      onSearch(repo.trim())
    }
  }

  const handleExampleClick = (exampleRepo: string) => {
    setRepo(exampleRepo)
    onSearch(exampleRepo)
  }

  const exampleRepos = ["facebook/react", "microsoft/vscode", "vercel/next.js", "nodejs/node"]

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <Github className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold text-foreground">Repository Search</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Enter repository (e.g., facebook/react)"
              value={repo}
              onChange={(e) => setRepo(e.target.value)}
              className="pl-10"
              disabled={loading}
            />
          </div>
          <Button type="submit" disabled={loading || !repo.trim()}>
            {loading ? "Searching..." : "Search"}
          </Button>
        </div>
      </form>

      <div className="mt-4">
        <p className="text-sm text-muted-foreground mb-2">Try these examples:</p>
        <div className="flex flex-wrap gap-2">
          {exampleRepos.map((exampleRepo) => (
            <Button
              key={exampleRepo}
              variant="outline"
              size="sm"
              onClick={() => handleExampleClick(exampleRepo)}
              disabled={loading}
              className="text-xs"
            >
              {exampleRepo}
            </Button>
          ))}
        </div>
      </div>
    </Card>
  )
}
