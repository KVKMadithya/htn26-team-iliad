'use client'

import React from 'react'
import Sidebar from '@/components/sidebar'

export default function SmartSpendPage() {
  return (
    <div className="min-h-screen bg-[#f1f1f1] font-geist p-0">
      <div className="flex min-h-screen">
        <Sidebar />

        <main className="flex-1 p-12">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-4xl font-bold text-gray-900">Smart Spend</h1>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-blue-200 flex items-center justify-center overflow-hidden">
                <img
                  src="/person-logo.png"
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-200 min-h-[500px] flex flex-col items-center justify-center">
            <div className="text-6xl mb-4">📊</div>
            <h2 className="text-2xl font-semibold mb-2">Analytics Dashboard</h2>
            <p className="text-gray-500 text-center max-w-md">
              This is your blank canvas for the Smart Spend feature. Start
              building your data visualizations and spending habits UI here!
            </p>
          </div>
        </main>
      </div>
    </div>
  )
}
