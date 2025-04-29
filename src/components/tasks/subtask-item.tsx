"use client"


import { Button } from "@/components/ui/button"
import { useGlobalStateStore } from "@/stores"
import { ITask } from "@/types"
import { ChevronRight } from "lucide-react"


interface SubtaskItemProps {
  task: ITask
}

export default function SubtaskItem({ task }: SubtaskItemProps) {
  const { openTaskModal } = useGlobalStateStore()

  return (
    <div className="flex items-center p-2 hover:bg-gray-50 rounded-md">
      <div
        className="w-4 h-4 rounded-full mr-2 flex items-center justify-center"
        style={{ backgroundColor: task.status.color }}
      >
        {task.status.type === "in_progress" && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
        {task.status.type === "done" && (
          <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        )}
      </div>
      <span className="flex-1 text-sm">{task.name}</span>
      <Button
        variant="ghost"
        size="icon"
        className="h-6 w-6 opacity-0 group-hover:opacity-100"
        onClick={() => openTaskModal(task._id)}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  )
}
