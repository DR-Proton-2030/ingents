import { assets } from '@/assets'
import Image from 'next/image'
import React from 'react'

const Logo = () => {
  return (
    <div>
      <Image src={assets.logo} alt="Ingents Logo" width={160} height={120} />
    </div>
  )
}

export default Logo