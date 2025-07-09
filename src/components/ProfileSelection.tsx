"use client"

import { useState } from "react"
import { User, Edit3 } from "lucide-react"
import { profiles } from "../data/mockData"

interface Profile {
  id: string
  name: string
  avatar: string
  isCustom?: boolean
  color?: string
}

interface ProfileSelectionProps {
  onProfileSelect: (profileId: string) => void
}

const ProfileSelection = ({ onProfileSelect }: ProfileSelectionProps) => {
  const [isManaging, setIsManaging] = useState(false)

  
  const handleProfileClick = (profileId: string) => {
    if (!isManaging) {
      onProfileSelect(profileId)
    }
  }

  const ProfileAvatar = ({ profile }: { profile: Profile }) => {
    if (profile.isCustom && profile.avatar) {
      return (
        <img src={profile.avatar || "/placeholder.svg"} alt={profile.name} className="w-full h-full object-cover" />
      )
    }

    return (
      <div className={`w-full h-full ${profile.color} flex items-center justify-center`}>
        <div className="relative">
          <div className="flex space-x-4 mb-2">
            <div className="w-3 h-3 bg-white rounded-full"></div>
            <div className="w-3 h-3 bg-white rounded-full"></div>
          </div>
          <div className="w-8 h-4 border-b-2 border-white rounded-b-full"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-zinc-900 min-h-screen flex flex-col items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-normal text-white mb-10 mt-2 md:mb-16">Who's watching?</h1>

        <div className="flex flex-wrap justify-center gap-6 md:gap-8 lg:gap-12 mb-12 md:mb-16">
          {profiles.map((profile) => (
            <div
              key={profile.id}
              className="flex flex-col items-center group cursor-pointer"
              onClick={() => handleProfileClick(profile.id)}
            >
              <div className="relative mb-3">
                <div className="w-32 h-32 md:w-40 md:h-40 lg:w-44 lg:h-44 rounded-lg overflow-hidden transition-all duration-200 group-hover:scale-105 group-hover:ring-4 group-hover:ring-white/50">
                  <ProfileAvatar profile={profile} />
                </div>

                {isManaging && (
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-zinc-800 border-2 border-white rounded-full flex items-center justify-center">
                    <Edit3 size={16} className="text-white" />
                  </div>
                )}
              </div>

              <span className="text-gray-400 text-lg md:text-xl font-normal group-hover:text-white transition-colors">
                {profile.name}
              </span>
            </div>
          ))}

          {isManaging && (
            <div className="flex flex-col items-center group cursor-pointer">
              <div className="w-32 h-32 md:w-40 md:h-40 lg:w-44 lg:h-44 rounded-lg bg-zinc-800 border-2 border-dashed border-gray-600 flex items-center justify-center mb-3 transition-all duration-200 group-hover:border-white">
                <User size={48} className="text-gray-600 group-hover:text-white" />
              </div>
              <span className="text-gray-400 text-lg md:text-xl font-normal group-hover:text-white transition-colors">
                Add Profile
              </span>
            </div>
          )}
        </div>

        <button
          onClick={() => setIsManaging(!isManaging)}
          className="px-8 py-3 border border-gray-600 text-gray-400 text-lg font-normal hover:border-white hover:text-white transition-all duration-200 tracking-wide"
        >
          {isManaging ? "Done" : "Manage Profiles"}
        </button>
      </div>
    </div>
  )
}

export default ProfileSelection
