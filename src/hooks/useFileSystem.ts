import { useContext } from 'react'
import { FileSystemContext } from '../context/FileSystemContext'

export const useFileSystem = () => {
  const { selectedItems } = useContext(FileSystemContext)

  return { selectedItems }
}
