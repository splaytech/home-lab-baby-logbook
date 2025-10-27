export const validatePassword = (password) => {
  const checks = {
    minLength: password.length >= 8,
    hasUpperCase: /[A-Z]/.test(password),
    hasLowerCase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };

  const strength = Object.values(checks).filter(Boolean).length;

  return {
    checks,
    strength,
    isValid: checks.minLength && checks.hasUpperCase && checks.hasLowerCase && checks.hasNumber,
  };
};

export const getPasswordStrengthLabel = (strength) => {
  if (strength <= 2) return { label: 'Weak', color: 'text-red-600' };
  if (strength === 3) return { label: 'Fair', color: 'text-yellow-600' };
  if (strength === 4) return { label: 'Good', color: 'text-blue-600' };
  return { label: 'Strong', color: 'text-green-600' };
};

export const validateUsername = (username) => {
  const minLength = username.length >= 3;
  const maxLength = username.length <= 20;
  const validChars = /^[a-zA-Z0-9_-]+$/.test(username);

  return {
    isValid: minLength && maxLength && validChars,
    errors: {
      minLength: !minLength ? 'Username must be at least 3 characters' : null,
      maxLength: !maxLength ? 'Username must be no more than 20 characters' : null,
      validChars: !validChars ? 'Username can only contain letters, numbers, hyphens, and underscores' : null,
    },
  };
};

export const validateEmail = (email) => {
  if (!email) return { isValid: true, error: null };

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isValid = emailRegex.test(email);

  return {
    isValid,
    error: !isValid ? 'Please enter a valid email address' : null,
  };
};

export const validateDisplayName = (name) => {
  const minLength = name.length >= 2;
  const maxLength = name.length <= 50;

  return {
    isValid: minLength && maxLength,
    errors: {
      minLength: !minLength ? 'Display name must be at least 2 characters' : null,
      maxLength: !maxLength ? 'Display name must be no more than 50 characters' : null,
    },
  };
};
