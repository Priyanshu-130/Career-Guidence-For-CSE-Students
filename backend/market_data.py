"""
Indian Tech Job Market & Skill-Gap Analysis Module
Loads indian_tech_jobs_2026.csv and India_tech_jobs.xls via pandas.read_csv(),
caches pre-aggregated per-domain market intelligence to backend/data/market_cache.json
for instant subsequent startups (< 50ms).
"""

import json
import os
import re
from collections import Counter
import pandas as pd

DATA_DIR = os.path.join(os.path.dirname(__file__), 'data')
CSV_PATH = os.path.join(DATA_DIR, 'indian_tech_jobs_2026.csv')
XLS_PATH = os.path.join(DATA_DIR, 'India_tech_jobs.xls')
CACHE_PATH = os.path.join(DATA_DIR, 'market_cache.json')

# Maps the 9 ML model classes -> PathFinder canonical domain IDs
CANONICAL_DOMAIN_MAP = {
    'AI/ML/DL': 'ai',
    'Data Science': 'data',
    'Data Engineering': 'data',
    'Business Intelligence': 'data',
    'Software Engineering': 'web',
    'Product Management': 'web',
    'Cyber Security': 'security',
    'Cloud & DevOps': 'cloud',
    'Information Technology': 'systems',
}

# Maps PathFinder canonical domain IDs -> primary ML model class label
ID_TO_MODEL_LABEL = {
    'ai': 'AI/ML/DL',
    'data': 'Data Science',
    'web': 'Software Engineering',
    'security': 'Cyber Security',
    'cloud': 'Cloud & DevOps',
    'systems': 'Information Technology',
    'networking': 'Information Technology',
    'iot': 'Software Engineering',
    'robotics': 'AI/ML/DL',
    'vlsi': 'Information Technology',
}

# Stopwords too generic to be useful as actionable missing skills
GENERIC_SKILL_STOPWORDS = {
    'basic', 'computer science', 'programming', 'analytical', 'communication',
    'management', 'development', 'operations', 'services', 'customer engagement',
    'technology', 'software', 'engineering', 'solutions', 'design', 'analysis',
    'it', 'technical', 'support', 'testing', 'documentation', 'tools', 'data',
    'business', 'analytics', 'coding', 'troubleshooting'
}

# Single-pass keyword map for extracting technical skills from df2 descriptions
SKILL_ALIAS_MAP = {
    'python': 'Python',
    'py': 'Python',
    'sql': 'SQL',
    'java': 'Java',
    'javascript': 'JavaScript',
    'js': 'JavaScript',
    'typescript': 'TypeScript',
    'ts': 'TypeScript',
    'react': 'React',
    'react.js': 'React',
    'reactjs': 'React',
    'node.js': 'Node.js',
    'nodejs': 'Node.js',
    'node': 'Node.js',
    'c++': 'C++',
    'aws': 'AWS',
    'amazon web services': 'AWS',
    'azure': 'Azure',
    'gcp': 'GCP',
    'google cloud': 'GCP',
    'docker': 'Docker',
    'kubernetes': 'Kubernetes',
    'k8s': 'Kubernetes',
    'terraform': 'Terraform',
    'linux': 'Linux',
    'unix': 'Linux',
    'git': 'Git',
    'github': 'Git',
    'ci/cd': 'CI/CD',
    'jenkins': 'CI/CD',
    'rest api': 'REST API',
    'restful api': 'REST API',
    'microservices': 'Microservices',
    'machine learning': 'Machine Learning',
    'ml': 'Machine Learning',
    'deep learning': 'Deep Learning',
    'dl': 'Deep Learning',
    'dsa': 'Data Structures & Algorithms',
    'tensorflow': 'TensorFlow',
    'pytorch': 'PyTorch',
    'generative ai': 'Generative AI',
    'genai': 'Generative AI',
    'llm': 'Generative AI',
    'nlp': 'NLP',
    'natural language processing': 'NLP',
    'data analysis': 'Data Analysis',
    'data analytics': 'Data Analytics',
    'data visualization': 'Data Visualization',
    'power bi': 'Power BI',
    'powerbi': 'Power BI',
    'tableau': 'Tableau',
    'excel': 'Excel',
    'pandas': 'Pandas',
    'numpy': 'NumPy',
    'scikit-learn': 'Scikit-learn',
    'sklearn': 'Scikit-learn',
    'spark': 'Spark',
    'pyspark': 'PySpark',
    'etl': 'ETL',
    'snowflake': 'Snowflake',
    'mongodb': 'MongoDB',
    'nosql': 'NoSQL',
    'postgresql': 'PostgreSQL',
    'postgres': 'PostgreSQL',
    'mysql': 'MySQL',
    'cybersecurity': 'Cybersecurity',
    'cyber security': 'Cybersecurity',
    'information security': 'Cybersecurity',
    'network security': 'Network Security',
    'firewalls': 'Firewalls',
    'siem': 'SIEM',
    'soc': 'SOC',
    'iam': 'IAM',
    'owasp': 'OWASP',
    'penetration testing': 'Penetration Testing',
    'vulnerability': 'Vulnerability Assessment',
    'cryptography': 'Cryptography',
    'tcp/ip': 'TCP/IP',
    'networking': 'Networking',
    'agile': 'Agile',
    'scrum': 'Scrum',
    'jira': 'Jira',
    'figma': 'Figma',
    'roadmap': 'Product Roadmap',
    'itil': 'ITIL',
    'html': 'HTML/CSS',
    'css': 'HTML/CSS',
    'django': 'Django',
    'flask': 'Flask',
    'fastapi': 'FastAPI',
    'spring boot': 'Spring Boot',
    'springboot': 'Spring Boot',
}

