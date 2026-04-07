import type { Flashcard, CardType, Difficulty, MCQOption } from '../types/flashcard';

function generateId(): string {
  return Math.random().toString(36).slice(2, 11) + Date.now().toString(36);
}

function assignDifficulty(index: number, total: number): Difficulty {
  const ratio = index / total;
  if (ratio < 0.4) return 'easy';
  if (ratio < 0.75) return 'medium';
  return 'hard';
}

function extractTags(text: string): string[] {
  const keywords = text.toLowerCase().match(/\b[a-z]{4,}\b/g) || [];
  const stopWords = new Set(['that', 'this', 'with', 'from', 'they', 'have', 'been', 'will', 'when', 'what', 'which', 'there', 'their', 'about', 'would', 'make', 'like', 'time', 'just', 'know', 'take', 'into', 'year', 'your', 'some', 'could', 'them', 'other', 'than', 'then', 'these', 'also', 'more', 'very', 'after', 'well', 'each']);
  const freq: Record<string, number> = {};
  keywords.forEach(w => {
    if (!stopWords.has(w)) freq[w] = (freq[w] || 0) + 1;
  });
  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([word]) => word);
}

function generateMCQOptions(answer: string, allAnswers: string[]): MCQOption[] {
  const distractors = allAnswers
    .filter(a => a !== answer)
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);

  while (distractors.length < 3) {
    distractors.push(`Option ${distractors.length + 1}`);
  }

  const options: MCQOption[] = [
    { id: generateId(), text: answer, isCorrect: true },
    ...distractors.map(d => ({ id: generateId(), text: d, isCorrect: false })),
  ];

  return options.sort(() => Math.random() - 0.5);
}

function parseTextToQAPairs(text: string): Array<{ q: string; a: string }> {
  const pairs: Array<{ q: string; a: string }> = [];

  // Try to detect Q&A patterns
  const qaPatterns = [
    /Q[:\.]?\s*(.+?)\s*A[:\.]?\s*(.+?)(?=Q[:\.]|$)/gis,
    /Question[:\.]?\s*(.+?)\s*Answer[:\.]?\s*(.+?)(?=Question[:\.]|$)/gis,
    /(\d+[\.\)]\s*.+?\?)\s*(.+?)(?=\d+[\.\)]|$)/gs,
  ];

  for (const pattern of qaPatterns) {
    let match;
    pattern.lastIndex = 0;
    while ((match = pattern.exec(text)) !== null) {
      if (match[1]?.trim() && match[2]?.trim()) {
        pairs.push({ q: match[1].trim(), a: match[2].trim() });
      }
    }
    if (pairs.length >= 3) return pairs;
  }

  // Split by sentences and create Q&A from consecutive sentences
  const sentences = text
    .split(/(?<=[.!?])\s+/)
    .map(s => s.trim())
    .filter(s => s.length > 20 && s.length < 300);

  for (let i = 0; i < sentences.length - 1; i += 2) {
    if (sentences[i] && sentences[i + 1]) {
      const questionSentence = sentences[i].endsWith('?')
        ? sentences[i]
        : convertToQuestion(sentences[i]);
      pairs.push({ q: questionSentence, a: sentences[i + 1] });
    }
  }

  // If still not enough, create definition-style cards from key phrases
  if (pairs.length < 3) {
    const definitions = text.match(/([A-Z][a-zA-Z\s]+(?:is|are|was|were|refers to|defined as|means)[^.]+\.)/g) || [];
    definitions.forEach(def => {
      const parts = def.match(/^(.+?)\s+(?:is|are|was|were|refers to|defined as|means)\s+(.+)$/i);
      if (parts) {
        pairs.push({
          q: `What ${parts[1].trim().toLowerCase().startsWith('the') ? 'is' : 'are'} ${parts[1].trim()}?`,
          a: parts[2].trim(),
        });
      }
    });
  }

  return pairs;
}

function convertToQuestion(sentence: string): string {
  const patterns = [
    { re: /^(.+?) is (.+)$/i, fn: (m: RegExpMatchArray) => `What is ${m[1]}?` },
    { re: /^(.+?) are (.+)$/i, fn: (m: RegExpMatchArray) => `What are ${m[1]}?` },
    { re: /^(.+?) was (.+)$/i, fn: (m: RegExpMatchArray) => `What was ${m[1]}?` },
    { re: /^The (.+?) of (.+?) is (.+)$/i, fn: (m: RegExpMatchArray) => `What is the ${m[1]} of ${m[2]}?` },
    { re: /^(.+?) can (.+)$/i, fn: (m: RegExpMatchArray) => `What can ${m[1]} do?` },
  ];

  for (const { re, fn } of patterns) {
    const match = sentence.match(re);
    if (match) return fn(match);
  }

  return `What does the following describe? "${sentence.substring(0, 60)}..."`;
}

