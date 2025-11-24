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

const GRID_SIZE = 5 // 5x5 maze as specified

// Generate the specific maze layout
const generateMaze = (): Cell[][] => {
  // Initialize empty maze
  const maze: Cell[][] = Array(GRID_SIZE).fill(0).map(() =>
    Array(GRID_SIZE).fill(0).map(() => ({ type: 'empty' as CellType, discovered: false }))
  )
  
  // Specific layout based on provided map
  // C1  C2  C3  C4  C5
  // R1 [ S ][ . ][ . ][ . ][ . ]
  // R2 [ . ][ X ][ - ][ X ][ - ]
  // R3 [ . ][ . ][ K ][ . ][ . ]
  // R4 [ X ][ . ][ X ][ . ][ . ]
  // R5 [ . ][ . ][ - ][ X ][ E ]
  
  // Row 1 (index 0) - All empty except Start
  maze[0][0] = { type: 'player', discovered: true } // Start position S at (1,1)
  // Rest are empty (default)
  
  // Row 2 (index 1)
  maze[1][1] = { type: 'wall', discovered: false } // X at (2,2)
  maze[1][2] = { type: 'wall', discovered: false } // - at (2,3)
  maze[1][3] = { type: 'wall', discovered: false } // X at (2,4)
  maze[1][4] = { type: 'wall', discovered: false } // - at (2,5)
  
  // Row 3 (index 2) - All empty except Key
  maze[2][2] = { type: 'key', discovered: false } // Key K at (3,3)
  // Rest are empty (default)
  
  // Row 4 (index 3)
  maze[3][0] = { type: 'wall', discovered: false } // X at (4,1)
  maze[3][2] = { type: 'wall', discovered: false } // X at (4,3)
  // (4,2), (4,4), (4,5) are empty
  
  // Row 5 (index 4)
  maze[4][2] = { type: 'wall', discovered: false } // - at (5,3)
  maze[4][3] = { type: 'wall', discovered: false } // X at (5,4)
  maze[4][4] = { type: 'exit', discovered: false } // Exit E at (5,5)
  // (5,1), (5,2) are empty
  
  return maze
}

