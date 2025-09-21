"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Filter, X, ArrowUp, ArrowDown } from "lucide-react"
import { useState } from "react"

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

interface FiltersProps {
  filters: FilterState
  onFiltersChange: (filters: FilterState) => void
  sort: SortState
  onSortChange: (sort: SortState) => void
  availableLabels: string[]
  availableAssignees: string[]
}

export function Filters({
  filters,
  onFiltersChange,
  sort,
  onSortChange,
  availableLabels,
  availableAssignees,
}: FiltersProps) {
  const [labelSearch, setLabelSearch] = useState("")

  const handleStateChange = (state: "all" | "open" | "closed") => {
    onFiltersChange({ ...filters, state })
  }

  const handleLabelToggle = (label: string) => {
    const newLabels = filters.labels.includes(label)
      ? filters.labels.filter((l) => l !== label)
      : [...filters.labels, label]
    onFiltersChange({ ...filters, labels: newLabels })
  }

  const handleAssigneeChange = (assignee: string) => {
    onFiltersChange({ ...filters, assignee })
  }

  const handleKeywordChange = (keyword: string) => {
    onFiltersChange({ ...filters, keyword })
  }

  const handleSortChange = (field: "created" | "comments") => {
    if (sort.field === field) {
      onSortChange({
        field,
        direction: sort.direction === "asc" ? "desc" : "asc",
      })
    } else {
      onSortChange({ field, direction: "desc" })
    }
  }

  const clearFilters = () => {
    onFiltersChange({
      state: "all",
      labels: [],
      assignee: "",
      keyword: "",
    })
  }

  const hasActiveFilters =
    filters.state !== "all" || filters.labels.length > 0 || filters.assignee !== "" || filters.keyword !== ""

  const filteredLabels = availableLabels.filter((label) => label.toLowerCase().includes(labelSearch.toLowerCase()))

  return (
    <Card className="p-4">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="h-4 w-4 text-primary" />
        <h3 className="font-medium text-foreground">Filters & Sorting</h3>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters} className="ml-auto text-xs">
            Clear all
          </Button>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* State Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">State</label>
          <Select value={filters.state} onValueChange={handleStateChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Issues</SelectItem>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Labels Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Labels</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start bg-transparent">
                {filters.labels.length > 0 ? (
                  <span>{filters.labels.length} selected</span>
                ) : (
                  <span className="text-muted-foreground">Select labels</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0">
              <div className="p-3 border-b">
                <Input
                  placeholder="Search labels..."
                  value={labelSearch}
                  onChange={(e) => setLabelSearch(e.target.value)}
                />
              </div>
              <div className="max-h-60 overflow-y-auto p-2">
                {filteredLabels.length > 0 ? (
                  <div className="space-y-1">
                    {filteredLabels.map((label) => (
                      <Button
                        key={label}
                        variant={filters.labels.includes(label) ? "default" : "ghost"}
                        size="sm"
                        className="w-full justify-start text-xs"
                        onClick={() => handleLabelToggle(label)}
                      >
                        {label}
                      </Button>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">No labels found</p>
                )}
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Assignee Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Assignee</label>
          <Select value={filters.assignee} onValueChange={handleAssigneeChange}>
            <SelectTrigger>
              <SelectValue placeholder="All assignees" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All assignees</SelectItem>
              {availableAssignees.map((assignee) => (
                <SelectItem key={assignee} value={assignee}>
                  {assignee}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Keyword Search */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Search</label>
          <Input
            placeholder="Search issues..."
            value={filters.keyword}
            onChange={(e) => handleKeywordChange(e.target.value)}
          />
        </div>
      </div>

      {/* Active Filters */}
      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex flex-wrap gap-2">
            {filters.state !== "all" && (
              <Badge variant="secondary" className="gap-1">
                State: {filters.state}
                <Button variant="ghost" size="sm" className="h-auto p-0 ml-1" onClick={() => handleStateChange("all")}>
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            )}
            {filters.labels.map((label) => (
              <Badge key={label} variant="secondary" className="gap-1">
                {label}
                <Button variant="ghost" size="sm" className="h-auto p-0 ml-1" onClick={() => handleLabelToggle(label)}>
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
            {filters.assignee && (
              <Badge variant="secondary" className="gap-1">
                Assignee: {filters.assignee}
                <Button variant="ghost" size="sm" className="h-auto p-0 ml-1" onClick={() => handleAssigneeChange("")}>
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            )}
            {filters.keyword && (
              <Badge variant="secondary" className="gap-1">
                Search: {filters.keyword}
                <Button variant="ghost" size="sm" className="h-auto p-0 ml-1" onClick={() => handleKeywordChange("")}>
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            )}
          </div>
        </div>
      )}

      {/* Sorting */}
      <div className="mt-4 pt-4 border-t border-border">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-foreground">Sort by:</span>
          <Button
            variant={sort.field === "created" ? "default" : "outline"}
            size="sm"
            onClick={() => handleSortChange("created")}
            className="gap-1"
          >
            Created
            {sort.field === "created" &&
              (sort.direction === "asc" ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />)}
          </Button>
          <Button
            variant={sort.field === "comments" ? "default" : "outline"}
            size="sm"
            onClick={() => handleSortChange("comments")}
            className="gap-1"
          >
            Comments
            {sort.field === "comments" &&
              (sort.direction === "asc" ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />)}
          </Button>
        </div>
      </div>
    </Card>
  )
}
