import React, { useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
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

function ProtectedLayout({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  return (
    <div className="app-container">
      <Sidebar />
      <main className="main-viewport">
        <TopNav />
        <div className="animate-page">{children}</div>
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route path="/" element={<ProtectedLayout><Home /></ProtectedLayout>} />
          <Route path="/domains" element={<ProtectedLayout><DomainsList /></ProtectedLayout>} />
          <Route path="/domain/:id" element={<ProtectedLayout><DomainDetail /></ProtectedLayout>} />
          <Route path="/roadmap/:id" element={<ProtectedLayout><Roadmap /></ProtectedLayout>} />
          <Route path="/quiz" element={<ProtectedLayout><QuizSelection /></ProtectedLayout>} />
          <Route path="/quiz/:track" element={<ProtectedLayout><QuizRunner /></ProtectedLayout>} />
          <Route path="/results" element={<ProtectedLayout><Results /></ProtectedLayout>} />
          <Route path="/career-finder" element={<ProtectedLayout><CareerFinder /></ProtectedLayout>} />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
