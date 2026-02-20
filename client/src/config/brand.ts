/**
 * Anime Ascend — Brand Configuration
 * Health & Wellness Companion with anime-inspired Japanese minimalism
 * Design: White background, cherry blossom accents, chibi mascot guide
 * PRIMARY: Health monitoring (heart, stress, fall detection, companion mode)
 * SECONDARY: Habits, journal, meditation, goals
 */

export const brandConfig = {
  name: 'Anime Ascend',
  tagline: 'Your Health & Wellness Companion',
  description: 'Monitor your heart health, detect stress episodes, and stay safe with fall detection — guided by your chibi companion through every moment.',

  colors: {
    // Sakura pink (primary)
    primary: '#e8729a',
    primaryLight: '#f5a3c0',
    primaryDark: '#c4507a',

    // Bamboo green (health/calm)
    secondary: '#7ab87a',
    secondaryLight: '#a8d4a8',
    secondaryDark: '#5a8f5a',

    // Warm amber (alerts)
    alert: '#e8a849',
    alertLight: '#f5c97a',
    alertDark: '#c48a30',

    // Heart red (health monitoring)
    heart: '#d4556b',
    heartLight: '#e88a9a',
    heartDark: '#b03050',

    // White background
    background: '#fefefe',
    surface: '#ffffff',
    surfaceLight: '#fdf2f4',
    text: '#3d2b2e',
    textMuted: '#8a7075',

    // Status
    success: '#7ab87a',
    warning: '#e8a849',
    error: '#d4556b',
    info: '#7ab8c4',
  },

  fonts: {
    heading: "'Quicksand', 'Noto Sans JP', sans-serif",
    body: "'Quicksand', 'Noto Sans JP', sans-serif",
  },

  // Navigation — Health features FIRST
  navigation: {
    primary: [
      { id: 'home', label: 'Home', path: '/', icon: 'home' },
      { id: 'health', label: 'Health Monitor', path: '/health', icon: 'heart-pulse' },
      { id: 'companion', label: 'Companion', path: '/companion', icon: 'sparkles' },
      { id: 'emergency', label: 'Emergency', path: '/emergency', icon: 'shield-alert' },
    ],
    secondary: [
      { id: 'dashboard', label: 'Dashboard', path: '/dashboard', icon: 'layout-grid' },
      { id: 'habits', label: 'Habits', path: '/habits', icon: 'target' },
      { id: 'journal', label: 'Journal', path: '/journal', icon: 'book-open' },
      { id: 'meditation', label: 'Meditation', path: '/meditation', icon: 'wind' },
      { id: 'goals', label: 'Goals', path: '/goals', icon: 'star' },
      { id: 'discover', label: 'Discover', path: '/discover', icon: 'compass' },
    ],
  },

  // Health monitoring categories
  healthCategories: [
    { id: 'heart', label: 'Heart Monitor', color: '#d4556b', icon: 'heart-pulse', description: 'PPG-based heart rate and arrhythmia detection' },
    { id: 'stress', label: 'Stress Detection', color: '#e8a849', icon: 'brain', description: 'Biometric stress level monitoring' },
    { id: 'fall', label: 'Fall Detection', color: '#7ab8c4', icon: 'shield-alert', description: 'Accelerometer-based fall detection and alerts' },
    { id: 'exercise', label: 'Guided Exercises', color: '#7ab87a', icon: 'activity', description: 'Companion-guided recovery exercises' },
  ],

  // Chibi mascot
  mascot: {
    name: 'Hana',
    description: 'Your chibi wellness companion who guides you through exercises and stays with you during health episodes',
    personality: 'Gentle, encouraging, calm during emergencies, celebrates your progress',
  },

  // Moods
  moods: [
    { id: 'energized', label: 'Energized', emoji: '✨', color: '#e8a849' },
    { id: 'calm', label: 'Calm', emoji: '🌸', color: '#e8729a' },
    { id: 'focused', label: 'Focused', emoji: '🎯', color: '#7ab87a' },
    { id: 'grateful', label: 'Grateful', emoji: '🙏', color: '#7ab8c4' },
    { id: 'anxious', label: 'Anxious', emoji: '💭', color: '#d4556b' },
    { id: 'tired', label: 'Tired', emoji: '🌙', color: '#8a7075' },
    { id: 'neutral', label: 'Neutral', emoji: '🍃', color: '#a8d4a8' },
  ],

  // Pricing
  pricing: {
    free: {
      name: 'Blossom',
      price: 0,
      tokens: 5,
      features: [
        'Basic heart rate monitoring',
        'Daily mood check-in',
        'Fall detection alerts',
        '3 guided exercises/month',
        '5 AI companion messages/month',
      ],
    },
    premium: {
      name: 'Sakura',
      price: 9.99,
      tokens: 50,
      features: [
        'Everything in Blossom',
        'Advanced arrhythmia detection',
        'Stress episode monitoring',
        'Unlimited guided exercises',
        '50 AI companion messages/month',
        'Emergency contact alerts',
        'Health history & analytics',
      ],
    },
    pro: {
      name: 'Zenith',
      price: 19.99,
      tokens: 200,
      features: [
        'Everything in Sakura',
        'Real-time HRV analysis',
        'Predictive health alerts',
        '200 AI companion messages/month',
        'Priority emergency response',
        'Family health dashboard',
        'Export health reports (PDF)',
        'API access for integrations',
      ],
    },
  },

  seo: {
    title: 'Anime Ascend | Health Monitoring & Wellness Companion',
    description: 'Monitor heart health, detect stress episodes, and stay safe with fall detection. Your anime-inspired chibi companion guides you through every wellness moment.',
    keywords: [
      'heart rate monitor',
      'arrhythmia detection',
      'stress detection app',
      'fall detection',
      'wellness companion',
      'health monitoring',
      'guided exercises',
      'anime wellness',
      'PPG heart monitor',
      'emergency alerts',
      'elderly care',
      'health tracking',
    ],
  },

  accessibility: {
    wcagAAA: { name: 'WCAG AAA Compliance', description: 'Enhanced contrast, larger text, screen reader optimized' },
    ecoCode: { name: 'ECO CODE', description: 'Low energy: dark backgrounds, no animations, minimal data' },
    neuroCode: { name: 'NEURO CODE', description: 'ADHD-friendly: reduced clutter, focus mode, simplified UI' },
    dyslexic: { name: 'DYSLEXIC MODE', description: 'OpenDyslexic font, increased spacing, high contrast' },
    noBlueLight: { name: 'NO BLUE LIGHT', description: 'Warm filter, removes blue wavelengths, night-safe' },
  },
};

export type BrandConfig = typeof brandConfig;
