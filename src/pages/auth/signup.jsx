import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Icon from '../../components/AppIcon';

const SignUp = () => {
  const navigate = useNavigate();
  const { signUp, user, loading, authError, clearAuthError } = useAuth();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  // Redirect if already authenticated
  useEffect(() => {
    if (user && !loading) {
      navigate('/user-dashboard');
    }
  }, [user, loading, navigate]);

  // Clear auth error when component mounts or form changes
  useEffect(() => {
    clearAuthError();
    setValidationErrors({});
  }, [formData]);

  const handleInputChange = (e) => {
    const { name, value } = e?.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    const errors = {};

    // Full name validation
    if (!formData?.fullName?.trim()) {
      errors.fullName = 'Full name is required';
    }

    // Email validation
    if (!formData?.email?.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/?.test(formData?.email)) {
      errors.email = 'Please enter a valid email';
    }

    // Password validation
    if (!formData?.password) {
      errors.password = 'Password is required';
    } else if (formData?.password?.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    // Confirm password validation
    if (!formData?.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (formData?.password !== formData?.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    setValidationErrors(errors);
    return Object.keys(errors)?.length === 0;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSigningUp(true);
    
    try {
      const result = await signUp(formData?.email, formData?.password, formData?.fullName);
      
      if (result?.success) {
        if (result?.needsConfirmation) {
          // Show confirmation message
          alert('Please check your email for confirmation link');
        } else {
          navigate('/user-dashboard');
        }
      }
    } catch (error) {
      console.log('Sign up error:', error);
    } finally {
      setIsSigningUp(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-primary to-accent rounded-xl flex items-center justify-center">
              <Icon name="Zap" size={24} color="white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-foreground">Create account</h2>
          <p className="mt-2 text-muted-foreground">
            Start analyzing websites with AI
          </p>
        </div>

        {/* Sign Up Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Full Name Field */}
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-foreground mb-1">
                Full name
              </label>
              <Input
                id="fullName"
                name="fullName"
                type="text"
                autoComplete="name"
                required
                placeholder="Enter your full name"
                value={formData?.fullName}
                onChange={handleInputChange}
                disabled={isSigningUp}
                className={validationErrors?.fullName ? 'border-destructive focus:border-destructive' : ''}
              />
              {validationErrors?.fullName && (
                <p className="mt-1 text-sm text-destructive">{validationErrors?.fullName}</p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1">
                Email address
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="Enter your email"
                value={formData?.email}
                onChange={handleInputChange}
                disabled={isSigningUp}
                className={validationErrors?.email ? 'border-destructive focus:border-destructive' : ''}
              />
              {validationErrors?.email && (
                <p className="mt-1 text-sm text-destructive">{validationErrors?.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-foreground mb-1">
                Password
              </label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  placeholder="Enter your password"
                  value={formData?.password}
                  onChange={handleInputChange}
                  disabled={isSigningUp}
                  className={`pr-12 ${validationErrors?.password ? 'border-destructive focus:border-destructive' : ''}`}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isSigningUp}
                >
                  <Icon 
                    name={showPassword ? "EyeOff" : "Eye"} 
                    size={18} 
                    color="var(--color-muted-foreground)"
                  />
                </button>
              </div>
              {validationErrors?.password && (
                <p className="mt-1 text-sm text-destructive">{validationErrors?.password}</p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground mb-1">
                Confirm password
              </label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  placeholder="Confirm your password"
                  value={formData?.confirmPassword}
                  onChange={handleInputChange}
                  disabled={isSigningUp}
                  className={`pr-12 ${validationErrors?.confirmPassword ? 'border-destructive focus:border-destructive' : ''}`}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={isSigningUp}
                >
                  <Icon 
                    name={showConfirmPassword ? "EyeOff" : "Eye"} 
                    size={18} 
                    color="var(--color-muted-foreground)"
                  />
                </button>
              </div>
              {validationErrors?.confirmPassword && (
                <p className="mt-1 text-sm text-destructive">{validationErrors?.confirmPassword}</p>
              )}
            </div>
          </div>

          {/* Error Message */}
          {authError && (
            <div className="flex items-center space-x-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
              <Icon name="AlertCircle" size={16} color="var(--color-destructive)" />
              <span className="text-sm text-destructive">{authError}</span>
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            variant="default"
            disabled={isSigningUp}
            className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
            iconName={isSigningUp ? "Loader2" : null}
            iconPosition="left"
          >
            {isSigningUp ? 'Creating account...' : 'Create account'}
          </Button>

          {/* Terms */}
          <p className="text-xs text-muted-foreground text-center">
            By creating an account, you agree to our{' '}
            <Link to="/terms" className="text-primary hover:text-primary/80">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link to="/privacy" className="text-primary hover:text-primary/80">
              Privacy Policy
            </Link>
          </p>

          {/* Links */}
          <div className="text-center">
            <Link
              to="/auth/signin"
              className="text-sm text-primary hover:text-primary/80 font-medium"
            >
              Already have an account? Sign in
            </Link>
          </div>
        </form>

        {/* Footer */}
        <div className="text-center">
          <Link
            to="/"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignUp;