"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Github, BookOpen, Users, Code, GitFork, Star, CheckCircle } from "lucide-react"

export default function ContributePage() {
  const steps = [
    {
      title: "Find an Issue",
      description: "Browse our curated projects and look for issues labeled 'good first issue' or 'help wanted'",
      icon: BookOpen,
      tips: [
        "Start with projects you already use or are interested in",
        "Look for issues with clear descriptions and acceptance criteria",
        "Check if the issue is still open and not assigned to someone else",
      ],
    },
    {
      title: "Fork the Repository",
      description: "Create your own copy of the project to work on",
      icon: GitFork,
      tips: [
        "Click the 'Fork' button on the GitHub repository page",
        "This creates a copy under your GitHub account",
        "You'll make changes in your fork, not the original repository",
      ],
    },
    {
      title: "Clone and Setup",
      description: "Get the code on your local machine and set up the development environment",
      icon: Code,
      tips: [
        "Clone your fork: git clone https://github.com/yourusername/repo-name.git",
        "Follow the project's README for setup instructions",
        "Install dependencies and run tests to ensure everything works",
      ],
    },
    {
      title: "Make Your Changes",
      description: "Implement the fix or feature described in the issue",
      icon: CheckCircle,
      tips: [
        "Create a new branch for your changes",
        "Write clear, focused commits with good messages",
        "Follow the project's coding style and conventions",
      ],
    },
    {
      title: "Submit a Pull Request",
      description: "Share your changes with the project maintainers",
      icon: Users,
      tips: [
        "Push your changes to your fork",
        "Create a pull request from your fork to the original repository",
        "Reference the issue number in your PR description",
      ],
    },
  ]

  const resources = [
    {
      title: "GitHub Flow Guide",
      description: "Learn the basics of contributing to projects on GitHub",
      url: "https://guides.github.com/introduction/flow/",
      category: "Beginner",
    },
    {
      title: "First Contributions",
      description: "A hands-on tutorial for making your first open source contribution",
      url: "https://github.com/firstcontributions/first-contributions",
      category: "Tutorial",
    },
    {
      title: "How to Write Good Commit Messages",
      description: "Best practices for writing clear and helpful commit messages",
      url: "https://chris.beams.io/posts/git-commit/",
      category: "Best Practices",
    },
    {
      title: "Code Review Guidelines",
      description: "What to expect during the code review process",
      url: "https://github.com/thoughtbot/guides/tree/main/code-review",
      category: "Process",
    },
  ]

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
                <BookOpen className="h-6 w-6 text-primary" />
                <span className="text-lg font-semibold text-foreground">How to Contribute</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">Contributing to Open Source</h1>
            <p className="text-xl text-muted-foreground text-pretty">
              Your guide to making meaningful contributions to open source projects. Start your journey here.
            </p>
          </div>

          <div className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-6">Getting Started</h2>
            <div className="space-y-6">
              {steps.map((step, index) => {
                const Icon = step.icon
                return (
                  <Card key={step.title} className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary flex-shrink-0">
                        <Icon className="h-6 w-6" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Badge variant="outline" className="text-xs">
                            Step {index + 1}
                          </Badge>
                          <h3 className="text-xl font-semibold text-foreground">{step.title}</h3>
                        </div>
                        <p className="text-muted-foreground mb-4">{step.description}</p>
                        <div className="space-y-2">
                          <h4 className="font-medium text-foreground">Tips:</h4>
                          <ul className="space-y-1">
                            {step.tips.map((tip, tipIndex) => (
                              <li key={tipIndex} className="text-sm text-muted-foreground flex items-start gap-2">
                                <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                                {tip}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </Card>
                )
              })}
            </div>
          </div>

          <div className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-6">Helpful Resources</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {resources.map((resource) => (
                <Card key={resource.title} className="p-6 hover:bg-accent transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <Badge variant="secondary" className="text-xs">
                      {resource.category}
                    </Badge>
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{resource.title}</h3>
                  <p className="text-muted-foreground mb-4">{resource.description}</p>
                  <Button variant="outline" size="sm" asChild>
                    <a href={resource.url} target="_blank" rel="noopener noreferrer">
                      Read More
                    </a>
                  </Button>
                </Card>
              ))}
            </div>
          </div>

          <div className="text-center">
            <Card className="p-8 bg-primary/5 border-primary/20">
              <Github className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">Ready to Start Contributing?</h3>
              <p className="text-muted-foreground mb-6">
                Browse our curated projects and find your first issue to work on.
              </p>
              <Link href="/projects">
                <Button size="lg">
                  Browse Projects
                  <Star className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