_SORTED_TERMS = sorted(SKILL_ALIAS_MAP.keys(), key=len, reverse=True)
_SINGLE_PASS_SKILL_RE = re.compile(
    r'(?<![A-Za-z0-9_])(' + '|'.join(re.escape(t) for t in _SORTED_TERMS) + r')(?![A-Za-z0-9_])',
    re.IGNORECASE
)

CITY_NORMALIZATION = {
    'bengaluru': 'Bangalore',
    'bangalore': 'Bangalore',
    'hyderābād': 'Hyderabad',
    'hyderabad': 'Hyderabad',
    'mumbai': 'Mumbai',
    'pune': 'Pune',
    'chennai': 'Chennai',
    'noida': 'Noida',
    'gurgaon': 'Gurgaon',
    'gurugram': 'Gurgaon',
    'new delhi': 'Delhi NCR',
    'delhi': 'Delhi NCR',
    'kolkata': 'Kolkata',
    'ka, in': 'Bangalore',
    'mh, in': 'Mumbai',
    'ts, in': 'Hyderabad',
    'tn, in': 'Chennai',
    'dl, in': 'Delhi NCR',
    'up, in': 'Noida',
    'hr, in': 'Gurgaon',
    'wb, in': 'Kolkata',
}

_MARKET_CACHE = {}
_INITIALIZED = False


def _normalize_city(raw_city):
    if not raw_city or not isinstance(raw_city, str):
        return 'India'
    cleaned = raw_city.strip()
    lower = cleaned.lower()
    if lower in CITY_NORMALIZATION:
        return CITY_NORMALIZATION[lower]
    first_part = cleaned.split(',')[0].strip()
    if first_part.lower() in CITY_NORMALIZATION:
        return CITY_NORMALIZATION[first_part.lower()]
    return first_part if first_part else 'India'


def _extract_skills_fast(text):
    if not text or not isinstance(text, str):
        return []
    snippet = text[:2000]
    found = []
    seen = set()
    for match in _SINGLE_PASS_SKILL_RE.finditer(snippet):
        canonical = SKILL_ALIAS_MAP.get(match.group(1).lower())
        if canonical and canonical not in seen:
            seen.add(canonical)
            found.append(canonical)
    return found


def _canonicalize_skill_name(raw):
    clean = raw.strip()
    low = clean.lower()
    if low in SKILL_ALIAS_MAP:
        return SKILL_ALIAS_MAP[low]
    return clean[:1].upper() + clean[1:] if clean else ''


