'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Brain, Gamepad2, ArrowLeft } from 'lucide-react'

export default function RoundsPage() {
  return (
    <main className="min-h-screen px-4 py-12">
      <div className="max-w-4xl mx-auto">
        
        <Link href="/">
          <button className="mb-8 flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </button>
        </Link>

        <h1 className="text-5xl font-bold mb-12 gradient-text text-center">
          Choose Your Round
        </h1>

        <div className="space-y-10">
          
          {/* Round 1: Elimination */}
          <Link href="/rounds/elimination">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="glass rounded-2xl p-10 mb-4 cursor-pointer"
            >
              <div className="flex items-center gap-6">
                <div className="p-4 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600">
                  <Brain className="w-12 h-12 text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="text-3xl font-bold mb-2">Round 1: Elimination Round</h2>
                  <p className="text-gray-400">
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
              className="glass rounded-2xl p-10 cursor-pointer"
            >
              <div className="flex items-center gap-6">
                <div className="p-4 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600">
                  <Gamepad2 className="w-12 h-12 text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="text-3xl font-bold mb-2">Round 2: Technical MCQ</h2>
                  <p className="text-gray-400">
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
