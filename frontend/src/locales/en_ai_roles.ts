export default {
  // Existing translations remain unchanged...
  dashboard: {
    title: 'Dual Track Life Dashboard',
    welcome: 'Welcome back',
    stats: {
      totalEvents: 'Total Events',
      thisMonth: 'This Month',
      virtualLevel: 'Virtual Level',
      aiInsights: 'AI Insights'
    },
    quickActions: {
      addEvent: 'Add Event',
      aiRoles: 'AI Role Manager',
      simulate: 'Life Simulation',
      analyze: 'Analyze Trends',
      lifeAgent: 'Life Agent'
    },
    timeline: {
      title: 'Life Timeline',
      filter: 'Filter Events',
      search: 'Search events...',
      category: 'Select Category',
      allCategories: 'All Categories',
      noEvents: 'Start recording your life journey!',
      addFirstEvent: 'Add First Event',
      loading: 'Loading...',
      error: 'Failed to load'
    }
  },
  
  // New AI Roles translations
  aiRoles: {
    title: 'AI Role Manager',
    level: 'Relationship Level',
    conversations: 'conversations',
    setPrimary: 'Set as Primary',
    primary: 'Primary Mentor',
    recommended: 'Recommended Role',
    acceptRecommendation: 'Accept Recommendation',
    newConversation: 'New Conversation',
    switchRole: 'Switch Role',
    contextInfo: 'Conversation Context',
    
    types: {
      counselor: 'Counselor',
      philosopher: 'Philosopher',
      career_mentor: 'Career Mentor',
      life_coach: 'Life Coach',
      life_mentor: 'Life Mentor'
    },
    
    inputPlaceholder: {
      default: 'Start a conversation with AI role...',
      counselor: 'Share your feelings and concerns...',
      philosopher: 'Explore the meaning and values of life...',
      career_mentor: 'Discuss career planning and development...',
      life_coach: 'Talk about life habits and goals...',
      life_mentor: 'Seek guidance for life direction...'
    },
    
    suggestions: {
      counselor: {
        feeling: 'I\'ve been feeling...',
        stress: 'I\'m struggling with stress',
        relationship: 'My relationships are troubling me'
      },
      philosopher: {
        meaning: 'What is the meaning of life?',
        purpose: 'How do I find my purpose?',
        values: 'What values should I uphold?'
      },
      career_mentor: {
        career: 'My career development direction',
        skills: 'What skills should I improve?',
        goals: 'How to set career goals?'
      },
      life_coach: {
        habits: 'I want to build good habits',
        balance: 'How to balance work and life?',
        productivity: 'Ways to improve efficiency'
      },
      life_mentor: {
        direction: 'I feel lost about the future',
        decisions: 'Facing important decisions',
        growth: 'How to achieve personal growth?'
      }
    },
    
    recommendationReasons: {
      general: 'Recommended based on your recent activities'
    }
  }
}

