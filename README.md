<div align="center">

# 🧠 AI Flashcard Maker

**Generate smart, beautiful flashcards from any topic, text, file, or URL — instantly.**

[![React](https://img.shields.io/badge/React-18-61dafb?style=flat-square&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5-646cff?style=flat-square&logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](LICENSE)

</div>

---

## ✨ What is it?

AI Flashcard Maker is a fully client-side web app that transforms any learning material into polished flashcard decks. Enter a topic, paste some notes, drop a file, or provide a URL — and get a ready-to-study deck in seconds. No backend, no account needed.

---

## 🚀 Features

### 📥 Four Input Modes
| Mode | Description |
|------|-------------|
| **Topic** | Type any subject (e.g. *Python*, *World War II*, *Calculus*) and get curated Q&A cards from a built-in knowledge base |
| **Text** | Paste notes, paragraphs, or study material — the AI parser extracts meaningful Q&A pairs automatically |
| **File Upload** | Drag & drop a `.txt` or `.md` file to generate cards directly from your documents |
| **URL** | Paste a link and let the app infer the topic from the URL path |

### 🃏 Four Card Types
- **Q&A** — Classic question and answer pairs
- **MCQ** — Multiple-choice questions with auto-generated distractors
- **Revision** — Concise concept summaries
- **Summary** — Key-point overviews

### 📚 Study & Quiz Mode
- Flip cards interactively to reveal answers
- Track **known / unknown** progress per card
- **Start Quiz** for a timed, gamified study session
- Confetti celebration on completion 🎉
- Star ⭐ important cards for focused review

### 📊 Analytics Dashboard
- Total cards created and mastered
- Study streak tracker
- Per-session breakdown (cards studied, known, duration)
- Visual progress bars per deck

### 💾 Persistence & Export
- All decks auto-saved to **localStorage** — no data loss on refresh
- Export any deck as a **PDF** with one click

### 🌗 Dark / Light Mode
- Toggle between dark and light themes; preference is remembered across sessions

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | [React 18](https://reactjs.org/) + [TypeScript 5](https://www.typescriptlang.org/) |
| Build Tool | [Vite 5](https://vitejs.dev/) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com/) |
| Animations | [Framer Motion](https://www.framer-motion.com/) |
| Icons | [Lucide React](https://lucide.dev/) |
| PDF Export | [jsPDF](https://github.com/parallax/jsPDF) |
| File Uploads | [react-dropzone](https://react-dropzone.js.org/) |
| Celebrations | [canvas-confetti](https://github.com/catdad/canvas-confetti) |

---

## 🏃 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) v18 or higher
- npm (comes with Node)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/VaishnavPandey2012/AI-Flashcard-Maker.git
cd AI-Flashcard-Maker

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start local dev server with hot-reload |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint across all TypeScript/TSX files |

---

## 📂 Project Structure

```
src/
├── components/
│   ├── analytics/     # Charts and stats components
│   ├── flashcard/     # Card display, deck view, quiz mode
│   ├── home/          # Landing page components
│   ├── input/         # Input panel (text, topic, file, URL)
│   ├── layout/        # Header and Footer
│   └── ui/            # Reusable buttons, progress bars, etc.
├── pages/
│   ├── HomePage.tsx       # Landing / hero page
│   ├── CreatePage.tsx     # Card generation workflow
│   ├── StudyPage.tsx      # Deck browser + quiz launcher
│   └── AnalyticsPage.tsx  # Study stats and history
├── types/
│   └── flashcard.ts       # Shared TypeScript interfaces
└── utils/
    ├── aiGenerator.ts     # Core card generation logic
    ├── pdfExport.ts       # PDF export helper
    ├── storage.ts         # localStorage persistence layer
    └── confetti.ts        # Celebration effects
```

---

## 🧩 How the AI Generation Works

The app uses a **client-side rule-based generator** — no external API keys required:

1. **Topic mode** maps your input to a curated knowledge base covering Mathematics, Science, History, Programming, Biology, and Economics.
2. **Text mode** parses your content with pattern matching to detect existing Q&A structures, then falls back to sentence-pair extraction and definition mining.
3. **MCQ distractors** are auto-generated by sampling other answers from the same deck, keeping options plausible but distinguishable.
4. **Difficulty** is assigned automatically based on position in the generated set.

---

## 🤝 Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request.

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m 'Add my feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

<div align="center">
  Made with ❤️ by <a href="https://github.com/VaishnavPandey2012">Vaishnav Pandey</a>
</div>
