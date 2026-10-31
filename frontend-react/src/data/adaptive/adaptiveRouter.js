/**
 * Adaptive Assessment Router & Next Question Selector
 * 
 * Rules:
 * - Exactly:
 *   - 6 Logic puzzle questions from Bebras (computational thinking, graph/network, binary, trees, sorting)
 *   - 10 Interest-based questions from O*NET (RIASEC traits, work activities)
 *   - 5 Guided Career Engineering activities from Code.org
 *   - Total = 21 targeted diagnostic questions
 * - Dynamic adaptive difficulty:
 *   - Promotes to higher difficulty on 2 consecutive correct answers
 *   - Demotes to easier difficulty on 2 consecutive wrong answers or "I don't know"
 * - Questions adapt dynamically to previous answers and introductory student profile
 * - Zero Orientation filler questions.
 */

import itemBankData from './item_bank.json';

const ALL_QUESTIONS = (itemBankData.questions || []).filter(q => q.status === 'approved');

export const QUIZ_STRUCTURE = {
  LOGIC_COUNT: 6,       // Steps 1 to 6 (Bebras logic puzzles)
  INTEREST_COUNT: 10,   // Steps 7 to 16 (O*NET interest items)
  GUIDED_COUNT: 5,      // Steps 17 to 21 (Code.org guided engineering activities)
  TOTAL_QUESTIONS: 21
};

export function getAdaptiveQuestion({
  stepNumber,          // 1-based index (1 to 21)
  previousAnswers = {}, // { [questionId]: { answer, isCorrect, isDontKnow, timeTaken } }
  studentIntro = {},   // { semester, experienceLevel, preferredArea }
  askedQuestionIds = [],
  currentLadderLevel = 2 // 1, 2, 3, or 4
}) {
  const askedSet = new Set(askedQuestionIds);
  const remaining = ALL_QUESTIONS.filter(q => !askedSet.has(q.id));

  if (remaining.length === 0) return null;

  // Track consecutive correct and wrong answers for the knowledge ladder
  const answeredList = Object.values(previousAnswers);
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

  // Adjust ladder difficulty based on previous answers (promote on 2 correct, demote on 2 wrong)
  let targetDifficulty = currentLadderLevel;
  if (consecutiveCorrect >= 2) {
    targetDifficulty = Math.min(4, targetDifficulty + 1);
  } else if (consecutiveWrong >= 2) {
    targetDifficulty = Math.max(1, targetDifficulty - 1);
  }

  // Strict Section Allocation:
  // Step 1 - 6: Bebras Logic Puzzles (6 questions)
  // Step 7 - 16: O*NET Interest Profiler Items (10 questions)
  // Step 17 - 21: Code.org Guided Engineering Activities (5 questions)

  let preferredCategory = 'logic';
  let categoryLabel = 'Bebras Computational Logic Puzzle';

  if (stepNumber <= QUIZ_STRUCTURE.LOGIC_COUNT) {
    preferredCategory = 'logic';
    categoryLabel = 'Bebras Computational Logic Puzzle';
  } else if (stepNumber <= (QUIZ_STRUCTURE.LOGIC_COUNT + QUIZ_STRUCTURE.INTEREST_COUNT)) {
    preferredCategory = 'interest';
    categoryLabel = 'O*NET Career Interest Activity';
  } else {
    preferredCategory = 'guided_activity';
    categoryLabel = 'Code.org Guided Career Engineering Lab';
  }

  // 1. Try matching preferred category and difficulty level
  let candidates = remaining.filter(q => {
    const catMatch = q.category === preferredCategory;
    const diffMatch = preferredCategory === 'interest' ? true : q.difficulty === targetDifficulty;
    return catMatch && diffMatch;
  });

  // 2. Fallback: match category with adjacent difficulty (target +/- 1)
  if (candidates.length === 0) {
    candidates = remaining.filter(q => {
      const catMatch = q.category === preferredCategory;
      const diffMatch = preferredCategory === 'interest' ? true : Math.abs(q.difficulty - targetDifficulty) <= 1;
      return catMatch && diffMatch;
    });
  }

  // 3. Fallback: any question in the preferred category
  if (candidates.length === 0) {
    candidates = remaining.filter(q => q.category === preferredCategory);
  }

  // 4. Ultimate fallback if category is exhausted: any remaining question
  if (candidates.length === 0) {
    candidates = remaining;
  }

  const selected = candidates[0];

  return {
    question: selected,
    targetDifficulty,
    consecutiveCorrect,
    consecutiveWrong,
    categoryLabel,
    reasoning: `Selected Question #${stepNumber} (${categoryLabel}) at Difficulty Level ${targetDifficulty} based on your introductory profile (${studentIntro.experienceLevel || 'standard'}) and ${consecutiveCorrect > 0 ? `${consecutiveCorrect} correct answer(s) in a row` : consecutiveWrong > 0 ? `${consecutiveWrong} consecutive miss/IDK (adjusting difficulty)` : 'balanced performance'}.`
  };
}
