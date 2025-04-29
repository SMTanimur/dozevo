/* eslint-disable @next/next/no-img-element */

import { getInitials } from "@/lib"
import { ITaskUser } from "@/types"



interface UserAvatarProps {
  user: ITaskUser
  size?: "sm" | "md" | "lg"
}

export const UserAvatar = ({ user, size = "md" }: UserAvatarProps) => {
  const sizeClasses = {
    sm: "h-6 w-6 text-xs",
    md: "h-8 w-8 text-sm",
    lg: "h-10 w-10 text-base",
  }

  const initials = getInitials(user.firstName, user.lastName)

  return (
    <div
      className={`${sizeClasses[size]} rounded-full bg-blue-500 text-white flex items-center justify-center font-medium border-2 border-white`}
      title={`${user.firstName || ""} ${user.lastName || ""}`}
    >
      {user.avatar ? (
        <img
          src={user.avatar || "/placeholder.svg"}
          alt={`${user.firstName || ""} ${user.lastName || ""}`}
          className="w-full h-full rounded-full object-cover"
        />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  )
}
