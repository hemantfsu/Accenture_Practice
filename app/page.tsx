'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Play, Brain, Code, Trophy } from 'lucide-react'

export default function HomePage() {
  return (
    <main className="min-h-screen px-4 py-20">
      <div className="max-w-6xl mx-auto">
        
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <h1 className="text-7xl font-extrabold mb-6 gradient-text">
            Accenture Preparation
          </h1>
          <p className="text-3xl text-gray-300 mb-4">
            Smart Gamified Mock Tests
          </p>
          <p className="text-lg text-gray-400 mb-12 max-w-2xl mx-auto">
            Master your placement exams with interactive games, psychometric tests, 
            and technical assessments designed for success.
          </p>

          <Link href="/rounds">
            <button className="btn-bloom px-12 py-5 text-xl font-bold rounded-full bg-gradient-to-r from-purple-600 via-pink-600 to-blue-500 text-white hover:scale-105 transition-transform duration-300 relative z-10 flex items-center gap-3 mx-auto">
              <Play className="w-6 h-6" />
              Start Practice
            </button>
          </Link>
        </motion.div>

        {/* Navigation Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          
          {/* Round 1 */}
          <Link href="/rounds/elimination">
            <motion.div
              whileHover={{ scale: 1.02, y: -5 }}
              className="glass rounded-3xl p-8 cursor-pointer"
            >
              <div className="flex items-start gap-6">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600">
                  <Brain className="w-10 h-10 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2">Round 1: Elimination</h3>
                  <p className="text-gray-400 mb-4">
                    Psychometric Test (54 Q) + 3 Interactive Games
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 rounded-full bg-purple-600/20 text-purple-400 text-sm">
                      Rotate Path Puzzle
                    </span>
                    <span className="px-3 py-1 rounded-full bg-pink-600/20 text-pink-400 text-sm">
                      Expression Ordering
                    </span>
                    <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-sm">
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
              className="glass rounded-3xl p-8 cursor-pointer"
            >
              <div className="flex items-start gap-6">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600">
                  <Code className="w-10 h-10 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2">Round 2: Technical MCQ</h3>
                  <p className="text-gray-400 mb-4">
                    50 Questions across 5 technical domains
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-sm">
                      Pseudocode
                    </span>
                    <span className="px-3 py-1 rounded-full bg-purple-600/20 text-purple-400 text-sm">
                      Cloud & Networks
                    </span>
                    <span className="px-3 py-1 rounded-full bg-pink-600/20 text-pink-400 text-sm">
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
            className="glass rounded-3xl p-8 cursor-pointer"
          >
            <div className="flex items-center gap-6">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-yellow-500 to-orange-500">
                <Trophy className="w-10 h-10 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-1">View Results Dashboard</h3>
                <p className="text-gray-400">
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
