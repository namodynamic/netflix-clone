"use client"

import React, { createContext, useState, useEffect, type ReactNode } from 'react'
import Toast from '../components/Toast'
import type { MyListContextType, MyListItem, ToastProps } from '../types'


const MyListContext = createContext<MyListContextType | undefined>(undefined)

interface MyListProviderProps {
  children: ReactNode
}

export const MyListProvider: React.FC<MyListProviderProps> = ({ children }) => {
  const [myList, setMyList] = useState<MyListItem[]>([])
  const [toast, setToast] = useState<(ToastProps & { id: string }) | null>(null)

  // Load from localStorage on mount
  useEffect(() => {
    const savedList = localStorage.getItem('netflix-clone-mylist')
    if (savedList) {
      try {
        setMyList(JSON.parse(savedList))
      } catch (error) {
        console.error('Error parsing saved list:', error)
      }
    }
  }, [])

  // Save to localStorage whenever myList changes
  useEffect(() => {
    localStorage.setItem('netflix-clone-mylist', JSON.stringify(myList))
  }, [myList])

  const showToast = (message: string, type: 'success' | 'error') => {
    const id = Date.now().toString()
    setToast({ id, message, type, onClose: () => setToast(null) })
  }

  const addToMyList = (item: MyListItem) => {
    setMyList(prev => {
      // Check if item already exists
      if (prev.find(listItem => listItem.id === item.id)) {
        showToast('Item already in your list', 'error')
        return prev
      }
      const itemName = item.title || item.name || 'Item'
      showToast(`${itemName} added to My List`, 'success')
      return [...prev, item]
    })
  }

  const removeFromMyList = (id: number) => {
    setMyList(prev => {
      const item = prev.find(item => item.id === id)
      if (item) {
        const itemName = item.title || item.name || 'Item'
        showToast(`${itemName} removed from My List`, 'success')
      }
      return prev.filter(item => item.id !== id)
    })
  }

  const isInMyList = (id: number): boolean => {
    return myList.some(item => item.id === id)
  }

  const clearMyList = () => {
    setMyList([])
  }

  return (
    <MyListContext.Provider value={{
      myList,
      addToMyList,
      removeFromMyList,
      isInMyList,
      clearMyList
    }}>
      {children}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={toast.onClose}
        />
      )}
    </MyListContext.Provider>
  )
}

export { MyListContext };