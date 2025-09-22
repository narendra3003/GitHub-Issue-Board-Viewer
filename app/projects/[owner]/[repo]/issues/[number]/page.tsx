"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader } from "@/components/loader"
import {
  ArrowLeft,
  Github,
  ExternalLink,
  AlertCircle,
  CircleDot,
  CheckCircle2,
  Calendar,
  MessageCircle,
  User,
  Tag,
  Clock,
} from "lucide-react"
import ReactMarkdown from "react-markdown"

interface Issue {
  id: number
  number: number
  title: string
  body: string
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
  assignees: Array<{
    login: string
    avatar_url: string
  }>
  created_at: string
  updated_at: string
  closed_at: string | null
  comments: number
  html_url: string
  user: {
    login: string
    avatar_url: string
  }
}

interface Comment {
  id: number
  body: string
  created_at: string
  updated_at: string
  html_url: string
  user: {
    login: string
    avatar_url: string
  }
}

export default function IssueDetailPage() {
  const params = useParams()
  const owner = params.owner as string
  const repo = params.repo as string
  const issueNumber = params.number as string

  const [issue, setIssue] = useState<Issue | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [commentsLoading, setCommentsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchIssue = async () => {
    try {
      setLoading(true)
      const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/issues/${issueNumber}`)

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Issue not found")
        }
        throw new Error(`Failed to fetch issue: ${response.statusText}`)
      }

      const data = await response.json()
      setIssue(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch issue")
    } finally {
      setLoading(false)
    }
  }

  const fetchComments = async () => {
    if (!issue || issue.comments === 0) return

    try {
      setCommentsLoading(true)
      const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/issues/${issueNumber}/comments`)

      if (!response.ok) {
        throw new Error(`Failed to fetch comments: ${response.statusText}`)
      }

      const data = await response.json()
      setComments(data)
    } catch (err) {
      console.error("Failed to fetch comments:", err)
    } finally {
      setCommentsLoading(false)
    }
  }

  useEffect(() => {
    if (owner && repo && issueNumber) {
      fetchIssue()
    }
  }, [owner, repo, issueNumber])

  useEffect(() => {
    if (issue) {
      fetchComments()
    }
  }, [issue])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getContrastColor = (hexColor: string) => {
    const r = Number.parseInt(hexColor.slice(0, 2), 16)
    const g = Number.parseInt(hexColor.slice(2, 4), 16)
    const b = Number.parseInt(hexColor.slice(4, 6), 16)
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
    return luminance > 0.5 ? "#000000" : "#ffffff"
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader />
      </div>
    )
  }

  if (error || !issue) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b border-border bg-card">
          <div className="container mx-auto px-4 py-4">
            <Link href={`/projects/${owner}/${repo}`}>
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Issues
              </Button>
            </Link>
          </div>
        </header>
        <div className="container mx-auto px-4 py-8">
          <Alert className="border-destructive/50 text-destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error || "Issue not found"}</AlertDescription>
          </Alert>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href={`/projects/${owner}/${repo}`}>
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Issues
                </Button>
              </Link>
              <div className="flex items-center space-x-2">
                <Github className="h-6 w-6 text-primary" />
                <span className="text-lg font-semibold text-foreground">
                  {owner}/{repo} #{issue.number}
                </span>
              </div>
            </div>
            <Button variant="outline" asChild>
              <a href={issue.html_url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" />
                View on GitHub
              </a>
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Issue Header */}
            <Card className="p-6 mb-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="flex items-center gap-2">
                  {issue.state === "open" ? (
                    <CircleDot className="h-5 w-5 text-green-500 flex-shrink-0" />
                  ) : (
                    <CheckCircle2 className="h-5 w-5 text-purple-500 flex-shrink-0" />
                  )}
                  <Badge
                    variant={issue.state === "open" ? "default" : "secondary"}
                    className={
                      issue.state === "open"
                        ? "bg-green-500/10 text-green-700 border-green-500/20"
                        : "bg-purple-500/10 text-purple-700 border-purple-500/20"
                    }
                  >
                    {issue.state}
                  </Badge>
                </div>
              </div>

              <h1 className="text-2xl font-bold text-foreground mb-4 text-balance">{issue.title}</h1>

              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={issue.user.avatar_url || "/placeholder.svg"} alt={issue.user.login} />
                    <AvatarFallback className="text-xs">{issue.user.login.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <span>{issue.user.login}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  opened {formatDate(issue.created_at)}
                </div>
                <div className="flex items-center gap-1">
                  <MessageCircle className="h-4 w-4" />
                  {issue.comments} comments
                </div>
              </div>

              {/* Labels */}
              {issue.labels.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {issue.labels.map((label) => (
                    <Badge
                      key={label.id}
                      variant="outline"
                      className="px-3 py-1"
                      style={{
                        backgroundColor: `#${label.color}20`,
                        borderColor: `#${label.color}40`,
                        color: getContrastColor(label.color),
                      }}
                    >
                      {label.name}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Issue Body */}
              {issue.body && (
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  <ReactMarkdown>{issue.body}</ReactMarkdown>
                </div>
              )}
            </Card>

            {/* Comments */}
            {issue.comments > 0 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-foreground">Comments ({issue.comments})</h2>

                {commentsLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader />
                  </div>
                ) : (
                  <div className="space-y-4">
                    {comments.map((comment) => (
                      <Card key={comment.id} className="p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={comment.user.avatar_url || "/placeholder.svg"} alt={comment.user.login} />
                            <AvatarFallback className="text-xs">
                              {comment.user.login.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium text-foreground">{comment.user.login}</div>
                            <div className="text-sm text-muted-foreground">
                              {formatDate(comment.created_at)}
                              {comment.updated_at !== comment.created_at && " (edited)"}
                            </div>
                          </div>
                        </div>
                        <div className="prose prose-sm max-w-none dark:prose-invert">
                          <ReactMarkdown>{comment.body}</ReactMarkdown>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {/* Assignees */}
              <Card className="p-4">
                <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Assignees
                </h3>
                {issue.assignees && issue.assignees.length > 0 ? (
                  <div className="space-y-2">
                    {issue.assignees.map((assignee) => (
                      <div key={assignee.login} className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={assignee.avatar_url || "/placeholder.svg"} alt={assignee.login} />
                          <AvatarFallback className="text-xs">
                            {assignee.login.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm text-foreground">{assignee.login}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No one assigned</p>
                )}
              </Card>

              {/* Labels */}
              <Card className="p-4">
                <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                  <Tag className="h-4 w-4" />
                  Labels
                </h3>
                {issue.labels.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {issue.labels.map((label) => (
                      <Badge
                        key={label.id}
                        variant="outline"
                        className="text-xs"
                        style={{
                          backgroundColor: `#${label.color}20`,
                          borderColor: `#${label.color}40`,
                          color: getContrastColor(label.color),
                        }}
                      >
                        {label.name}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">None yet</p>
                )}
              </Card>

              {/* Timeline */}
              <Card className="p-4">
                <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Timeline
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <CircleDot className="h-3 w-3 text-green-500" />
                    <span>Opened {formatDate(issue.created_at)}</span>
                  </div>
                  {issue.updated_at !== issue.created_at && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>Updated {formatDate(issue.updated_at)}</span>
                    </div>
                  )}
                  {issue.closed_at && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <CheckCircle2 className="h-3 w-3 text-purple-500" />
                      <span>Closed {formatDate(issue.closed_at)}</span>
                    </div>
                  )}
                </div>
              </Card>

              {/* Actions */}
              <Card className="p-4">
                <h3 className="font-semibold text-foreground mb-3">Actions</h3>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start bg-transparent" asChild>
                    <a href={issue.html_url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View on GitHub
                    </a>
                  </Button>
                  <Button variant="outline" className="w-full justify-start bg-transparent" asChild>
                    <a href={`${issue.html_url}#new_comment_field`} target="_blank" rel="noopener noreferrer">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Add Comment
                    </a>
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
