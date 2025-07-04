"use client"

import React, { useEffect } from 'react'
import { CheckCircle, XCircle, X } from 'lucide-react'
import type { ToastProps } from '../types'


const Toast: React.FC<ToastProps> = ({ message, type, duration = 3000, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  return (
    <div className={`
      fixed top-24 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg
      transition-all duration-300 ease-in-out transform
      ${type === 'success' 
        ? 'bg-green-600 text-white' 
        : 'bg-red-600 text-white'
      }
    `}>
      {type === 'success' ? (
        <CheckCircle size={20} />
      ) : (
        <XCircle size={20} />
      )}
      <span className="text-sm font-medium">{message}</span>
      <button
        onClick={onClose}
        className="ml-2 hover:bg-white/20 rounded-full p-1 transition-colors"
      >
        <X size={16} />
      </button>
    </div>
  )
}

export default Toast
