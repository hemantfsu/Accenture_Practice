'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Play, Brain, Code, Trophy } from 'lucide-react'

export default function HomePage() {
  return (
    <main className="min-h-screen px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
      <div className="max-w-6xl mx-auto">
        
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12 sm:mb-16 lg:mb-20"
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-4 sm:mb-6 gradient-text px-2">
            Accenture Preparation
          </h1>
          <p className="text-xl sm:text-2xl lg:text-3xl text-gray-300 mb-3 sm:mb-4 px-4">
            Smart Gamified Mock Tests
          </p>
          <p className="text-sm sm:text-base lg:text-lg text-gray-400 mb-8 sm:mb-10 lg:mb-12 max-w-2xl mx-auto px-4">
            Master your placement exams with interactive games, psychometric tests, 
            and technical assessments designed for success.
          </p>

          <Link href="/rounds">
            <button className="btn-bloom px-8 sm:px-10 lg:px-12 py-4 sm:py-5 text-base sm:text-lg lg:text-xl font-bold rounded-full bg-gradient-to-r from-purple-600 via-pink-600 to-blue-500 text-white hover:scale-105 transition-transform duration-300 relative z-10 flex items-center gap-2 sm:gap-3 mx-auto">
              <Play className="w-5 h-5 sm:w-6 sm:h-6" />
              Start Practice
            </button>
          </Link>
        </motion.div>

        {/* Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-6 sm:mb-8">
          
          {/* Round 1 */}
          <Link href="/rounds/elimination">
            <motion.div
              whileHover={{ scale: 1.02, y: -5 }}
              className="glass rounded-2xl sm:rounded-3xl p-6 sm:p-8 cursor-pointer"
            >
              <div className="flex items-start gap-4 sm:gap-6">
                <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 flex-shrink-0">
                  <Brain className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl sm:text-2xl font-bold mb-2">Round 1: Elimination</h3>
                  <p className="text-sm sm:text-base text-gray-400 mb-3 sm:mb-4">
                    Psychometric Test (54 Q) + 3 Interactive Games
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 sm:px-3 py-1 rounded-full bg-purple-600/20 text-purple-400 text-xs sm:text-sm">
                      Rotate Path Puzzle
                    </span>
                    <span className="px-2 sm:px-3 py-1 rounded-full bg-pink-600/20 text-pink-400 text-xs sm:text-sm">
                      Expression Ordering
                    </span>
                    <span className="px-2 sm:px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs sm:text-sm">
                      Hidden Maze
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </Link>

          {/* Round 2 */}
          <Link href="/rounds/technical">
            <motion.div
              whileHover={{ scale: 1.02, y: -5 }}
              className="glass rounded-2xl sm:rounded-3xl p-6 sm:p-8 cursor-pointer"
            >
              <div className="flex items-start gap-4 sm:gap-6">
                <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex-shrink-0">
                  <Code className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl sm:text-2xl font-bold mb-2">Round 2: Technical MCQ</h3>
                  <p className="text-sm sm:text-base text-gray-400 mb-3 sm:mb-4">
                    50 Questions across 5 technical domains
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 sm:px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs sm:text-sm">
                      Pseudocode
                    </span>
                    <span className="px-2 sm:px-3 py-1 rounded-full bg-purple-600/20 text-purple-400 text-xs sm:text-sm">
                      Cloud & Networks
                    </span>
                    <span className="px-2 sm:px-3 py-1 rounded-full bg-pink-600/20 text-pink-400 text-xs sm:text-sm">
                      MS Office
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </Link>
        </div>

        {/* Results */}
        <Link href="/results">
          <motion.div
            whileHover={{ scale: 1.02, y: -5 }}
            className="glass rounded-2xl sm:rounded-3xl p-6 sm:p-8 cursor-pointer"
          >
            <div className="flex items-center gap-4 sm:gap-6">
              <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-gradient-to-br from-yellow-500 to-orange-500 flex-shrink-0">
                <Trophy className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-xl sm:text-2xl font-bold mb-1">View Results Dashboard</h3>
                <p className="text-sm sm:text-base text-gray-400">
                  Track your performance, strengths, and areas for improvement
                </p>
              </div>
            </div>
          </motion.div>
        </Link>

      </div>
    </main>
  )
}
