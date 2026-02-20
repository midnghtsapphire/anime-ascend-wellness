/**
 * Anime Ascend Wellness — Brand Configuration
 * Coming-of-age anime-inspired wellness and life-skills platform
 * Design: Glassmorphism with neon accents, anime aesthetics
 */

export const brandConfig = {
  // App Identity
  name: 'Anime Ascend',
  tagline: 'Your Journey to Growth',
  description: 'Transform your life through anime-inspired wellness, habit tracking, and personal growth.',

  // Color Palette (anime-inspired, warm tones for blue light filter compatibility)
  colors: {
    // Primary: Warm teal (anime-inspired, calming)
    primary: '#14b8a6', // teal-500
    primaryLight: '#2dd4bf', // teal-300
    primaryDark: '#0d9488', // teal-700

    // Accent: Neon pink/magenta (anime energy)
    accent: '#ec4899', // pink-500
    accentLight: '#f472b6', // pink-400
    accentDark: '#be185d', // pink-700

    // Secondary: Warm amber (sunset, growth)
    secondary: '#f59e0b', // amber-500
    secondaryLight: '#fbbf24', // amber-400
    secondaryDark: '#d97706', // amber-600

    // Neutral: Dark slate for dark mode
    background: '#0f172a', // slate-900
    surface: '#1e293b', // slate-800
    surfaceLight: '#334155', // slate-700
    text: '#f1f5f9', // slate-100
    textMuted: '#cbd5e1', // slate-300

    // Status
    success: '#10b981', // emerald-500
    warning: '#f59e0b', // amber-500
    error: '#ef4444', // red-500
    info: '#06b6d4', // cyan-500
  },

  // Typography
  fonts: {
    heading: "'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    body: "'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },

  // Navigation Structure
  navigation: [
    { id: 'home', label: 'Home', path: '/', icon: 'home' },
    { id: 'dashboard', label: 'Dashboard', path: '/dashboard', icon: 'layout-grid' },
    { id: 'discover', label: 'Discover', path: '/discover', icon: 'compass' },
    { id: 'habits', label: 'Habits', path: '/habits', icon: 'target' },
    { id: 'journal', label: 'Journal', path: '/journal', icon: 'book-open' },
    { id: 'meditation', label: 'Meditation', path: '/meditation', icon: 'wind' },
    { id: 'goals', label: 'Goals', path: '/goals', icon: 'star' },
    { id: 'community', label: 'Community', path: '/community', icon: 'users' },
    { id: 'ai-coach', label: 'AI Coach', path: '/ai-coach', icon: 'sparkles' },
  ],

  // Feature Categories (for Discover page)
  categories: [
    { id: 'wellness', label: 'Wellness', color: '#14b8a6', icon: 'heart' },
    { id: 'mindfulness', label: 'Mindfulness', color: '#06b6d4', icon: 'wind' },
    { id: 'productivity', label: 'Productivity', color: '#f59e0b', icon: 'zap' },
    { id: 'relationships', label: 'Relationships', color: '#ec4899', icon: 'users' },
    { id: 'creativity', label: 'Creativity', color: '#a855f7', icon: 'palette' },
    { id: 'growth', label: 'Personal Growth', color: '#10b981', icon: 'trending-up' },
  ],

  // Mood Options (for mood tracking)
  moods: [
    { id: 'energized', label: 'Energized', emoji: '⚡', color: '#fbbf24' },
    { id: 'calm', label: 'Calm', emoji: '🌊', color: '#14b8a6' },
    { id: 'focused', label: 'Focused', emoji: '🎯', color: '#f59e0b' },
    { id: 'creative', label: 'Creative', emoji: '✨', color: '#a855f7' },
    { id: 'grateful', label: 'Grateful', emoji: '🙏', color: '#10b981' },
    { id: 'anxious', label: 'Anxious', emoji: '😰', color: '#ef4444' },
    { id: 'tired', label: 'Tired', emoji: '😴', color: '#6366f1' },
    { id: 'neutral', label: 'Neutral', emoji: '😐', color: '#cbd5e1' },
  ],

  // Habit Categories
  habitCategories: [
    { id: 'health', label: 'Health & Fitness', icon: 'activity' },
    { id: 'learning', label: 'Learning', icon: 'book' },
    { id: 'creativity', label: 'Creativity', icon: 'palette' },
    { id: 'mindfulness', label: 'Mindfulness', icon: 'wind' },
    { id: 'social', label: 'Social', icon: 'users' },
    { id: 'productivity', label: 'Productivity', icon: 'zap' },
  ],

  // Pricing Tiers
  pricing: {
    free: {
      name: 'Free',
      price: 0,
      tokens: 5,
      features: [
        'Basic habit tracking',
        'Mood logging',
        'Journal entries (limited)',
        'Community access',
        '5 AI coach messages/month',
      ],
    },
    premium: {
      name: 'Premium',
      price: 9.99,
      tokens: 50,
      features: [
        'Everything in Free',
        'Advanced analytics',
        'Guided meditations',
        'Goal tracking',
        '50 AI coach messages/month',
        'Priority support',
      ],
    },
    pro: {
      name: 'Pro',
      price: 19.99,
      tokens: 200,
      features: [
        'Everything in Premium',
        'Personalized recommendations',
        'Custom meditation sessions',
        'Advanced goal planning',
        '200 AI coach messages/month',
        'Early access to new features',
        'VIP community access',
      ],
    },
  },

  // SEO
  seo: {
    title: 'Anime Ascend | Wellness & Personal Growth Through Anime-Inspired Habits',
    description: 'Transform your life with Anime Ascend. Track habits, meditate, journal, and grow with anime-inspired wellness tools. Join a community of people on their personal growth journey.',
    keywords: [
      'anime wellness',
      'habit tracker',
      'personal growth',
      'meditation app',
      'journaling',
      'mood tracking',
      'life skills',
      'coming-of-age',
      'anime community',
      'wellness app',
      'self-improvement',
      'mindfulness',
    ],
  },

  // Accessibility Modes
  accessibility: {
    wcagAAA: {
      name: 'WCAG AAA Compliance',
      description: 'Enhanced contrast, larger text, optimized for screen readers',
    },
    ecoCode: {
      name: 'ECO CODE',
      description: 'Low energy mode: dark backgrounds, reduced animations, minimal data',
    },
    neuroCode: {
      name: 'NEURO CODE',
      description: 'ADHD-friendly: reduced clutter, focus mode, simplified navigation',
    },
    dyslexic: {
      name: 'DYSLEXIC MODE',
      description: 'OpenDyslexic font, increased spacing, high contrast',
    },
    noBlueLight: {
      name: 'NO BLUE LIGHT',
      description: 'Warm color filter, removes blue wavelengths, night-safe',
    },
  },
};

export type BrandConfig = typeof brandConfig;
