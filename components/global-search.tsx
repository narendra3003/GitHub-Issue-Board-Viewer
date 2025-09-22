"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Search, Github, Star, GitFork } from "lucide-react"

interface SearchResult {
  type: "repository" | "issue"
  name: string
  owner?: string
  description: string
  language?: string
  stars?: string
  forks?: string
  labels?: string[]
  number?: number
  url: string
}

interface GlobalSearchProps {
  trigger?: React.ReactNode
}

export function GlobalSearch({ trigger }: GlobalSearchProps) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  // Mock search results - in a real app, this would call an API
  const mockResults: SearchResult[] = [
    {
      type: "repository",
      name: "React",
      owner: "facebook",
      description: "The library for web and native user interfaces",
      language: "JavaScript",
      stars: "228k",
      forks: "46.7k",
      url: "/projects/facebook/react",
    },
    {
      type: "repository",
      name: "Next.js",
      owner: "vercel",
      description: "The React Framework for the Web",
      language: "TypeScript",
      stars: "125k",
      forks: "26.8k",
      url: "/projects/vercel/next.js",
    },
    {
      type: "issue",
      name: "Add support for custom hooks in components",
      owner: "facebook",
      description: "React",
      number: 1234,
      labels: ["good first issue", "help wanted"],
      url: "/projects/facebook/react/issues/1234",
    },
    {
      type: "issue",
      name: "Improve TypeScript definitions for API routes",
      owner: "vercel",
      description: "Next.js",
      number: 5678,
      labels: ["typescript", "help wanted"],
      url: "/projects/vercel/next.js/issues/5678",
    },
  ]

  useEffect(() => {
    if (query.length > 2) {
      setLoading(true)
      // Simulate API delay
      const timer = setTimeout(() => {
        const filtered = mockResults.filter(
          (result) =>
            result.name.toLowerCase().includes(query.toLowerCase()) ||
            result.description.toLowerCase().includes(query.toLowerCase()) ||
            result.owner?.toLowerCase().includes(query.toLowerCase()),
        )
        setResults(filtered)
        setLoading(false)
      }, 300)

      return () => clearTimeout(timer)
    } else {
      setResults([])
    }
  }, [query])

  const handleResultClick = (result: SearchResult) => {
    router.push(result.url)
    setOpen(false)
    setQuery("")
  }

  const defaultTrigger = (
    <Button variant="outline" className="w-full justify-start text-muted-foreground bg-transparent">
      <Search className="h-4 w-4 mr-2" />
      Search projects and issues...
    </Button>
  )

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger || defaultTrigger}</DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Search Projects and Issues</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search for projects, issues, or repositories..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10"
              autoFocus
            />
          </div>

          {loading && <div className="text-center py-4 text-muted-foreground">Searching...</div>}

          {results.length > 0 && (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {results.map((result, index) => (
                <Card
                  key={index}
                  className="p-4 cursor-pointer hover:bg-accent transition-colors"
                  onClick={() => handleResultClick(result)}
                >
                  <div className="flex items-start gap-3">
                    <Github className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="text-xs">
                          {result.type}
                        </Badge>
                        <h3 className="font-medium text-foreground truncate">
                          {result.type === "repository" ? `${result.owner}/${result.name}` : result.name}
                        </h3>
                        {result.number && <span className="text-sm text-muted-foreground">#{result.number}</span>}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{result.description}</p>

                      {result.type === "repository" && (
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          {result.language && (
                            <div className="flex items-center gap-1">
                              <div className="w-2 h-2 rounded-full bg-primary"></div>
                              {result.language}
                            </div>
                          )}
                          {result.stars && (
                            <div className="flex items-center gap-1">
                              <Star className="h-3 w-3" />
                              {result.stars}
                            </div>
                          )}
                          {result.forks && (
                            <div className="flex items-center gap-1">
                              <GitFork className="h-3 w-3" />
                              {result.forks}
                            </div>
                          )}
                        </div>
                      )}

                      {result.labels && result.labels.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {result.labels.slice(0, 3).map((label) => (
                            <Badge key={label} variant="secondary" className="text-xs">
                              {label}
                            </Badge>
                          ))}
                          {result.labels.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{result.labels.length - 3}
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {query.length > 2 && results.length === 0 && !loading && (
            <div className="text-center py-8 text-muted-foreground">No results found for "{query}"</div>
          )}

          {query.length <= 2 && (
            <div className="text-center py-8 text-muted-foreground">Type at least 3 characters to search</div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
