import ClientHeader from '@/components/ClientHeader'
import React from 'react'

const ClientLayout = ({children}: {children: React.ReactNode}) => {
  return (
    <div className='min-h-screen bg-gray-50'>
      <ClientHeader />
      {children}
    </div>
  )
}

export default ClientLayout