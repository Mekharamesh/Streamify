import { LoaderIcon } from 'lucide-react'
import React from 'react'
import { useThemesStore } from '../store/useThemesStore'

const PageLoader = () => {
  const { theme } = useThemesStore();

  return (
    <div
      className='min-h-screen flex items-center justify-center'
      data-theme={theme}   // ✅ APPLY THEME
    >
      <LoaderIcon className='animate-spin size-10 text-primary' />
    </div>
  )
}

export default PageLoader