export default {
  // 通用
  common: {
    loading: 'Loading...',
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    add: 'Add',
    search: 'Search',
    filter: 'Filter',
    reset: 'Reset',
    confirm: 'Confirm',
    back: 'Back',
    next: 'Next',
    submit: 'Submit',
    close: 'Close',
    yes: 'Yes',
    no: 'No',
    ok: 'OK',
    error: 'Error',
    success: 'Success',
    warning: 'Warning',
    info: 'Info'
  },

  // 语言
  language: {
    english: 'English',
    chinese: '中文',
    switchLanguage: 'Switch Language'
  },

  // 导航
  nav: {
    home: 'Home',
    dashboard: 'Dashboard',
    login: 'Sign In',
    register: 'Sign Up',
    logout: 'Sign Out',
    profile: 'Profile',
    settings: 'Settings'
  },

  // 欢迎页面
  welcome: {
    title: 'Dual Track Life',
    subtitle: 'Record Reality, Explore Possibilities',
    description: 'An innovative life management platform that lets you record your real life journey while exploring infinite possibilities through AI-driven virtual life simulation.',
    getStarted: 'Get Started',
    tryDemo: 'Try Demo',
    learnMore: 'Learn More',
    
    // 功能介绍
    features: {
      title: 'Core Features',
      realLife: {
        title: 'Real Life Recording',
        description: 'Record your real life events including work achievements, personal growth, relationships and more.'
      },
      virtualLife: {
        title: 'Virtual Life Simulation',
        description: 'Explore different life choices and possibilities through AI-driven virtual life simulation.'
      },
      aiCoach: {
        title: 'AI Life Coach',
        description: 'Get personalized AI insights and recommendations to help you make better life decisions.'
      }
    },

    // 统计数据
    stats: {
      users: 'Users',
      events: 'Recorded Events',
      simulations: 'Virtual Simulations',
      insights: 'AI Insights'
    },

    // 行动召唤
    cta: {
      title: 'Start Your Dual Track Life Journey',
      description: 'Register now to start recording your real life and exploring infinite virtual possibilities.',
      register: 'Register Now',
      demo: 'Free Trial'
    }
  },

  // 认证
  auth: {
    // 登录
    login: {
      title: 'Sign In',
      subtitle: 'Welcome Back',
      username: 'Username or Email',
      password: 'Password',
      rememberMe: 'Remember Me',
      forgotPassword: 'Forgot Password?',
      loginButton: 'Sign In',
      noAccount: "Don't have an account?",
      signUp: 'Sign Up Now',
      demoLogin: 'Demo Login',
      loginSuccess: 'Login Successful',
      loginFailed: 'Login Failed'
    },

    // 注册
    register: {
      title: 'Sign Up',
      subtitle: 'Create Your Account',
      username: 'Username',
      email: 'Email Address',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      fullName: 'Full Name (Optional)',
      registerButton: 'Sign Up',
      hasAccount: 'Already have an account?',
      signIn: 'Sign In Now',
      registerSuccess: 'Registration Successful',
      registerFailed: 'Registration Failed',
      passwordMismatch: 'Passwords do not match',
      usernameRequired: 'Username is required',
      emailRequired: 'Email is required',
      passwordRequired: 'Password is required'
    }
  },

  // 控制台
  dashboard: {
    title: 'Dashboard',
    welcome: 'Welcome Back',
    demoMode: 'Demo Mode',
    demoDescription: 'You are using demo mode and can experience all features.',
    resetDemo: 'Reset Demo Data',

    // 统计卡片
    stats: {
      totalEvents: 'Total Events',
      thisMonth: 'This Month',
      aiInsights: 'AI Insights',
      virtualLevel: 'Virtual Level'
    },

    // 快速操作
    quickActions: {
      title: 'Quick Actions',
      addEvent: 'Add Life Event',
      aiRoles: 'AI Role Management',
      virtualSimulation: 'Virtual Life Simulation',
      viewAnalytics: 'View Analytics',
      parallelUniverses: 'Parallel Universes',
      memoryRecorder: 'Memory Recorder',
      lifeAgent: 'Life Agent'
    },

    // 事件时间轴
    timeline: {
      title: 'Event Timeline',
      noEvents: 'No events recorded',
      addFirstEvent: 'Add your first event',
      searchPlaceholder: 'Search your life events...',
      filterAll: 'All',
      filterWork: 'Work',
      filterPersonal: 'Personal',
      filterHealth: 'Health',
      filterLearning: 'Learning',
      filterRelationships: 'Relationships',
      filterEntertainment: 'Entertainment',
      filterTravel: 'Travel',
      filterFinance: 'Finance',
      importance: 'Importance',
      location: 'Location',
      emotion: 'Emotion',
      loading: 'Loading your timeline...'
    }
  },

  // 事件管理
  events: {
    title: 'Event Management',
    addEvent: 'Add Event',
    editEvent: 'Edit Event',
    deleteEvent: 'Delete Event',
    eventTitle: 'Event Title',
    eventDescription: 'Event Description',
    eventDate: 'Event Date',
    eventTime: 'Event Time',
    category: 'Category',
    importance: 'Importance',
    emotion: 'Emotion',
    location: 'Location',
    
    // 分类
    categories: {
      work: 'Work',
      personal: 'Personal',
      health: 'Health',
      learning: 'Learning',
      relationships: 'Relationships',
      entertainment: 'Entertainment',
      travel: 'Travel',
      finance: 'Finance'
    },

    // 情感
    emotions: {
      happy: 'Happy',
      excited: 'Excited',
      grateful: 'Grateful',
      proud: 'Proud',
      content: 'Content',
      neutral: 'Neutral',
      tired: 'Tired',
      stressed: 'Stressed',
      sad: 'Sad',
      angry: 'Angry',
      anxious: 'Anxious',
      disappointed: 'Disappointed'
    },

    // 消息
    eventSaved: 'Event Saved',
    eventDeleted: 'Event Deleted',
    confirmDelete: 'Are you sure you want to delete this event?',
    titleRequired: 'Please enter event title',
    dateRequired: 'Please select event date'
  },

  // 虚拟人生模拟
  virtualLife: {
    title: 'Virtual Life Simulation',
    subtitle: 'AI-Driven Life Exploration',
    description: 'Explore different life choices and possibilities through AI simulation',
    modes: {
      title: 'Simulation Mode',
      explore: 'Life Explorer',
      exploreDesc: 'Discover new possibilities',
      decision: 'Decision Maker',
      decisionDesc: 'Test important choices',
      goal: 'Goal Achiever',
      goalDesc: 'Plan your success path',
      adventure: 'Adventure Seeker',
      adventureDesc: 'Take bold risks'
    },
    personality: {
      title: 'AI Personality',
      riskTolerance: 'Risk Tolerance',
      conservative: 'Conservative',
      adventurous: 'Adventurous',
      creativity: 'Creativity Level',
      practical: 'Practical',
      imaginative: 'Imaginative',
      focusArea: 'Focus Area',
      balanced: 'Balanced Growth',
      career: 'Career Focus',
      relationships: 'Relationships',
      health: 'Health & Wellness',
      creativityArea: 'Creativity',
      adventure: 'Adventure'
    },
    stats: {
      title: 'Virtual Life Timeline',
      happiness: 'Happiness',
      success: 'Success',
      growth: 'Growth',
      experience: 'Experience'
    },
    scenario: {
      aiInsight: 'AI Insight',
      makeChoice: 'What would you do?',
      impact: 'Impact'
    },
    scenarioTemplates: {
      career_change: {
        title: 'Career Crossroads',
        description: "You've been offered a dream job in a different city, but it means leaving your current life behind.",
        aiInsight: 'This decision could significantly impact your professional growth. Consider the long-term benefits versus immediate comfort.',
        choices: [
          { text: 'Take the new job', consequence: 'Start fresh in a new environment' },
          { text: 'Stay in current position', consequence: 'Maintain stability but miss opportunity' },
          { text: 'Negotiate remote work', consequence: 'Try to get best of both worlds' }
        ]
      },
      relationship_choice: {
        title: 'Love vs. Logic',
        description: "You meet someone amazing, but they live on the other side of the world. Your heart says yes, but logic says it's complicated.",
        aiInsight: 'Relationships require both emotional and practical considerations. Long-distance can work with commitment from both sides.',
        choices: [
          { text: 'Pursue the relationship', consequence: 'Take a chance on love' },
          { text: 'Stay friends for now', consequence: 'Keep things simple' },
          { text: 'Plan to meet in person', consequence: 'Test the connection first' }
        ]
      },
      creative_pursuit: {
        title: 'Creative Calling',
        description: "You've always wanted to write a novel. You have a great idea, but it means sacrificing evenings and weekends for months.",
        aiInsight: 'Creative pursuits often require sacrifice but can lead to profound personal satisfaction and unexpected opportunities.',
        choices: [
          { text: 'Start writing immediately', consequence: 'Dive into your passion project' },
          { text: 'Plan and research first', consequence: 'Take a methodical approach' },
          { text: 'Join a writing group', consequence: 'Get support and accountability' }
        ]
      },
      health_challenge: {
        title: 'Wellness Wake-up Call',
        description: "Your doctor suggests major lifestyle changes. It's time to prioritize your health, but it means changing habits you've had for years.",
        aiInsight: 'Health is the foundation of everything else. Small, consistent changes often work better than dramatic overhauls.',
        choices: [
          { text: 'Complete lifestyle overhaul', consequence: 'Make dramatic changes immediately' },
          { text: 'Gradual improvements', consequence: 'Change one habit at a time' },
          { text: 'Hire a health coach', consequence: 'Get professional guidance' }
        ]
      },
      financial_opportunity: {
        title: 'Investment Dilemma',
        description: "A friend offers you a chance to invest in their startup. It could be huge, but you'd need to use your emergency savings.",
        aiInsight: 'High-risk investments can offer high rewards, but never invest more than you can afford to lose. Consider your risk tolerance.',
        choices: [
          { text: 'Invest the full amount', consequence: 'Go all-in on the opportunity' },
          { text: 'Invest a smaller amount', consequence: 'Participate but limit risk' },
          { text: 'Decline the investment', consequence: 'Keep your savings safe' }
        ]
      }
    },
    loading: 'Generating scenario... Please wait',
    analyzing: 'Analyzing your real life data...',
    actions: {
      randomScenario: 'Random Scenario',
      analyzeRealLife: 'Analyze Real Life',
      resetSimulation: 'Reset Simulation'
    },
    aiInsights: {
      riskComfort: 'Based on your {risk}% risk tolerance, this scenario aligns well with your comfort zone.',
      creativity: 'Your high creativity setting suggests you might find innovative solutions to this challenge.',
      focusArea: 'Given your focus on {focus}, this decision could significantly impact your goals.',
      balance: 'This scenario offers a good balance of risk and reward for your current life stage.',
      vision: 'Consider how this choice aligns with your long-term vision and values.'
    }
  },

  // AI生活教练
  aiCoach: {
    title: 'AI Life Coach',
    subtitle: 'Your Intelligent Life Advisor',
    
    // 洞察
    insights: {
      title: 'Personalized Insights',
      today: "Today's Insights",
      lifeBalance: 'Life Balance',
      patterns: 'Behavior Patterns',
      suggestions: 'Improvement Suggestions',
      trends: 'Trend Analysis',
      messages: {
        0: "You're heavily focused on {category}. Consider exploring other life areas for better balance.",
        1: 'I notice elevated stress levels in your recent events. Virtual life simulation could help explore stress-reduction strategies.',
        2: 'Many of your events have low importance ratings. Consider setting bigger, more meaningful goals.',
        3: 'Start tracking more diverse life events to get personalized insights and recommendations.'
      },
      categories: {
        Balance: 'Balance',
        Wellness: 'Wellness',
        Growth: 'Growth',
        'Getting Started': 'Getting Started',
        general: 'General'
      }
    },

    // 平衡评分
    balance: {
      title: 'Life Balance Score',
      work: 'Work',
      health: 'Health',
      relationships: 'Relationships',
      personal: 'Personal Development',
      entertainment: 'Entertainment'
    },

    // 建议类型
    suggestions: {
      improve: 'Improvement Suggestions',
      maintain: 'Maintain Current',
      explore: 'Explore Opportunities',
      balance: 'Balance Adjustment'
    }
  },

  // 错误消息
  errors: {
    networkError: 'Network Connection Error',
    serverError: 'Server Error',
    unauthorized: 'Unauthorized Access',
    notFound: 'Page Not Found',
    validationError: 'Input Validation Failed',
    unknownError: 'Unknown Error'
  },

  // 成功消息
  success: {
    saved: 'Saved Successfully',
    updated: 'Updated Successfully',
    deleted: 'Deleted Successfully',
    created: 'Created Successfully'
  },

  // 确认对话框
  confirm: {
    delete: 'Are you sure you want to delete?',
    reset: 'Are you sure you want to reset?',
    logout: 'Are you sure you want to logout?'
  },

  // 时间格式
  time: {
    now: 'Just now',
    minutesAgo: '{n} minutes ago',
    hoursAgo: '{n} hours ago',
    daysAgo: '{n} days ago',
    weeksAgo: '{n} weeks ago',
    monthsAgo: '{n} months ago',
    yearsAgo: '{n} years ago'
  },

  // 平行宇宙
  parallelUniverse: {
    modal: {
      title: 'Enter Parallel Universe',
      description: 'Choose how you want to explore this alternative life path',
      triggerEvent: 'Triggered by',
      userDefinedTitle: 'User-Defined Path',
      userDefinedDescription: 'Create your own custom parallel universe journey',
      aiPlannedTitle: 'AI-Planned Path',
      aiPlannedDescription: 'Let AI generate a complete parallel life experience',
      selectTheme: 'Select Universe Theme',
      startUniverse: 'Start Universe'
    },
    
    themes: {
      entrepreneur: 'Entrepreneur Life',
      artist: 'Artist Life',
      adventurer: 'Adventurer Life',
      scholar: 'Scholar Life',
      family: 'Family Life',
      general: 'General Life'
    },
    
    grid: {
      title: 'Parallel Universes',
      description: 'Explore your alternative life paths and compare different choices',
      createNew: 'Create New Universe',
      createNewDescription: 'Start a new parallel universe journey',
      empty: {
        title: 'No Parallel Universes Yet',
        description: 'Create your first parallel universe to explore alternative life paths',
        action: 'Create First Universe'
      }
    },
    
    stats: {
      total: 'Total Universes',
      active: 'Active',
      completed: 'Completed',
      insights: 'Insights'
    },
    
    status: {
      active: 'Active',
      completed: 'Completed',
      paused: 'Paused'
    },
    
    actions: {
      continue: 'Continue',
      view: 'View',
      compare: 'Compare'
    },
    
    level: 'Level'
  },

  // 时间轴
  timeline: {
    title: 'Life Timeline',
    subtitle: 'Your dual-track life journey',
    realLife: 'Real Life',
    parallelUniverses: 'Parallel Universes',
    comparison: 'Comparison',
    addEvent: 'Add Event',
    noEvents: 'No events yet',
    addFirstEvent: 'Add your first life event',
    noLocation: 'No location',
    enterParallel: 'Enter Parallel'
  },

  // 对比功能
  comparison: {
    title: 'Life Comparison',
    description: 'Compare your real life with parallel universe experiences',
    realLife: 'Real Life',
    parallelUniverse: 'Parallel Universe',
    selectUniverse: 'Select a parallel universe to compare',
    chooseUniverse: 'Choose Universe...',
    totalEvents: 'Total Events',
    avgImportance: 'Avg Importance',
    categoryDistribution: 'Category Distribution',
    level: 'Level',
    decisions: 'Decisions',
    statsComparison: 'Statistics Comparison',
    real: 'Real',
    virtual: 'Virtual',
    virtualHigher: 'Virtual Higher',
    realHigher: 'Real Higher',
    equal: 'Equal',
    insights: 'Insights & Recommendations',
    keyDifferences: 'Key Differences',
    recommendations: 'Recommendations',
    virtualHigherIn: 'Virtual life shows {diff} points higher in {metric}',
    realHigherIn: 'Real life shows {diff} points higher in {metric}',
    improveReal: 'Consider improving {metric} in real life',
    learnFromVirtual: 'Learn from virtual experiences in {metric}',
    experienceTransfer: 'Experience Transfer',
    availableInsights: 'Available Insights',
    transferredInsights: 'Transferred Insights',
    transfer: 'Transfer',
    transferred: 'Transferred',
    noTransfers: 'No insights transferred yet'
  },

  // 回忆记录器
  memory: {
    // 页面标题和导航
    title: 'Memory Recorder',
    subtitle: 'Capture life\'s precious moments',
    description: 'Record and organize your memories with multimedia support',
    
    // 操作按钮
    actions: {
      addMemory: 'Add Memory',
      editMemory: 'Edit Memory',
      deleteMemory: 'Delete Memory',
      saveMemory: 'Save Memory',
      cancelEdit: 'Cancel',
      viewDetails: 'View Details',
      shareMemory: 'Share Memory',
      exportMemory: 'Export Memory'
    },
    
    // 表单字段
    form: {
      title: 'Memory Title',
      titlePlaceholder: 'Give this memory a title...',
      content: 'Memory Content',
      contentPlaceholder: 'Describe this memory in detail...',
      category: 'Category',
      importance: 'Importance',
      tags: 'Tags',
      tagsPlaceholder: 'Add tags (press Enter to add)',
      location: 'Location',
      locationPlaceholder: 'Where did this happen?',
      date: 'Date',
      time: 'Time',
      isPrivate: 'Private Memory',
      companions: 'Companions',
      companionsPlaceholder: 'Who was with you?'
    },
    
    // 媒体文件
    media: {
      title: 'Media Files',
      uploadTitle: 'Add Media Files',
      uploadDescription: 'Drag and drop files here, or click to select',
      supportedFormats: 'Supports images, audio, and video files',
      maxSize: 'Maximum file size: 50MB',
      uploading: 'Uploading...',
      uploadSuccess: 'Upload successful',
      uploadError: 'Upload failed',
      removeFile: 'Remove file',
      previewFile: 'Preview file',
      downloadFile: 'Download file'
    },
    
    // 情感分析
    emotion: {
      title: 'Emotion Analysis',
      analyzing: 'Analyzing emotions...',
      detected: 'Detected emotion',
      primary: 'Primary emotion',
      secondary: 'Secondary emotion',
      intensity: 'Intensity',
      confidence: 'Confidence',
      sentiment: 'Sentiment',
      keywords: 'Emotion keywords',
      sentiments: {
        positive: 'Positive',
        negative: 'Negative',
        neutral: 'Neutral'
      },
      emotions: {
        joy: 'Joy',
        sadness: 'Sadness',
        anger: 'Anger',
        fear: 'Fear',
        surprise: 'Surprise',
        disgust: 'Disgust',
        love: 'Love',
        excitement: 'Excitement',
        calm: 'Calm',
        nostalgia: 'Nostalgia'
      }
    },
    
    // 位置信息
    location: {
      title: 'Location Information',
      detecting: 'Detecting location...',
      detected: 'Location detected',
      manual: 'Enter manually',
      current: 'Use current location',
      address: 'Address',
      city: 'City',
      country: 'Country',
      venue: 'Venue',
      accuracy: 'Accuracy',
      weather: 'Weather',
      temperature: 'Temperature',
      condition: 'Condition',
      humidity: 'Humidity'
    },
    
    // 分类
    categories: {
      personal: 'Personal',
      family: 'Family',
      friends: 'Friends',
      work: 'Work',
      travel: 'Travel',
      food: 'Food',
      hobby: 'Hobby',
      achievement: 'Achievement',
      milestone: 'Milestone',
      celebration: 'Celebration',
      learning: 'Learning',
      health: 'Health',
      other: 'Other'
    },
    
    // 筛选和搜索
    filter: {
      title: 'Filter Memories',
      dateRange: 'Date Range',
      startDate: 'Start Date',
      endDate: 'End Date',
      categories: 'Categories',
      emotions: 'Emotions',
      types: 'Media Types',
      locations: 'Locations',
      tags: 'Tags',
      importance: 'Importance Range',
      minImportance: 'Minimum',
      maxImportance: 'Maximum',
      applyFilter: 'Apply Filter',
      clearFilter: 'Clear Filter',
      resetAll: 'Reset All'
    },
    
    // 视图模式
    views: {
      timeline: 'Timeline',
      grid: 'Grid',
      list: 'List',
      calendar: 'Calendar',
      map: 'Map'
    },
    
    // 统计信息
    stats: {
      title: 'Memory Statistics',
      totalMemories: 'Total Memories',
      memoriesByType: 'By Type',
      memoriesByEmotion: 'By Emotion',
      memoriesByCategory: 'By Category',
      averageImportance: 'Average Importance',
      mostActiveMonth: 'Most Active Month',
      emotionalTrend: 'Emotional Trend',
      recentActivity: 'Recent Activity'
    },
    
    // 消息提示
    messages: {
      memoryAdded: 'Memory added successfully',
      memoryUpdated: 'Memory updated successfully',
      memoryDeleted: 'Memory deleted successfully',
      loadingMemories: 'Loading memories...',
      noMemories: 'No memories found',
      noMemoriesDescription: 'Start recording your first memory!',
      searchNoResults: 'No memories match your search',
      filterNoResults: 'No memories match your filters',
      deleteConfirm: 'Are you sure you want to delete this memory?',
      deleteWarning: 'This action cannot be undone',
      saveSuccess: 'Memory saved successfully',
      saveError: 'Failed to save memory',
      loadError: 'Failed to load memories',
      networkError: 'Network error, please try again'
    },
    
    // 时间相关
    time: {
      justNow: 'Just now',
      minutesAgo: '{count} minutes ago',
      hoursAgo: '{count} hours ago',
      daysAgo: '{count} days ago',
      weeksAgo: '{count} weeks ago',
      monthsAgo: '{count} months ago',
      yearsAgo: '{count} years ago',
      today: 'Today',
      yesterday: 'Yesterday',
      thisWeek: 'This week',
      thisMonth: 'This month',
      thisYear: 'This year'
    }
  },

  // AI Service Related Translations
  ai: {
    analyzing: 'AI is analyzing...',
    eventEvaluation: {
      title: 'Event AI Evaluation',
      overallAnalysis: 'Overall Analysis',
      overallScore: 'Overall Score',
      emotionalImpact: 'Emotional Impact',
      growthPotential: 'Growth Potential',
      lifeSignificance: 'Life Significance',
      insights: 'Deep Insights',
      strengths: 'Strengths Analysis',
      improvements: 'Improvement Suggestions',
      futureOpportunities: 'Future Opportunities',
      recommendations: 'Action Recommendations',
      immediate: 'Immediate Actions',
      shortTerm: 'Short-term Planning',
      longTerm: 'Long-term Development',
      noEvaluation: 'No AI evaluation yet',
      startEvaluation: 'Start AI Evaluation'
    },
    planAnalysis: {
      title: 'Virtual Life Plan AI Analysis',
      subtitle: 'Intelligent analysis of your life plan',
      feasibilityAssessment: 'Feasibility Assessment',
      overallScore: 'Overall Score',
      timeRealistic: 'Time Realistic',
      resourceAvailability: 'Resource Availability',
      skillRequirement: 'Skill Requirement',
      marketOpportunity: 'Market Opportunity',
      riskAssessment: 'Risk Assessment',
      riskLevel: 'Risk Level',
      mainRisks: 'Main Risks',
      mitigationStrategies: 'Mitigation Strategies',
      optimization: 'Optimization Suggestions',
      priorityAdjustments: 'Priority Adjustments',
      timelineOptimization: 'Timeline Optimization',
      resourceOptimization: 'Resource Optimization',
      noAnalysis: 'No AI analysis yet',
      startAnalysis: 'Start AI Analysis'
    },
    chat: {
      title: 'AI Chat',
      eventContext: 'Deep conversation based on current event',
      planContext: 'Deep conversation based on current plan',
      placeholder: 'Type your question...',
      suggestions: 'Suggested questions:'
    }
  },

  // Life Agent
  lifeAgent: {
    title: 'Life Agent',
    subtitle: 'Your AI Life Planning Assistant',
    connected: 'Connected',
    disconnected: 'Disconnected',
    inputPlaceholder: 'Ask me anything about life planning, goal setting, or evaluation...',
    
    quickActions: {
      planning: 'Life Planning',
      evaluation: 'Life Evaluation',
      goal: 'Goal Analysis'
    },
    
    messages: {
      welcome: 'Hello! I am your Life Agent. What can I help you with today?',
      thinking: 'Thinking...',
      error: 'Sorry, I encountered an error. Please try again.',
      networkError: 'Network connection failed. Please check your connection.'
    },
    
    features: {
      planning: {
        title: 'Life Planning',
        description: 'Create personalized life plans based on your goals and current situation'
      },
      evaluation: {
        title: 'Life Evaluation',
        description: 'Comprehensive analysis of your current life status and progress'
      },
      goal: {
        title: 'Goal Analysis',
        description: 'Analyze goal feasibility and provide optimization suggestions'
      },
      conversation: {
        title: 'Smart Conversation',
        description: 'Natural conversation about life planning and personal development'
      }
    }
  }
}

