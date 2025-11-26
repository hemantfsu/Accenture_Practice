'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, RotateCw, Award, RefreshCw } from 'lucide-react'

type TileType = '─' | '│' | '┘' | '└' | '┐' | '┌' | 'S' | 'E'

interface Tile {
  type: TileType
  rotation: number
  isPath: boolean
}

const GRID_SIZE = 5 // Optimized grid size

// Generate a guaranteed solvable puzzle
const generatePuzzle = (): Tile[][] => {
  const grid: Tile[][] = []
  
  // Initialize empty grid
  for (let i = 0; i < GRID_SIZE; i++) {
    grid[i] = []
    for (let j = 0; j < GRID_SIZE; j++) {
      grid[i][j] = {
        type: '─',
        rotation: 0,
        isPath: false
      }
    }
  }
  
  // Set start and end
  grid[0][0] = { type: 'S', rotation: 0, isPath: false }
  grid[GRID_SIZE - 1][GRID_SIZE - 1] = { type: 'E', rotation: 0, isPath: false }
  
  // Create a valid solution path using simple snake pattern
  const path: [number, number][] = [[0, 0]]
  let row = 0, col = 0
  
  // Build path to the end
  while (row !== GRID_SIZE - 1 || col !== GRID_SIZE - 1) {
    const canGoRight = col < GRID_SIZE - 1
    const canGoDown = row < GRID_SIZE - 1
    
    // Prefer alternating pattern for better puzzles
    if (canGoRight && (!canGoDown || (row % 2 === 0 && col < GRID_SIZE - 1))) {
      col++
    } else if (canGoDown) {
      row++
    } else if (canGoRight) {
      col++
    }
    
    path.push([row, col])
  }
  
  // Set correct tile types based on path
  for (let i = 0; i < path.length; i++) {
    const [row, col] = path[i]
    
    if (grid[row][col].type === 'S' || grid[row][col].type === 'E') {
      continue
    }
    
    const prev = i > 0 ? path[i - 1] : null
    const next = i < path.length - 1 ? path[i + 1] : null
    
    let fromDir = ''
    let toDir = ''
    
    if (prev) {
      if (prev[0] < row) fromDir = 'top'
      else if (prev[0] > row) fromDir = 'bottom'
      else if (prev[1] < col) fromDir = 'left'
      else fromDir = 'right'
    }
    
    if (next) {
      if (next[0] < row) toDir = 'top'
      else if (next[0] > row) toDir = 'bottom'
      else if (next[1] < col) toDir = 'left'
      else toDir = 'right'
    }
    
    // Determine tile type based on directions
    const dirs = [fromDir, toDir].sort().join('-')
    
    switch (dirs) {
      case 'left-right':
        grid[row][col].type = '─'
        grid[row][col].rotation = 0
        break
      case 'bottom-top':
        grid[row][col].type = '│'
        grid[row][col].rotation = 0
        break
      case 'right-top':
        grid[row][col].type = '└'
        grid[row][col].rotation = 0
        break
      case 'left-top':
        grid[row][col].type = '┘'
        grid[row][col].rotation = 0
        break
      case 'bottom-right':
        grid[row][col].type = '┌'
        grid[row][col].rotation = 0
        break
      case 'bottom-left':
        grid[row][col].type = '┐'
        grid[row][col].rotation = 0
        break
    }
  }
  
  // Fill empty tiles with random pipes
  for (let i = 0; i < GRID_SIZE; i++) {
    for (let j = 0; j < GRID_SIZE; j++) {
      if (grid[i][j].type === '─' && !path.some(([r, c]) => r === i && c === j)) {
        const types: TileType[] = ['─', '│', '┘', '└', '┐', '┌']
        grid[i][j].type = types[Math.floor(Math.random() * types.length)]
        grid[i][j].rotation = 0
      }
    }
  }
  
  // Now randomize all rotations (except start and end) to create the puzzle
  for (let i = 0; i < GRID_SIZE; i++) {
    for (let j = 0; j < GRID_SIZE; j++) {
      if (grid[i][j].type !== 'S' && grid[i][j].type !== 'E') {
        const rotations = [0, 90, 180, 270]
        grid[i][j].rotation = rotations[Math.floor(Math.random() * rotations.length)]
      }
    }
  }
  
  return grid
}

