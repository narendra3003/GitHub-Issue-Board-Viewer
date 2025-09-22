"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { GlobalSearch } from "@/components/global-search"
import { Search, Github, Star, GitFork, ArrowLeft } from "lucide-react"

interface Repository {
  name: string
  owner: string
  description: string
  language: string
  stars: string
  forks: string
  openIssues: number
  goodFirstIssues: number
  helpWantedIssues: number
  tags: string[]
  lastUpdated: string
}

export default function ProjectsPage() {
  const [repositories] = useState<Repository[]>([
    {
      name: "React",
      owner: "facebook",
      description: "The library for web and native user interfaces",
      language: "JavaScript",
      stars: "228k",
      forks: "46.7k",
      openIssues: 1234,
      goodFirstIssues: 45,
      helpWantedIssues: 89,
      tags: ["Frontend", "Library", "Popular"],
      lastUpdated: "2024-01-15",
    },
    {
      name: "Next.js",
      owner: "vercel",
      description: "The React Framework for the Web",
      language: "TypeScript",
      stars: "125k",
      forks: "26.8k",
      openIssues: 2156,
      goodFirstIssues: 67,
      helpWantedIssues: 123,
      tags: ["Framework", "Full-stack", "Popular"],
      lastUpdated: "2024-01-14",
    },
    {
      name: "TensorFlow",
      owner: "tensorflow",
      description: "An Open Source Machine Learning Framework for Everyone",
      language: "Python",
      stars: "185k",
      forks: "74.2k",
      openIssues: 3421,
      goodFirstIssues: 156,
      helpWantedIssues: 234,
      tags: ["ML", "AI", "Python"],
      lastUpdated: "2024-01-13",
    },
    {
      name: "Vue.js",
      owner: "vuejs",
      description: "The Progressive JavaScript Framework",
      language: "TypeScript",
      stars: "207k",
      forks: "33.7k",
      openIssues: 567,
      goodFirstIssues: 23,
      helpWantedIssues: 45,
      tags: ["Frontend", "Framework", "Beginner-friendly"],
      lastUpdated: "2024-01-12",
    },
    {
      name: "Kubernetes",
      owner: "kubernetes",
      description: "Production-Grade Container Scheduling and Management",
      language: "Go",
      stars: "110k",
      forks: "39.4k",
      openIssues: 2789,
      goodFirstIssues: 89,
      helpWantedIssues: 167,
      tags: ["DevOps", "Infrastructure", "Cloud"],
      lastUpdated: "2024-01-11",
    },
    {
      name: "VSCode",
      owner: "microsoft",
      description: "Visual Studio Code",
      language: "TypeScript",
      stars: "163k",
      forks: "28.9k",
      openIssues: 5432,
      goodFirstIssues: 234,
      helpWantedIssues: 345,
      tags: ["Editor", "Tools", "Popular"],
      lastUpdated: "2024-01-10",
    },
  ])

  const [filteredRepos, setFilteredRepos] = useState<Repository[]>(repositories)
  const [searchQuery, setSearchQuery] = useState("")
  const [languageFilter, setLanguageFilter] = useState("all")
  const [sortBy, setSortBy] = useState("stars")

  const languages = Array.from(new Set(repositories.map((repo) => repo.language)))

  useEffect(() => {
    const filtered = repositories.filter((repo) => {
      const matchesSearch =
        repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        repo.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        repo.owner.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesLanguage = languageFilter === "all" || repo.language === languageFilter
      return matchesSearch && matchesLanguage
    })

    // Sort repositories
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "stars":
          return Number.parseInt(b.stars.replace("k", "000")) - Number.parseInt(a.stars.replace("k", "000"))
        case "issues":
          return b.goodFirstIssues - a.goodFirstIssues
        case "updated":
          return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
        default:
          return 0
      }
    })

    setFilteredRepos(filtered)
  }, [searchQuery, languageFilter, sortBy, repositories])

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
              <div className="flex items-center space-x-2">
                <Github className="h-6 w-6 text-primary" />
                <span className="text-lg font-semibold text-foreground">Projects</span>
              </div>
            </div>
            <div className="hidden md:block w-64">
              <GlobalSearch />
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-6">Curated Open Source Projects</h1>

          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={languageFilter} onValueChange={setLanguageFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Languages</SelectItem>
                {languages.map((lang) => (
                  <SelectItem key={lang} value={lang}>
                    {lang}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="stars">Most Stars</SelectItem>
                <SelectItem value="issues">Most Issues</SelectItem>
                <SelectItem value="updated">Recently Updated</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="md:hidden mb-6">
            <GlobalSearch />
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRepos.map((repo) => (
            <Link key={`${repo.owner}/${repo.name}`} href={`/projects/${repo.owner}/${repo.name}`}>
              <Card className="p-6 hover:bg-accent transition-colors cursor-pointer h-full">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-foreground mb-1">
                      {repo.owner}/{repo.name}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">{repo.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-primary"></div>
                    {repo.language}
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3" />
                    {repo.stars}
                  </div>
                  <div className="flex items-center gap-1">
                    <GitFork className="h-3 w-3" />
                    {repo.forks}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                  <div className="text-center p-2 bg-green-500/10 rounded">
                    <div className="text-green-500 font-semibold">{repo.goodFirstIssues}</div>
                    <div className="text-muted-foreground text-xs">Good First Issues</div>
                  </div>
                  <div className="text-center p-2 bg-blue-500/10 rounded">
                    <div className="text-blue-500 font-semibold">{repo.helpWantedIssues}</div>
                    <div className="text-muted-foreground text-xs">Help Wanted</div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {repo.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </Card>
            </Link>
          ))}
        </div>

        {filteredRepos.length === 0 && (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">No projects match your current filters.</p>
          </Card>
        )}
      </div>
    </div>
  )
}