def _build_domain_cache(combined_df):
    cache = {}
    for domain_label, group in combined_df.groupby('skill_domain'):
        total_openings = int(len(group))
        fresher_mask = group['is_fresher_friendly'] == True
        fresher_count = int(fresher_mask.sum())
        fresher_ratio_pct = round((fresher_count / total_openings) * 100, 1) if total_openings > 0 else 0.0

        sal_series = group.loc[group['salary_midpoint_lpa'] > 0, 'salary_midpoint_lpa']
        if len(sal_series) > 0:
            median_sal = round(float(sal_series.median()), 1)
            min_sal = round(float(sal_series.quantile(0.25)), 1)
            max_sal = round(float(sal_series.quantile(0.75)), 1)
        else:
            median_sal, min_sal, max_sal = 0.0, 0.0, 0.0

        city_counts = group['primary_city'].value_counts()
        top_hubs = [
            {'city': str(city), 'count': int(cnt)}
            for city, cnt in city_counts.items()
            if str(city).lower() not in ('india', 'nan', '')
        ][:5]

        skill_counter = Counter()
        display_names = {}
        for skills_val in group['skills_list']:
            for sk in skills_val:
                sk_disp = _canonicalize_skill_name(sk)
                low = sk_disp.lower()
                if sk_disp and low not in GENERIC_SKILL_STOPWORDS and len(sk_disp) > 1:
                    skill_counter[low] += 1
                    if low not in display_names:
                        display_names[low] = sk_disp

        top_15_skills = [
            {
                'skill': display_names.get(low, low.title()),
                'mentions': int(cnt),
                'demand_pct': round((cnt / total_openings) * 100, 1) if total_openings > 0 else 0.0
            }
            for low, cnt in skill_counter.most_common(15)
        ]

        # Prioritize genuine entry-level / fresher-friendly roles first, then disclosed salary
        sorted_jobs = group.sort_values(
            by=['is_true_fresher', 'is_fresher_friendly', 'salary_midpoint_lpa'],
            ascending=[False, False, False]
        )

        listings = []
        seen_pairs = set()
        for _, row in sorted_jobs.iterrows():
            title = str(row['job_title']).strip()
            company = str(row['company_name']).strip()
            pair = (title.lower(), company.lower())
            if pair in seen_pairs or not title or title.lower() == 'nan':
                continue
            seen_pairs.add(pair)
            sal = float(row['salary_midpoint_lpa'])
            listings.append({
                'job_title': title,
                'company_name': company if company and company.lower() != 'nan' else 'Tech Employer',
                'primary_city': str(row['primary_city']),
                'salary_midpoint_lpa': round(sal, 1) if sal > 0 else None,
                'salary_display': f"₹{round(sal, 1)} LPA" if sal > 0 else 'Not Disclosed',
                'is_fresher_friendly': bool(row['is_true_fresher']),
                'experience_raw': str(row['experience_raw']) if pd.notna(row['experience_raw']) else '0–2 Yrs',
                'job_url': str(row['job_url']) if pd.notna(row['job_url']) else ''
            })
            if len(listings) >= 10:
                break

        cache[domain_label] = {
            'domain_label': domain_label,
            'canonical_domain_id': CANONICAL_DOMAIN_MAP.get(domain_label, 'ai'),
            'market_insights': {
                'total_openings': total_openings,
                'fresher_friendly_count': fresher_count,
                'fresher_friendly_ratio_pct': fresher_ratio_pct,
                'median_salary_lpa': median_sal,
                'salary_range_lpa': f"₹{min_sal} – ₹{max_sal} LPA" if median_sal > 0 else 'Market Disclosed Varies',
                'top_hiring_hubs': top_hubs
            },
            'top_15_skills': top_15_skills,
            'job_listings': listings
        }
    return cache


def _cache_is_fresh():
    if not os.path.exists(CACHE_PATH):
        return False
    cache_mtime = os.path.getmtime(CACHE_PATH)
    for src in (CSV_PATH, XLS_PATH):
        if os.path.exists(src) and os.path.getmtime(src) > cache_mtime:
            return False
    return True


