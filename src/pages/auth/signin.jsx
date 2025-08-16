import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Icon from '../../components/AppIcon';

const SignIn = () => {
  const navigate = useNavigate();
  const { signIn, user, loading, authError, clearAuthError } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (user && !loading) {
      navigate('/user-dashboard');
    }
  }, [user, loading, navigate]);

  // Clear auth error when component mounts or form changes
  useEffect(() => {
    clearAuthError();
  }, [formData]);

  const handleInputChange = (e) => {
    const { name, value } = e?.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!formData?.email?.trim() || !formData?.password?.trim()) {
      return;
    }

    setIsSigningIn(true);
    
    try {
      const result = await signIn(formData?.email, formData?.password);
      
      if (result?.success) {
        navigate('/user-dashboard');
      }
    } catch (error) {
      console.log('Sign in error:', error);
    } finally {
      setIsSigningIn(false);
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
          <h2 className="text-3xl font-bold text-foreground">Welcome back</h2>
          <p className="mt-2 text-muted-foreground">
            Sign in to your CogniSite AI account
          </p>
        </div>

        {/* Sign In Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
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
                disabled={isSigningIn}
              />
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
                  autoComplete="current-password"
                  required
                  placeholder="Enter your password"
                  value={formData?.password}
                  onChange={handleInputChange}
                  disabled={isSigningIn}
                  className="pr-12"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isSigningIn}
                >
                  <Icon 
                    name={showPassword ? "EyeOff" : "Eye"} 
                    size={18} 
                    color="var(--color-muted-foreground)"
                  />
                </button>
              </div>
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
            disabled={isSigningIn || !formData?.email?.trim() || !formData?.password?.trim()}
            className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
            iconName={isSigningIn ? "Loader2" : null}
            iconPosition="left"
          >
            {isSigningIn ? 'Signing in...' : 'Sign in'}
          </Button>

          {/* Links */}
          <div className="flex items-center justify-between text-sm">
            <Link
              to="/auth/signup"
              className="text-primary hover:text-primary/80 font-medium"
            >
              Don't have an account? Sign up
            </Link>
            
            <Link
              to="/auth/forgot-password"
              className="text-muted-foreground hover:text-foreground"
            >
              Forgot password?
            </Link>
          </div>

          {/* Demo Account Info */}
          <div className="mt-6 p-4 bg-muted/50 rounded-lg border border-border">
            <div className="flex items-start space-x-3">
              <Icon name="Info" size={16} color="var(--color-primary)" className="mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-foreground mb-1">Demo Account</p>
                <p className="text-xs text-muted-foreground">
                  Email: john.doe@example.com<br />
                  Password: password123
                </p>
              </div>
            </div>
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

export default SignIn;