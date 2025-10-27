import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import InitializationGuard from './components/InitializationGuard';
import WelcomePage from './pages/WelcomePage';
import SetupWizard from './pages/SetupWizard';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import ChildDetail from './pages/ChildDetail';
import ProfileSettings from './pages/ProfileSettings';

function App() {
  return (
    <Router>
      <Toaster position="top-right" />
      <InitializationGuard>
        <Routes>
          {/* Welcome page - first-time use */}
          <Route path="/welcome" element={<WelcomePage />} />

          {/* Setup wizard - multi-step setup process */}
          <Route path="/setup" element={<SetupWizard />} />

          {/* Login page - for returning users */}
          <Route path="/login" element={<LoginPage />} />

          {/* Dashboard - main app */}
          <Route path="/dashboard" element={<Dashboard />} />

          {/* Child Detail Page */}
          <Route path="/child/:childId" element={<ChildDetail />} />

          {/* Profile Settings */}
          <Route path="/profile" element={<ProfileSettings />} />

          {/* Redirect root to welcome (will be redirected by InitializationGuard if needed) */}
          <Route path="/" element={<Navigate to="/welcome" replace />} />

          {/* 404 - Not Found */}
          <Route
            path="*"
            element={
              <div className="min-h-screen bg-gradient-to-br from-mint-50 to-coral-50 flex items-center justify-center">
                <div className="bg-white rounded-lg shadow-lg p-8 max-w-md mx-auto text-center">
                  <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                    Page Not Found
                  </h2>
                  <p className="text-gray-600 mb-6">
                    The page you're looking for doesn't exist.
                  </p>
                  <a
                    href="/"
                    className="inline-block px-6 py-3 bg-mint-500 hover:bg-mint-600 text-white rounded-lg font-semibold transition-colors"
                  >
                    Go Home
                  </a>
                </div>
              </div>
            }
          />
        </Routes>
      </InitializationGuard>
    </Router>
  );
}

export default App;
