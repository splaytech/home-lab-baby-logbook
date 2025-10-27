import { useState, useEffect } from 'react';
import { Eye, EyeOff, Check, X } from 'lucide-react';
import DinosaurDoctor from '../DinosaurDoctor';
import {
  validatePassword,
  validateUsername,
  validateEmail,
  validateDisplayName,
  getPasswordStrengthLabel,
} from '../../utils/validation';

const AdminAccountStep = ({ onNext, onSkip, initialData }) => {
  const [formData, setFormData] = useState({
    username: initialData?.username || '',
    displayName: initialData?.displayName || '',
    email: initialData?.email || '',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});

  const passwordValidation = validatePassword(formData.password);
  const passwordStrength = getPasswordStrengthLabel(passwordValidation.strength);

  useEffect(() => {
    const newErrors = {};

    if (touched.username) {
      const usernameValidation = validateUsername(formData.username);
      if (!usernameValidation.isValid) {
        newErrors.username = Object.values(usernameValidation.errors).find(Boolean);
      }
    }

    if (touched.displayName) {
      const displayNameValidation = validateDisplayName(formData.displayName);
      if (!displayNameValidation.isValid) {
        newErrors.displayName = Object.values(displayNameValidation.errors).find(Boolean);
      }
    }

    if (touched.email && formData.email) {
      const emailValidation = validateEmail(formData.email);
      if (!emailValidation.isValid) {
        newErrors.email = emailValidation.error;
      }
    }

    if (touched.password && !passwordValidation.isValid) {
      newErrors.password = 'Password does not meet requirements';
    }

    if (touched.confirmPassword && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
  }, [formData, touched, passwordValidation.isValid]);

  const handleChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  const handleBlur = (field) => () => {
    setTouched({ ...touched, [field]: true });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const allTouched = {
      username: true,
      displayName: true,
      email: true,
      password: true,
      confirmPassword: true,
    };
    setTouched(allTouched);

    if (
      !validateUsername(formData.username).isValid ||
      !validateDisplayName(formData.displayName).isValid ||
      (formData.email && !validateEmail(formData.email).isValid) ||
      !passwordValidation.isValid ||
      formData.password !== formData.confirmPassword
    ) {
      return;
    }

    onNext(formData);
  };

  const isFormValid =
    formData.username &&
    formData.displayName &&
    formData.password &&
    formData.confirmPassword &&
    validateUsername(formData.username).isValid &&
    validateDisplayName(formData.displayName).isValid &&
    (!formData.email || validateEmail(formData.email).isValid) &&
    passwordValidation.isValid &&
    formData.password === formData.confirmPassword;

  return (
    <div className="max-w-xl mx-auto">
      {/* Dinosaur mascot with message */}
      <div className="mb-8 flex justify-center">
        <DinosaurDoctor
          className="w-32 h-32"
          message="Great! Let's create your admin account!"
        />
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Username */}
        <div>
          <label htmlFor="username" className="block text-sm font-semibold text-gray-700 mb-2">
            Username <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="username"
            value={formData.username}
            onChange={handleChange('username')}
            onBlur={handleBlur('username')}
            className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 transition-colors ${
              errors.username
                ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                : 'border-gray-300 focus:border-mint-500 focus:ring-mint-200'
            }`}
            placeholder="admin"
          />
          {errors.username ? (
            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
              <X className="w-4 h-4" /> {errors.username}
            </p>
          ) : (
            <p className="mt-1 text-xs text-gray-500">Must be 3-20 characters</p>
          )}
        </div>

        {/* Display Name */}
        <div>
          <label htmlFor="displayName" className="block text-sm font-semibold text-gray-700 mb-2">
            Display Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="displayName"
            value={formData.displayName}
            onChange={handleChange('displayName')}
            onBlur={handleBlur('displayName')}
            className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 transition-colors ${
              errors.displayName
                ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                : 'border-gray-300 focus:border-mint-500 focus:ring-mint-200'
            }`}
            placeholder="Sarah Johnson"
          />
          {errors.displayName ? (
            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
              <X className="w-4 h-4" /> {errors.displayName}
            </p>
          ) : (
            <p className="mt-1 text-xs text-gray-500">Your full name</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
            Email <span className="text-gray-400 text-xs">(optional)</span>
          </label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={handleChange('email')}
            onBlur={handleBlur('email')}
            className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 transition-colors ${
              errors.email
                ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                : 'border-gray-300 focus:border-mint-500 focus:ring-mint-200'
            }`}
            placeholder="sarah@email.com"
          />
          {errors.email ? (
            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
              <X className="w-4 h-4" /> {errors.email}
            </p>
          ) : (
            <p className="mt-1 text-xs text-gray-500">For password resets and reminders</p>
          )}
        </div>

        {/* Password */}
        <div>
          <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
            Password <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              value={formData.password}
              onChange={handleChange('password')}
              onBlur={handleBlur('password')}
              className={`w-full px-4 py-3 pr-12 border-2 rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                errors.password
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                  : 'border-gray-300 focus:border-mint-500 focus:ring-mint-200'
              }`}
              placeholder="••••••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          {/* Password strength and requirements */}
          {formData.password && (
            <div className="mt-2 space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-600">Strength:</span>
                <span className={`text-xs font-semibold ${passwordStrength.color}`}>
                  {passwordStrength.label}
                </span>
              </div>
              <div className="space-y-1">
                <RequirementItem
                  met={passwordValidation.checks.minLength}
                  text="At least 8 characters"
                />
                <RequirementItem
                  met={passwordValidation.checks.hasUpperCase && passwordValidation.checks.hasLowerCase}
                  text="Contains uppercase and lowercase"
                />
                <RequirementItem met={passwordValidation.checks.hasNumber} text="Contains a number" />
              </div>
            </div>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            Confirm Password <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              id="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange('confirmPassword')}
              onBlur={handleBlur('confirmPassword')}
              className={`w-full px-4 py-3 pr-12 border-2 rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                errors.confirmPassword
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                  : 'border-gray-300 focus:border-mint-500 focus:ring-mint-200'
              }`}
              placeholder="••••••••••••"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
              <X className="w-4 h-4" /> {errors.confirmPassword}
            </p>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex gap-4 pt-4">
          <button
            type="button"
            onClick={onSkip}
            className="px-6 py-3 text-gray-600 hover:text-gray-800 font-medium transition-colors"
          >
            Skip for Now
          </button>
          <button
            type="submit"
            disabled={!isFormValid}
            className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all ${
              isFormValid
                ? 'bg-mint-500 hover:bg-mint-600 text-white shadow-lg hover:shadow-xl'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Continue →
          </button>
        </div>
      </form>
    </div>
  );
};

const RequirementItem = ({ met, text }) => (
  <div className="flex items-center gap-2 text-xs">
    {met ? (
      <Check className="w-4 h-4 text-green-600" />
    ) : (
      <div className="w-4 h-4 rounded-full border-2 border-gray-300" />
    )}
    <span className={met ? 'text-green-600' : 'text-gray-600'}>{text}</span>
  </div>
);

export default AdminAccountStep;
