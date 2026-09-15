import { supabase, isSupabaseConfigured } from '../lib/supabase';

// Helper for SHA-256 password hashing in browser
async function hashPassword(password) {
  try {
    const msgUint8 = new TextEncoder().encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  } catch (err) {
    return password; // Fallback
  }
}

// LocalStorage Helper Keys
const LS_USERS_KEY = 'cse_pathfinder_users';
const LS_RESULTS_KEY = 'cse_pathfinder_results';
const LS_PROGRESS_KEY = 'cse_pathfinder_progress';

function getLsItem(key) {
  try {
    return JSON.parse(localStorage.getItem(key) || '[]');
  } catch (e) {
    return [];
  }
}

function setLsItem(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error('LocalStorage error:', e);
  }
}

// ----------------------------------------------------
// 1. REGISTER USER
// ----------------------------------------------------
export async function registerUser({ name, email, password, college, year, branch }) {
  const cleanEmail = email.trim().toLowerCase();
  const hashedPassword = await hashPassword(password);

  if (isSupabaseConfigured && supabase) {
    try {
      // Check existing
      const { data: existing } = await supabase
        .from('students')
        .select('email')
        .eq('email', cleanEmail)
        .maybeSingle();

      if (existing) {
        return { status: 'error', message: 'This email is already registered. Please login instead.', code: 409 };
      }

      const { error } = await supabase
        .from('students')
        .insert([{ name: name.trim(), email: cleanEmail, password: hashedPassword, college: college.trim(), year: year.trim(), branch: branch.trim() }]);

      if (error) {
        if (error.code === '23505') {
          return { status: 'error', message: 'This email is already registered. Please login instead.', code: 409 };
        }
        throw error;
      }
      return { status: 'success', message: 'Registration successful!' };
    } catch (err) {
      console.warn('Supabase register error, falling back to local storage:', err);
    }
  }

  // LocalStorage Fallback
  const users = getLsItem(LS_USERS_KEY);
  if (users.some(u => u.email === cleanEmail)) {
    return { status: 'error', message: 'This email is already registered. Please login instead.', code: 409 };
  }

  const newUser = {
    name: name.trim(),
    email: cleanEmail,
    password: hashedPassword,
    college: college.trim(),
    year: year.trim(),
    branch: branch.trim(),
    created_at: new Date().toISOString()
  };
  users.push(newUser);
  setLsItem(LS_USERS_KEY, users);
  return { status: 'success', message: 'Registration successful!' };
}

// ----------------------------------------------------
// 2. LOGIN USER
// ----------------------------------------------------
export async function loginUser({ email, password }) {
  const cleanEmail = email.trim().toLowerCase();
  const hashedPassword = await hashPassword(password);

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('students')
        .select('name, email, college, year, branch, password')
        .eq('email', cleanEmail)
        .maybeSingle();

      if (data && data.password === hashedPassword) {
        const student = {
          name: data.name,
          email: data.email,
          college: data.college,
          year: data.year,
          branch: data.branch
        };
        return { status: 'success', student };
      } else if (data) {
        return { status: 'error', message: 'Invalid email or password.', code: 401 };
      }
    } catch (err) {
      console.warn('Supabase login error, checking local storage:', err);
    }
  }

  // LocalStorage Fallback
  const users = getLsItem(LS_USERS_KEY);
  const found = users.find(u => u.email === cleanEmail && u.password === hashedPassword);
  if (found) {
    const student = {
      name: found.name,
      email: found.email,
      college: found.college,
      year: found.year,
      branch: found.branch
    };
    return { status: 'success', student };
  }

  return { status: 'error', message: 'Invalid email or password.', code: 401 };
}

