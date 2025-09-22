"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, Github, Heart, Users, Code, Target, Lightbulb, Globe } from "lucide-react"

export default function AboutPage() {
  const features = [
    {
      icon: Target,
      title: "Curated Projects",
      description:
        "Hand-picked open source projects that welcome new contributors and maintain high code quality standards.",
    },
    {
      icon: Lightbulb,
      title: "Beginner-Friendly",
      description: "Focus on issues labeled 'good first issue' and 'help wanted' to help newcomers get started easily.",
    },
    {
      icon: Globe,
      title: "Comprehensive Search",
      description: "Advanced filtering and search capabilities to find issues that match your skills and interests.",
    },
    {
      icon: Users,
      title: "Community Driven",
      description:
        "Built by the community, for the community. Help us improve the open source contribution experience.",
    },
  ]

  const stats = [
    { label: "Curated Projects", value: "500+" },
    { label: "Open Issues", value: "12,000+" },
    { label: "Good First Issues", value: "2,500+" },
    { label: "Contributors Helped", value: "10,000+" },
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
                <Heart className="h-6 w-6 text-primary" />
                <span className="text-lg font-semibold text-foreground">About</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">About OpenSource Board</h1>
            <p className="text-xl text-muted-foreground text-pretty">
              Making open source contribution accessible to everyone, one issue at a time.
            </p>
          </div>

          <div className="mb-12">
            <Card className="p-8 bg-primary/5 border-primary/20">
              <div className="text-center">
                <Github className="h-16 w-16 text-primary mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-foreground mb-4">Our Mission</h2>
                <p className="text-lg text-muted-foreground text-pretty">
                  We believe that contributing to open source should be accessible to developers of all skill levels.
                  OpenSource Board curates beginner-friendly issues from high-quality projects, providing a clear path
                  for new contributors to make their first meaningful contributions to the open source community.
                </p>
              </div>
            </Card>
          </div>

          <div className="grid md:grid-cols-4 gap-6 mb-12">
            {stats.map((stat) => (
              <Card key={stat.label} className="p-6 text-center">
                <div className="text-3xl font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </Card>
            ))}
          </div>

          <div className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-6 text-center">What Makes Us Different</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {features.map((feature) => {
                const Icon = feature.icon
                return (
                  <Card key={feature.title} className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary flex-shrink-0">
                        <Icon className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                        <p className="text-muted-foreground">{feature.description}</p>
                      </div>
                    </div>
                  </Card>
                )
              })}
            </div>
          </div>

          <div className="text-center">
            <Card className="p-8">
              <Code className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">Ready to Start Contributing?</h3>
              <p className="text-muted-foreground mb-6">
                Join thousands of developers who have started their open source journey with us.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/projects">
                  <Button size="lg">Browse Projects</Button>
                </Link>
                <Link href="/contribute">
                  <Button variant="outline" size="lg">
                    Learn How to Contribute
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
