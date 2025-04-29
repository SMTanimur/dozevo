import { UserAvatar } from "@/components/ui"
import { IComment } from "@/types"
import { formatDistanceToNow } from "date-fns"


interface CommentItemProps {
  comment: IComment
}

export const CommentItem = ({ comment }: CommentItemProps) => {
  return (
    <div className="flex gap-2">
      <UserAvatar user={comment.user} size="sm" />
      <div className="flex-1">
        <div className="bg-gray-50 rounded-md p-2">
          <div className="flex items-center gap-1 mb-1">
            <span className="font-medium text-xs text-gray-700">
              {comment.user.firstName} {comment.user.lastName}
            </span>
            <span className="text-xs text-gray-400">
              {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
            </span>
          </div>
          <div className="text-sm whitespace-pre-wrap">{comment.comment_text}</div>
        </div>
      </div>
    </div>
  )
}
