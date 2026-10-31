/**
 * Adaptive Assessment Router & Next Question Selector
 * 
 * Rules:
 * - Dynamic selection based on:
 *   1. Student Intro Profile (semester, self-reported experience, target goals)
 *   2. Previous answer outcomes (correct vs wrong / I don't know)
 *   3. Strict Category Mix:
 *      - O*NET Interest Profiler questions
 *      - Bebras Computational Logic puzzle tasks
 *      - Guided Career Activities (Code.org / Applied Software Labs)
 *      - Technical Knowledge Ladder items (Python, SQL, Java)
 *   4. Zero Orientation filler questions.
 */

import itemBankData from './item_bank.json';

const ALL_QUESTIONS = (itemBankData.questions || []).filter(q => q.status === 'approved');

export function getAdaptiveQuestion({
  stepNumber,          // 1-based index (e.g., 1 to 15)
  previousAnswers = {}, // { [questionId]: { answer, isCorrect, isDontKnow, timeTaken } }
  studentIntro = {},   // { semester, experienceLevel, preferredArea }
  askedQuestionIds = [],
  currentLadderLevel = 2 // 1, 2, 3, or 4
}) {
  const askedSet = new Set(askedQuestionIds);
  const remaining = ALL_QUESTIONS.filter(q => !askedSet.has(q.id));

  if (remaining.length === 0) return null;

  // Track recent correctness for ladder stepping
  const answeredList = Object.values(previousAnswers);
  const recentTwo = answeredList.slice(-2);
  let consecutiveCorrect = 0;
  let consecutiveWrong = 0;

  for (let i = answeredList.length - 1; i >= 0; i--) {
    const a = answeredList[i];
    if (a.isCorrect && consecutiveWrong === 0) {
      consecutiveCorrect++;
    } else if (!a.isCorrect && consecutiveCorrect === 0) {
      consecutiveWrong++;
    } else {
      break;
    }
  }

  // Ladder adjustment: promote on 2 correct, demote on 2 wrong
  let targetDifficulty = currentLadderLevel;
  if (consecutiveCorrect >= 2) {
    targetDifficulty = Math.min(4, targetDifficulty + 1);
  } else if (consecutiveWrong >= 2) {
    targetDifficulty = Math.max(1, targetDifficulty - 1);
  }

  // Phase scheduling across assessment journey:
  // Q1 - Q2: Bebras Computational Logic / Starter Diagnostic (calibrating baseline reasoning)
  // Q3 - Q5: O*NET Work Activities & RIASEC Interest Profiling
  // Q6 - Q7: Guided Career Activities (Code.org / Real-world engineering labs)
  // Q8+: Adaptive Technical Knowledge Ladder (Difficulty dynamically adjusts to student capability)

  let preferredCategory = 'knowledge';
  let preferredTopic = null;

  if (stepNumber <= 2) {
    preferredCategory = 'logic';
  } else if (stepNumber <= 5) {
    preferredCategory = 'interest';
  } else if (stepNumber <= 7) {
    preferredCategory = 'guided_activity';
  } else {
    preferredCategory = 'knowledge';
    // Focus topic according to student intro or adaptive exploration
    const preferredArea = (studentIntro.preferredArea || '').toLowerCase();
    if (preferredArea.includes('data') || preferredArea.includes('sql') || preferredArea.includes('database')) {
      preferredTopic = 'sql';
    } else if (preferredArea.includes('system') || preferredArea.includes('java') || preferredArea.includes('backend')) {
      preferredTopic = 'java';
    } else {
      preferredTopic = 'python';
    }
  }

  // 1. Try exact match: category + topic + difficulty
  let candidates = remaining.filter(q => {
    const catMatch = q.category === preferredCategory;
    const diffMatch = preferredCategory === 'interest' ? true : q.difficulty === targetDifficulty;
    const topicMatch = preferredTopic ? q.topic === preferredTopic : true;
    return catMatch && diffMatch && topicMatch;
  });

  // 2. Fallback: match category + difficulty
  if (candidates.length === 0) {
    candidates = remaining.filter(q => {
      const catMatch = q.category === preferredCategory;
      const diffMatch = preferredCategory === 'interest' ? true : Math.abs(q.difficulty - targetDifficulty) <= 1;
      return catMatch && diffMatch;
    });
  }

  // 3. Fallback: match category
  if (candidates.length === 0) {
    candidates = remaining.filter(q => q.category === preferredCategory);
  }

  // 4. Fallback: any remaining question matching ladder difficulty
  if (candidates.length === 0) {
    candidates = remaining.filter(q => Math.abs(q.difficulty - targetDifficulty) <= 1);
  }

  if (candidates.length === 0) {
    candidates = remaining;
  }

  const selected = candidates[0];

  return {
    question: selected,
    targetDifficulty,
    consecutiveCorrect,
    consecutiveWrong,
    reasoning: `Scheduled step ${stepNumber} (${preferredCategory}) at Difficulty Level ${targetDifficulty} based on your introductory profile and ${consecutiveCorrect > 0 ? `${consecutiveCorrect} correct answer(s) in a row` : consecutiveWrong > 0 ? `${consecutiveWrong} consecutive miss/IDK (adjusting difficulty)` : 'balanced performance'}.`
  };
}
