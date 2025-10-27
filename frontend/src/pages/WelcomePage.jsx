import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, AlertCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import DinosaurWelcome from '../components/DinosaurWelcome';
import { restoreBackup } from '../services/api';

const WelcomePage = () => {
  const navigate = useNavigate();
  const [isRestoring, setIsRestoring] = useState(false);
  const [showRestoreOption, setShowRestoreOption] = useState(false);

  const handleBeginSetup = () => {
    navigate('/setup');
  };

  const handleRestoreBackup = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.sqlite') && !file.name.endsWith('.db')) {
      toast.error('Please select a valid .sqlite or .db backup file');
      return;
    }

    setIsRestoring(true);

    try {
      await restoreBackup(file);
      toast.success('Database restored successfully! Redirecting to login...');

      // Redirect to login after a short delay
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);
    } catch (error) {
      console.error('Restore error:', error);
      toast.error(error.response?.data?.message || 'Failed to restore backup');
      setIsRestoring(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-50 via-mint-50 to-coral-50 flex items-center justify-center px-4">
      <div className="max-w-3xl w-full">
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 text-center">
          {/* Dinosaur Illustration */}
          <div className="mb-8">
            <DinosaurWelcome className="w-full max-w-md mx-auto" />
          </div>

          {/* Welcome Heading */}
          <h1 className="text-4xl md:text-5xl font-display font-bold text-mint-700 mb-4">
            Welcome to Baby Logbook!
          </h1>

          {/* Subtitle with emoji */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <span className="text-2xl">🍼</span>
            <p className="text-xl text-gray-600">
              Your private, self-hosted baby health companion
            </p>
          </div>

          {/* Description */}
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Let's get started by setting up your administrator account and creating your family's health tracking space.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col gap-4 items-center">
            <button
              onClick={handleBeginSetup}
              disabled={isRestoring}
              className="group bg-mint-500 hover:bg-mint-600 text-white font-semibold text-lg px-12 py-4 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              Begin Setup
              <svg
                className="w-6 h-6 group-hover:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </button>

            {/* Restore from Backup Option */}
            <div className="w-full max-w-md">
              {!showRestoreOption ? (
                <button
                  onClick={() => setShowRestoreOption(true)}
                  disabled={isRestoring}
                  className="text-sm text-gray-600 hover:text-mint-600 underline transition-colors disabled:opacity-50"
                >
                  or restore from a backup file
                </button>
              ) : (
                <div className="mt-4 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
                  <div className="flex items-start gap-2 mb-3">
                    <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-blue-800">
                      If you have a backup file from a previous installation, you can restore it here. This will skip the setup process.
                    </p>
                  </div>

                  <label
                    htmlFor="backup-file"
                    className={`flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg cursor-pointer transition-colors ${
                      isRestoring ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    <Upload className="h-4 w-4" />
                    {isRestoring ? 'Restoring...' : 'Choose Backup File'}
                  </label>
                  <input
                    id="backup-file"
                    type="file"
                    accept=".sqlite,.db"
                    onChange={handleRestoreBackup}
                    disabled={isRestoring}
                    className="hidden"
                  />

                  <button
                    onClick={() => setShowRestoreOption(false)}
                    disabled={isRestoring}
                    className="mt-2 text-xs text-gray-500 hover:text-gray-700 underline"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Feature highlights */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-10 h-10 bg-mint-100 rounded-full flex items-center justify-center">
                <span className="text-xl">🔒</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">Privacy First</h3>
                <p className="text-sm text-gray-600">Your data stays on your server</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-10 h-10 bg-coral-100 rounded-full flex items-center justify-center">
                <span className="text-xl">👨‍👩‍👧</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">Family Friendly</h3>
                <p className="text-sm text-gray-600">Multiple users and babies</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-10 h-10 bg-sunny-100 rounded-full flex items-center justify-center">
                <span className="text-xl">📊</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">Track Everything</h3>
                <p className="text-sm text-gray-600">Feeding, sleep, health & more</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer note */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Setup takes just a few minutes
        </p>
      </div>
    </div>
  );
};

export default WelcomePage;
