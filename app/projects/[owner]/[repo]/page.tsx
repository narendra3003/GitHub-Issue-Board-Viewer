"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Filters } from "@/components/filters"
import { IssueCard } from "@/components/issue-card"
import { Loader } from "@/components/loader"
import { ArrowLeft, Github, Star, GitFork, ExternalLink, AlertCircle, ChevronDown } from "lucide-react"

interface Issue {
  id: number
  number: number
  title: string
  state: "open" | "closed"
  labels: Array<{
    id: number
    name: string
    color: string
  }>
  assignee: {
    login: string
    avatar_url: string
  } | null
  created_at: string
  comments: number
  html_url: string
  user: {
    login: string
    avatar_url: string
  }
}

interface Repository {
  name: string
  full_name: string
  description: string
  language: string
  stargazers_count: number
  forks_count: number
  open_issues_count: number
  html_url: string
  owner: {
    login: string
    avatar_url: string
  }
}

interface FilterState {
  state: "all" | "open" | "closed"
  labels: string[]
  assignee: string
  keyword: string
}

interface SortState {
  field: "created" | "comments"
  direction: "asc" | "desc"
}

export default function RepositoryIssuePage() {
  const params = useParams()
  console.log("Params:", params)
  const owner = params.owner as string
  const repo = params.repo as string
  console.log("Owner:", owner, "Repo:", repo)

  const [repository, setRepository] = useState<Repository | null>(null)
  const [issues, setIssues] = useState<Issue[]>([])
  const [filteredIssues, setFilteredIssues] = useState<Issue[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [hasMorePages, setHasMorePages] = useState(true)
  const [totalIssues, setTotalIssues] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const [filters, setFilters] = useState<FilterState>({
    state: "all",
    labels: [],
    assignee: "",
    keyword: "",
  })

  const [sort, setSort] = useState<SortState>({
    field: "created",
    direction: "desc",
  })

  const fetchRepository = async () => {
    try {
      const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`,{
        headers: {
      Authorization: process.env.VITE_GITHUB_TOKEN
        ? `Bearer ${process.env.VITE_GITHUB_TOKEN}`
        : "",
      Accept: "application/vnd.github.v3+json",
    },
      });
      if (!response.ok) {
        throw new Error("Repository not found")
      }
      const data = await response.json()
      setRepository(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch repository")
    }
  }

  const fetchIssues = async (page = 1, append = false) => {
    if (page === 1) {
      setLoading(true)
      setIssues([])
      setCurrentPage(1)
      setHasMorePages(true)
    } else {
      setLoadingMore(true)
    }

    setError(null)

    try {
      const response = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/issues?state=all&per_page=100&page=${page}&sort=created&direction=desc`,
      {
        headers: {
      Authorization: process.env.VITE_GITHUB_TOKEN
        ? `Bearer ${process.env.VITE_GITHUB_TOKEN}`
        : "",
      Accept: "application/vnd.github.v3+json",
    },
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Repository not found. Please check the repository name and make sure it's public.")
        }
        throw new Error(`Failed to fetch issues: ${response.statusText}`)
      }

      const data = await response.json()
      const issuesOnly = data.filter((issue: any) => !issue.pull_request)

      if (page === 1) {
        setIssues(issuesOnly)
        if (issuesOnly.length === 100) {
          setHasMorePages(true)
        } else {
          setHasMorePages(false)
        }
        setTotalIssues(issuesOnly.length)
      } else {
        setIssues((prev) => [...prev, ...issuesOnly])
        setTotalIssues((prev) => prev + issuesOnly.length)

        if (issuesOnly.length < 100) {
          setHasMorePages(false)
        }
      }

      setCurrentPage(page)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred while fetching issues")
      if (page === 1) {
        setIssues([])
      }
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }

  const loadMoreIssues = () => {
    if (hasMorePages && !loadingMore) {
      fetchIssues(currentPage + 1, true)
    }
  }

  useEffect(() => {
    if (owner && repo) {
      fetchRepository()
      fetchIssues()
    }
  }, [owner, repo])

  useEffect(() => {
    let filtered = [...issues]

    if (filters.state !== "all") {
      filtered = filtered.filter((issue) => issue.state === filters.state)
    }

    if (filters.labels.length > 0) {
      filtered = filtered.filter((issue) =>
        filters.labels.some((filterLabel) => issue.labels.some((issueLabel) => issueLabel.name === filterLabel)),
      )
    }

    if (filters.assignee) {
      filtered = filtered.filter((issue) =>
        issue.assignee?.login.toLowerCase().includes(filters.assignee.toLowerCase()),
      )
    }

    if (filters.keyword) {
      const keyword = filters.keyword.toLowerCase()
      filtered = filtered.filter(
        (issue) => issue.title.toLowerCase().includes(keyword) || issue.user.login.toLowerCase().includes(keyword),
      )
    }

    filtered.sort((a, b) => {
      let aValue: number
      let bValue: number

      if (sort.field === "created") {
        aValue = new Date(a.created_at).getTime()
        bValue = new Date(b.created_at).getTime()
      } else {
        aValue = a.comments
        bValue = b.comments
      }

      if (sort.direction === "asc") {
        return aValue - bValue
      } else {
        return bValue - aValue
      }
    })

    setFilteredIssues(filtered)
  }, [issues, filters, sort])

  const availableLabels = Array.from(new Set(issues.flatMap((issue) => issue.labels.map((label) => label.name)))).sort()
  const availableAssignees = Array.from(
    new Set(issues.filter((issue) => issue.assignee).map((issue) => issue.assignee!.login)),
  ).sort()

  const goodFirstIssues = issues.filter((issue) =>
    issue.labels.some((label) => label.name.toLowerCase().includes("good first issue")),
  ).length

  const helpWantedIssues = issues.filter((issue) =>
    issue.labels.some((label) => label.name.toLowerCase().includes("help wanted")),
  ).length

  if (loading && !repository) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/projects">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Projects
                </Button>
              </Link>
              <div className="flex items-center space-x-2">
                <Github className="h-6 w-6 text-primary" />
                <span className="text-lg font-semibold text-foreground">
                  {owner}/{repo}
                </span>
              </div>
            </div>
            {repository && (
              <Button variant="outline" asChild>
                <a href={repository.html_url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View on GitHub
                </a>
              </Button>
            )}
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {repository && (
          <div className="mb-8">
            <Card className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-foreground mb-2">{repository.full_name}</h1>
                  <p className="text-muted-foreground mb-4">{repository.description}</p>

                  <div className="flex items-center gap-6 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded-full bg-primary"></div>
                      {repository.language}
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4" />
                      {repository.stargazers_count.toLocaleString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <GitFork className="h-4 w-4" />
                      {repository.forks_count.toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-foreground">{repository.open_issues_count}</div>
                  <div className="text-sm text-muted-foreground">Open Issues</div>
                </div>
                <div className="text-center p-4 bg-green-500/10 rounded-lg">
                  <div className="text-2xl font-bold text-green-500">{goodFirstIssues}</div>
                  <div className="text-sm text-muted-foreground">Good First Issues</div>
                </div>
                <div className="text-center p-4 bg-blue-500/10 rounded-lg">
                  <div className="text-2xl font-bold text-blue-500">{helpWantedIssues}</div>
                  <div className="text-sm text-muted-foreground">Help Wanted</div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {error && (
          <Alert className="mb-6 border-destructive/50 text-destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {loading && (
          <div className="flex justify-center py-12">
            <Loader />
          </div>
        )}

        {!loading && issues.length > 0 && (
          <>
            <div className="mb-6">
              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-foreground">Issues</h2>
                    <p className="text-muted-foreground">
                      {totalIssues} issues loaded{hasMorePages ? " (more available)" : ""}
                    </p>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Showing {filteredIssues.length} of {totalIssues} issues
                  </div>
                </div>
              </Card>
            </div>

            <div className="mb-6">
              <Filters
                filters={filters}
                onFiltersChange={setFilters}
                sort={sort}
                onSortChange={setSort}
                availableLabels={availableLabels}
                availableAssignees={availableAssignees}
              />
            </div>

            {filteredIssues.length > 0 ? (
              <>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {filteredIssues.map((issue) => (
                    <Link key={issue.id} href={`/projects/${owner}/${repo}/issues/${issue.number}`}>
                      <div className="cursor-pointer">
                        <IssueCard issue={issue} />
                      </div>
                    </Link>
                  ))}
                </div>

                {hasMorePages && (
                  <div className="flex justify-center mt-8">
                    <Button
                      onClick={loadMoreIssues}
                      disabled={loadingMore}
                      variant="outline"
                      size="lg"
                      className="min-w-[200px] bg-transparent"
                    >
                      {loadingMore ? (
                        <>
                          <Loader />
                          <span className="ml-2">Loading more...</span>
                        </>
                      ) : (
                        <>
                          <ChevronDown className="w-4 h-4 mr-2" />
                          Load More Issues
                        </>
                      )}
                    </Button>
                  </div>
                )}

                {!hasMorePages && totalIssues > 100 && (
                  <div className="text-center mt-6 text-muted-foreground">All {totalIssues} issues loaded</div>
                )}
              </>
            ) : (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">No issues match your current filters.</p>
              </Card>
            )}
          </>
        )}

        {!loading && !error && issues.length === 0 && (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">No issues found in this repository.</p>
          </Card>
        )}
      </div>
    </div>
  )
}
