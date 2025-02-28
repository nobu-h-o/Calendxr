// This is a mock implementation. In a real app, you would use the Google Calendar API.
export async function getCalendarEvents() {
  // Mock data for calendar events
  return [
    {
      id: 1,
      title: "Team Meeting",
      date: new Date(2025, 1, 28, 10, 0),
      duration: 60,
      attendees: [
        { name: "John Doe", avatar: "/placeholder.svg?height=32&width=32" },
        { name: "Jane Smith", avatar: "/placeholder.svg?height=32&width=32" },
      ],
    },
    {
      id: 2,
      title: "Project Review",
      date: new Date(2025, 1, 28, 14, 0),
      duration: 30,
      attendees: [
        { name: "John Doe", avatar: "/placeholder.svg?height=32&width=32" },
        { name: "Alice Johnson", avatar: "/placeholder.svg?height=32&width=32" },
      ],
    },
    {
      id: 3,
      title: "Client Call",
      date: new Date(2025, 1, 29, 11, 0),
      duration: 45,
      attendees: [
        { name: "John Doe", avatar: "/placeholder.svg?height=32&width=32" },
        { name: "Bob Brown", avatar: "/placeholder.svg?height=32&width=32" },
      ],
    },
    {
      id: 4,
      title: "Product Demo",
      date: new Date(2025, 2, 1, 13, 0),
      duration: 60,
      attendees: [
        { name: "John Doe", avatar: "/placeholder.svg?height=32&width=32" },
        { name: "Sarah Lee", avatar: "/placeholder.svg?height=32&width=32" },
        { name: "Mike Wilson", avatar: "/placeholder.svg?height=32&width=32" },
      ],
    },
    {
      id: 5,
      title: "Weekly Sync",
      date: new Date(2025, 2, 3, 9, 0),
      duration: 30,
      attendees: [
        { name: "John Doe", avatar: "/placeholder.svg?height=32&width=32" },
        { name: "Team", avatar: "/placeholder.svg?height=32&width=32" },
      ],
    },
  ]
}

