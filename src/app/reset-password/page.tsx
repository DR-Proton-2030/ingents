'use client';

import SetupPassword from '@/screens/auth/setupPassword/SetupPassword'
import React, { Suspense } from 'react'

const page = () => {
  return (
    <div>
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
        <SetupPassword/>
      </Suspense>
    </div>
  )
}

export default page
