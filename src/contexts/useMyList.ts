import { useContext } from "react"
import{ MyListContext }  from './MyListContext';

export const useMyList = () => {
  const context = useContext(MyListContext)
  if (context === undefined) {
    throw new Error('useMyList must be used within a MyListProvider')
  }
  return context
}