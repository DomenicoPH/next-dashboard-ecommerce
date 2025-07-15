'use client'

import React from 'react'

interface VistaCarruselPreviewProps {
  imgUrl: string
  categoryName?: string
}

const VistaCarruselPreview: React.FC<VistaCarruselPreviewProps> = ({ imgUrl, categoryName }) => {

  return (
    <div className="relative w-full aspect-[21/9] rounded-lg overflow-hidden bg-cover bg-center shadow-xl" style={{ backgroundImage: `url(${imgUrl})` }}>
      {categoryName && (
        <div className="absolute bottom-4 left-4 text-white bg-black/60 px-4 py-2 rounded-md text-lg font-semibold">
          {categoryName}
        </div>
      )}
    </div>
  )
}

export default VistaCarruselPreview
