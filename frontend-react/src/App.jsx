import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import TopNav from './components/TopNav';
import Sidebar from './components/Sidebar';

import Home from './pages/Home';
import DomainsList from './pages/DomainsList';
import DomainDetail from './pages/DomainDetail';
import Roadmap from './pages/Roadmap';
import QuizSelection from './pages/QuizSelection';
import QuizRunner from './pages/QuizRunner';
import Results from './pages/Results';
import Login from './pages/Login';
import Register from './pages/Register';
import CareerFinder from './pages/CareerFinder';
import Progress from './pages/Progress';
import AdminDashboard from './pages/AdminDashboard';
import DomainAssessmentRunner from './pages/DomainAssessmentRunner';
import DomainComparisonDashboard from './pages/DomainComparisonDashboard';
import DomainResourcesAndBooster from './pages/DomainResourcesAndBooster';

function ProtectedLayout({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="app-container">
      <Sidebar />
      <main className="main-viewport">
        <TopNav />
        <div className="animate-page" style={{ flex: 1 }}>{children}</div>
      </main>
    </div>
  );
}

// Admin console: hidden route (/admin), rendered without the student Sidebar so it never appears in student navigation.
function AdminLayout({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return (
    <main className="main-viewport" style={{ marginLeft: 0, width: '100%', minHeight: '100vh' }}>
      <div style={{ flex: 1 }}>{children}</div>
    </main>
  );
}

function PublicLayout({ children }) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1 }}>{children}</div>
    </div>
  );
}

// "Roadmap" nav item: open the roadmap for the student's latest recommended domain,
// or let them pick a domain if they have no result yet.
function RoadmapEntry() {
  let domainId = null;
  try {
    const raw =
      sessionStorage.getItem('quiz_results') ||
      localStorage.getItem('cpath_latest_quiz_results');
    if (raw) domainId = JSON.parse(raw)?.domain_id || null;
  } catch { /* ignore malformed storage */ }
  return <Navigate to={domainId ? `/roadmap/${domainId}` : '/domains'} replace />;
}

function App() {
  return (
    <AuthProvider>
      <HashRouter>
        <Routes>
          {/* Public / Auth routes */}
          <Route path="/login" element={<PublicLayout><Login /></PublicLayout>} />
          <Route path="/register" element={<PublicLayout><Register /></PublicLayout>} />

          {/* Multi-Page Application Core Routes inside persistent Sidebar + TopNav */}
          <Route path="/" element={<ProtectedLayout><Home /></ProtectedLayout>} />
          <Route path="/dashboard" element={<ProtectedLayout><Home /></ProtectedLayout>} />
          
          {/* DOM-03: Domains & Specializations */}
          <Route path="/domains" element={<ProtectedLayout><DomainsList /></ProtectedLayout>} />
          <Route path="/domain/:id" element={<ProtectedLayout><DomainDetail /></ProtectedLayout>} />

          {/* Dedicated Multi-Domain Resources & Stand Out Beyond Entry-Level Hub */}
          <Route path="/resources" element={<ProtectedLayout><DomainResourcesAndBooster /></ProtectedLayout>} />
          <Route path="/resources/:id" element={<ProtectedLayout><DomainResourcesAndBooster /></ProtectedLayout>} />
          
          {/* MAP-04: Curriculum Roadmaps */}
          <Route path="/roadmap" element={<ProtectedLayout><RoadmapEntry /></ProtectedLayout>} />
          <Route path="/roadmap/:id" element={<ProtectedLayout><Roadmap /></ProtectedLayout>} />
          
          {/* LAB-02: Diagnostic Assessment */}
          <Route path="/quiz" element={<ProtectedLayout><QuizSelection /></ProtectedLayout>} />
          <Route path="/quiz/:track" element={<ProtectedLayout><QuizRunner /></ProtectedLayout>} />
          <Route path="/assess" element={<Navigate to="/quiz" replace />} />
          {/* Hidden admin/telemetry console: not linked from student navigation */}
          <Route path="/admin" element={<AdminLayout><AdminDashboard /></AdminLayout>} />
          
          {/* RES-06: Telemetry & Results */}
          <Route path="/results" element={<ProtectedLayout><Results /></ProtectedLayout>} />
          
          {/* Phase 6: Domain-Specific Assessment & Comparison */}
          <Route path="/domain-assessment/:domainId" element={<ProtectedLayout><DomainAssessmentRunner /></ProtectedLayout>} />
          <Route path="/domain-comparison" element={<ProtectedLayout><DomainComparisonDashboard /></ProtectedLayout>} />
          
          {/* TRK-05: Student Trajectory & Progress */}
          <Route path="/progress" element={<ProtectedLayout><Progress /></ProtectedLayout>} />
          <Route path="/career-finder" element={<ProtectedLayout><CareerFinder /></ProtectedLayout>} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </HashRouter>
    </AuthProvider>
  );
}

export default App;