// ----------------------------------------------------
// 3. SUBMIT QUIZ RESULT
// ----------------------------------------------------
export async function submitQuizResult({ student_email, quiz_type, recommended_domain, confidence_score, all_scores }) {
  const cleanEmail = student_email.trim().toLowerCase();

  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase
        .from('quiz_results')
        .insert([{
          student_email: cleanEmail,
          quiz_type,
          recommended_domain,
          confidence_score,
          all_scores: typeof all_scores === 'string' ? all_scores : JSON.stringify(all_scores || {})
        }]);

      if (!error) {
        return { status: 'success', message: 'Result saved successfully!' };
      }
    } catch (err) {
      console.warn('Supabase quiz submit error:', err);
    }
  }

  // LocalStorage Fallback
  const results = getLsItem(LS_RESULTS_KEY);
  results.push({
    student_email: cleanEmail,
    quiz_type,
    recommended_domain,
    confidence_score,
    all_scores: typeof all_scores === 'string' ? JSON.parse(all_scores) : (all_scores || {}),
    timestamp: new Date().toISOString()
  });
  setLsItem(LS_RESULTS_KEY, results);
  return { status: 'success', message: 'Result saved successfully!' };
}

// ----------------------------------------------------
// 4. GET QUIZ RESULTS
// ----------------------------------------------------
export async function getQuizResults(email) {
  const cleanEmail = email.trim().toLowerCase();

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('quiz_results')
        .select('quiz_type, recommended_domain, confidence_score, all_scores, timestamp')
        .eq('student_email', cleanEmail)
        .order('timestamp', { ascending: false });

      if (!error && data) {
        const results = data.map(item => ({
          ...item,
          all_scores: typeof item.all_scores === 'string' ? JSON.parse(item.all_scores || '{}') : item.all_scores
        }));
        return { status: 'success', results };
      }
    } catch (err) {
      console.warn('Supabase fetch results error:', err);
    }
  }

  // LocalStorage Fallback
  const allResults = getLsItem(LS_RESULTS_KEY);
  const userResults = allResults
    .filter(r => r.student_email === cleanEmail)
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  return { status: 'success', results: userResults };
}

// ----------------------------------------------------
// 5. GET PROGRESS
// ----------------------------------------------------
export async function getProgress(email) {
  const cleanEmail = email.trim().toLowerCase();

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('student_progress')
        .select('domain_id, semester_num, course_title, status, notes, updated_at')
        .eq('student_email', cleanEmail);

      if (!error && data) {
        return { status: 'success', progress: data };
      }
    } catch (err) {
      console.warn('Supabase fetch progress error:', err);
    }
  }

  // LocalStorage Fallback
  const allProgress = getLsItem(LS_PROGRESS_KEY);
  const userProgress = allProgress.filter(p => p.student_email === cleanEmail);
  return { status: 'success', progress: userProgress };
}

// ----------------------------------------------------
// 6. SAVE PROGRESS
// ----------------------------------------------------
export async function saveProgress({ student_email, domain_id, semester_num, course_title, status = 'Not Started', notes = '' }) {
  const cleanEmail = student_email.trim().toLowerCase();
  const semNum = Number(semester_num);

  if (isSupabaseConfigured && supabase) {
    try {
      const { data: existing } = await supabase
        .from('student_progress')
        .select('id')
        .eq('student_email', cleanEmail)
        .eq('domain_id', domain_id)
        .eq('semester_num', semNum)
        .eq('course_title', course_title)
        .maybeSingle();

      if (existing) {
        await supabase
          .from('student_progress')
          .update({ status, notes, updated_at: new Date().toISOString() })
          .eq('id', existing.id);
      } else {
        await supabase
          .from('student_progress')
          .insert([{ student_email: cleanEmail, domain_id, semester_num: semNum, course_title, status, notes }]);
      }
      return { status: 'success', message: 'Progress saved successfully!' };
    } catch (err) {
      console.warn('Supabase save progress error:', err);
    }
  }

  // LocalStorage Fallback
  let allProgress = getLsItem(LS_PROGRESS_KEY);
  const idx = allProgress.findIndex(
    p => p.student_email === cleanEmail && p.domain_id === domain_id && Number(p.semester_num) === semNum && p.course_title === course_title
  );

  const now = new Date().toISOString();
  if (idx >= 0) {
    allProgress[idx].status = status;
    allProgress[idx].notes = notes;
    allProgress[idx].updated_at = now;
  } else {
    allProgress.push({
      student_email: cleanEmail,
      domain_id,
      semester_num: semNum,
      course_title,
      status,
      notes,
      updated_at: now
    });
  }
  setLsItem(LS_PROGRESS_KEY, allProgress);
  return { status: 'success', message: 'Progress saved successfully!' };
}
