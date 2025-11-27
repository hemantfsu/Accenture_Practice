'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Clock, CheckCircle, Code, Cloud, Network, Shield, FileSpreadsheet, CheckCircle2, Circle, AlertCircle } from 'lucide-react'

interface Question {
  id: number
  category: string
  question: string
  options: string[]
  correctAnswer: number
  difficulty: 'easy' | 'medium' | 'hard'
  isScenario?: boolean
}

// Technical questions (50 total - 10 per category)
const questions: Question[] = [
  // Pseudocode (10 questions)
  {
    id: 1,
    category: 'Pseudocode',
    difficulty: 'hard',
    isScenario: true,
    question: 'A developer is tasked with optimizing a search algorithm for a large dataset of 1 million sorted records. The current implementation uses linear search which takes too long. The team suggests implementing binary search instead. What would be the time complexity improvement?',
    options: ['From O(n) to O(log n)', 'From O(n²) to O(n)', 'From O(log n) to O(1)', 'No improvement'],
    correctAnswer: 0
  },
  {
    id: 2,
    category: 'Pseudocode',
    difficulty: 'medium',
    isScenario: true,
    question: 'An online compiler needs to validate if brackets in user code are properly balanced: (), {}, []. For the input "({[()]})", which approach ensures correct validation in O(n) time?',
    options: ['Stack-based matching with push/pop operations', 'Count opening and closing brackets separately', 'Use nested loops to compare each pair', 'Sort and then compare'],
    correctAnswer: 0
  },
  {
    id: 3,
    category: 'Pseudocode',
    difficulty: 'hard',
    isScenario: true,
    question: 'A banking system needs to process transactions in the exact order they are received, ensuring FIFO (First In First Out) behavior. Multiple ATMs are sending requests simultaneously. Which data structure would be most appropriate for this requirement and why?',
    options: ['Queue - maintains insertion order', 'Stack - fast operations', 'Array - random access', 'Tree - sorted storage'],
    correctAnswer: 0
  },
  {
    id: 4,
    category: 'Pseudocode',
    difficulty: 'medium',
    isScenario: true,
    question: 'A video streaming platform implements an "Undo" feature for playlist edits. Users can undo up to 50 recent actions. Each undo operation must retrieve the most recent action in constant time. Which data structure best fits this requirement?',
    options: ['Stack with O(1) push and pop', 'Queue with O(1) enqueue only', 'Array with O(n) search', 'Linked List with O(n) traversal'],
    correctAnswer: 0
  },
  {
    id: 5,
    category: 'Pseudocode',
    difficulty: 'hard',
    isScenario: true,
    question: 'A navigation app needs to find the shortest path between two cities considering real-time traffic on 500,000 road segments. Which algorithm provides optimal performance for single-source shortest path in a weighted graph?',
    options: ['Dijkstra\'s Algorithm with min-heap', 'Depth-First Search (DFS)', 'Bubble Sort on distances', 'Linear search through all paths'],
    correctAnswer: 0
  },
  {
    id: 6,
    category: 'Pseudocode',
    difficulty: 'hard',
    question: 'What is the space complexity of merge sort algorithm?',
    options: ['O(n)', 'O(1)', 'O(log n)', 'O(n²)'],
    correctAnswer: 0
  },
  {
    id: 7,
    category: 'Pseudocode',
    difficulty: 'medium',
    isScenario: true,
    question: 'An e-commerce platform stores product IDs and needs to quickly check if a product exists in inventory. The system handles millions of queries per second. Which approach provides O(1) average lookup time?',
    options: ['Hash Table', 'Binary Search Tree', 'Sorted Array', 'Linked List'],
    correctAnswer: 0
  },
  {
    id: 8,
    category: 'Pseudocode',
    difficulty: 'hard',
    isScenario: true,
    question: 'A cache system needs to evict the least recently used item when memory is full. The system must support get(key) and put(key, value) both in O(1) time. Which data structure combination achieves this for an LRU cache?',
    options: ['Hash Map + Doubly Linked List', 'Array with linear search', 'Single Linked List only', 'Binary Search Tree'],
    correctAnswer: 0
  },
  {
    id: 9,
    category: 'Pseudocode',
    difficulty: 'hard',
    question: 'What is the worst-case time complexity of QuickSort when the pivot selection is poor (e.g., always picking smallest element)?',
    options: ['O(n²)', 'O(n log n)', 'O(n)', 'O(log n)'],
    correctAnswer: 0
  },
  {
    id: 10,
    category: 'Pseudocode',
    difficulty: 'hard',
    isScenario: true,
    question: 'A social media app needs to detect cycles in friend connections to prevent infinite loops in recommendation algorithms. The friend network has 10 million users represented as a directed graph. Which algorithm efficiently detects cycles?',
    options: ['Depth-First Search (DFS) with visited and recursion stack tracking', 'Bubble Sort on user IDs', 'Linear Search through connections', 'Binary Search on friend lists'],
    correctAnswer: 0
  },

  // MS Office (10 questions)
  {
    id: 11,
    category: 'MS Office',
    difficulty: 'easy',
    question: 'Which Excel function calculates the average of a range?',
    options: ['AVERAGE()', 'MEAN()', 'AVG()', 'SUM()/COUNT()'],
    correctAnswer: 0
  },
  {
    id: 12,
    category: 'MS Office',
    difficulty: 'medium',
    isScenario: true,
    question: 'A sales manager has a spreadsheet with 10,000 rows of customer data. She needs to find all customers from "New York" who made purchases over $5,000 in Q4 2024. Which Excel feature would be most efficient?',
    options: ['Advanced Filter with multiple criteria', 'Manual scrolling', 'CTRL+F find', 'Sort by city only'],
    correctAnswer: 0
  },
  {
    id: 13,
    category: 'MS Office',
    difficulty: 'hard',
    question: 'What does the Excel formula =VLOOKUP(A2, B:D, 3, FALSE) return?',
    options: ['Value from 3rd column where A2 matches column B', 'Sum of 3 columns', '3rd row value', 'Boolean FALSE'],
    correctAnswer: 0
  },
  {
    id: 14,
    category: 'MS Office',
    difficulty: 'easy',
    question: 'Which PowerPoint view shows all slides as thumbnails?',
    options: ['Slide Sorter', 'Normal', 'Outline', 'Reading'],
    correctAnswer: 0
  },
  {
    id: 15,
    category: 'MS Office',
    difficulty: 'medium',
    isScenario: true,
    question: 'A team is collaborating on a Word document for a project proposal. Multiple people need to edit simultaneously and see changes in real-time. The document contains sensitive client information. Which feature combination is most appropriate?',
    options: ['OneDrive sharing with Track Changes enabled', 'Email attachments', 'USB drive sharing', 'Print and scan'],
    correctAnswer: 0
  },
  {
    id: 16,
    category: 'MS Office',
    difficulty: 'medium',
    question: 'What is a Pivot Table used for in Excel?',
    options: ['Summarizing and analyzing large datasets', 'Creating charts', 'Formatting cells', 'Printing reports'],
    correctAnswer: 0
  },
  {
    id: 17,
    category: 'MS Office',
    difficulty: 'hard',
    question: 'Which Excel function combines IF and OR conditions?',
    options: ['=IF(OR(condition1, condition2), true, false)', '=OR(IF(...))', '=IFOR(...)', '=CONDITION(OR(...))'],
    correctAnswer: 0
  },
  {
    id: 18,
    category: 'MS Office',
    difficulty: 'easy',
    question: 'How do you freeze the top row in Excel?',
    options: ['View > Freeze Panes > Freeze Top Row', 'Format > Lock', 'Data > Freeze', 'Home > Pin'],
    correctAnswer: 0
  },
  {
    id: 19,
    category: 'MS Office',
    difficulty: 'hard',
    isScenario: true,
    question: 'An analyst needs to extract the domain name from email addresses in column A (e.g., "john@company.com" → "company.com"). With 50,000 emails, which approach is most efficient?',
    options: ['=MID(A1,FIND("@",A1)+1,LEN(A1)) formula combined with Flash Fill', 'Manually type each domain', 'Copy-paste one by one', 'Use Word to find and replace'],
    correctAnswer: 0
  },
  {
    id: 20,
    category: 'MS Office',
    difficulty: 'hard',
    isScenario: true,
    question: 'An HR department maintains employee records in Excel with columns for Name, Department, Salary, and Join Date. They need to calculate the average salary for employees who joined after Jan 1, 2020, in the IT department. Which function is most appropriate?',
    options: ['AVERAGEIFS()', 'AVERAGE()', 'SUMIF()', 'COUNTIF()'],
    correctAnswer: 0
  },

  // Cloud (10 questions)
  {
    id: 21,
    category: 'Cloud',
    difficulty: 'easy',
    question: 'Which of the following is NOT a cloud service model?',
    options: ['DaaS (Desktop as a Service)', 'IaaS', 'PaaS', 'SaaS'],
    correctAnswer: 0
  },
  {
    id: 22,
    category: 'Cloud',
    difficulty: 'medium',
    isScenario: true,
    question: 'A startup is launching a web application and expects highly variable traffic - from 100 users during nights to 50,000 during peak hours. They want to minimize infrastructure costs while maintaining performance. Which cloud pricing model is most cost-effective?',
    options: ['Auto-scaling with pay-per-use pricing', 'Reserved instances for 50K users', 'On-premise servers', 'Fixed monthly hosting'],
    correctAnswer: 0
  },
  {
    id: 23,
    category: 'Cloud',
    difficulty: 'hard',
    question: 'What is the primary difference between vertical and horizontal scaling?',
    options: ['Vertical adds more power to existing machine, horizontal adds more machines', 'Both are same', 'Vertical is for databases only', 'Horizontal is slower'],
    correctAnswer: 0
  },
  {
    id: 24,
    category: 'Cloud',
    difficulty: 'easy',
    question: 'What does AWS stand for?',
    options: ['Amazon Web Services', 'Automated Web System', 'Advanced Web Storage', 'Application Web Server'],
    correctAnswer: 0
  },
  {
    id: 25,
    category: 'Cloud',
    difficulty: 'medium',
    isScenario: true,
    question: 'A financial services company must ensure their customer data is stored only in European data centers due to GDPR compliance. They use a cloud provider with global infrastructure. Which cloud deployment model addresses this requirement?',
    options: ['Region-specific deployment with data residency controls', 'Public cloud worldwide', 'Private on-premise only', 'Mobile-first cloud'],
    correctAnswer: 0
  },
  {
    id: 26,
    category: 'Cloud',
    difficulty: 'hard',
    isScenario: true,
    question: 'A SaaS company experiences a sudden 10x traffic spike due to viral marketing. Their monolithic application starts failing. After migrating to microservices architecture, which cloud-native pattern would prevent cascading failures?',
    options: ['Circuit Breaker pattern with health checks and fallbacks', 'Increasing server size', 'Adding more databases', 'Removing load balancer'],
    correctAnswer: 0
  },
  {
    id: 27,
    category: 'Cloud',
    difficulty: 'hard',
    question: 'Which AWS service is used for serverless computing?',
    options: ['Lambda', 'EC2', 'S3', 'RDS'],
    correctAnswer: 0
  },
  {
    id: 28,
    category: 'Cloud',
    difficulty: 'hard',
    isScenario: true,
    question: 'A company needs 99.99% uptime SLA for their critical application. They deploy across 3 availability zones in one region. One zone fails completely. What architecture principle prevents total outage?',
    options: ['Multi-AZ deployment with automatic failover and load distribution', 'Single zone with backup', 'Manual failover process', 'One server handles all traffic'],
    correctAnswer: 0
  },
  {
    id: 29,
    category: 'Cloud',
    difficulty: 'medium',
    question: 'What does CDN stand for?',
    options: ['Content Delivery Network', 'Central Data Node', 'Cloud Distribution Network', 'Cached Domain Name'],
    correctAnswer: 0
  },
  {
    id: 30,
    category: 'Cloud',
    difficulty: 'hard',
    isScenario: true,
    question: 'An e-learning platform streams video lectures to students worldwide. Users in Asia experience buffering while US users have smooth playback. The videos are stored in a US data center. What is the most effective solution?',
    options: ['Implement CDN with edge locations globally', 'Increase server capacity in US', 'Compress videos more', 'Limit Asian user access'],
    correctAnswer: 0
  },

  // Networks (10 questions)
  {
    id: 31,
    category: 'Networks',
    difficulty: 'easy',
    question: 'What layer of the OSI model does HTTP operate at?',
    options: ['Application Layer (Layer 7)', 'Transport Layer', 'Network Layer', 'Session Layer'],
    correctAnswer: 0
  },
  {
    id: 32,
    category: 'Networks',
    difficulty: 'medium',
    isScenario: true,
    question: 'A company network has 200 employees and uses a single router. Users complain about slow internet during work hours. Network monitoring shows the router is handling 500+ simultaneous connections. What is the likely bottleneck and solution?',
    options: ['Router capacity limit - upgrade to enterprise router or add load balancer', 'User computers are slow', 'Internet plan is fine', 'Firewall is blocking'],
    correctAnswer: 0
  },
  {
    id: 33,
    category: 'Networks',
    difficulty: 'hard',
    question: 'What is the default subnet mask for a Class C network?',
    options: ['255.255.255.0', '255.0.0.0', '255.255.0.0', '255.255.255.255'],
    correctAnswer: 0
  },
  {
    id: 34,
    category: 'Networks',
    difficulty: 'easy',
    question: 'Which protocol is used to assign IP addresses automatically?',
    options: ['DHCP', 'HTTP', 'FTP', 'SMTP'],
    correctAnswer: 0
  },
  {
    id: 35,
    category: 'Networks',
    difficulty: 'medium',
    isScenario: true,
    question: 'A remote employee cannot access the company VPN from a coffee shop, but their internet works fine for browsing. The IT team confirms VPN server is operational. What is the most likely cause?',
    options: ['Coffee shop firewall blocking VPN ports (1194/443)', 'Employee password wrong', 'VPN server is down', 'Internet is too slow'],
    correctAnswer: 0
  },
  {
    id: 36,
    category: 'Networks',
    difficulty: 'medium',
    question: 'What is the purpose of DNS?',
    options: ['Translate domain names to IP addresses', 'Encrypt data', 'Route packets', 'Assign IP addresses'],
    correctAnswer: 0
  },
  {
    id: 37,
    category: 'Networks',
    difficulty: 'hard',
    question: 'Which TCP flag is used to initiate a connection?',
    options: ['SYN', 'ACK', 'FIN', 'RST'],
    correctAnswer: 0
  },
  {
    id: 38,
    category: 'Networks',
    difficulty: 'hard',
    isScenario: true,
    question: 'A network engineer needs to divide a 192.168.1.0/24 network into 8 equal subnets for different departments. Each department needs at least 30 hosts. What subnet mask should be used?',
    options: ['255.255.255.224 (/27) - provides 8 subnets with 30 usable hosts each', '255.255.255.0 (/24)', '255.255.255.128 (/25)', '255.255.255.192 (/26)'],
    correctAnswer: 0
  },
  {
    id: 39,
    category: 'Networks',
    difficulty: 'hard',
    isScenario: true,
    question: 'A company\'s network experiences intermittent packet loss between two offices connected via VPN. Ping shows 30% packet loss but bandwidth is fine. Traceroute reveals packets taking different routes. What is the likely issue?',
    options: ['Asymmetric routing causing packets to drop at stateful firewalls', 'Internet speed is slow', 'DNS server down', 'Wrong IP address'],
    correctAnswer: 0
  },
  {
    id: 40,
    category: 'Networks',
    difficulty: 'hard',
    isScenario: true,
    question: 'A web server is receiving 10,000 requests per second, far beyond normal traffic. The server becomes unresponsive and legitimate users cannot access it. Logs show requests from thousands of different IP addresses. What type of attack is this?',
    options: ['Distributed Denial of Service (DDoS)', 'Phishing', 'SQL Injection', 'Man-in-the-Middle'],
    correctAnswer: 0
  },

  // Cybersecurity (10 questions)
  {
    id: 41,
    category: 'Cybersecurity',
    difficulty: 'easy',
    question: 'What type of attack involves flooding a server with traffic?',
    options: ['DDoS', 'Phishing', 'SQL Injection', 'Cross-Site Scripting'],
    correctAnswer: 0
  },
  {
    id: 42,
    category: 'Cybersecurity',
    difficulty: 'medium',
    isScenario: true,
    question: 'An employee receives an email appearing to be from the CEO requesting immediate wire transfer of $50,000 to a new vendor. The email has the CEO\'s name but a slightly different email domain (ceo@companyy.com vs ceo@company.com). What type of attack is this?',
    options: ['Phishing/Spear Phishing', 'DDoS', 'Ransomware', 'SQL Injection'],
    correctAnswer: 0
  },
  {
    id: 43,
    category: 'Cybersecurity',
    difficulty: 'hard',
    question: 'What does SSL/TLS primarily provide?',
    options: ['Encryption in transit', 'Data compression', 'File storage', 'User authentication only'],
    correctAnswer: 0
  },
  {
    id: 44,
    category: 'Cybersecurity',
    difficulty: 'easy',
    question: 'What is two-factor authentication (2FA)?',
    options: ['Using password + another verification method', 'Using two passwords', 'Two user accounts', 'Two browsers'],
    correctAnswer: 0
  },
  {
    id: 45,
    category: 'Cybersecurity',
    difficulty: 'medium',
    isScenario: true,
    question: 'A company database is compromised and attackers executed: "SELECT * FROM users WHERE id = 1 OR 1=1". This returned all user records instead of one. What vulnerability was exploited?',
    options: ['SQL Injection', 'XSS', 'CSRF', 'Buffer Overflow'],
    correctAnswer: 0
  },
  {
    id: 46,
    category: 'Cybersecurity',
    difficulty: 'hard',
    isScenario: true,
    question: 'A security audit reveals that developers have production database credentials in their code repositories on GitHub. Attackers found these credentials and accessed customer data. What security principle was violated?',
    options: ['Secrets management - credentials should never be in code, use environment variables/vault', 'Firewall configuration', 'User authentication', 'Network segmentation'],
    correctAnswer: 0
  },
  {
    id: 47,
    category: 'Cybersecurity',
    difficulty: 'hard',
    question: 'Which encryption type uses the same key for encryption and decryption?',
    options: ['Symmetric Encryption', 'Asymmetric Encryption', 'Hash Function', 'Digital Signature'],
    correctAnswer: 0
  },
  {
    id: 48,
    category: 'Cybersecurity',
    difficulty: 'hard',
    isScenario: true,
    question: 'A web application allows users to upload profile pictures. An attacker uploads a file named "profile.php" instead of an image, which executes malicious code on the server. What vulnerability is this?',
    options: ['Unrestricted File Upload - should validate file type, size, and rename files', 'SQL Injection', 'XSS', 'CSRF'],
    correctAnswer: 0
  },
  {
    id: 49,
    category: 'Cybersecurity',
    difficulty: 'hard',
    isScenario: true,
    question: 'A company implements Zero Trust security. An employee with valid credentials tries to access the HR system from an unrecognized device in a foreign country at 3 AM (unusual time). What should happen?',
    options: ['Access denied/additional verification required - Zero Trust verifies every access attempt', 'Automatic access granted', 'No monitoring needed', 'Only check credentials'],
    correctAnswer: 0
  },
  {
    id: 50,
    category: 'Cybersecurity',
    difficulty: 'hard',
    isScenario: true,
    question: 'A hospital\'s patient records are encrypted by malware and a ransom note demands 10 Bitcoin for the decryption key. The backup system was also compromised. Staff cannot access patient histories. What type of attack is this and what is the immediate priority?',
    options: ['Ransomware - isolate infected systems and activate incident response plan', 'Phishing - reset passwords', 'DDoS - increase bandwidth', 'SQL Injection - patch database'],
    correctAnswer: 0
  }
]

