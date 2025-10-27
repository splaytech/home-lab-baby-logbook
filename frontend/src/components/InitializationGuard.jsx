import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useAppStore from '../store/useAppStore';
import { checkInitialization } from '../services/api';

const InitializationGuard = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isInitialized, initializationLoading, setInitialized, setInitializationLoading } = useAppStore();

  useEffect(() => {
    const checkAppInitialization = async () => {
      setInitializationLoading(true);
      try {
        const result = await checkInitialization();
        setInitialized(result.initialized);

        // Route based on initialization status and current location
        if (!result.initialized && location.pathname !== '/welcome' && location.pathname !== '/setup') {
          navigate('/welcome');
        } else if (result.initialized && location.pathname === '/welcome') {
          navigate('/login');
        }
      } catch (error) {
        console.error('Failed to check initialization:', error);
        // Default to not initialized on error
        setInitialized(false);
        if (location.pathname !== '/welcome' && location.pathname !== '/setup') {
          navigate('/welcome');
        }
      } finally {
        setInitializationLoading(false);
      }
    };

    checkAppInitialization();
  }, []);

  if (initializationLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cream-50 via-mint-50 to-coral-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">🦕</div>
          <h2 className="text-2xl font-display font-bold text-mint-700 mb-2">
            Baby Logbook
          </h2>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return children;
};

export default InitializationGuard;
