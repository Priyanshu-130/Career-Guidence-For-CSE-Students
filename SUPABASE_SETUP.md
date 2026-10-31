# Supabase Setup Guide & Schema Architecture

This document specifies the PostgreSQL / Supabase schema for **CSE PathFinder Adaptive Assessment**, supporting full longitudinal history, Row Level Security (RLS), and seamless offline synchronization.

---

## 1. Schema Definitions (PostgreSQL / Supabase DDL)

Execute the following SQL script in your Supabase SQL Editor:

```sql
-- =========================================================================
-- CSE PathFinder: Assessment Storage Schema
-- Version: 1.0.0
-- Principle: Append-only evidence history (NEVER OVERWRITE)
-- =========================================================================

-- 1. Assessment Sessions (Snapshots of profile & routing)
CREATE TABLE IF NOT EXISTS assessment_sessions (
    id TEXT PRIMARY KEY,
    student_email TEXT NOT NULL,
    intro_snapshot JSONB NOT NULL,
    routing_decision JSONB NOT NULL,
    status TEXT NOT NULL DEFAULT 'in_progress',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_assessment_sessions_email ON assessment_sessions(student_email);
CREATE INDEX IF NOT EXISTS idx_assessment_sessions_created ON assessment_sessions(created_at DESC);

-- 2. Assessment Attempts (Every answer attempt across questions)
CREATE TABLE IF NOT EXISTS assessment_attempts (
    id BIGSERIAL PRIMARY KEY,
    session_id TEXT REFERENCES assessment_sessions(id) ON DELETE SET NULL,
    student_email TEXT NOT NULL,
    topic TEXT NOT NULL,
    question_id TEXT NOT NULL,
    category TEXT NOT NULL,
    answer TEXT NOT NULL,
    correct BOOLEAN NOT NULL DEFAULT FALSE,
    time_taken NUMERIC(8, 2) NOT NULL DEFAULT 0.0,
    bank_version TEXT NOT NULL,
    rules_version TEXT NOT NULL,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_attempts_student_email ON assessment_attempts(student_email);
CREATE INDEX IF NOT EXISTS idx_attempts_topic ON assessment_attempts(topic);
CREATE INDEX IF NOT EXISTS idx_attempts_timestamp ON assessment_attempts(timestamp DESC);

-- 3. Topic Mastery Checkpoints (Full append-only evidence history)
CREATE TABLE IF NOT EXISTS topic_mastery (
    id BIGSERIAL PRIMARY KEY,
    session_id TEXT REFERENCES assessment_sessions(id) ON DELETE SET NULL,
    student_email TEXT NOT NULL,
    topic TEXT NOT NULL,
    level INTEGER NOT NULL CHECK (level BETWEEN 0 AND 4),
    confidence TEXT NOT NULL CHECK (confidence IN ('low', 'medium', 'high')),
    evidence_count INTEGER NOT NULL DEFAULT 0,
    last_assessed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    source TEXT NOT NULL CHECK (source IN ('self_report', 'assessed', 'diagnostic')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_mastery_student_topic ON topic_mastery(student_email, topic);
CREATE INDEX IF NOT EXISTS idx_mastery_last_assessed ON topic_mastery(last_assessed_at DESC);

-- 4. RIASEC Interest Scores & Domain Affinities (Versioned Heuristics)
CREATE TABLE IF NOT EXISTS interest_scores (
    id BIGSERIAL PRIMARY KEY,
    session_id TEXT REFERENCES assessment_sessions(id) ON DELETE SET NULL,
    student_email TEXT NOT NULL,
    riasec_vector JSONB NOT NULL,           -- e.g. {"R": 45, "I": 92, "A": 30, "S": 35, "E": 65, "C": 88}
    domain_affinity JSONB NOT NULL,        -- e.g. [{"id": "0", "title": "AI, ML", "score": 85.4}, ...]
    mapping_version TEXT NOT NULL,         -- e.g. "hypothesis v1"
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_interests_email ON interest_scores(student_email);
CREATE INDEX IF NOT EXISTS idx_interests_timestamp ON interest_scores(timestamp DESC);

-- 5. Result Feedback ("Does this feel right? (1-5)")
CREATE TABLE IF NOT EXISTS result_feedback (
    id BIGSERIAL PRIMARY KEY,
    result_id TEXT NOT NULL,
    student_email TEXT NOT NULL,
    feels_right_rating INTEGER NOT NULL CHECK (feels_right_rating BETWEEN 1 AND 5),
    optional_comment TEXT,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_feedback_result ON result_feedback(result_id);
CREATE INDEX IF NOT EXISTS idx_feedback_email ON result_feedback(student_email);
```

---

## 2. Row Level Security (RLS) Policies

Enable Row Level Security to protect student records while permitting authenticated access:

```sql
-- Enable RLS
ALTER TABLE assessment_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE topic_mastery ENABLE ROW LEVEL SECURITY;
ALTER TABLE interest_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE result_feedback ENABLE ROW LEVEL SECURITY;

-- Allow students to read and insert their own assessment records
CREATE POLICY "Users can manage own sessions" ON assessment_sessions
    FOR ALL USING (auth.jwt() ->> 'email' = student_email);

CREATE POLICY "Users can view and insert own attempts" ON assessment_attempts
    FOR ALL USING (auth.jwt() ->> 'email' = student_email);

CREATE POLICY "Users can view and insert own mastery" ON topic_mastery
    FOR ALL USING (auth.jwt() ->> 'email' = student_email);

CREATE POLICY "Users can view and insert own interests" ON interest_scores
    FOR ALL USING (auth.jwt() ->> 'email' = student_email);

CREATE POLICY "Users can submit feedback" ON result_feedback
    FOR ALL USING (auth.jwt() ->> 'email' = student_email);
```

---

## 3. Environment Configuration

Add the following environment variables to your frontend `.env` (or `.env.local`):

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key

# Fallback Backend API URL
VITE_API_URL=http://localhost:5000
```

---

## 4. Fallback Execution Priority

The client library (`apiService.js`) automatically operates across 3 tiers:

```
[ Tier 1: Supabase (Cloud Sync) ]
               │
               ▼ (if unavailable or unconfigured)
[ Tier 2: Java / REST Backend (SQLite) ]
               │
               ▼ (if offline or server unreachable)
[ Tier 3: LocalStorage (Offline Independent Browser Storage) ]
```

- When the application is completely offline, **Tier 3** takes over seamlessly.
- The question bank (`item_bank.json`) and adaptive logic are bundled in the frontend, guaranteeing zero interruption for students in low-connectivity classrooms.