const categoryIcons: Record<string, any> = {
  'Pseudocode': Code,
  'MS Office': FileSpreadsheet,
  'Cloud': Cloud,
  'Networks': Network,
  'Cybersecurity': Shield
}

export default function TechnicalRound() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [skipped, setSkipped] = useState<Set<number>>(new Set())
  const [timeLeft, setTimeLeft] = useState(45 * 60) // 45 minutes
  const [isComplete, setIsComplete] = useState(false)
  const [showReview, setShowReview] = useState(false)

  // Load saved results on mount
  useEffect(() => {
    const savedResults = localStorage.getItem('technical-results')
    const savedAnswers = localStorage.getItem('technical-answers')
    
    if (savedResults) {
      const results = JSON.parse(savedResults)
      setIsComplete(true)
      
      // If coming from results page, show review automatically
      if (typeof window !== 'undefined' && window.location.hash === '#review') {
        setShowReview(true)
      }
    }
    
    if (savedAnswers) {
      setAnswers(JSON.parse(savedAnswers))
    }
  }, [])
  
  const categories = ['All', 'Pseudocode', 'MS Office', 'Cloud', 'Networks', 'Cybersecurity']
  
  const filteredQuestions = selectedCategory === 'All' 
    ? questions 
    : questions.filter(q => q.category === selectedCategory)

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

  const handleAnswer = (answerIndex: number) => {
    const currentQuestionId = filteredQuestions[currentQuestion].id
    setAnswers({ ...answers, [currentQuestionId]: answerIndex })
    
    // Remove from skipped if it was skipped before
    const newSkipped = new Set(skipped)
    newSkipped.delete(currentQuestionId)
    setSkipped(newSkipped)
    
    localStorage.setItem('technical-answers', JSON.stringify({ ...answers, [currentQuestionId]: answerIndex }))
  }
  
  const handleSkip = () => {
    const currentQuestionId = filteredQuestions[currentQuestion].id
    const newSkipped = new Set(skipped)
    newSkipped.add(currentQuestionId)
    setSkipped(newSkipped)
    
    if (currentQuestion < filteredQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const handleNext = () => {
    const currentQuestionId = filteredQuestions[currentQuestion].id
    
    // If no answer selected, mark as skipped
    if (answers[currentQuestionId] === undefined) {
      const newSkipped = new Set(skipped)
      newSkipped.add(currentQuestionId)
      setSkipped(newSkipped)
    }
    
    if (currentQuestion < filteredQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const handleQuestionJump = (index: number) => {
    const currentQuestionId = filteredQuestions[currentQuestion].id
    
    // If no answer selected for current question, mark as skipped
    if (answers[currentQuestionId] === undefined) {
      const newSkipped = new Set(skipped)
      newSkipped.add(currentQuestionId)
      setSkipped(newSkipped)
    }
    
    setCurrentQuestion(index)
  }

  const submitTest = () => {
    setIsComplete(true)
    
    // Calculate results
    let correct = 0
    const categoryScores: Record<string, { correct: number, total: number }> = {}
    const detailedResults: Array<{
      question: Question
      userAnswer: number | undefined
      isCorrect: boolean
    }> = []
    
    questions.forEach((q) => {
      const userAnswer = answers[q.id]
      const isCorrect = userAnswer === q.correctAnswer
      
      if (isCorrect) {
        correct++
      }
      
      // Store detailed results for review
      detailedResults.push({
        question: q,
        userAnswer,
        isCorrect
      })
      
      if (!categoryScores[q.category]) {
        categoryScores[q.category] = { correct: 0, total: 0 }
      }
      categoryScores[q.category].total++
      if (isCorrect) {
        categoryScores[q.category].correct++
      }
    })
    
    localStorage.setItem('technical-results', JSON.stringify({
      score: correct,
      total: questions.length,
      timeSpent: 2700 - timeLeft,
      categoryScores,
      skippedCount: skipped.size,
      detailedResults // Save detailed results for review
    }))
  }

  const answeredCount = Object.keys(answers).length
  const remainingCount = filteredQuestions.length - answeredCount
  const skippedCount = skipped.size

  const progress = Math.round(((currentQuestion + 1) / filteredQuestions.length) * 100)
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (isComplete) {
    const score = questions.filter((q) => answers[q.id] === q.correctAnswer).length
    const percentage = Math.round((score / questions.length) * 100)
    
    if (showReview) {
      // Review mode - show all questions with answers
      return (
        <main className="min-h-screen px-4 py-8">
          <div className="max-w-5xl mx-auto">
            
            {/* Review Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={() => setShowReview(false)}
                  className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Back to Results
                </button>
                <div className="glass px-4 py-2 rounded-full">
                  <span className="text-gray-400">Score: </span>
                  <span className="font-bold text-green-400">{score}/{questions.length}</span>
                </div>
              </div>
              <h1 className="text-4xl font-bold mb-2 gradient-text">Answer Review</h1>
              <p className="text-gray-400">Review all questions and see the correct answers</p>
              
              {/* Filter by status */}
              <div className="flex gap-2 mt-4">
                <button className="px-4 py-2 rounded-lg glass text-sm">
                  All Questions ({questions.length})
                </button>
                <button className="px-4 py-2 rounded-lg glass text-sm text-red-400 border border-red-500/30">
                  Incorrect ({questions.filter(q => answers[q.id] !== q.correctAnswer).length})
                </button>
                <button className="px-4 py-2 rounded-lg glass text-sm text-green-400 border border-green-500/30">
                  Correct ({score})
                </button>
                <button className="px-4 py-2 rounded-lg glass text-sm text-yellow-400 border border-yellow-500/30">
                  Skipped ({Array.from(skipped).filter(id => answers[id] === undefined).length})
                </button>
              </div>
            </div>

            {/* Questions Review */}
            <div className="space-y-6">
              {questions.map((q, index) => {
                const userAnswer = answers[q.id]
                const isCorrect = userAnswer === q.correctAnswer
                const isSkipped = userAnswer === undefined
                const CategoryIcon = categoryIcons[q.category]
                
                return (
                  <motion.div
                    key={q.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`glass rounded-2xl p-6 border-2 ${
                      isSkipped ? 'border-yellow-500/30' :
                      isCorrect ? 'border-green-500/30' : 'border-red-500/30'
                    }`}
                  >
                    {/* Question Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3 flex-1">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                          isSkipped ? 'bg-yellow-500/20 text-yellow-400' :
                          isCorrect ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                        }`}>
                          {index + 1}
                        </div>
                        <div className="flex items-center gap-2">
                          <CategoryIcon className="w-5 h-5 text-purple-400" />
                          <span className="text-sm text-purple-400">{q.category}</span>
                        </div>
                      </div>
                      <div className="flex gap-2 items-center">
                        {isSkipped ? (
                          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
                            SKIPPED
                          </span>
                        ) : isCorrect ? (
                          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-500/20 text-green-400 border border-green-500/30">
                            ✓ CORRECT
                          </span>
                        ) : (
                          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-500/20 text-red-400 border border-red-500/30">
                            ✗ WRONG
                          </span>
                        )}
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          q.difficulty === 'easy'
                            ? 'bg-green-500 bg-opacity-30'
                            : q.difficulty === 'medium'
                            ? 'bg-yellow-500 bg-opacity-30'
                            : 'bg-red-500 bg-opacity-30'
                        }`}>
                          {q.difficulty.toUpperCase()}
                        </span>
                      </div>
                    </div>

                    {/* Question Text */}
                    <h3 className="text-lg font-semibold mb-4 leading-relaxed">{q.question}</h3>

                    {/* Options */}
                    <div className="space-y-3">
                      {q.options.map((option, optionIndex) => {
                        const isUserAnswer = userAnswer === optionIndex
                        const isCorrectAnswer = q.correctAnswer === optionIndex
                        
                        return (
                          <div
                            key={optionIndex}
                            className={`p-4 rounded-xl border-2 transition-all ${
                              isCorrectAnswer
                                ? 'bg-green-500/10 border-green-500 shadow-lg shadow-green-500/20'
                                : isUserAnswer && !isCorrect
                                ? 'bg-red-500/10 border-red-500 shadow-lg shadow-red-500/20'
                                : 'glass border-transparent'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex items-start gap-3 flex-1">
                                <span className="font-bold text-gray-400 mt-0.5">
                                  {String.fromCharCode(65 + optionIndex)}.
                                </span>
                                <span className={`flex-1 ${
                                  isCorrectAnswer ? 'font-bold text-green-400' :
                                  isUserAnswer && !isCorrect ? 'font-bold text-red-400' : ''
                                }`}>
                                  {option}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                {isCorrectAnswer && (
                                  <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-green-500/20">
                                    <CheckCircle className="w-4 h-4 text-green-400" />
                                    <span className="text-xs font-semibold text-green-400">Correct Answer</span>
                                  </div>
                                )}
                                {isUserAnswer && !isCorrect && (
                                  <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-red-500/20">
                                    <AlertCircle className="w-4 h-4 text-red-400" />
                                    <span className="text-xs font-semibold text-red-400">Your Answer</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>

                    {/* Explanation for wrong answers */}
                    {!isCorrect && !isSkipped && (
                      <div className="mt-4 p-4 rounded-xl bg-blue-500/10 border border-blue-500/30">
                        <div className="flex items-start gap-2">
                          <span className="text-blue-400">💡</span>
                          <div>
                            <p className="font-semibold text-blue-400 mb-1">Why this is incorrect:</p>
                            <p className="text-sm text-gray-300">
                              The correct answer is option {String.fromCharCode(65 + q.correctAnswer)}. 
                              {q.isScenario && " This scenario-based question tests practical understanding of the concept."}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )
              })}
            </div>

            {/* Bottom Actions */}
            <div className="mt-8 flex gap-4 justify-center sticky bottom-4">
              <button
                onClick={() => setShowReview(false)}
                className="px-8 py-4 rounded-xl glass hover:bg-white/10 font-bold"
              >
                Back to Summary
              </button>
              <Link href="/results">
                <button className="px-8 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 font-bold">
                  View Full Results
                </button>
              </Link>
            </div>

          </div>
        </main>
      )
    }
    
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
              Technical Round Complete!
            </h1>
            <div className="grid grid-cols-3 gap-6 mb-8">
              <div className="glass rounded-xl p-4">
                <p className="text-gray-400 text-sm mb-1">Score</p>
                <p className="text-3xl font-bold">{score}/{questions.length}</p>
              </div>
              <div className="glass rounded-xl p-4">
                <p className="text-gray-400 text-sm mb-1">Percentage</p>
                <p className="text-3xl font-bold">{percentage}%</p>
              </div>
              <div className="glass rounded-xl p-4">
                <p className="text-gray-400 text-sm mb-1">Time Used</p>
                <p className="text-3xl font-bold">{formatTime(2700 - timeLeft)}</p>
              </div>
            </div>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="glass rounded-lg p-3 border border-green-500/30">
                <p className="text-green-400 text-2xl font-bold">{score}</p>
                <p className="text-xs text-gray-400">Correct</p>
              </div>
              <div className="glass rounded-lg p-3 border border-red-500/30">
                <p className="text-red-400 text-2xl font-bold">{questions.length - score - skipped.size}</p>
                <p className="text-xs text-gray-400">Wrong</p>
              </div>
              <div className="glass rounded-lg p-3 border border-yellow-500/30">
                <p className="text-yellow-400 text-2xl font-bold">{Array.from(skipped).filter(id => answers[id] === undefined).length}</p>
                <p className="text-xs text-gray-400">Skipped</p>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => setShowReview(true)}
                className="w-full px-8 py-4 rounded-xl glass hover:bg-white/10 font-bold border-2 border-purple-500/50 hover:border-purple-500 transition-all"
              >
                📋 Review All Answers
              </button>
              <Link href="/results" className="w-full">
                <button className="w-full px-8 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 font-bold text-lg">
                  View Detailed Results
                </button>
              </Link>
            </div>
          </motion.div>
        </div>
      </main>
    )
  }

  const currentQ = filteredQuestions[currentQuestion]
  const CategoryIcon = categoryIcons[currentQ.category]

  return (
    <main className="min-h-screen px-4 py-8">
      {/* Left Status Bar */}
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="fixed left-4 top-1/2 -translate-y-1/2 glass p-6 rounded-2xl w-64 z-10"
      >
        <h3 className="text-lg font-bold mb-4 text-center gradient-text">Progress</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-400" />
              <span className="text-sm">Answered</span>
            </div>
            <span className="font-bold text-green-400">{answeredCount}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Circle className="w-5 h-5 text-blue-400" />
              <span className="text-sm">Remaining</span>
            </div>
            <span className="font-bold text-blue-400">{remainingCount}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-yellow-400" />
              <span className="text-sm">Skipped</span>
            </div>
            <span className="font-bold text-yellow-400">{skippedCount}</span>
          </div>
          <div className="pt-4 border-t border-white/20">
            <div className="text-center">
              <div className="text-2xl font-bold gradient-text mb-1">
                {Math.round((answeredCount / filteredQuestions.length) * 100)}%
              </div>
              <div className="text-xs opacity-70">Complete</div>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="max-w-5xl mx-auto ml-72">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/rounds">
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
              <span className="text-gray-400"> / {filteredQuestions.length}</span>
            </div>
          </div>
        </div>

        {/* Category Selector */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category) => {
              const count = category === 'All' ? questions.length : questions.filter(q => q.category === category).length
              return (
                <motion.button
                  key={category}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setSelectedCategory(category)
                    setCurrentQuestion(0)
                  }}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                    selectedCategory === category
                      ? 'bg-purple-500 bg-opacity-40 border-2 border-purple-400 shadow-lg'
                      : 'glass hover:bg-white/10'
                  }`}
                >
                  {category}
                  <span className="ml-2 text-xs opacity-70">({count})</span>
                </motion.button>
              )
            })}
          </div>
        </div>

        {/* Question Navigation Grid */}
        <div className="mb-6 p-4 glass rounded-2xl">
          <div className="text-sm font-semibold mb-3 text-center opacity-70">Question Navigator</div>
          <div className="grid grid-cols-10 gap-2">
            {filteredQuestions.map((q, idx) => {
              const isAnswered = answers[q.id] !== undefined
              const isSkipped = skipped.has(q.id)
              const isCurrent = idx === currentQuestion
              
              return (
                <motion.button
                  key={q.id}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleQuestionJump(idx)}
                  className={`aspect-square rounded-lg text-sm font-bold transition-all ${
                    isCurrent
                      ? 'bg-blue-500 border-2 border-blue-300 shadow-lg'
                      : isAnswered
                      ? 'bg-green-500 bg-opacity-60'
                      : isSkipped
                      ? 'bg-yellow-500 bg-opacity-60'
                      : 'bg-white/10'
                  }`}
                >
                  {idx + 1}
                </motion.button>
              )
            })}
          </div>
          <div className="flex justify-center gap-4 mt-3 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-green-500 bg-opacity-60"></div>
              <span>Answered</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-yellow-500 bg-opacity-60"></div>
              <span>Skipped</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-blue-500"></div>
              <span>Current</span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-purple-600 to-pink-600"
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
            className="glass rounded-3xl p-10 mb-8"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <CategoryIcon className="w-6 h-6 text-purple-400" />
                <p className="text-sm text-purple-400">{currentQ.category} • Question {currentQuestion + 1}</p>
              </div>
              <div className="flex gap-2 items-center">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  currentQ.difficulty === 'easy'
                    ? 'bg-green-500 bg-opacity-30'
                    : currentQ.difficulty === 'medium'
                    ? 'bg-yellow-500 bg-opacity-30'
                    : 'bg-red-500 bg-opacity-30'
                }`}>
                  {currentQ.difficulty.toUpperCase()}
                </span>
                {currentQ.isScenario && (
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-500 bg-opacity-30">
                    SCENARIO
                  </span>
                )}
              </div>
            </div>
            
            <h2 className={`font-bold mb-8 whitespace-pre-line ${
              currentQ.isScenario ? 'text-lg leading-relaxed' : 'text-2xl'
            }`}>
              {currentQ.question}
            </h2>

            <div className="space-y-4">
              {currentQ.options.map((option, index) => {
                const isSelected = answers[currentQ.id] === index
                return (
                  <motion.button
                    key={index}
                    onClick={() => handleAnswer(index)}
                    whileHover={{ scale: 1.02, x: 10 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full text-left p-6 rounded-2xl transition-all ${
                      isSelected 
                        ? 'bg-gradient-to-r from-blue-600 to-cyan-600 border-2 border-blue-400 shadow-lg shadow-blue-500/50' 
                        : 'glass hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-lg ${isSelected ? 'font-bold' : ''}`}>
                        {String.fromCharCode(65 + index)}. {option}
                      </span>
                      {isSelected && (
                        <CheckCircle className="w-6 h-6 text-white" />
                      )}
                    </div>
                  </motion.button>
                )
              })}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex gap-4">
          <button
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className="px-8 py-4 rounded-xl glass hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          
          <button
            onClick={handleSkip}
            className="px-8 py-4 rounded-xl glass hover:bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
          >
            Skip
          </button>
          
          {currentQuestion < filteredQuestions.length - 1 ? (
            <button
              onClick={handleNext}
              className="flex-1 px-8 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 font-bold"
            >
              Next Question
            </button>
          ) : (
            <button
              onClick={submitTest}
              className="flex-1 px-8 py-4 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 font-bold"
            >
              Submit Test
            </button>
          )}
        </div>

      </div>
    </main>
  )
}
