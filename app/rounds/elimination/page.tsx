'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, Brain, Gamepad2 } from 'lucide-react'

export default function EliminationPage() {
  return (
    <main className="min-h-screen px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="max-w-5xl mx-auto">
        
        <Link href="/rounds">
          <button className="mb-6 sm:mb-8 flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-sm sm:text-base">Back to Rounds</span>
          </button>
        </Link>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 gradient-text text-center px-4">
          Round 1: Elimination
        </h1>
        <p className="text-center text-sm sm:text-base text-gray-400 mb-8 sm:mb-12 px-4">
          Complete the Psychometric Test and all 3 games to pass this round
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          
          {/* Psychometric Test */}
          <Link href="/rounds/elimination/psychometric">
            <motion.div
              whileHover={{ scale: 1.02, y: -5 }}
              className="glass rounded-xl sm:rounded-2xl p-6 sm:p-8 cursor-pointer h-full"
            >
              <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                <div className="p-2 sm:p-3 rounded-lg sm:rounded-xl bg-purple-600 flex-shrink-0">
                  <Brain className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg sm:text-xl font-bold">Psychometric Test</h3>
                  <p className="text-xs sm:text-sm text-gray-400">54 Questions</p>
                </div>
              </div>
              <p className="text-gray-300 text-xs sm:text-sm">
                Personality and aptitude assessment to evaluate your behavioral traits
              </p>
            </motion.div>
          </Link>

          {/* Game 1: Rotate Path */}
          <Link href="/rounds/elimination/games/rotate-path">
            <motion.div
              whileHover={{ scale: 1.02, y: -5 }}
              className="glass rounded-xl sm:rounded-2xl p-6 sm:p-8 cursor-pointer h-full"
            >
              <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                <div className="p-2 sm:p-3 rounded-lg sm:rounded-xl bg-pink-600 flex-shrink-0">
                  <Gamepad2 className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg sm:text-xl font-bold">Rotate Path Puzzle</h3>
                  <p className="text-xs sm:text-sm text-gray-400">Game 1</p>
                </div>
              </div>
              <p className="text-gray-300 text-xs sm:text-sm">
                Rotate tiles to connect Start to End with valid paths
              </p>
            </motion.div>
          </Link>

          {/* Game 2: Expression Ordering */}
          <Link href="/rounds/elimination/games/expression">
            <motion.div
              whileHover={{ scale: 1.02, y: -5 }}
              className="glass rounded-xl sm:rounded-2xl p-6 sm:p-8 cursor-pointer h-full"
            >
              <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                <div className="p-2 sm:p-3 rounded-lg sm:rounded-xl bg-blue-500 flex-shrink-0">
                  <Gamepad2 className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg sm:text-xl font-bold">Expression Ordering</h3>
                  <p className="text-xs sm:text-sm text-gray-400">Game 2 - 15 Questions</p>
                </div>
              </div>
              <p className="text-gray-300 text-xs sm:text-sm">
                Drag and drop expressions in ascending order
              </p>
            </motion.div>
          </Link>

          {/* Game 3: Hidden Maze */}
          <Link href="/rounds/elimination/games/maze">
            <motion.div
              whileHover={{ scale: 1.02, y: -5 }}
              className="glass rounded-xl sm:rounded-2xl p-6 sm:p-8 cursor-pointer h-full"
            >
              <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                <div className="p-2 sm:p-3 rounded-lg sm:rounded-xl bg-purple-600 flex-shrink-0">
                  <Gamepad2 className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg sm:text-xl font-bold">Hidden Path Maze</h3>
                  <p className="text-xs sm:text-sm text-gray-400">Game 3</p>
                </div>
              </div>
              <p className="text-gray-300 text-xs sm:text-sm">
                Navigate grid, collect key, find exit - walls revealed as you explore
              </p>
            </motion.div>
          </Link>

        </div>
      </div>
    </main>
  )
}
