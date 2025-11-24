'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Clock, CheckCircle } from 'lucide-react'

// Sample psychometric questions
const questions = [
  { id: 1, question: "I prefer working in a team rather than alone", options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"] },
  { id: 2, question: "I enjoy solving complex problems", options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"] },
  { id: 3, question: "I adapt quickly to changes", options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"] },
  { id: 4, question: "I prefer structured tasks over creative ones", options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"] },
  { id: 5, question: "I feel comfortable leading a team", options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"] },
  { id: 6, question: "When facing a tight deadline, I prioritize quality over speed", options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"] },
  { id: 7, question: "I am comfortable making decisions without complete information", options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"] },
  { id: 8, question: "I actively seek feedback to improve my performance", options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"] },
  { id: 9, question: "I find it easy to work with people who have different opinions", options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"] },
  { id: 10, question: "I prefer to take calculated risks rather than play it safe", options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"] },
  { id: 11, question: "I stay calm under pressure and stressful situations", options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"] },
  { id: 12, question: "I am willing to work beyond regular hours to meet project goals", options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"] },
  { id: 13, question: "I find it easy to start conversations with strangers", options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"] },
  { id: 14, question: "I prefer to follow established processes rather than innovate", options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"] },
  { id: 15, question: "I am comfortable delegating tasks to team members", options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"] },
  { id: 16, question: "I thrive in fast-paced, dynamic work environments", options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"] },
  { id: 17, question: "I believe transparency is more important than diplomacy", options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"] },
  { id: 18, question: "I enjoy mentoring and developing others", options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"] },
  { id: 19, question: "I am energized by working on multiple projects simultaneously", options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"] },
  { id: 20, question: "I prefer data-driven decisions over intuition", options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"] },
  { id: 21, question: "I am comfortable presenting ideas to senior management", options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"] },
  { id: 22, question: "I learn more from failures than successes", options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"] },
  { id: 23, question: "I am detail-oriented and thorough in my work", options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"] },
  { id: 24, question: "I find it easy to admit when I'm wrong", options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"] },
  { id: 25, question: "I prefer long-term strategic thinking over short-term wins", options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"] },
  { id: 26, question: "I am comfortable with ambiguity and uncertainty", options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"] },
  { id: 27, question: "I actively build professional networks and relationships", options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"] },
  { id: 28, question: "I prioritize team success over individual recognition", options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"] },
  { id: 29, question: "I am proactive in identifying and solving problems", options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"] },
  { id: 30, question: "I find it easy to challenge conventional thinking", options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"] },
  { id: 31, question: "I am comfortable with frequent changes in priorities", options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"] },
  { id: 32, question: "I take ownership of mistakes and learn from them", options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"] },
  { id: 33, question: "I enjoy working with cutting-edge technology", options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"] },
  { id: 34, question: "I am comfortable giving constructive criticism to peers", options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"] },
  { id: 35, question: "I prefer collaborative decision-making over individual choices", options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"] },
  { id: 36, question: "I am resilient when facing setbacks or failures", options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"] },
  { id: 37, question: "I enjoy exploring new ideas and concepts", options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"] },
  { id: 38, question: "I am comfortable working independently with minimal supervision", options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"] },
  { id: 39, question: "I actively seek opportunities for professional development", options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"] },
  { id: 40, question: "I am effective at managing conflicts within teams", options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"] },
  { id: 41, question: "I prefer to see the big picture rather than focus on details", options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"] },
  { id: 42, question: "I am comfortable with public speaking and presentations", options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"] },
  { id: 43, question: "I embrace diversity and different perspectives", options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"] },
  { id: 44, question: "I am patient when training or explaining concepts to others", options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"] },
  { id: 45, question: "I prefer to work on challenging projects that push my limits", options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"] },
  { id: 46, question: "I am good at time management and meeting deadlines", options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"] },
  { id: 47, question: "I value work-life balance equally with career growth", options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"] },
  { id: 48, question: "I am comfortable with constructive criticism and use it to improve", options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"] },
  { id: 49, question: "I naturally take initiative in group settings", options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"] },
  { id: 50, question: "I am adaptable to different work cultures and environments", options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"] },
  { id: 51, question: "I find it rewarding to help others succeed", options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"] },
  { id: 52, question: "I am comfortable making unpopular decisions when necessary", options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"] },
  { id: 53, question: "I continuously seek to improve processes and efficiency", options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"] },
  { id: 54, question: "I remain focused and productive even with distractions", options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"] }
]

export default function PsychometricTest() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [timeLeft, setTimeLeft] = useState(20 * 60) // 20 minutes
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    if (!isComplete && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsComplete(true)
            return 0
          }
          return prev - 1
        })
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [isComplete, timeLeft])

  const handleAnswer = (answer: string) => {
    setAnswers({ ...answers, [currentQuestion]: answer })
    
    // Auto-save to localStorage
    localStorage.setItem('psychometric-answers', JSON.stringify({ ...answers, [currentQuestion]: answer }))
    
    if (currentQuestion < questions.length - 1) {
      setTimeout(() => setCurrentQuestion(currentQuestion + 1), 300)
    } else {
      setIsComplete(true)
    }
  }

  const progress = Math.round(((currentQuestion + 1) / questions.length) * 100)
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (isComplete) {
    const personality = Object.values(answers).filter(a => a.includes('Strongly Agree') || a.includes('Agree')).length > 30
      ? 'Analytical Leader'
      : 'Creative Thinker'

    return (
      <main className="min-h-screen px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="glass rounded-3xl p-12 text-center"
          >
            <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
            <h1 className="text-4xl font-bold mb-4 gradient-text">
              Assessment Complete!
            </h1>
            <p className="text-2xl mb-6">Your Personality Type:</p>
            <h2 className="text-5xl font-bold mb-8 text-purple-400">
              {personality}
            </h2>
            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="glass rounded-xl p-4">
                <p className="text-gray-400 text-sm mb-1">Questions Answered</p>
                <p className="text-3xl font-bold">{questions.length}</p>
              </div>
              <div className="glass rounded-xl p-4">
                <p className="text-gray-400 text-sm mb-1">Time Taken</p>
                <p className="text-3xl font-bold">{formatTime(1200 - timeLeft)}</p>
              </div>
            </div>
            <Link href="/rounds/elimination">
              <button className="px-8 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 font-bold text-lg">
                Continue to Games
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
              Exit Test
            </button>
          </Link>
          
          <div className="flex items-center gap-6">
            <div className={`flex items-center gap-2 glass px-4 py-2 rounded-full ${
              timeLeft < 300 ? 'border-2 border-red-500 animate-pulse' : ''
            }`}>
              <Clock className="w-5 h-5 text-purple-400" />
              <span className="font-mono">{formatTime(timeLeft)}</span>
            </div>
            <div className="glass px-4 py-2 rounded-full">
              <span className="font-bold">{currentQuestion + 1}</span>
              <span className="text-gray-400"> / {questions.length}</span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-purple-600 to-pink-600"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ type: 'spring', damping: 20 }}
            className="glass rounded-3xl p-10"
          >
            <p className="text-sm text-purple-400 mb-4">Question {currentQuestion + 1}</p>
            <h2 className="text-3xl font-bold mb-12">
              {questions[currentQuestion].question}
            </h2>

            <div className="space-y-4">
              {questions[currentQuestion].options.map((option, index) => (
                <motion.button
                  key={index}
                  onClick={() => handleAnswer(option)}
                  whileHover={{ scale: 1.02, x: 10 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full text-left p-6 rounded-2xl glass hover:bg-white/10 transition-all"
                >
                  <span className="text-lg">{option}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

      </div>
    </main>
  )
}
