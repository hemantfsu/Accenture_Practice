'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, Brain, Gamepad2 } from 'lucide-react'

export default function EliminationPage() {
  return (
    <main className="min-h-screen px-4 py-12">
      <div className="max-w-5xl mx-auto">
        
        <Link href="/rounds">
          <button className="mb-8 flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
            Back to Rounds
          </button>
        </Link>

        <h1 className="text-5xl font-bold mb-4 gradient-text text-center">
          Round 1: Elimination
        </h1>
        <p className="text-center text-gray-400 mb-12">
          Complete the Psychometric Test and all 3 games to pass this round
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          
          {/* Psychometric Test */}
          <Link href="/rounds/elimination/psychometric">
            <motion.div
              whileHover={{ scale: 1.02, y: -5 }}
              className="glass rounded-2xl p-8 cursor-pointer h-full"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 rounded-xl bg-purple-600">
                  <Brain className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Psychometric Test</h3>
                  <p className="text-sm text-gray-400">54 Questions</p>
                </div>
              </div>
              <p className="text-gray-300 text-sm">
                Personality and aptitude assessment to evaluate your behavioral traits
              </p>
            </motion.div>
          </Link>

          {/* Game 1: Rotate Path */}
          <Link href="/rounds/elimination/games/rotate-path">
            <motion.div
              whileHover={{ scale: 1.02, y: -5 }}
              className="glass rounded-2xl p-8 cursor-pointer h-full"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 rounded-xl bg-pink-600">
                  <Gamepad2 className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Rotate Path Puzzle</h3>
                  <p className="text-sm text-gray-400">Game 1</p>
                </div>
              </div>
              <p className="text-gray-300 text-sm">
                Rotate tiles to connect Start to End with valid paths
              </p>
            </motion.div>
          </Link>

          {/* Game 2: Expression Ordering */}
          <Link href="/rounds/elimination/games/expression">
            <motion.div
              whileHover={{ scale: 1.02, y: -5 }}
              className="glass rounded-2xl p-8 cursor-pointer h-full"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 rounded-xl bg-blue-500">
                  <Gamepad2 className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Expression Ordering</h3>
                  <p className="text-sm text-gray-400">Game 2 - 15 Questions</p>
                </div>
              </div>
              <p className="text-gray-300 text-sm">
                Drag and drop expressions in ascending order
              </p>
            </motion.div>
          </Link>

          {/* Game 3: Hidden Maze */}
          <Link href="/rounds/elimination/games/maze">
            <motion.div
              whileHover={{ scale: 1.02, y: -5 }}
              className="glass rounded-2xl p-8 cursor-pointer h-full"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 rounded-xl bg-purple-600">
                  <Gamepad2 className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Hidden Path Maze</h3>
                  <p className="text-sm text-gray-400">Game 3</p>
                </div>
              </div>
              <p className="text-gray-300 text-sm">
                Navigate grid, collect key, find exit - walls revealed as you explore
              </p>
            </motion.div>
          </Link>

        </div>
      </div>
    </main>
  )
}