def init_market_data():
    """Load both datasets via pandas.read_csv() (or fresh JSON cache) once at startup."""
    global _MARKET_CACHE, _INITIALIZED
    if _INITIALIZED and _MARKET_CACHE:
        return _MARKET_CACHE

    if _cache_is_fresh():
        try:
            with open(CACHE_PATH, 'r', encoding='utf-8') as f:
                _MARKET_CACHE = json.load(f)
            _INITIALIZED = True
            return _MARKET_CACHE
        except Exception:
            pass

    frames = []

    if os.path.exists(CSV_PATH):
        df1 = pd.read_csv(CSV_PATH, low_memory=False)
        exp_min = pd.to_numeric(df1['experience_min_yrs'], errors='coerce').fillna(99.0)
        fresher_flag = df1['is_fresher_friendly'].fillna(False).astype(bool)
        title_low_1 = df1['job_title'].fillna('').astype(str).str.lower()
        exp_raw_str = df1['experience_raw'].fillna('').astype(str).str.strip()
        not_high_exp_raw = ~exp_raw_str.str.match(r'^(?:[4-9]|[12]\d)\s*(?:-|to|\+)', case=False)
        non_senior_title_1 = ~title_low_1.str.contains(r'\b(?:lead|principal|staff|director|manager|head|architect|senior|sr\.?|vp)\b', regex=True)
        is_true_fresh_1 = non_senior_title_1 & not_high_exp_raw & ((exp_min <= 2.0) | (fresher_flag & (exp_min <= 3.0)))
        df1_norm = pd.DataFrame({
            'job_title': df1['job_title'].fillna(''),
            'company_name': df1['company_name'].fillna('Tech Employer'),
            'primary_city': df1['primary_city'].fillna(df1['location']).apply(_normalize_city),
            'skill_domain': df1['skill_domain'].fillna('Software Engineering'),
            'salary_midpoint_lpa': pd.to_numeric(df1['salary_midpoint_lpa'], errors='coerce').fillna(0.0),
            'is_fresher_friendly': is_true_fresh_1,
            'is_true_fresher': is_true_fresh_1,
            'experience_raw': df1['experience_raw'].fillna('Not Specified'),
            'job_url': df1['job_url'].fillna(''),
            'skills_list': df1['skills_required'].fillna('').apply(
                lambda s: [part.strip() for part in str(s).split(',') if part.strip()]
            )
        })
        frames.append(df1_norm)

    if os.path.exists(XLS_PATH):
        df2 = pd.read_csv(XLS_PATH, low_memory=False)
        min_amt = pd.to_numeric(df2['min_amount'], errors='coerce')
        max_amt = pd.to_numeric(df2['max_amount'], errors='coerce')
        mid_amt = pd.concat([min_amt, max_amt], axis=1).mean(axis=1).fillna(0.0)
        is_inr = df2['currency'].fillna('').astype(str).str.upper() == 'INR'
        sal_lpa = ((mid_amt / 100000.0).where(is_inr & (mid_amt > 100000.0), 0.0)).round(2)

        title_lower = df2['title'].fillna('').astype(str).str.lower()
        desc_lower = df2['description'].fillna('').astype(str).str[:800].str.lower()
        fresher_pat = r'\b(?:fresher|entry[- ]level|junior|jr\.?|intern|trainee|graduate|0[- ]?[12]\s*y)'
        non_senior_title_2 = ~title_lower.str.contains(r'\b(?:lead|principal|staff|director|manager|head|architect|senior|sr\.?|vp)\b', regex=True)
        is_fresh_2 = non_senior_title_2 & (title_lower.str.contains(fresher_pat, regex=True) | desc_lower.str.contains(fresher_pat, regex=True))

        df2_norm = pd.DataFrame({
            'job_title': df2['title'].fillna(''),
            'company_name': df2['company'].fillna('Tech Employer'),
            'primary_city': df2['location'].fillna('India').apply(_normalize_city),
            'skill_domain': df2['category'].fillna('Software Engineering'),
            'salary_midpoint_lpa': sal_lpa,
            'is_fresher_friendly': is_fresh_2,
            'is_true_fresher': is_fresh_2,
            'experience_raw': is_fresh_2.map({True: '0–2 Yrs (Fresher Friendly)', False: 'Experienced'}),
            'job_url': df2['job_url'].fillna(''),
            'skills_list': df2['description'].fillna('').apply(_extract_skills_fast)
        })
        frames.append(df2_norm)

    if frames:
        combined = pd.concat(frames, ignore_index=True)
        _MARKET_CACHE = _build_domain_cache(combined)
        try:
            with open(CACHE_PATH, 'w', encoding='utf-8') as f:
                json.dump(_MARKET_CACHE, f)
        except Exception:
            pass

    _INITIALIZED = True
    return _MARKET_CACHE


