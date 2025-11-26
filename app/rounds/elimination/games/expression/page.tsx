'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, Trophy } from 'lucide-react'
import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core'
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

interface Expression {
  id: string
  value: number
  display: string
}

interface Question {
  id: number
  expressions: Expression[]
}

// Generate questions with difficulty levels
const generateQuestions = (difficulty: 'easy' | 'medium' | 'hard' = 'medium'): Question[] => {
  const questions: Question[] = []
  const questionCount = difficulty === 'easy' ? 10 : difficulty === 'medium' ? 15 : 20
  const itemsPerQuestion = difficulty === 'easy' ? 3 : difficulty === 'medium' ? 4 : 5
  
  for (let i = 1; i <= questionCount; i++) {
    const expressions: Expression[] = []
    
    // Generate expressions based on difficulty
    for (let j = 0; j < itemsPerQuestion; j++) {
      if (difficulty === 'easy') {
        // Easy: Simple integers
        const val = Math.floor(Math.random() * 100)
        expressions.push({
          id: `${i}-${j}`,
          value: val,
          display: val.toString()
        })
      } else if (difficulty === 'medium') {
        // Medium: Mix of fractions and decimals
        if (Math.random() > 0.5) {
          const num = Math.floor(Math.random() * 9) + 1
          const den = Math.floor(Math.random() * 9) + 1
          const val = num / den
          expressions.push({
            id: `${i}-${j}`,
            value: val,
            display: `${num}/${den}`
          })
        } else {
          const val = Math.random() * 10
          expressions.push({
            id: `${i}-${j}`,
            value: val,
            display: val.toFixed(2)
          })
        }
      } else {
        // Hard: Complex fractions, decimals, and percentages
        const typeChoice = Math.random()
        if (typeChoice < 0.4) {
          // Fraction
          const num = Math.floor(Math.random() * 20) + 1
          const den = Math.floor(Math.random() * 20) + 1
          const val = num / den
          expressions.push({
            id: `${i}-${j}`,
            value: val,
            display: `${num}/${den}`
          })
        } else if (typeChoice < 0.7) {
          // Decimal
          const val = Math.random() * 50
          expressions.push({
            id: `${i}-${j}`,
            value: val,
            display: val.toFixed(3)
          })
        } else {
          // Percentage
          const val = Math.random() * 2
          expressions.push({
            id: `${i}-${j}`,
            value: val,
            display: `${(val * 100).toFixed(1)}%`
          })
        }
      }
    }
    
    // Shuffle expressions
    for (let j = expressions.length - 1; j > 0; j--) {
      const k = Math.floor(Math.random() * (j + 1));
      [expressions[j], expressions[k]] = [expressions[k], expressions[j]]
    }
    
    questions.push({ id: i, expressions })
  }
  
  return questions
}

function SortableItem({ id, display }: { id: string, display: string }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1
  }
  
  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="glass rounded-xl p-6 cursor-grab active:cursor-grabbing hover:bg-white/10 transition-all"
    >
      <p className="text-2xl font-bold text-center font-mono">{display}</p>
    </div>
  )
}

