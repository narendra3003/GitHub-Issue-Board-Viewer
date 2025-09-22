"use client"

import { useState, useEffect } from "react"
import { RepoSearch } from "@/components/repo-search"
import { IssueCard } from "@/components/issue-card"
import { Filters } from "@/components/filters"
import { Loader } from "@/components/loader"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, ChevronDown } from "lucide-react"


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

export default function GitHubIssueBoardViewer() {
  const [issues, setIssues] = useState<Issue[]>([])
  const [filteredIssues, setFilteredIssues] = useState<Issue[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentRepo, setCurrentRepo] = useState<string>("")
  const [totalIssues, setTotalIssues] = useState<number | null>(null)

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

  // Pagination states
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(30) // Default perPage value
  const [totalPages, setTotalPages] = useState<number>(1)

  // Fetch issues from GitHub API with pagination
  const fetchTotalIssues = async (repo: string) => {
    if (!repo || !repo.includes("/")) return;
    try {
      const response = await fetch(`https://api.github.com/repos/${repo}`);
      if (!response.ok) return;
      const data = await response.json();
      // open_issues_count includes PRs, so we need to estimate or just use as is
      setTotalIssues(data.open_issues_count || 0);
    } catch {
      setTotalIssues(null);
    }
  };

  const fetchIssues = async (
    repo: string,
    pageNum: number = 1,
    perPageNum: number = perPage
  ) => {
    if (!repo || !repo.includes("/")) {
      setError("Please enter a valid repository in the format: owner/repo");
      return;
    }

    setLoading(true);
    setError(null);
    setCurrentRepo(repo);

    // Fetch total issues count when repo changes or on first fetch
    if (pageNum === 1 && perPageNum === perPage) {
      fetchTotalIssues(repo);
    }

    try {
      const response = await fetch(
        `https://api.github.com/repos/${repo}/issues?state=all&per_page=${perPageNum}&page=${pageNum}`
      );

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(
            "Repository not found. Please check the repository name and make sure it's public."
          );
        }
        throw new Error(`Failed to fetch issues: ${response.statusText}`);
      }

    const data = await response.json();
    // const issuesOnly = data.filter((issue: any) => !issue.pull_request);
    const issuesOnly = data;

      setIssues(issuesOnly);
      setPage(pageNum);
      setPerPage(perPageNum);

      // If no issues returned, show page out of bounds error
      if (Array.isArray(issuesOnly) && issuesOnly.length === 0) {
        setError("Page out of bounds or no issues found on this page.");
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred while fetching issues"
      );
      setIssues([]);
    } finally {
      setLoading(false);
    }
  };

  // Apply filters and sorting
  useEffect(() => {
    let filtered = [...issues]

    // Filter by state
    if (filters.state !== "all") {
      filtered = filtered.filter((issue) => issue.state === filters.state)
    }

    // Filter by labels
    if (filters.labels.length > 0) {
      filtered = filtered.filter((issue) =>
        filters.labels.some((filterLabel) => issue.labels.some((issueLabel) => issueLabel.name === filterLabel)),
      )
    }

    // Filter by assignee
    if (filters.assignee) {
      filtered = filtered.filter((issue) =>
        issue.assignee?.login.toLowerCase().includes(filters.assignee.toLowerCase()),
      )
    }

    // Filter by keyword
    if (filters.keyword) {
      const keyword = filters.keyword.toLowerCase()
      filtered = filtered.filter(
        (issue) => issue.title.toLowerCase().includes(keyword) || issue.user.login.toLowerCase().includes(keyword),
      )
    }

    // Apply sorting
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

  // Update totalPages whenever totalIssues or perPage changes
  useEffect(() => {
    if (totalIssues !== null && perPage > 0) {
      setTotalPages(Math.ceil(totalIssues / perPage));
    } else {
      setTotalPages(1);
    }
  }, [totalIssues, perPage]);

  // Get unique labels for filter options
  const availableLabels = Array.from(
    new Set(issues.flatMap((issue) => issue.labels.map((label) => label.name))),
  ).sort()

  // Get unique assignees for filter options
  const availableAssignees = Array.from(
    new Set(issues.filter((issue) => issue.assignee).map((issue) => issue.assignee!.login)),
  ).sort()

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2 text-balance">GitHub Issue Board Viewer</h1>
          <p className="text-muted-foreground text-lg">Browse and filter issues from any public GitHub repository</p>
        </div>

        {/* Repository Search */}
        <div className="mb-6">
          <RepoSearch onSearch={fetchIssues} loading={loading} />
        </div>

        {/* Error Display */}
        {error && (
          <Alert className="mb-6 border-destructive/50 text-destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center py-12">
            <Loader />
          </div>
        )}
        {/* Per Page and Page Controls */}
        <div className="mb-4 flex gap-4 items-center">
          {/* Per Page Selector */}
          <label>
            Per Page:
            <select
              className="ml-2 px-2 py-1 border rounded bg-black text-white"
              value={perPage}
              onChange={(e) => {
                const newPerPage = Number(e.target.value);
                fetchIssues(currentRepo, 1, newPerPage); // reset to page 1
              }}
              disabled={loading}
            >
              {[10, 20, 30, 50, 100].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </label>

          {/* Page Input */}
          <label>
            Page:
            <input
              type="number"
              min={1}
              className="ml-2 px-2 py-1 border rounded w-16"
              value={page}
              onChange={(e) => {
                const newPage = Number(e.target.value);
                if (newPage >= 1) {
                  fetchIssues(currentRepo, newPage, perPage);
                }
              }}
              disabled={loading}
            />
          </label>
        </div>
        {/* Main Content */}
        {!loading && issues.length > 0 && !error && (
          <>
            {/* Repository Info */}
            <div className="mb-6">
              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-foreground">{currentRepo}</h2>
                    <p className="text-muted-foreground">
                      {totalIssues !== null ? `${totalIssues} total issues` : `${issues.length} issues found`}
                    </p>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Showing {filteredIssues.length} of {issues.length} issues
                  </div>
                </div>
              </Card>
            </div>

            {/* Pagination Controls */}
            <div className="mb-4 flex justify-between items-center">
              <button
                className="px-4 py-2 bg-muted-foreground text-white rounded disabled:opacity-50"
                onClick={() => fetchIssues(currentRepo, page - 1)}
                disabled={page <= 1 || loading}
              >
                Prev
              </button>
              <span className="text-muted-foreground">
                Page {page} of {totalPages}
              </span>
              <button
                className="px-4 py-2 bg-muted-foreground text-white rounded disabled:opacity-50"
                onClick={() => fetchIssues(currentRepo, page + 1)}
                disabled={loading || page >= totalPages}
              >
                Next
              </button>
            </div>

            {/* Filters */}
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

            {/* Issues Grid */}
            {filteredIssues.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredIssues.map((issue) => (
                  <IssueCard key={issue.id} issue={issue} />
                ))}
              </div>
            ) : (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">No issues match your current filters.</p>
              </Card>
            )}
          </>
        )}

        {/* Empty State */}
        {!loading && !error && issues.length === 0 && currentRepo && (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">No issues found in this repository.</p>
          </Card>
        )}
      </div>
    </div>
  )
}
