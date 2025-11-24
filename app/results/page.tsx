'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Award, Brain, Gamepad2, Code, TrendingUp, TrendingDown, Trophy, Clock, Target, RotateCw } from 'lucide-react'

interface GameResult {
  score?: number
  moves?: number
  time?: number
  total?: number
}

export default function ResultsPage() {
  const [psychometricData, setPsychometricData] = useState<any>(null)
  const [rotatePathData, setRotatePathData] = useState<GameResult | null>(null)
  const [expressionData, setExpressionData] = useState<GameResult | null>(null)
  const [mazeData, setMazeData] = useState<GameResult | null>(null)
  const [technicalData, setTechnicalData] = useState<any>(null)

  useEffect(() => {
    // Load all results from localStorage
    const psych = localStorage.getItem('psychometric-answers')
    const rotate = localStorage.getItem('rotate-path-completed')
    const expression = localStorage.getItem('expression-ordering-completed')
    const maze = localStorage.getItem('hidden-maze-completed')
    const tech = localStorage.getItem('technical-results')

    if (psych) setPsychometricData(JSON.parse(psych))
    if (rotate) setRotatePathData(JSON.parse(rotate))
    if (expression) setExpressionData(JSON.parse(expression))
    if (maze) setMazeData(JSON.parse(maze))
    if (tech) setTechnicalData(JSON.parse(tech))
  }, [])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${String(secs).padStart(2, '0')}`
  }

  const getStrengthsAndWeaknesses = () => {
    if (!technicalData?.categoryScores) return { strengths: [], weaknesses: [] }
    
    const categories = Object.entries(technicalData.categoryScores).map(([name, data]: [string, any]) => ({
      name,
      percentage: Math.round((data.correct / data.total) * 100)
    }))
    
    const sorted = categories.sort((a, b) => b.percentage - a.percentage)
    return {
      strengths: sorted.slice(0, 2),
      weaknesses: sorted.slice(-2).reverse()
    }
  }

  const { strengths, weaknesses } = getStrengthsAndWeaknesses()

  const totalGamesCompleted = [rotatePathData, expressionData, mazeData].filter(Boolean).length
  const overallPerformance = technicalData 
    ? Math.round((technicalData.score / technicalData.total) * 100)
    : 0

  const completionRate = () => {
    let completed = 0
    let total = 5 // Total sections: Psychometric, 3 games, Technical
    if (psychometricData) completed++
    if (rotatePathData) completed++
    if (expressionData) completed++
    if (mazeData) completed++
    if (technicalData) completed++
    return { completed, total, percentage: Math.round((completed / total) * 100) }
  }

  const completion = completionRate()

  return (
    <main className="min-h-screen px-4 py-12">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
          >
            <div className="relative inline-block">
              <Trophy className="w-24 h-24 text-yellow-500 mx-auto mb-6" />
              <motion.div
                className="absolute -top-2 -right-2 w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-xl font-bold shadow-lg"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.3, type: 'spring' }}
              >
                {completion.percentage}%
              </motion.div>
            </div>
          </motion.div>
          <h1 className="text-6xl font-bold mb-4 gradient-text">Performance Dashboard</h1>
          <p className="text-gray-400 text-lg mb-2">Complete assessment overview and analytics</p>
          <div className="flex items-center justify-center gap-2 text-sm">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-gray-400">{completion.completed} Completed</span>
            </div>
            <span className="text-gray-600">•</span>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-gray-600"></div>
              <span className="text-gray-400">{completion.total - completion.completed} Pending</span>
            </div>
          </div>
        </div>

        {/* Overall Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="glass rounded-2xl p-6 border-2 border-purple-500/30"
          >
            <div className="flex items-center justify-between mb-4">
              <Target className="w-10 h-10 text-purple-400" />
              {overallPerformance >= 70 ? (
                <span className="text-green-500 text-2xl">✓</span>
              ) : overallPerformance >= 50 ? (
                <span className="text-yellow-500 text-2xl">⚡</span>
              ) : overallPerformance > 0 ? (
                <span className="text-orange-500 text-2xl">⚠</span>
              ) : null}
            </div>
            <p className="text-gray-400 text-sm mb-2">Technical Score</p>
            <p className="text-4xl font-bold gradient-text mb-1">{overallPerformance}%</p>
            <p className="text-xs text-gray-500">
              {overallPerformance >= 70 ? 'Excellent!' : overallPerformance >= 50 ? 'Good Progress' : overallPerformance > 0 ? 'Keep Practicing' : 'Not started yet'}
            </p>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="glass rounded-2xl p-6 border-2 border-pink-500/30"
          >
            <div className="flex items-center justify-between mb-4">
              <Gamepad2 className="w-10 h-10 text-pink-400" />
              <div className={`text-xl font-bold ${totalGamesCompleted === 3 ? 'text-green-500' : 'text-yellow-500'}`}>
                {totalGamesCompleted}/3
              </div>
            </div>
            <p className="text-gray-400 text-sm mb-2">Games Completed</p>
            <div className="flex gap-2 mb-2">
              <div className={`flex-1 h-2 rounded-full ${rotatePathData ? 'bg-green-500' : 'bg-gray-700'}`}></div>
              <div className={`flex-1 h-2 rounded-full ${expressionData ? 'bg-green-500' : 'bg-gray-700'}`}></div>
              <div className={`flex-1 h-2 rounded-full ${mazeData ? 'bg-green-500' : 'bg-gray-700'}`}></div>
            </div>
            <p className="text-xs text-gray-500">
              {totalGamesCompleted === 3 ? 'All Complete!' : `${3 - totalGamesCompleted} Remaining`}
            </p>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="glass rounded-2xl p-6 border-2 border-blue-500/30"
          >
            <div className="flex items-center justify-between mb-4">
              <Code className="w-10 h-10 text-blue-400" />
              {technicalData && (
                <span className={`text-2xl ${technicalData.score >= technicalData.total * 0.7 ? 'text-green-500' : 'text-yellow-500'}`}>
                  {Math.round((technicalData.score / technicalData.total) * 100)}%
                </span>
              )}
            </div>
            <p className="text-gray-400 text-sm mb-2">Technical MCQ</p>
            <p className="text-3xl font-bold">
              {technicalData ? (
                <><span className="gradient-text">{technicalData.score}</span><span className="text-gray-500 text-2xl">/{technicalData.total}</span></>
              ) : (
                <span className="text-gray-600">Not Started</span>
              )}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {technicalData ? `${technicalData.total - technicalData.score} incorrect` : 'Complete 50 questions'}
            </p>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="glass rounded-2xl p-6 border-2 border-green-500/30"
          >
            <div className="flex items-center justify-between mb-4">
              <Brain className="w-10 h-10 text-green-400" />
              {psychometricData && <span className="text-green-500 text-2xl">✓</span>}
            </div>
            <p className="text-gray-400 text-sm mb-2">Psychometric</p>
            <p className="text-2xl font-bold">
              {psychometricData ? (
                <span className="text-green-400">Completed ✓</span>
              ) : (
                <span className="text-gray-600">Pending</span>
              )}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {psychometricData ? 'Profile analyzed' : '40 questions pending'}
            </p>
          </motion.div>
        </div>

        {/* Strengths & Weaknesses */}
        {technicalData && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="glass rounded-3xl p-6 lg:p-8 border-2 border-green-500/20"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
                  <TrendingUp className="w-7 h-7 text-green-500" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Your Strengths</h2>
                  <p className="text-sm text-gray-400">Top performing areas</p>
                </div>
              </div>
              <div className="space-y-4">
                {strengths.length > 0 ? strengths.map((category, index) => (
                  <div key={index} className="glass rounded-xl p-5 border border-green-500/20">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">🏆</span>
                        <span className="font-bold text-lg">{category.name}</span>
                      </div>
                      <span className="text-green-500 text-2xl font-bold">{category.percentage}%</span>
                    </div>
                    <div className="h-3 bg-gray-800/50 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-green-500 to-emerald-500 shadow-lg shadow-green-500/50"
                        initial={{ width: 0 }}
                        animate={{ width: `${category.percentage}%` }}
                        transition={{ delay: 0.5 + index * 0.1, duration: 1, ease: 'easeOut' }}
                      />
                    </div>
                  </div>
                )) : (
                  <p className="text-gray-500 text-center py-4">Complete technical assessment to see strengths</p>
                )}
              </div>
            </motion.div>

            <motion.div
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="glass rounded-3xl p-6 lg:p-8 border-2 border-orange-500/20"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center">
                  <TrendingDown className="w-7 h-7 text-orange-500" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Areas to Improve</h2>
                  <p className="text-sm text-gray-400">Focus on these topics</p>
                </div>
              </div>
              <div className="space-y-4">
                {weaknesses.length > 0 ? weaknesses.map((category, index) => (
                  <div key={index} className="glass rounded-xl p-5 border border-orange-500/20">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">📚</span>
                        <span className="font-bold text-lg">{category.name}</span>
                      </div>
                      <span className="text-orange-500 text-2xl font-bold">{category.percentage}%</span>
                    </div>
                    <div className="h-3 bg-gray-800/50 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-orange-500 to-red-500 shadow-lg shadow-orange-500/50"
                        initial={{ width: 0 }}
                        animate={{ width: `${category.percentage}%` }}
                        transition={{ delay: 0.5 + index * 0.1, duration: 1, ease: 'easeOut' }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-2">💡 Review this topic to improve your score</p>
                  </div>
                )) : (
                  <p className="text-gray-500 text-center py-4">Complete technical assessment to identify areas</p>
                )}
              </div>
            </motion.div>
          </div>
        )}

        {/* Game Results */}
        <div className="mb-12">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
            <div>
              <h2 className="text-3xl font-bold">🎮 Game Performance</h2>
              <p className="text-gray-400 text-sm">Elimination round results</p>
            </div>
            <div className="glass rounded-xl px-4 py-2">
              <span className="text-sm text-gray-400">Total: </span>
              <span className="font-bold text-lg">{totalGamesCompleted}/3 Games</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Rotate Path */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className={`glass rounded-2xl p-6 border-2 ${rotatePathData ? 'border-purple-500/30' : 'border-gray-700/30'}`}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-12 h-12 rounded-xl ${rotatePathData ? 'bg-purple-500/20' : 'bg-gray-700/20'} flex items-center justify-center`}>
                  <RotateCw className={`w-7 h-7 ${rotatePathData ? 'text-purple-400' : 'text-gray-600'}`} />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold">Rotate Path Puzzle</h3>
                  <p className="text-xs text-gray-500">Spatial reasoning</p>
                </div>
                {rotatePathData && <span className="text-green-500 text-2xl">✓</span>}
              </div>
              {rotatePathData ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="glass rounded-lg p-3 text-center">
                      <p className="text-gray-400 text-xs mb-1">Moves</p>
                      <p className="text-2xl font-bold text-purple-400">{rotatePathData.moves}</p>
                    </div>
                    <div className="glass rounded-lg p-3 text-center">
                      <p className="text-gray-400 text-xs mb-1">Time</p>
                      <p className="text-2xl font-bold text-purple-400">{formatTime(rotatePathData.time || 0)}</p>
                    </div>
                  </div>
                  <div className="pt-3 border-t border-gray-700/50">
                    <div className="flex items-center justify-center gap-2">
                      <Award className="w-6 h-6 text-yellow-500" />
                      <p className="text-green-500 font-bold">Completed Successfully!</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 rounded-full bg-gray-800/50 flex items-center justify-center mx-auto mb-3">
                    <Clock className="w-8 h-8 text-gray-600" />
                  </div>
                  <p className="text-gray-500 font-medium">Not completed yet</p>
                  <p className="text-xs text-gray-600 mt-1">Start the elimination round</p>
                </div>
              )}
            </motion.div>

            {/* Expression Ordering */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
              className={`glass rounded-2xl p-6 border-2 ${expressionData ? 'border-pink-500/30' : 'border-gray-700/30'}`}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-12 h-12 rounded-xl ${expressionData ? 'bg-pink-500/20' : 'bg-gray-700/20'} flex items-center justify-center`}>
                  <Gamepad2 className={`w-7 h-7 ${expressionData ? 'text-pink-400' : 'text-gray-600'}`} />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold">Expression Ordering</h3>
                  <p className="text-xs text-gray-500">Logical sequencing</p>
                </div>
                {expressionData && <span className="text-green-500 text-2xl">✓</span>}
              </div>
              {expressionData ? (
                <div className="space-y-3">
                  <div className="glass rounded-lg p-4 text-center mb-3">
                    <p className="text-gray-400 text-xs mb-2">Accuracy Score</p>
                    <div className="flex items-baseline justify-center gap-1">
                      <p className="text-4xl font-bold gradient-text">{expressionData.score}</p>
                      <p className="text-gray-500 text-xl">/{expressionData.total}</p>
                    </div>
                    <div className="mt-2">
                      <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-pink-500 to-purple-500"
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.round(((expressionData.score || 0) / (expressionData.total || 1)) * 100)}%` }}
                          transition={{ delay: 0.8, duration: 1 }}
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {Math.round(((expressionData.score || 0) / (expressionData.total || 1)) * 100)}% Correct
                      </p>
                    </div>
                  </div>
                  <div className="glass rounded-lg p-3 text-center">
                    <p className="text-gray-400 text-xs mb-1">Time Taken</p>
                    <p className="text-xl font-bold text-pink-400">{formatTime(expressionData.time || 0)}</p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 rounded-full bg-gray-800/50 flex items-center justify-center mx-auto mb-3">
                    <Clock className="w-8 h-8 text-gray-600" />
                  </div>
                  <p className="text-gray-500 font-medium">Not completed yet</p>
                  <p className="text-xs text-gray-600 mt-1">15 questions pending</p>
                </div>
              )}
            </motion.div>

            {/* Hidden Maze */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
              className={`glass rounded-2xl p-6 border-2 ${mazeData ? 'border-blue-500/30' : 'border-gray-700/30'}`}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-12 h-12 rounded-xl ${mazeData ? 'bg-blue-500/20' : 'bg-gray-700/20'} flex items-center justify-center`}>
                  <Target className={`w-7 h-7 ${mazeData ? 'text-blue-400' : 'text-gray-600'}`} />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold">Hidden Maze</h3>
                  <p className="text-xs text-gray-500">Navigation & memory</p>
                </div>
                {mazeData && <span className="text-green-500 text-2xl">✓</span>}
              </div>
              {mazeData ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="glass rounded-lg p-3 text-center">
                      <p className="text-gray-400 text-xs mb-1">Moves</p>
                      <p className="text-2xl font-bold text-blue-400">{mazeData.moves}</p>
                    </div>
                    <div className="glass rounded-lg p-3 text-center">
                      <p className="text-gray-400 text-xs mb-1">Time</p>
                      <p className="text-2xl font-bold text-blue-400">{formatTime(mazeData.time || 0)}</p>
                    </div>
                  </div>
                  <div className="pt-3 border-t border-gray-700/50">
                    <div className="flex items-center justify-center gap-2">
                      <Award className="w-6 h-6 text-yellow-500" />
                      <p className="text-green-500 font-bold">Maze Solved!</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 rounded-full bg-gray-800/50 flex items-center justify-center mx-auto mb-3">
                    <Clock className="w-8 h-8 text-gray-600" />
                  </div>
                  <p className="text-gray-500 font-medium">Not completed yet</p>
                  <p className="text-xs text-gray-600 mt-1">Find the key and exit</p>
                </div>
              )}
            </motion.div>

          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-stretch sm:items-center">
          <Link href="/" className="w-full sm:w-auto">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full px-8 py-4 rounded-xl glass hover:bg-white/10 font-bold border-2 border-white/10 hover:border-purple-500/50 transition-all"
            >
              ← Back to Home
            </motion.button>
          </Link>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              if (confirm('⚠️ This will delete all your results permanently. Are you sure?')) {
                localStorage.clear()
                window.location.reload()
              }
            }}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-red-600 to-orange-600 font-bold hover:shadow-lg hover:shadow-red-500/50 transition-all"
          >
            🗑️ Clear All Results
          </motion.button>
          <Link href="/rounds" className="w-full sm:w-auto">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full px-8 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 font-bold hover:shadow-lg hover:shadow-purple-500/50 transition-all"
            >
              🔄 Retake Assessment
            </motion.button>
          </Link>
        </div>

        {/* Footer Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-12 text-center"
        >
          <div className="glass rounded-2xl p-6 max-w-2xl mx-auto border border-purple-500/20">
            <p className="text-gray-400 text-sm mb-2">
              💡 <span className="font-bold text-white">Pro Tip:</span> Review your weak areas and practice more questions in those categories.
            </p>
            <p className="text-gray-500 text-xs">
              Results are stored locally in your browser. Clear cache to reset progress.
            </p>
          </div>
        </motion.div>

      </div>
    </main>
  )
}