export default function ExpressionOrderingGame() {
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium')
  const [questions, setQuestions] = useState<Question[]>(() => generateQuestions('medium'))
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [items, setItems] = useState<Expression[]>(questions[0].expressions)
  const [answers, setAnswers] = useState<Expression[][]>([])
  const [isComplete, setIsComplete] = useState(false)
  const [questionTimeLeft, setQuestionTimeLeft] = useState(15)
  const [totalTimeSpent, setTotalTimeSpent] = useState(0)
  const [score, setScore] = useState(0)

  // Timer for each question (15 seconds)
  useEffect(() => {
    if (!isComplete && questionTimeLeft > 0) {
      const interval = setInterval(() => {
        setQuestionTimeLeft(t => t - 1)
        setTotalTimeSpent(t => t + 1)
      }, 1000)
      return () => clearInterval(interval)
    } else if (questionTimeLeft === 0 && !isComplete) {
      // Auto-submit when time runs out
      submitAnswer()
    }
  }, [isComplete, questionTimeLeft])

  useEffect(() => {
    setItems(questions[currentQuestion].expressions)
    setQuestionTimeLeft(15) // Reset timer for each new question
  }, [currentQuestion, questions])

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    
    if (over && active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex(item => item.id === active.id)
        const newIndex = items.findIndex(item => item.id === over.id)
        return arrayMove(items, oldIndex, newIndex)
      })
    }
  }

  const submitAnswer = () => {
    // Check if current answer is correct
    const isCorrect = items.every((item, index) => {
      if (index === 0) return true
      return item.value >= items[index - 1].value
    })
    
    if (isCorrect) {
      setScore(score + 1)
    }
    
    // Save current answer
    const newAnswers = [...answers]
    newAnswers[currentQuestion] = items
    setAnswers(newAnswers)
    
    // Move to next question or finish
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      setIsComplete(true)
      if (typeof window !== 'undefined') {
        localStorage.setItem('expression-ordering-completed', JSON.stringify({ 
          score: isCorrect ? score + 1 : score, 
          total: questions.length,
          time: totalTimeSpent,
          difficulty 
        }))
      }
    }
  }
  
  const changeDifficulty = (newDifficulty: 'easy' | 'medium' | 'hard') => {
    const newQuestions = generateQuestions(newDifficulty)
    setDifficulty(newDifficulty)
    setQuestions(newQuestions)
    setCurrentQuestion(0)
    setItems(newQuestions[0].expressions)
    setAnswers([])
    setScore(0)
    setQuestionTimeLeft(15)
    setTotalTimeSpent(0)
    setIsComplete(false)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (isComplete) {
    const percentage = Math.round((score / questions.length) * 100)
    
    return (
      <main className="min-h-screen px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="glass rounded-3xl p-12 text-center"
          >
            <Trophy className="w-20 h-20 text-yellow-500 mx-auto mb-6" />
            <h1 className="text-4xl font-bold mb-4 gradient-text">
              Game Complete!
            </h1>
            <div className="grid grid-cols-3 gap-6 mb-8">
              <div className="glass rounded-xl p-4">
                <p className="text-gray-400 text-sm mb-1">Score</p>
                <p className="text-3xl font-bold">{score}/{questions.length}</p>
              </div>
              <div className="glass rounded-xl p-4">
                <p className="text-gray-400 text-sm mb-1">Accuracy</p>
                <p className="text-3xl font-bold">{percentage}%</p>
              </div>
              <div className="glass rounded-xl p-4">
                <p className="text-gray-400 text-sm mb-1">Time</p>
                <p className="text-3xl font-bold">{formatTime(totalTimeSpent)}</p>
              </div>
            </div>
            <Link href="/rounds/elimination">
              <button className="px-8 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 font-bold text-lg">
                Continue
              </button>
            </Link>
          </motion.div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen px-4 py-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/rounds/elimination">
            <button className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
              <ArrowLeft className="w-5 h-5" />
              Back
            </button>
          </Link>
          
          <div className="flex items-center gap-4">
            <div className="glass px-4 py-2 rounded-full">
              <span className="text-gray-400">Progress: </span>
              <span className="font-bold">{currentQuestion + 1}/{questions.length}</span>
            </div>
            <div className={`glass px-4 py-2 rounded-full font-mono font-bold text-lg ${
              questionTimeLeft <= 5 ? 'border-2 border-red-500 animate-pulse text-red-400' : 'text-white'
            }`}>
              <span className="text-sm text-gray-400 mr-2">Time:</span>
              {questionTimeLeft}s
            </div>
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold mb-4 gradient-text">Expression Ordering</h1>
          <p className="text-gray-400">Arrange expressions in ascending order</p>
          <p className="text-sm text-gray-500 mt-2">Question {currentQuestion + 1} of {questions.length} • 15 seconds per question</p>
          
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

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-purple-600 to-pink-600"
              initial={{ width: 0 }}
              animate={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Drag and Drop Area */}
        <div className="glass rounded-3xl p-8 mb-8">
          <p className="text-center text-gray-400 mb-6">Drag to arrange from smallest to largest</p>
          
          <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={items.map(i => i.id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-4">
                {items.map((item) => (
                  <SortableItem key={item.id} id={item.id} display={item.display} />
                ))}
              </div>
            </SortableContext>
          </DndContext>

          <button
            onClick={submitAnswer}
            className="w-full mt-8 px-8 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 font-bold text-lg hover:shadow-lg hover:shadow-purple-500/50 transition-all"
          >
            {currentQuestion < questions.length - 1 ? 'Next Question' : 'Submit All Answers'}
          </button>
        </div>

        {/* Instructions */}
        <div className="glass rounded-2xl p-6">
          <h3 className="font-bold mb-2">Instructions:</h3>
          <ul className="text-gray-400 space-y-1 text-sm">
            <li>• Drag and drop the expressions to arrange them</li>
            <li>• Order from smallest to largest value</li>
            <li>• Compare fractions and decimals carefully</li>
            <li>• You have 15 seconds for each question</li>
            <li>• Questions auto-submit when time runs out</li>
          </ul>
        </div>

      </div>
    </main>
  )
}
