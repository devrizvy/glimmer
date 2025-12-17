import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Shield, User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, NavLink } from 'react-router-dom';

const Login: React.FC = () => {
  const { loginWithToken, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/chat');
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Call your backend login endpoint
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      });

      const data = await response.json();

      if (response.ok) {
        // Store token in localStorage (you might want to use httpOnly cookies in production)
        localStorage.setItem('zenwhisper_token', data.token);

        // Update auth context with token
        loginWithToken(data.userInfo, data.token);

        navigate('/chat');
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('Connection error. Please try again.');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen zen-pattern chat-container flex items-center justify-center p-6">
      <div className="w-full max-w-3xl">
        {/* Logo and title */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 glass-panel rounded-2xl flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8" style={{ color: 'oklch(0.65 0.12 155)' }} />
          </div>
          <h1 className="zen-title text-3xl mb-2">
            zenWhisper
          </h1>
          <p className="text-sidebar-foreground/60 text-sm">
            Educational platform for students and teachers
          </p>
        </div>

        {/* Login form */}
        <div className="glass-panel rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email field */}
            <div className="space-y-2">
              <label className="text-sidebar-foreground text-sm font-medium">
                Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="zen-search w-full px-4 py-3 rounded-xl text-sidebar-foreground placeholder-sidebar-foreground/40 focus:outline-none transition-all"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Password field */}
            <div className="space-y-2">
              <label className="text-sidebar-foreground text-sm font-medium">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="zen-search w-full px-4 py-3 rounded-xl text-sidebar-foreground placeholder-sidebar-foreground/40 focus:outline-none transition-all pr-12"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sidebar-foreground/60 hover:text-sidebar-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Error message */}
            {error && (
              <div className="p-3 rounded-xl border border-destructive/50 bg-destructive/10">
                <p className="text-destructive text-sm">{error}</p>
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 text-primary-foreground font-medium rounded-xl zen-action-btn disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              style={{
                background: 'oklch(0.65 0.12 155)',
                boxShadow: '0 4px 20px oklch(0.65 0.12 155 / 0.3)'
              }}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin"></div>
                  <span>Signing in...</span>
                </>
              ) : (
                <span>Sign In</span>
              )}
            </button>
          </form>

          {/* Security note */}
          <div className="mt-6 pt-6 zen-separator">
            <div className="flex items-center justify-center gap-2 text-sidebar-foreground/60 text-xs">
              <Shield className="w-3 h-3" />
              <span>Secure login for educational purposes</span>
            </div>
          </div>
        </div>

        {/* Signup link */}
        <div className="text-center mt-8">
          <p className="text-sidebar-foreground/60 text-sm">
            Don't have an account?{' '}
            <NavLink
              to="/signup"
              className="text-primary hover:text-primary-foreground transition-colors font-medium"
            >
              Sign up here
            </NavLink>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;