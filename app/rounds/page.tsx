'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Brain, Gamepad2, ArrowLeft } from 'lucide-react'

export default function RoundsPage() {
  return (
    <main className="min-h-screen px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="max-w-4xl mx-auto">
        
        <Link href="/">
          <button className="mb-6 sm:mb-8 flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-sm sm:text-base">Back to Home</span>
          </button>
        </Link>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-8 sm:mb-12 gradient-text text-center px-4">
          Choose Your Round
        </h1>

        <div className="space-y-6 sm:space-y-10">
          
          {/* Round 1: Elimination */}
          <Link href="/rounds/elimination">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="glass rounded-xl sm:rounded-2xl p-6 sm:p-10 mb-4 cursor-pointer"
            >
              <div className="flex items-center gap-4 sm:gap-6">
                <div className="p-3 sm:p-4 rounded-lg sm:rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex-shrink-0">
                  <Brain className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2">Round 1: Elimination Round</h2>
                  <p className="text-sm sm:text-base text-gray-400">
                    Psychometric Test + 3 Interactive Games
                  </p>
                </div>
              </div>
            </motion.div>
          </Link>

          {/* Round 2: Technical */}
          <Link href="/rounds/technical">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="glass rounded-xl sm:rounded-2xl p-6 sm:p-10 cursor-pointer"
            >
              <div className="flex items-center gap-4 sm:gap-6">
                <div className="p-3 sm:p-4 rounded-lg sm:rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex-shrink-0">
                  <Gamepad2 className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2">Round 2: Technical MCQ</h2>
                  <p className="text-sm sm:text-base text-gray-400">
                    50 Questions - Pseudocode, Cloud, Networks, MS Office & Cybersecurity
                  </p>
                </div>
              </div>
            </motion.div>
          </Link>

        </div>
      </div>
    </main>
  )
}