def resolve_domain_label(domain_or_id):
    """Resolve either an ML class label or a canonical domain ID into a cached domain label."""
    if not _INITIALIZED:
        init_market_data()
    if not domain_or_id:
        return 'Data Science' if 'Data Science' in _MARKET_CACHE else next(iter(_MARKET_CACHE), 'AI/ML/DL')
    if domain_or_id in _MARKET_CACHE:
        return domain_or_id
    lower = str(domain_or_id).strip().lower()
    if lower in ID_TO_MODEL_LABEL and ID_TO_MODEL_LABEL[lower] in _MARKET_CACHE:
        return ID_TO_MODEL_LABEL[lower]
    for label in _MARKET_CACHE:
        if lower in label.lower() or label.lower() in lower:
            return label
    return next(iter(_MARKET_CACHE), 'AI/ML/DL')


def _tokenize_skill_words(text):
    """Split a skill phrase into lowercase whole-word tokens preserving +, #, and . characters."""
    return [t for t in re.split(r'[\s,&-]+', str(text or '').strip().lower()) if t]


def _skill_matches(student_canon_set, student_entry_tokens, required_skill_lower):
    """Strict canonical alias and whole-word token matching without false substring hits."""
    if not student_canon_set:
        return False
    req = str(required_skill_lower or '').strip().lower()
    if not req:
        return False

    req_canon = SKILL_ALIAS_MAP.get(req, '').lower()
    if req in student_canon_set or (req_canon and req_canon in student_canon_set):
        return True

    if '/' in req:
        parts = [p.strip() for p in req.split('/') if p.strip()]
        for part in parts:
            if part in student_canon_set or any(part in entry_tokens for entry_tokens in student_entry_tokens):
                return True

    req_tokens = _tokenize_skill_words(req)
    if req_tokens and any(all(tok in entry_tokens for tok in req_tokens) for entry_tokens in student_entry_tokens):
        return True

    return False


def get_domain_market_intelligence(domain_or_id, student_skills=None):
    """
    Return real Indian job listings, market insights, and skill-gap analysis
    for the requested domain against the student's current skills.
    """
    if not _INITIALIZED:
        init_market_data()

    label = resolve_domain_label(domain_or_id)
    entry = _MARKET_CACHE.get(label)
    if not entry:
        return {
            'domain_label': str(domain_or_id),
            'canonical_domain_id': CANONICAL_DOMAIN_MAP.get(domain_or_id, 'ai'),
            'market_insights': {
                'total_openings': 0,
                'fresher_friendly_count': 0,
                'fresher_friendly_ratio_pct': 0,
                'median_salary_lpa': 0,
                'salary_range_lpa': 'N/A',
                'top_hiring_hubs': []
            },
            'skill_gap': {
                'readiness_score_pct': 0,
                'matched_skills': [],
                'missing_skills_top3': [],
                'top_15_domain_skills': []
            },
            'job_listings': []
        }

    if isinstance(student_skills, str):
        raw_skills = [s.strip() for s in re.split(r'[,;\n]+', student_skills) if s.strip()]
    elif isinstance(student_skills, list):
        raw_skills = [str(s).strip() for s in student_skills if str(s).strip()]
    else:
        raw_skills = []

    student_canon_set = set()
    student_entry_tokens = []
    for raw in raw_skills:
        low = raw.strip().lower()
        if not low:
            continue
        student_canon_set.add(low)
        entry_tokens = set(_tokenize_skill_words(low))
        canon = SKILL_ALIAS_MAP.get(low, '').lower()
        if canon:
            student_canon_set.add(canon)
            entry_tokens.update(_tokenize_skill_words(canon))
        student_entry_tokens.append(entry_tokens)

    top_15 = entry['top_15_skills']
    matched_skills = []
    missing_skills = []

    for item in top_15:
        sk_name = item['skill']
        if _skill_matches(student_canon_set, student_entry_tokens, sk_name.lower()):
            matched_skills.append(sk_name)
        else:
            missing_skills.append(sk_name)

    total_top = max(len(top_15), 1)
    readiness_score = round((len(matched_skills) / total_top) * 100)
    if raw_skills and readiness_score == 0:
        readiness_score = 10

    return {
        'domain_label': entry['domain_label'],
        'canonical_domain_id': entry['canonical_domain_id'],
        'market_insights': entry['market_insights'],
        'skill_gap': {
            'readiness_score_pct': min(100, readiness_score),
            'matched_count': len(matched_skills),
            'total_benchmark_skills': len(top_15),
            'matched_skills': matched_skills,
            'missing_skills_top3': missing_skills[:3],
            'top_15_domain_skills': top_15
        },
        'job_listings': entry['job_listings'][:8]
    }