// Topic-based flashcard generation
const topicKnowledgeBase: Record<string, Array<{ q: string; a: string }>> = {
  default: [
    { q: 'What is the main concept of this topic?', a: 'The main concept involves understanding core principles and their applications in real-world scenarios.' },
    { q: 'How does this topic apply in practice?', a: 'In practice, this topic is applied by analyzing problems, identifying patterns, and implementing solutions systematically.' },
    { q: 'What are the key components?', a: 'The key components include foundational principles, methodologies, best practices, and practical applications.' },
    { q: 'Why is this topic important?', a: 'This topic is important because it provides essential knowledge and skills required in modern contexts.' },
    { q: 'What are common challenges in this topic?', a: 'Common challenges include understanding abstract concepts, applying theory to practice, and keeping up with evolving standards.' },
  ],
  mathematics: [
    { q: 'What is the Pythagorean theorem?', a: 'In a right triangle, a² + b² = c², where c is the hypotenuse and a, b are the other two sides.' },
    { q: 'What is a derivative in calculus?', a: 'A derivative measures the rate of change of a function with respect to a variable. f\'(x) = lim(h→0) [f(x+h) - f(x)] / h.' },
    { q: 'What is an integral?', a: 'An integral computes the area under a curve. The definite integral ∫ₐᵇ f(x)dx represents the accumulated sum over [a, b].' },
    { q: 'What is a prime number?', a: 'A prime number is a natural number greater than 1 that has no positive divisors other than 1 and itself.' },
    { q: 'What is the quadratic formula?', a: 'x = (-b ± √(b²-4ac)) / 2a, used to solve ax² + bx + c = 0.' },
    { q: 'What is logarithm?', a: 'A logarithm is the inverse of exponentiation. logₐ(b) = c means aᶜ = b.' },
  ],
  science: [
    { q: "What is Newton's First Law of Motion?", a: 'An object at rest stays at rest, and an object in motion stays in motion with the same speed and direction, unless acted upon by an external force.' },
    { q: "What is Newton's Second Law of Motion?", a: 'F = ma. Force equals mass times acceleration. The acceleration of an object depends on the net force and its mass.' },
    { q: 'What is photosynthesis?', a: 'Photosynthesis is the process by which plants convert sunlight, water, and CO₂ into glucose and oxygen: 6CO₂ + 6H₂O + light → C₆H₁₂O₆ + 6O₂.' },
    { q: 'What is DNA?', a: 'DNA (Deoxyribonucleic acid) is a double-helix molecule carrying genetic instructions for development, functioning, and reproduction of all known organisms.' },
    { q: 'What is the speed of light?', a: 'The speed of light in a vacuum is approximately 299,792,458 meters per second (≈ 3 × 10⁸ m/s).' },
    { q: 'What is the periodic table?', a: 'The periodic table organizes all known chemical elements by atomic number, electron configuration, and recurring chemical properties.' },
  ],
  history: [
    { q: 'When did World War II begin and end?', a: 'World War II began on September 1, 1939, with Germany\'s invasion of Poland, and ended on September 2, 1945, with Japan\'s formal surrender.' },
    { q: 'What was the Renaissance?', a: 'The Renaissance (14th–17th century) was a cultural movement in Europe featuring renewed interest in classical art, literature, science, and philosophy.' },
    { q: 'What caused the French Revolution?', a: 'Key causes included financial crisis, social inequality between estates, Enlightenment ideas, food shortages, and weak leadership under Louis XVI.' },
    { q: 'What was the Cold War?', a: 'The Cold War (1947–1991) was a geopolitical rivalry between the USA and USSR, characterized by proxy wars, arms races, and ideological conflict without direct military confrontation.' },
    { q: 'Who was Mahatma Gandhi?', a: 'Mahatma Gandhi was an Indian independence activist who led India\'s nonviolent resistance movement against British colonial rule using civil disobedience.' },
  ],
  programming: [
    { q: 'What is Object-Oriented Programming (OOP)?', a: 'OOP is a paradigm organizing code into objects that combine data (attributes) and behavior (methods). Core principles: Encapsulation, Inheritance, Polymorphism, Abstraction.' },
    { q: 'What is a RESTful API?', a: 'REST (Representational State Transfer) is an architectural style using HTTP methods (GET, POST, PUT, DELETE) for stateless communication between client and server.' },
    { q: 'What is the difference between == and === in JavaScript?', a: '== checks value equality with type coercion (e.g., "5" == 5 is true). === checks both value and type without coercion (e.g., "5" === 5 is false).' },
    { q: 'What is Big O notation?', a: 'Big O notation describes algorithm complexity (time/space) in the worst case. Common complexities: O(1) constant, O(log n) logarithmic, O(n) linear, O(n²) quadratic.' },
    { q: 'What is a closure in programming?', a: 'A closure is a function that retains access to its outer scope variables even after the outer function has returned.' },
    { q: 'What is Git?', a: 'Git is a distributed version control system that tracks changes in source code, enabling multiple developers to collaborate, branch, merge, and revert changes.' },
  ],
  biology: [
    { q: 'What is a cell?', a: 'A cell is the basic structural and functional unit of all living organisms. Prokaryotic cells lack a nucleus; eukaryotic cells have a membrane-bound nucleus.' },
    { q: 'What is natural selection?', a: 'Natural selection is the mechanism of evolution where organisms with favorable traits survive and reproduce more successfully, passing traits to offspring.' },
    { q: 'What is mitosis?', a: 'Mitosis is cell division producing two genetically identical daughter cells from one parent cell. Stages: Prophase, Metaphase, Anaphase, Telophase, Cytokinesis.' },
    { q: 'What is the role of mitochondria?', a: 'Mitochondria are the "powerhouses of the cell," generating ATP through cellular respiration via the Krebs cycle and oxidative phosphorylation.' },
    { q: 'What is mRNA?', a: 'mRNA (messenger RNA) carries genetic information from DNA in the nucleus to ribosomes in the cytoplasm, where it directs protein synthesis.' },
  ],
  economics: [
    { q: 'What is supply and demand?', a: 'Supply is the quantity producers offer at various prices; demand is the quantity consumers want. Equilibrium price is where supply equals demand.' },
    { q: 'What is GDP?', a: 'Gross Domestic Product (GDP) measures the total monetary value of all goods and services produced within a country in a specific time period.' },
    { q: 'What is inflation?', a: 'Inflation is the rate at which the general price level of goods and services rises over time, reducing purchasing power of currency.' },
    { q: 'What is opportunity cost?', a: 'Opportunity cost is the value of the next best alternative forgone when making a decision. It represents the true cost of any choice.' },
    { q: 'What is comparative advantage?', a: 'Comparative advantage occurs when a country can produce a good at a lower opportunity cost than another, forming the basis of international trade theory.' },
  ],
};

