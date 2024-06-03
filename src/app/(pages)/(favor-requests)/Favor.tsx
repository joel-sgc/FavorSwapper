"use client"

import { CalendarIcon, UserIcon } from "lucide-react"
import { useState } from "react"

export const FavorComp = ({ request, className, index, ...props }: { request: any, className?: string, index: number }) => {
  const [expandedRequest, setExpandedRequest] = useState<number | null>(null)
  const handleRequestClick = ( index: number ) => {
    setExpandedRequest(index === expandedRequest ? null : index)
  }


  return (
    <div
      key={index}
      {...props}
      className={`bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transition-all duration-300 ${
        expandedRequest === index ? "hover:scale-105 hover:shadow-lg" : "hover:scale-[1.02] hover:shadow-md"
      }`}
      onClick={() => handleRequestClick(index)}
    >
      <div className="p-4 md:p-6">
        <div className="flex items-center mb-3 md:mb-4">
          <div className="bg-primary text-white font-bold px-3 py-1 rounded-full text-sm md:text-base">
            {request.favorPoints}
          </div>
          <h2 className="text-base font-bold ml-3 md:text-lg line-clamp-2">{request.description ?? "dwakhdwja"}</h2>
        </div>
        <p className="text-gray-600 line-clamp-3 mb-3 md:mb-4 text-sm md:text-base">{request.description}</p>
        <div className="flex items-center text-gray-500 text-sm md:text-base">
          <CalendarIcon className="w-4 h-4 mr-2 md:w-5 md:h-5" />
          <span>Due by {request.dueDate.toLocaleString()}</span>
          <UserIcon className="w-4 h-4 ml-4 mr-2 md:w-5 md:h-5" />
          <span>{request.senderId}</span>
        </div>
      </div>
      {expandedRequest === index && (
        <div className="bg-gray-100 p-4 md:p-6">
          <p className="text-sm md:text-base">{request.description}</p>
        </div>
      )}
    </div>
  )
}