export default function RotatePathGame() {
  const [grid, setGrid] = useState<Tile[][]>(generatePuzzle())
  const [moves, setMoves] = useState(0)
  const [isWon, setIsWon] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [timeLeft, setTimeLeft] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('game-timer-remaining')
      return saved ? parseInt(saved) : 20 * 60 // 20 minutes for all games combined
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
    checkPath()
  }, [grid])

  const rotateTile = (row: number, col: number) => {
    if (grid[row][col].type === 'S' || grid[row][col].type === 'E' || isWon) return
    
    setGrid(prevGrid => {
      const newGrid = prevGrid.map((r, i) =>
        r.map((tile, j) => {
          if (i === row && j === col) {
            return { ...tile, rotation: (tile.rotation + 90) % 360 }
          }
          return tile
        })
      )
      return newGrid
    })
    
    setMoves(m => m + 1)
  }

  const getConnections = (tile: Tile): { top: boolean, right: boolean, bottom: boolean, left: boolean } => {
    const { type, rotation } = tile
    let connections = { top: false, right: false, bottom: false, left: false }
    
    switch (type) {
      case '─':
        connections = { top: false, right: true, bottom: false, left: true }
        break
      case '│':
        connections = { top: true, right: false, bottom: true, left: false }
        break
      case '┘':
        connections = { top: true, right: false, bottom: false, left: true }
        break
      case '└':
        connections = { top: true, right: true, bottom: false, left: false }
        break
      case '┐':
        connections = { top: false, right: false, bottom: true, left: true }
        break
      case '┌':
        connections = { top: false, right: true, bottom: true, left: false }
        break
      case 'S':
        connections = { top: false, right: true, bottom: true, left: false }
        break
      case 'E':
        connections = { top: true, right: false, bottom: false, left: true }
        break
    }
    
    // Rotate connections
    const rotations = rotation / 90
    for (let i = 0; i < rotations; i++) {
      connections = {
        top: connections.left,
        right: connections.top,
        bottom: connections.right,
        left: connections.bottom
      }
    }
    
    return connections
  }

  const checkPath = () => {
    if (isWon) return
    
    // BFS to find if path exists from S to E
    const visited = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(false))
    const queue: [number, number][] = [[0, 0]]
    visited[0][0] = true
    let pathFound = false
    
    while (queue.length > 0) {
      const [row, col] = queue.shift()!
      
      if (grid[row][col].type === 'E') {
        pathFound = true
        break
      }
      
      const currentTile = grid[row][col]
      const connections = getConnections(currentTile)
      
      // Check all 4 directions
      const directions = [
        { dr: -1, dc: 0, current: 'top', neighbor: 'bottom' },
        { dr: 0, dc: 1, current: 'right', neighbor: 'left' },
        { dr: 1, dc: 0, current: 'bottom', neighbor: 'top' },
        { dr: 0, dc: -1, current: 'left', neighbor: 'right' }
      ] as const
      
      for (const { dr, dc, current, neighbor } of directions) {
        const newRow = row + dr
        const newCol = col + dc
        
        if (newRow >= 0 && newRow < GRID_SIZE && newCol >= 0 && newCol < GRID_SIZE && !visited[newRow][newCol]) {
          const neighborTile = grid[newRow][newCol]
          const neighborConnections = getConnections(neighborTile)
          
          if (connections[current] && neighborConnections[neighbor]) {
            visited[newRow][newCol] = true
            queue.push([newRow, newCol])
          }
        }
      }
    }
    
    if (pathFound && !isWon) {
      setIsWon(true)
      if (typeof window !== 'undefined') {
        localStorage.setItem('rotate-path-completed', JSON.stringify({ moves, time: 1200 - timeLeft }))
      }
    }
    
    // Update visual path only for visited tiles
    setGrid(prevGrid => prevGrid.map((row, i) =>
      row.map((tile, j) => ({
        ...tile,
        isPath: visited[i][j]
      }))
    ))
  }

  const resetGame = () => {
    setGrid(generatePuzzle())
    setMoves(0)
    setIsWon(false)
    setShowHint(false)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <main className="min-h-screen px-4 py-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/rounds/elimination" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
            Back
          </Link>
          
          <div className="flex items-center gap-4">
            <div className="glass px-4 py-2 rounded-full">
              <span className="text-gray-400">Moves: </span>
              <span className="font-bold">{moves}</span>
            </div>
            <div className={`glass px-4 py-2 rounded-full font-mono ${
              timeLeft < 300 ? 'border-2 border-red-500 animate-pulse' : ''
            }`}>
              {formatTime(timeLeft)}
            </div>
            <button onClick={resetGame} className="glass p-2 rounded-full hover:bg-white/10 transition-colors">
              <RefreshCw className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setShowHint(!showHint)} 
              className={`glass px-4 py-2 rounded-full hover:bg-white/10 transition-colors text-sm ${showHint ? 'bg-yellow-500/20 border border-yellow-500' : ''}`}
            >
              {showHint ? 'Hide Hint' : 'Show Hint'}
            </button>
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold mb-4 gradient-text">Rotate Path Puzzle</h1>
          <p className="text-gray-400">Connect Start (S) to End (E) by rotating tiles</p>
          {showHint && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 glass rounded-xl p-4 max-w-md mx-auto"
            >
              <p className="text-yellow-400 text-sm font-semibold mb-2">💡 Hint:</p>
              <ul className="text-gray-300 text-sm text-left space-y-1">
                <li>• Start has connections going RIGHT and DOWN</li>
                <li>• End has connections coming from TOP and LEFT</li>
                <li>• Look for tiles that can form corners in the path</li>
                <li>• Try working backwards from the End to Start</li>
              </ul>
            </motion.div>
          )}
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
              <h2 className="text-4xl font-bold mb-4">Puzzle Solved!</h2>
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
                <button onClick={resetGame} className="flex-1 px-6 py-3 rounded-xl glass hover:bg-white/10 transition-colors">
                  Play Again
                </button>
                <Link href="/rounds/elimination" className="flex-1">
                  <button className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 transition-opacity">
                    Continue
                  </button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}

        {/* Game Grid */}
        <div className="glass rounded-3xl p-8 max-w-3xl mx-auto">
          <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))` }}>
            {grid.map((row, i) =>
              row.map((tile, j) => (
                <motion.button
                  key={`${i}-${j}`}
                  onClick={() => rotateTile(i, j)}
                  whileHover={{ scale: tile.type !== 'S' && tile.type !== 'E' && !isWon ? 1.05 : 1 }}
                  whileTap={{ scale: tile.type !== 'S' && tile.type !== 'E' && !isWon ? 0.95 : 1 }}
                  className={`aspect-square rounded-xl flex items-center justify-center text-4xl font-bold transition-colors duration-200 ${
                    tile.isPath ? 'bg-gradient-to-br from-green-500/30 to-emerald-500/30 border-2 border-green-400 shadow-lg shadow-green-500/20' : 'glass hover:bg-white/10'
                  } ${tile.type === 'S' ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/50' : ''} ${tile.type === 'E' ? 'bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-lg shadow-purple-500/50' : ''} ${tile.type !== 'S' && tile.type !== 'E' && !isWon ? 'cursor-pointer' : 'cursor-default'}`}
                  animate={{ rotate: tile.rotation }}
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                >
                  {tile.type === 'S' ? '🎯' : tile.type === 'E' ? '🏁' : tile.type}
                </motion.button>
              ))
            )}
          </div>
        </div>

        {/* Instructions */}
        <div className="glass rounded-2xl p-6 max-w-3xl mx-auto mt-6">
          <h3 className="font-bold mb-2 flex items-center gap-2">
            <RotateCw className="w-5 h-5 text-purple-400" />
            How to Play
          </h3>
          <ul className="text-gray-400 space-y-1 text-sm">
            <li>• Click tiles to rotate them 90° clockwise</li>
            <li>• Connect the blue Start (🎯) to the purple End (🏁)</li>
            <li>• Green highlight shows valid path connections</li>
            <li>• Every puzzle is guaranteed to be solvable!</li>
            <li>• Use the hint button if you need help</li>
          </ul>
        </div>

      </div>
    </main>
  )
}
