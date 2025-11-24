# 🚀 Accenture Mock Prep - Assessment Platform

A modern Next.js application with interactive games and comprehensive assessment tools for Accenture placement preparation.

## ✨ Features

### 🎯 Round 1: Elimination Round
- **Psychometric Test**: Personality and aptitude assessment
- **Game 1 - Rotate Path Puzzle**: Tile rotation mechanics with path validation
- **Game 2 - Expression Ordering**: Drag-and-drop sorting challenges
- **Game 3 - Hidden Path Maze**: Grid-based maze with discovery system

### 💻 Round 2: Technical MCQ
- 45 questions across multiple domains
- Categories: Pseudocode, MS Office, Cloud, Networks, Cybersecurity
- Timed assessment with instant feedback

### 📊 Results Dashboard
- Performance tracking with visual analytics
- Strength and weakness analysis
- Achievement system

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Drag & Drop**: @dnd-kit
- **State Management**: Zustand
- **Icons**: Lucide React

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/hemantfsu/Accenture_Practice.git
cd Accenture_Practice
```

2. **Install dependencies**
```bash
npm install
```

3. **Run development server**
```bash
npm run dev
```

4. **Open in browser**
```
http://localhost:3000
```

## 📁 Project Structure

```
accenture-mock-prep/
├── app/
│   ├── globals.css          # Global styles
│   ├── layout.tsx            # Root layout
│   ├── page.tsx              # Home page
│   ├── rounds/
│   │   ├── elimination/      # Round 1
│   │   │   ├── psychometric/
│   │   │   └── games/
│   │   │       ├── rotate-path/
│   │   │       ├── expression/
│   │   │       └── maze/
│   │   └── technical/        # Round 2 - MCQ
│   └── results/              # Results Dashboard
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

## 📦 Build for Production

```bash
npm run build
npm start
```

## 🌐 Deploy

The application can be easily deployed on Vercel, Netlify, or any platform supporting Next.js.

### Deploy on Vercel
1. Push code to GitHub
2. Import repository on [vercel.com](https://vercel.com)
3. Deploy with one click

## 📝 License

MIT License - Free for personal and commercial use

## 👨‍💻 Developer

**Made with ❤️ by Hemant Dhangar**

---

For issues or suggestions, please create an issue on GitHub.
