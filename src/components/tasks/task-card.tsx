"use client"

import { formatDate } from "@/lib/utils"
import { ITask } from "@/types"
import { Calendar } from "lucide-react"
import { UserAvatar } from "../ui"


interface TaskCardProps {
  task: ITask
  onClick: () => void
}

export default function TaskCard({ task, onClick }: TaskCardProps) {
  return (
    <div
      className="bg-white p-3 rounded-md shadow-sm border border-gray-200 cursor-pointer hover:shadow-md transition-shadow"
      onClick={onClick}
    >
      <div className="text-sm font-medium mb-2">{task.name}</div>

      <div className="flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center gap-2">
          {task.dueDate && (
            <div className="flex items-center">
              <Calendar className="h-3 w-3 mr-1" />
              <span>{formatDate(task.dueDate)}</span>
            </div>
          )}
        </div>

        <div className="flex items-center">
          {task.assignees.length > 0 && (
            <div className="flex -space-x-2">
              {task.assignees.map((assignee) => (
                <UserAvatar key={assignee._id} user={assignee} size="sm" />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
