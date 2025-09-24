"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Github, Star, GitFork, Users, ArrowRight, Code, Heart, Zap } from "lucide-react"

export default function LandingPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchError, setSearchError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  // Handle search
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setSearchError(null)
    const trimmed = searchQuery.trim()

    // Validate format owner/repo
    if (!/^([\w-]+)\/[\w.-]+$/.test(trimmed)) {
      setSearchError("Please enter in the format owner/repo")
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`https://api.github.com/repos/${trimmed}`, {
        headers: {
          Authorization: process.env.VITE_GITHUB_TOKEN
            ? `Bearer ${process.env.VITE_GITHUB_TOKEN}`
            : "",
          Accept: "application/vnd.github.v3+json",
        },
      })

      if (!res.ok) {
        setSearchError("Repository not found or is private.")
        setLoading(false)
        return
      }

      // Navigate on success
      router.push(`/projects/${trimmed}`)
    } catch {
      setSearchError("Network error. Try again.")
    } finally {
      setLoading(false)
    }
  }

  const featuredProjects = [
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
    },
    {
      name: "VS Code",
      owner: "microsoft",
      description: "Visual Studio Code",
      language: "TypeScript",
      stars: "163k",
      forks: "28.9k",
      openIssues: 5432,
      goodFirstIssues: 234,
      helpWantedIssues: 345,
      tags: ["Editor", "Tools", "Popular"],
    },
  ]

  const categories = [
    { name: "Frontend", count: 1234, icon: Code },
    { name: "Backend", count: 856, icon: Zap },
    { name: "Mobile", count: 432, icon: Users },
    { name: "DevOps", count: 678, icon: GitFork },
    { name: "AI/ML", count: 543, icon: Star },
    { name: "Tools", count: 789, icon: Heart },
  ]

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Github className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold text-foreground">OpenSource Board</span>
            </div>
            <div className="flex items-center space-x-6">
              <nav className="hidden md:flex items-center space-x-6">
                <Link href="/projects" className="text-muted-foreground hover:text-foreground transition-colors">
                  Projects
                </Link>
                <Link href="/contribute" className="text-muted-foreground hover:text-foreground transition-colors">
                  How to Contribute
                </Link>
                <Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors">
                  About
                </Link>
              </nav>
            </div>
          </div>
        </div>
      </header>

      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl font-bold text-foreground mb-6 text-balance">
            Discover Your Next
            <span className="text-primary"> Open Source</span> Contribution
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto text-pretty">
            Find beginner-friendly issues across curated open source projects. Start contributing to the projects you
            love with issues tagged as "good first issue" and "help wanted".
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/projects">
              <Button size="lg" className="min-w-[200px]">
                Browse Projects
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/contribute">
              <Button variant="outline" size="lg" className="min-w-[200px] bg-transparent">
                Learn to Contribute
              </Button>
            </Link>
          </div>

          <div className="max-w-md mx-auto mb-8">
            <form onSubmit={handleSearch} className="flex flex-col gap-3">
              <input
                type="text"
                className="border rounded px-4 py-3 text-lg w-full"
                placeholder="owner/repo"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                disabled={loading}
              />
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? "Searching..." : "Go to Repository"}
              </Button>
              {searchError && (
                <div className="text-red-500 text-sm text-center">
                  {searchError}
                </div>
              )}
            </form>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">Browse by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category) => {
              const Icon = category.icon
              return (
                <Link key={category.name} href={`/projects?category=${category.name.toLowerCase()}`}>
                  <Card className="p-6 text-center hover:bg-accent transition-colors cursor-pointer">
                    <Icon className="h-8 w-8 text-primary mx-auto mb-3" />
                    <h3 className="font-semibold text-foreground mb-1">{category.name}</h3>
                    <p className="text-sm text-muted-foreground">{category.count} issues</p>
                  </Card>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl font-bold text-foreground">Featured Projects</h2>
            <Link href="/projects">
              <Button variant="outline">
                View All Projects
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProjects.map((project) => (
              <Link key={`${project.owner}/${project.name}`} href={`/projects/${project.owner}/${project.name}`}>
                <Card className="p-6 hover:bg-accent transition-colors cursor-pointer h-full">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-foreground mb-1">
                        {project.owner}/{project.name}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">{project.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded-full bg-primary"></div>
                      {project.language}
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3" />
                      {project.stars}
                    </div>
                    <div className="flex items-center gap-1">
                      <GitFork className="h-3 w-3" />
                      {project.forks}
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="text-sm">
                      <span className="text-green-500 font-medium">{project.goodFirstIssues}</span>
                      <span className="text-muted-foreground"> good first issues</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-blue-500 font-medium">{project.helpWantedIssues}</span>
                      <span className="text-muted-foreground"> help wanted</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-border bg-card py-12 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Github className="h-6 w-6 text-primary" />
                <span className="font-bold text-foreground">OpenSource Board</span>
              </div>
              <p className="text-sm text-muted-foreground">Connecting developers with open source opportunities.</p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Projects</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/projects" className="hover:text-foreground transition-colors">
                    Browse All
                  </Link>
                </li>
                <li>
                  <Link href="/projects?filter=good-first-issue" className="hover:text-foreground transition-colors">
                    Good First Issues
                  </Link>
                </li>
                <li>
                  <Link href="/projects?filter=help-wanted" className="hover:text-foreground transition-colors">
                    Help Wanted
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/contribute" className="hover:text-foreground transition-colors">
                    How to Contribute
                  </Link>
                </li>
                <li>
                  <Link href="/guides" className="hover:text-foreground transition-colors">
                    Contribution Guides
                  </Link>
                </li>
                <li>
                  <Link href="/community" className="hover:text-foreground transition-colors">
                    Community
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">About</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/about" className="hover:text-foreground transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-foreground transition-colors">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/api" className="hover:text-foreground transition-colors">
                    API
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2025 OpenSource Board. Built with ❤️ for the open source community.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