function matchTopic(input: string): string {
  const lower = input.toLowerCase();
  for (const topic of Object.keys(topicKnowledgeBase)) {
    if (lower.includes(topic)) return topic;
  }
  // Fuzzy match
  const topicAliases: Record<string, string> = {
    math: 'mathematics', maths: 'mathematics', calculus: 'mathematics', algebra: 'mathematics',
    physics: 'science', chemistry: 'science', biology: 'biology',
    coding: 'programming', javascript: 'programming', python: 'programming', software: 'programming',
    history: 'history', economics: 'economics', economy: 'economics',
  };
  for (const [alias, topic] of Object.entries(topicAliases)) {
    if (lower.includes(alias)) return topic;
  }
  return 'default';
}

export function generateFromTopic(topic: string): Flashcard[] {
  const matchedTopic = matchTopic(topic);
  const baseQA = topicKnowledgeBase[matchedTopic] || topicKnowledgeBase.default;
  const tags = [topic.toLowerCase(), matchedTopic];
  const allAnswers = baseQA.map(qa => qa.a);

  return baseQA.map((qa, i) => {
    const cardTypes: CardType[] = ['qa', 'mcq', 'revision', 'summary'];
    const type = cardTypes[i % cardTypes.length];
    return {
      id: generateId(),
      type,
      question: qa.q,
      answer: qa.a,
      options: type === 'mcq' ? generateMCQOptions(qa.a, allAnswers) : undefined,
      difficulty: assignDifficulty(i, baseQA.length),
      tags,
      isKnown: false,
      isStarred: false,
      createdAt: Date.now(),
    };
  });
}

export function generateFromText(text: string): Flashcard[] {
  if (!text || text.trim().length < 20) return [];

  const pairs = parseTextToQAPairs(text.trim());
  if (pairs.length === 0) return [];

  const tags = extractTags(text);
  const allAnswers = pairs.map(p => p.a);

  const cardTypes: CardType[] = ['qa', 'mcq', 'revision', 'summary'];

  return pairs.slice(0, 15).map((pair, i) => {
    const type = cardTypes[i % cardTypes.length];
    return {
      id: generateId(),
      type,
      question: pair.q,
      answer: pair.a,
      options: type === 'mcq' ? generateMCQOptions(pair.a, allAnswers) : undefined,
      difficulty: assignDifficulty(i, pairs.length),
      tags,
      isKnown: false,
      isStarred: false,
      createdAt: Date.now(),
    };
  });
}

export function generateFromURL(url: string): Flashcard[] {
  // Simulate URL-based generation using the URL path as topic clues
  const urlParts = url.replace(/https?:\/\//, '').split(/[/\-_?#&]/);
  const topic = urlParts.find(p => p.length > 3 && !['www', 'com', 'org', 'net', 'html', 'php', 'asp'].includes(p)) || 'general';
  return generateFromTopic(topic);
}

export function shuffleCards(cards: Flashcard[]): Flashcard[] {
  return [...cards].sort(() => Math.random() - 0.5);
}
