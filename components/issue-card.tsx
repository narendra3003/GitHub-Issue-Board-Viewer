"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { MessageCircle, Calendar, ExternalLink, CircleDot, CheckCircle2 } from "lucide-react"

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

interface IssueCardProps {
  issue: Issue
}

export function IssueCard({ issue }: IssueCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const getContrastColor = (hexColor: string) => {
    // Convert hex to RGB
    const r = Number.parseInt(hexColor.slice(0, 2), 16)
    const g = Number.parseInt(hexColor.slice(2, 4), 16)
    const b = Number.parseInt(hexColor.slice(4, 6), 16)

    // Calculate luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255

    return luminance > 0.5 ? "#000000" : "#ffffff"
  }

  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          {issue.state === "open" ? (
            <CircleDot className="h-4 w-4 text-green-500 flex-shrink-0" />
          ) : (
            <CheckCircle2 className="h-4 w-4 text-purple-500 flex-shrink-0" />
          )}
          <span className="text-sm text-muted-foreground">#{issue.number}</span>
        </div>
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

      {/* Title */}
      <h3 className="font-medium text-foreground mb-3 line-clamp-2 text-balance">{issue.title}</h3>

      {/* Labels */}
      {issue.labels.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {issue.labels.slice(0, 3).map((label) => (
            <Badge
              key={label.id}
              variant="outline"
              className="text-xs px-2 py-0.5"
              style={{
                backgroundColor: `#${label.color}20`,
                borderColor: `#${label.color}40`,
                color: getContrastColor(label.color),
              }}
            >
              {label.name}
            </Badge>
          ))}
          {issue.labels.length > 3 && (
            <Badge variant="outline" className="text-xs px-2 py-0.5">
              +{issue.labels.length - 3}
            </Badge>
          )}
        </div>
      )}

      {/* Assignee */}
      {issue.assignee && (
        <div className="flex items-center gap-2 mb-3">
          <Avatar className="h-6 w-6">
            <AvatarImage src={issue.assignee.avatar_url || "/placeholder.svg"} alt={issue.assignee.login} />
            <AvatarFallback className="text-xs">{issue.assignee.login.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <span className="text-sm text-muted-foreground">{issue.assignee.login}</span>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-border">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {formatDate(issue.created_at)}
          </div>
          <div className="flex items-center gap-1">
            <MessageCircle className="h-3 w-3" />
            {issue.comments}
          </div>
        </div>

        <Button variant="ghost" size="sm" asChild className="h-8 w-8 p-0">
          <a href={issue.html_url} target="_blank" rel="noopener noreferrer" aria-label="View issue on GitHub">
            <ExternalLink className="h-3 w-3" />
          </a>
        </Button>
      </div>
    </Card>
  )
}
