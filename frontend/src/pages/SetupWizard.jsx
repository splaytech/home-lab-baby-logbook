import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import StepIndicator from '../components/StepIndicator';
import AdminAccountStep from '../components/setup/AdminAccountStep';
import useAppStore from '../store/useAppStore';
import { createAdminAccount, completeSetup } from '../services/api';

const SETUP_STEPS = [
  {
    label: 'Admin',
    shortLabel: 'Admin',
    icon: '👤',
    title: 'Create Administrator Account',
    description: 'This account will have full access to manage users, settings, and all baby records.',
  },
  {
    label: 'Household',
    shortLabel: 'House',
    icon: '🏠',
    title: 'Household Information',
    description: 'Set up your household details.',
  },
  {
    label: 'Baby',
    shortLabel: 'Baby',
    icon: '👶',
    title: 'Add Your First Baby',
    description: 'Add your baby\'s information.',
  },
  {
    label: 'Done',
    shortLabel: 'Done',
    icon: '✓',
    title: 'Setup Complete',
    description: 'You\'re all set!',
  },
];

const SetupWizard = () => {
  const navigate = useNavigate();
  const { setupStep, setupData, setSetupStep, updateSetupData, completeSetup: completeStoreSetup } = useAppStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNextStep = async (stepName, data) => {
    updateSetupData(stepName, data);

    if (setupStep === 0) {
      // Admin account step - create the admin account
      setIsSubmitting(true);
      try {
        await createAdminAccount(data);
        toast.success('Admin account created successfully!');
        setSetupStep(setupStep + 1);
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to create admin account');
      } finally {
        setIsSubmitting(false);
      }
    } else if (setupStep === SETUP_STEPS.length - 2) {
      // Last data collection step - complete setup
      setIsSubmitting(true);
      try {
        await completeSetup({ ...setupData, [stepName]: data });
        toast.success('Setup completed successfully!');
        completeStoreSetup();
        navigate('/login');
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to complete setup');
      } finally {
        setIsSubmitting(false);
      }
    } else {
      // Intermediate steps
      setSetupStep(setupStep + 1);
    }
  };

  const handlePreviousStep = () => {
    if (setupStep > 0) {
      setSetupStep(setupStep - 1);
    }
  };

  const handleSkipStep = () => {
    if (setupStep === 0) {
      // For admin account, redirect to login instead
      toast.info('You can set up your account later from the login page');
      navigate('/login');
    } else {
      setSetupStep(setupStep + 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-50 via-mint-50 to-coral-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-mint-700 mb-2">
            Baby Logbook Setup
          </h1>
          <p className="text-gray-600">Step {setupStep + 1} of {SETUP_STEPS.length}</p>
        </div>

        {/* Step Indicator */}
        <StepIndicator currentStep={setupStep} steps={SETUP_STEPS} />

        {/* Step Content */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-10 mt-8">
          {setupStep === 0 && (
            <AdminAccountStep
              onNext={(data) => handleNextStep('admin', data)}
              onSkip={handleSkipStep}
              initialData={setupData.admin}
            />
          )}

          {setupStep === 1 && (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">Household setup step (to be implemented)</p>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={handlePreviousStep}
                  className="px-6 py-3 text-gray-600 hover:text-gray-800 font-medium transition-colors"
                >
                  ← Back
                </button>
                <button
                  onClick={() => handleNextStep('household', {})}
                  className="px-6 py-3 bg-mint-500 hover:bg-mint-600 text-white rounded-lg font-semibold"
                >
                  Continue →
                </button>
              </div>
            </div>
          )}

          {setupStep === 2 && (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">Baby information step (to be implemented)</p>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={handlePreviousStep}
                  className="px-6 py-3 text-gray-600 hover:text-gray-800 font-medium transition-colors"
                >
                  ← Back
                </button>
                <button
                  onClick={() => handleNextStep('baby', {})}
                  disabled={isSubmitting}
                  className="px-6 py-3 bg-mint-500 hover:bg-mint-600 text-white rounded-lg font-semibold disabled:opacity-50"
                >
                  {isSubmitting ? 'Completing...' : 'Complete Setup →'}
                </button>
              </div>
            </div>
          )}

          {setupStep === 3 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Setup Complete!</h2>
              <p className="text-gray-600 mb-8">
                Your Baby Logbook is ready to use.
              </p>
              <button
                onClick={() => navigate('/login')}
                className="px-8 py-3 bg-mint-500 hover:bg-mint-600 text-white rounded-lg font-semibold shadow-lg"
              >
                Go to Login
              </button>
            </div>
          )}
        </div>

        {/* Progress indicator at bottom */}
        {setupStep < SETUP_STEPS.length - 1 && (
          <div className="text-center mt-6 text-sm text-gray-500">
            {setupStep + 1} of {SETUP_STEPS.length} steps completed
          </div>
        )}
      </div>
    </div>
  );
};

export default SetupWizard;