export default function HiddenMazeGame() {
  const [maze, setMaze] = useState<Cell[][]>(generateMaze())
  const [playerPos, setPlayerPos] = useState({ row: 0, col: 0 })
  const [hasKey, setHasKey] = useState(false)
  const [moves, setMoves] = useState(0)
  const [isWon, setIsWon] = useState(false)
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
    
    // Hit a wall - reveal it, reset to start, and lose key if collected
    if (targetCell.type === 'wall') {
      const newMaze = maze.map((row, i) =>
        row.map((cell, j) => {
          // Clear previous player position
          if (i === playerPos.row && j === playerPos.col) {
            return { ...cell, type: 'empty' as CellType }
          }
          // Reveal the wall
          if (i === newRow && j === newCol) {
            return { ...cell, discovered: true, type: 'discovered-wall' as CellType }
          }
          // Place player back at start
          if (i === 0 && j === 0) {
            return { type: 'player' as CellType, discovered: true }
          }
          return cell
        })
      )
      setMaze(newMaze)
      setPlayerPos({ row: 0, col: 0 }) // Reset to start position
      setHasKey(false) // Lose the key if you had it
      setMoves(moves + 1)
      return
    }
    
    // Try to enter exit without key - door won't open, stay in place
    if (targetCell.type === 'exit' && !hasKey) {
      // Reveal the exit but don't move
      const newMaze = maze.map((row, i) =>
        row.map((cell, j) => {
          if (i === newRow && j === newCol) {
            return { ...cell, discovered: true }
          }
          return cell
        })
      )
      setMaze(newMaze)
      setMoves(moves + 1)
      return
    }
    
    // Valid move - update player position
    setMoves(moves + 1)
    
    const newMaze = maze.map((row, i) =>
      row.map((cell, j) => {
        // Clear previous player position
        if (i === playerPos.row && j === playerPos.col) {
          return { ...cell, type: 'empty' as CellType }
        }
        // Move to new position
        if (i === newRow && j === newCol) {
          // Collect key
          if (cell.type === 'key') {
            setHasKey(true)
            return { type: 'player' as CellType, discovered: true }
          }
          // Reach exit with key - WIN!
          if (cell.type === 'exit' && hasKey) {
            setIsWon(true)
            if (typeof window !== 'undefined') {
              localStorage.setItem('hidden-maze-completed', JSON.stringify({ moves: moves + 1, time: 1200 - timeLeft }))
            }
            return { type: 'player' as CellType, discovered: true }
          }
          return { ...cell, type: 'player' as CellType, discovered: true }
        }
        return cell
      })
    )
    
    setMaze(newMaze)
    setPlayerPos({ row: newRow, col: newCol })
  }

  const resetGame = () => {
    setMaze(generateMaze())
    setPlayerPos({ row: 0, col: 0 })
    setHasKey(false)
    setMoves(0)
    setIsWon(false)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <main className="min-h-screen px-4 py-8">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
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
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold mb-4 gradient-text">Hidden Maze</h1>
          <p className="text-gray-400">Navigate the hidden maze • Find the key • Reach the exit</p>
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
        <div className="grid lg:grid-cols-[1.3fr_1fr_1fr] gap-8 mb-8">
          
          {/* Left Panel - Game Rules */}
          <div className="glass rounded-3xl p-6">
            <h3 className="text-xl font-bold mb-3 gradient-text">📜 The Hidden Path - Game Rules</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <span className="text-purple-400 font-bold">1.</span>
                <div>
                  <p className="font-semibold text-white">Goal:</p>
                  <p className="text-gray-400">Start from S (Start) → collect the Key (K) → reach the Exit (E) safely.</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-purple-400 font-bold">2.</span>
                <div>
                  <p className="font-semibold text-white">Hidden Walls:</p>
                  <p className="text-gray-400">Some cells have invisible walls (X) - you can't see them until you try to move into them.</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-purple-400 font-bold">3.</span>
                <div>
                  <p className="font-semibold text-white">Movement:</p>
                  <p className="text-gray-400 mb-1">• You can move Up, Down, Left, or Right (no diagonal moves).</p>
                  <p className="text-gray-400">• Each move reveals if the new cell is safe or blocked.</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-purple-400 font-bold">4.</span>
                <div>
                  <p className="font-semibold text-white">Blocked Cell:</p>
                  <p className="text-gray-400 mb-1">• If you hit a wall (X), you instantly restart from the Start position.</p>
                  <p className="text-gray-400 mb-1">• The wall is revealed (marked red) for future attempts.</p>
                  <p className="text-gray-400">• You lose your key if you had collected it.</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-purple-400 font-bold">5.</span>
                <div>
                  <p className="font-semibold text-white">Key Rule:</p>
                  <p className="text-gray-400 mb-1">• You must collect the Key (K) before the Exit (E) opens.</p>
                  <p className="text-gray-400">• If you reach E without the key, the door won't open.</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-purple-400 font-bold">6.</span>
                <div>
                  <p className="font-semibold text-white">Winning Condition:</p>
                  <p className="text-gray-400">You win when you reach E (Exit) after collecting the key.</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-orange-400 font-bold">7.</span>
                <div>
                  <p className="font-semibold text-white">Losing Condition:</p>
                  <p className="text-gray-400 mb-1">• You lose if you get trapped (no open moves left).</p>
                  <p className="text-gray-400">• Restart the level and try a new path.</p>
                </div>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-white/10">
              <h3 className="font-bold mb-2">🎨 Legend</h3>
              <div className="space-y-1.5 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-500/50 flex items-center justify-center">
                    <span className="text-xl">👤</span>
                  </div>
                  <span><span className="font-bold">S</span> - Start (You)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-yellow-500 to-yellow-600 shadow-lg shadow-yellow-500/50 flex items-center justify-center">
                    <Key className="w-5 h-5 text-white" />
                  </div>
                  <span><span className="font-bold">K</span> - Key (Must collect)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-green-600 shadow-lg shadow-green-500/50 flex items-center justify-center">
                    <Flag className="w-5 h-5 text-white" />
                  </div>
                  <span><span className="font-bold">E</span> - Exit (Goal)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500 to-red-600 shadow-lg shadow-red-500/50 flex items-center justify-center">
                    <span className="text-xl">🚫</span>
                  </div>
                  <span><span className="font-bold">X</span> - Wall (Blocked)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg glass border border-white/20" />
                  <span>Unknown (Hidden)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-white/5" />
                  <span>Safe Path (Explored)</span>
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
                  
                  if (cell.type === 'player') {
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
                  } else if (cell.type === 'key' && cell.discovered) {
                    bgColor = 'bg-gradient-to-br from-yellow-500 to-yellow-600'
                    shadowClass = 'shadow-lg shadow-yellow-500/50'
                    content = <Key className="w-8 h-8 text-white" />
                  } else if (cell.type === 'exit') {
                    if (cell.discovered) {
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
                      // Show exit even when not discovered
                      bgColor = 'glass border-2 border-green-500/30'
                      content = (
                        <div className="relative flex items-center justify-center w-full h-full">
                          <Flag className="w-6 h-6 text-green-500/50" />
                          <span className="absolute -top-1 -right-1 text-xs font-bold text-yellow-400 bg-black/50 px-1 rounded">E</span>
                        </div>
                      )
                    }
                  } else if (cell.type === 'discovered-wall' || (cell.type === 'wall' && cell.discovered)) {
                    bgColor = 'bg-gradient-to-br from-red-500 to-red-600'
                    shadowClass = 'shadow-lg shadow-red-500/50'
                    content = <span className="text-3xl">🚫</span>
                  } else if (cell.discovered) {
                    bgColor = 'bg-white/5'
                  } else if (isStart && cell.type === 'empty') {
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
                  <span className="text-gray-400">Key Status</span>
                  <span className={`font-bold ${hasKey ? 'text-green-400' : 'text-yellow-400'}`}>
                    {hasKey ? '✓ Collected' : '✗ Not Found'}
                  </span>
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
