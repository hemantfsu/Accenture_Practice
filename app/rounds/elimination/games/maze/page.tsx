'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowUp, ArrowDown, ArrowRight, Key, Flag, Award } from 'lucide-react'

type CellType = 'empty' | 'wall' | 'player' | 'key' | 'exit' | 'discovered-wall'

interface Cell {
  type: CellType
  discovered: boolean
}

const GRID_SIZE = 6 // Increased to 6x6 for more challenge

// Generate maze with difficulty levels
const generateMaze = (difficulty: 'easy' | 'medium' | 'hard' = 'medium'): Cell[][] => {
  const maze: Cell[][] = Array(GRID_SIZE).fill(0).map(() =>
    Array(GRID_SIZE).fill(0).map(() => ({ type: 'empty' as CellType, discovered: false }))
  )
  
  // Set start (top-left) and exit (bottom-right)
  maze[0][0] = { type: 'player', discovered: true }
  maze[GRID_SIZE - 1][GRID_SIZE - 1] = { type: 'exit', discovered: false }
  
  // Place key at a strategic position based on difficulty
  let keyRow, keyCol
  if (difficulty === 'easy') {
    keyRow = Math.floor(GRID_SIZE / 2)
    keyCol = Math.floor(GRID_SIZE / 2)
  } else if (difficulty === 'medium') {
    keyRow = Math.floor(GRID_SIZE / 3)
    keyCol = Math.floor(GRID_SIZE * 2 / 3)
  } else {
    keyRow = GRID_SIZE - 2
    keyCol = 1
  }
  maze[keyRow][keyCol] = { type: 'key', discovered: false }
  
  // Place walls based on difficulty
  let wallCount = difficulty === 'easy' ? 5 : difficulty === 'medium' ? 8 : 12
  let wallsPlaced = 0
  
  while (wallsPlaced < wallCount) {
    const row = Math.floor(Math.random() * GRID_SIZE)
    const col = Math.floor(Math.random() * GRID_SIZE)
    
    // Don't place walls on start, exit, key, or already occupied cells
    if (maze[row][col].type === 'empty' && 
        !(row === 0 && col === 0) && 
        !(row === GRID_SIZE - 1 && col === GRID_SIZE - 1)) {
      
      // Ensure there's still a path to key and exit
      maze[row][col] = { type: 'wall', discovered: false }
      
      // Simple check: make sure we can still reach key and exit
      if (canReachTargets(maze, keyRow, keyCol)) {
        wallsPlaced++
      } else {
        maze[row][col] = { type: 'empty', discovered: false }
      }
    }
  }
  
  return maze
}

// BFS to check if targets are reachable
const canReachTargets = (maze: Cell[][], keyRow: number, keyCol: number): boolean => {
  const visited = Array(GRID_SIZE).fill(0).map(() => Array(GRID_SIZE).fill(false))
  const queue: [number, number][] = [[0, 0]]
  visited[0][0] = true
  let keyReachable = false
  let exitReachable = false
  
  while (queue.length > 0) {
    const [row, col] = queue.shift()!
    
    if (row === keyRow && col === keyCol) keyReachable = true
    if (row === GRID_SIZE - 1 && col === GRID_SIZE - 1) exitReachable = true
    
    const directions = [[-1, 0], [0, 1], [1, 0], [0, -1]]
    for (const [dr, dc] of directions) {
      const newRow = row + dr
      const newCol = col + dc
      
      if (newRow >= 0 && newRow < GRID_SIZE && 
          newCol >= 0 && newCol < GRID_SIZE && 
          !visited[newRow][newCol] && 
          maze[newRow][newCol].type !== 'wall') {
        visited[newRow][newCol] = true
        queue.push([newRow, newCol])
      }
    }
  }
  
  return keyReachable && exitReachable
}

export default function HiddenMazeGame() {
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium')
  const [maze, setMaze] = useState<Cell[][]>(() => generateMaze('medium'))
  const [playerPos, setPlayerPos] = useState({ row: 0, col: 0 })
  const [hasKey, setHasKey] = useState(false)
  const [moves, setMoves] = useState(0)
  const [isWon, setIsWon] = useState(false)
  const [keyCollected, setKeyCollected] = useState(false)
  const [wallHits, setWallHits] = useState(0)
  const [timeLeft, setTimeLeft] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('game-timer-remaining')
      return saved ? parseInt(saved) : 20 * 60
    }
    return 20 * 60
  })

  useEffect(() => {
    if (!isWon && timeLeft > 0) {
      const interval = setInterval(() => {
        setTimeLeft(t => {
          const newTime = t - 1
          if (typeof window !== 'undefined') {
            localStorage.setItem('game-timer-remaining', newTime.toString())
          }
          return newTime
        })
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [isWon, timeLeft])

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (isWon) return
      
      e.preventDefault()
      
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
          movePlayer(-1, 0)
          break
        case 'ArrowDown':
        case 's':
          movePlayer(1, 0)
          break
        case 'ArrowLeft':
        case 'a':
          movePlayer(0, -1)
          break
        case 'ArrowRight':
        case 'd':
          movePlayer(0, 1)
          break
      }
    }
    
    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [playerPos, hasKey, isWon])

  const movePlayer = (dRow: number, dCol: number) => {
    const newRow = playerPos.row + dRow
    const newCol = playerPos.col + dCol
    
    // Check boundaries
    if (newRow < 0 || newRow >= GRID_SIZE || newCol < 0 || newCol >= GRID_SIZE) {
      return
    }
    
    const targetCell = maze[newRow][newCol]
    
    // Hit a wall - reset to start and lose key
    if (targetCell.type === 'wall') {
      setPlayerPos({ row: 0, col: 0 })
      setHasKey(false)
      setKeyCollected(false)
      setMoves(moves + 1)
      setWallHits(wallHits + 1)
      
      // Mark the wall cell as discovered so player learns
      const newMaze = maze.map((row, i) =>
        row.map((cell, j) => {
          if (i === newRow && j === newCol && cell.type === 'wall') {
            return { ...cell, discovered: true, type: 'discovered-wall' as CellType }
          }
          // Reset player's previous path but keep discovered walls
          if (cell.type !== 'wall' && cell.type !== 'discovered-wall' && cell.type !== 'key' && cell.type !== 'exit') {
            return { ...cell, discovered: i === 0 && j === 0 } // Only keep start discovered
          }
          return cell
        })
      )
      setMaze(newMaze)
      return
    }
    
    // Try to enter exit without key - door won't open, stay in place
    if (targetCell.type === 'exit' && !hasKey) {
      setMoves(moves + 1)
      return
    }
    
    // Reach exit with key - WIN!
    if (targetCell.type === 'exit' && hasKey) {
      setIsWon(true)
      setPlayerPos({ row: newRow, col: newCol })
      setMoves(moves + 1)
      if (typeof window !== 'undefined') {
        localStorage.setItem('hidden-maze-completed', JSON.stringify({ moves: moves + 1, time: 1200 - timeLeft }))
      }
      return
    }
    
    // Collect key
    if (targetCell.type === 'key' && !keyCollected) {
      setHasKey(true)
      setKeyCollected(true)
    }
    
    // Valid move - update player position
    setPlayerPos({ row: newRow, col: newCol })
    setMoves(moves + 1)
    
    // Mark cell as discovered
    const newMaze = maze.map((row, i) =>
      row.map((cell, j) => {
        if (i === newRow && j === newCol) {
          return { ...cell, discovered: true }
        }
        return cell
      })
    )
    setMaze(newMaze)
  }

  const resetGame = () => {
    const newMaze = generateMaze(difficulty)
    setMaze(newMaze)
    setPlayerPos({ row: 0, col: 0 })
    setHasKey(false)
    setKeyCollected(false)
    setMoves(0)
    setWallHits(0)
    setIsWon(false)
  }
  
  const changeDifficulty = (newDifficulty: 'easy' | 'medium' | 'hard') => {
    setDifficulty(newDifficulty)
    const newMaze = generateMaze(newDifficulty)
    setMaze(newMaze)
    setPlayerPos({ row: 0, col: 0 })
    setHasKey(false)
    setKeyCollected(false)
    setMoves(0)
    setWallHits(0)
    setIsWon(false)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <main className="min-h-screen px-4 py-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Link href="/rounds/elimination">
            <button className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
              <ArrowLeft className="w-5 h-5" />
              Back
            </button>
          </Link>
          
          <div className="flex items-center gap-4">
            <div className={`glass px-4 py-2 rounded-full flex items-center gap-2 ${hasKey ? 'bg-green-500/20 border-2 border-green-500' : ''}`}>
              <Key className="w-5 h-5" />
              <span>{hasKey ? 'Key Collected!' : 'Find the Key'}</span>
            </div>
            <div className="glass px-4 py-2 rounded-full">
              <span className="text-gray-400">Moves: </span>
              <span className="font-bold">{moves}</span>
            </div>
            <div className={`glass px-4 py-2 rounded-full font-mono ${
              timeLeft < 300 ? 'border-2 border-red-500 animate-pulse' : ''
            }`}>
              {formatTime(timeLeft)}
            </div>
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold mb-2 gradient-text">Hidden Maze</h1>
          <p className="text-gray-400">Navigate the hidden maze • Find the key • Reach the exit</p>
          
          {/* Difficulty Selector */}
          <div className="flex items-center justify-center gap-2 mt-4">
            <span className="text-sm text-gray-400">Difficulty:</span>
            {(['easy', 'medium', 'hard'] as const).map((level) => (
              <button
                key={level}
                onClick={() => changeDifficulty(level)}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                  difficulty === level
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 shadow-lg'
                    : 'glass hover:bg-white/10'
                }`}
              >
                {level.charAt(0).toUpperCase() + level.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Win Modal */}
        {isWon && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm"
          >
            <div className="glass rounded-3xl p-12 text-center max-w-md">
              <Award className="w-20 h-20 text-yellow-500 mx-auto mb-6" />
              <h2 className="text-4xl font-bold mb-4">Maze Completed!</h2>
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="glass rounded-xl p-4">
                  <p className="text-gray-400 text-sm">Moves</p>
                  <p className="text-2xl font-bold">{moves}</p>
                </div>
                <div className="glass rounded-xl p-4">
                  <p className="text-gray-400 text-sm">Time</p>
                  <p className="text-2xl font-bold">{formatTime(1200 - timeLeft)}</p>
                </div>
              </div>
              <div className="flex gap-4">
                <button onClick={resetGame} className="flex-1 px-6 py-3 rounded-xl glass hover:bg-white/10">
                  Play Again
                </button>
                <Link href="/rounds/elimination" className="flex-1">
                  <button className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600">
                    Continue
                  </button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}

        {/* Maze Grid */}
        <div className="grid lg:grid-cols-[1.8fr_1fr_1fr] gap-6 mb-6">
          
          {/* Left Panel - Game Rules */}
          <div className="glass rounded-3xl p-6">
            <h3 className="text-xl font-bold mb-3 gradient-text">📜 The Hidden Path - Game Rules</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <span className="text-purple-400 font-bold">1.</span>
                <div>
                  <p className="font-semibold text-white">Goal:</p>
                  <p className="text-gray-400">Start from S → collect Key (K) → reach Exit (E).</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-purple-400 font-bold">2.</span>
                <div>
                  <p className="font-semibold text-white">Hidden Walls:</p>
                  <p className="text-gray-400">Invisible walls (X) remain hidden throughout the game.</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-purple-400 font-bold">3.</span>
                <div>
                  <p className="font-semibold text-white">Movement:</p>
                  <p className="text-gray-400">Move Up/Down/Left/Right. Each move reveals the cell.</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-purple-400 font-bold">4.</span>
                <div>
                  <p className="font-semibold text-white">Hit a Wall:</p>
                  <p className="text-gray-400">Instantly restart from Start, lose your key. Wall stays hidden.</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-purple-400 font-bold">5.</span>
                <div>
                  <p className="font-semibold text-white">Key Rule:</p>
                  <p className="text-gray-400">Must collect key before exit opens.</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-purple-400 font-bold">6.</span>
                <div>
                  <p className="font-semibold text-white">Win:</p>
                  <p className="text-gray-400">Reach E after collecting the key.</p>
                </div>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-white/10">
              <h3 className="font-bold mb-2">🎨 Legend</h3>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-500/50 flex items-center justify-center">
                    <span className="text-lg">👤</span>
                  </div>
                  <span><span className="font-bold">S</span> - Start</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-yellow-500 to-yellow-600 shadow-lg shadow-yellow-500/50 flex items-center justify-center">
                    <Key className="w-4 h-4 text-white" />
                  </div>
                  <span><span className="font-bold">K</span> - Key</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-green-500 to-green-600 shadow-lg shadow-green-500/50 flex items-center justify-center">
                    <Flag className="w-4 h-4 text-white" />
                  </div>
                  <span><span className="font-bold">E</span> - Exit</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-red-500 to-red-600 shadow-lg shadow-red-500/50 flex items-center justify-center">
                    <span className="text-lg">🚫</span>
                  </div>
                  <span><span className="font-bold">X</span> - Wall</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg glass border border-white/20" />
                  <span>Unknown</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-white/5" />
                  <span>Safe Path</span>
                </div>
              </div>
            </div>
          </div>

          {/* Center Panel - Maze */}
          <div className="glass rounded-3xl p-8">
            <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)` }}>
              {maze.map((row, i) =>
                row.map((cell, j) => {
                  let bgColor = 'glass border border-white/10'
                  let content = null
                  let shadowClass = ''
                  
                  // Check if this is the start position (0,0)
                  const isStart = i === 0 && j === 0
                  // Check if this is the exit position (4,4)
                  const isExit = i === 4 && j === 4
                  // Check if player is at this position
                  const isPlayer = playerPos.row === i && playerPos.col === j
                  
                  // Show discovered walls
                  if (cell.type === 'discovered-wall') {
                    bgColor = 'bg-gradient-to-br from-red-500 to-red-600'
                    shadowClass = 'shadow-lg shadow-red-500/50'
                    content = <span className="text-2xl">🚫</span>
                  } else if (isPlayer) {
                    bgColor = 'bg-gradient-to-br from-blue-500 to-blue-600'
                    shadowClass = 'shadow-lg shadow-blue-500/50'
                    content = (
                      <div className="relative flex items-center justify-center w-full h-full">
                        <span className="text-3xl">👤</span>
                        {isStart && (
                          <span className="absolute -top-1 -left-1 text-xs font-bold text-green-400 bg-black/50 px-1 rounded">S</span>
                        )}
                      </div>
                    )
                  } else if (cell.type === 'key' && !keyCollected) {
                    if (cell.discovered) {
                      bgColor = 'bg-gradient-to-br from-yellow-500 to-yellow-600'
                      shadowClass = 'shadow-lg shadow-yellow-500/50'
                      content = <Key className="w-8 h-8 text-white" />
                    } else {
                      bgColor = 'glass border border-white/10'
                    }
                  } else if (cell.type === 'exit') {
                    if (cell.discovered || isExit) {
                      if (hasKey) {
                        bgColor = 'bg-gradient-to-br from-green-500 to-green-600'
                        shadowClass = 'shadow-lg shadow-green-500/50 animate-pulse'
                      } else {
                        bgColor = 'bg-gradient-to-br from-gray-600 to-gray-700'
                        shadowClass = 'shadow-lg shadow-gray-500/30'
                      }
                      content = (
                        <div className="relative flex items-center justify-center w-full h-full">
                          <Flag className="w-8 h-8 text-white" />
                          <span className="absolute -top-1 -right-1 text-xs font-bold text-yellow-400 bg-black/50 px-1 rounded">E</span>
                        </div>
                      )
                    } else {
                      bgColor = 'glass border-2 border-green-500/30'
                      content = (
                        <div className="relative flex items-center justify-center w-full h-full">
                          <Flag className="w-6 h-6 text-green-500/50" />
                          <span className="absolute -top-1 -right-1 text-xs font-bold text-yellow-400 bg-black/50 px-1 rounded">E</span>
                        </div>
                      )
                    }
                  } else if (cell.discovered) {
                    bgColor = 'bg-white/5'
                  } else if (isStart && !isPlayer) {
                    // Show start marker when player is not there
                    bgColor = 'glass border-2 border-blue-500/30'
                    content = (
                      <div className="relative flex items-center justify-center w-full h-full">
                        <span className="text-2xl opacity-50">🏠</span>
                        <span className="absolute -top-1 -left-1 text-xs font-bold text-green-400 bg-black/50 px-1 rounded">S</span>
                      </div>
                    )
                  }
                  
                  return (
                    <motion.div
                      key={`${i}-${j}`}
                      className={`aspect-square rounded-xl flex items-center justify-center ${bgColor} ${shadowClass} transition-all duration-300 relative`}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: (i + j) * 0.02 }}
                    >
                      {content}
                    </motion.div>
                  )
                })
              )}
            </div>
          </div>

          {/* Right Panel - Controls */}
          <div className="space-y-4">
            <div className="glass rounded-3xl p-6">
              <h3 className="text-xl font-bold mb-4 text-center gradient-text">🎮 Controls</h3>
              
              {/* Arrow Buttons */}
              <div className="grid grid-cols-3 gap-2 mb-4">
                {/* Empty space */}
                <div></div>
                {/* Up Arrow */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => movePlayer(-1, 0)}
                  className="w-full aspect-square glass rounded-xl flex items-center justify-center hover:bg-purple-500/20 transition-all border-2 border-transparent hover:border-purple-500"
                >
                  <ArrowUp className="w-8 h-8 text-purple-400" />
                </motion.button>
                {/* Empty space */}
                <div></div>
                
                {/* Left Arrow */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => movePlayer(0, -1)}
                  className="w-full aspect-square glass rounded-xl flex items-center justify-center hover:bg-purple-500/20 transition-all border-2 border-transparent hover:border-purple-500"
                >
                  <ArrowLeft className="w-8 h-8 text-purple-400" />
                </motion.button>
                {/* Down Arrow */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => movePlayer(1, 0)}
                  className="w-full aspect-square glass rounded-xl flex items-center justify-center hover:bg-purple-500/20 transition-all border-2 border-transparent hover:border-purple-500"
                >
                  <ArrowDown className="w-8 h-8 text-purple-400" />
                </motion.button>
                {/* Right Arrow */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => movePlayer(0, 1)}
                  className="w-full aspect-square glass rounded-xl flex items-center justify-center hover:bg-purple-500/20 transition-all border-2 border-transparent hover:border-purple-500"
                >
                  <ArrowRight className="w-8 h-8 text-purple-400" />
                </motion.button>
              </div>

              <div className="text-center text-xs text-gray-400">
                Or use Arrow Keys / WASD
              </div>
            </div>

            {/* Stats */}
            <div className="glass rounded-3xl p-6">
              <h3 className="text-lg font-bold mb-3 gradient-text">📊 Stats</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 glass rounded-xl">
                  <span className="text-gray-400">Moves</span>
                  <span className="text-2xl font-bold text-purple-400">{moves}</span>
                </div>
                <div className="flex items-center justify-between p-3 glass rounded-xl">
                  <span className="text-gray-400">Wall Hits</span>
                  <span className="text-2xl font-bold text-red-400">{wallHits}</span>
                </div>
                <div className="flex items-center justify-between p-3 glass rounded-xl">
                  <span className="text-gray-400">Key Status</span>
                  <span className={`font-bold ${hasKey ? 'text-green-400' : 'text-yellow-400'}`}>
                    {hasKey ? '✓ Collected' : '✗ Not Found'}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 glass rounded-xl">
                  <span className="text-gray-400">Difficulty</span>
                  <span className="font-bold text-purple-400 capitalize">{difficulty}</span>
                </div>
              </div>
            </div>

            {/* Reset Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={resetGame}
              className="w-full px-6 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 font-bold text-lg hover:shadow-lg hover:shadow-purple-500/50 transition-all"
            >
              🔄 Reset Maze
            </motion.button>
          </div>
        </div>



      </div>
    </main>
  )
}
