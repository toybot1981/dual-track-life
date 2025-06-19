export default {
  // 通用
  common: {
    save: '保存',
    cancel: '取消',
    delete: '删除',
    edit: '编辑',
    add: '添加',
    search: '搜索',
    loading: '加载中...',
    error: '错误',
    success: '成功',
    confirm: '确认',
    back: '返回',
    next: '下一步',
    previous: '上一步',
    close: '关闭',
    submit: '提交',
    reset: '重置',
    clear: '清除',
    select: '选择',
    all: '全部',
    none: '无',
    yes: '是',
    no: '否',
    ok: '确定',
    demo: '演示',
    welcome: '欢迎'
  },

  // 语言
  language: {
    english: 'English',
    chinese: '中文',
    switchLanguage: '切换语言'
  },

  // 导航
  nav: {
    home: '首页',
    dashboard: '控制台',
    login: '登录',
    register: '注册',
    logout: '退出登录',
    profile: '个人资料',
    settings: '设置'
  },

  // 欢迎页面
  welcome: {
    title: '双轨人生',
    subtitle: '记录真实，探索可能',
    description: '一个创新的人生管理平台，让您同时记录真实生活轨迹，并通过AI驱动的虚拟人生模拟探索无限可能。',
    getStarted: '开始使用',
    tryDemo: '体验演示',
    learnMore: '了解更多',
    
    // 功能介绍
    features: {
      title: '核心功能',
      realLife: {
        title: '真实人生记录',
        description: '记录您的真实生活事件，包括工作成就、个人成长、人际关系等各个方面。'
      },
      virtualLife: {
        title: '虚拟人生模拟',
        description: '通过AI驱动的虚拟人生模拟，探索不同的人生选择和可能性。'
      },
      aiCoach: {
        title: 'AI生活教练',
        description: '获得个性化的AI建议和洞察，帮助您做出更好的人生决策。'
      }
    },

    // 统计数据
    stats: {
      users: '用户',
      events: '记录事件',
      simulations: '虚拟模拟',
      insights: 'AI洞察'
    },

    // 行动召唤
    cta: {
      title: '开始您的双轨人生之旅',
      description: '立即注册，开始记录您的真实人生，并探索无限的虚拟可能性。',
      register: '立即注册',
      demo: '免费体验'
    }
  },

  // 认证
  auth: {
    // 登录
    login: {
      title: '登录',
      subtitle: '欢迎回来',
      username: '用户名或邮箱',
      password: '密码',
      rememberMe: '记住我',
      forgotPassword: '忘记密码？',
      loginButton: '登录',
      noAccount: '还没有账户？',
      signUp: '立即注册',
      demoLogin: '演示登录',
      loginSuccess: '登录成功',
      loginFailed: '登录失败'
    },

    // 注册
    register: {
      title: '注册',
      subtitle: '创建您的账户',
      username: '用户名',
      email: '邮箱地址',
      password: '密码',
      confirmPassword: '确认密码',
      fullName: '姓名（可选）',
      registerButton: '注册',
      hasAccount: '已有账户？',
      signIn: '立即登录',
      registerSuccess: '注册成功',
      registerFailed: '注册失败',
      passwordMismatch: '密码不匹配',
      usernameRequired: '用户名不能为空',
      emailRequired: '邮箱不能为空',
      passwordRequired: '密码不能为空'
    }
  },

  // 控制台
  dashboard: {
    title: '控制台',
    welcome: '欢迎回来',
    demoMode: '演示模式',
    demoDescription: '您正在使用演示模式，可以体验所有功能。',
    resetDemo: '重置演示数据',

    // 统计卡片
    stats: {
      totalEvents: '总事件数',
      thisMonth: '本月事件',
      aiInsights: 'AI洞察',
      virtualLevel: '虚拟等级'
    },

    // 快速操作
    quickActions: {
      title: '快速操作',
      addEvent: '添加人生事件',
      virtualSimulation: '虚拟人生模拟',
      viewAnalytics: '查看分析',
      parallelUniverses: '平行宇宙'
    },

    // 事件时间轴
    timeline: {
      title: '事件时间轴',
      noEvents: '暂无事件记录',
      addFirstEvent: '添加您的第一个事件',
      searchPlaceholder: '搜索您的人生事件...',
      filterAll: '全部',
      filterWork: '工作',
      filterPersonal: '个人',
      filterHealth: '健康',
      filterLearning: '学习',
      filterRelationships: '人际关系',
      filterEntertainment: '娱乐',
      filterTravel: '旅行',
      filterFinance: '财务',
      importance: '重要性',
      location: '地点',
      emotion: '情感',
      loading: '正在加载您的时间轴...'
    }
  },

  // 事件管理
  events: {
    title: '事件管理',
    addEvent: '添加事件',
    editEvent: '编辑事件',
    deleteEvent: '删除事件',
    eventTitle: '事件标题',
    eventDescription: '事件描述',
    eventDate: '事件日期',
    eventTime: '事件时间',
    category: '分类',
    importance: '重要性',
    emotion: '情感',
    location: '地点',
    
    // 分类
    categories: {
      work: '工作',
      personal: '个人',
      health: '健康',
      learning: '学习',
      relationships: '人际关系',
      entertainment: '娱乐',
      travel: '旅行',
      finance: '财务'
    },

    // 情感
    emotions: {
      happy: '开心',
      excited: '兴奋',
      grateful: '感激',
      proud: '自豪',
      content: '满足',
      neutral: '平静',
      tired: '疲惫',
      stressed: '压力',
      sad: '难过',
      angry: '愤怒',
      anxious: '焦虑',
      disappointed: '失望'
    },

    // 消息
    eventSaved: '事件已保存',
    eventDeleted: '事件已删除',
    confirmDelete: '确定要删除这个事件吗？',
    titleRequired: '请输入事件标题',
    dateRequired: '请选择事件日期'
  },

  // 虚拟人生模拟
  virtualLife: {
    title: '虚拟人生模拟',
    subtitle: 'AI驱动的人生探索',
    description: '通过AI模拟探索不同的人生选择和可能性',
    modes: {
      title: '模拟模式',
      explore: '生活探索者',
      exploreDesc: '发现新的可能性',
      decision: '决策制定者',
      decisionDesc: '测试重要选择',
      goal: '目标达成者',
      goalDesc: '规划成功路径',
      adventure: '冒险寻求者',
      adventureDesc: '大胆冒险'
    },
    personality: {
      title: 'AI个性设置',
      riskTolerance: '风险承受度',
      conservative: '保守',
      adventurous: '冒险',
      creativity: '创造力水平',
      practical: '实用',
      imaginative: '想象',
      focusArea: '专注领域',
      balanced: '平衡发展',
      career: '职业发展',
      relationships: '人际关系',
      health: '健康生活',
      creativityArea: '创造力',
      adventure: '冒险'
    },
    stats: {
      title: '虚拟人生时间线',
      happiness: '幸福感',
      success: '成功度',
      growth: '成长值',
      experience: '经验值'
    },
    scenario: {
      aiInsight: 'AI洞察',
      makeChoice: '你会怎么做？',
      impact: '影响'
    },
    scenarioTemplates: {
      career_change: {
        title: '职业十字路口',
        description: '你获得了一个梦想中的外地工作机会，但这意味着要离开现在的生活。',
        aiInsight: '这个决定可能会极大影响你的职业成长，请权衡长期收益与眼前舒适。',
        choices: [
          { text: '接受新工作', consequence: '在新环境中重新开始' },
          { text: '留在现有岗位', consequence: '保持稳定但错失机会' },
          { text: '争取远程办公', consequence: '尝试两全其美' }
        ]
      },
      relationship_choice: {
        title: '爱情与理性',
        description: '你遇到了很棒的人，但对方住在地球另一端。你的心说可以试试，理性却觉得很复杂。',
        aiInsight: '感情需要情感与现实兼顾，异地恋需要双方的承诺和努力。',
        choices: [
          { text: '勇敢追爱', consequence: '为爱情冒险一次' },
          { text: '暂时做朋友', consequence: '保持简单关系' },
          { text: '计划见面', consequence: '先线下见面试试' }
        ]
      },
      creative_pursuit: {
        title: '创意召唤',
        description: '你一直想写小说，有了好点子，但这意味着要牺牲很多业余时间。',
        aiInsight: '创意追求常常需要牺牲，但能带来深刻的满足和意外的机会。',
        choices: [
          { text: '立刻开始写作', consequence: '全身心投入你的热爱' },
          { text: '先规划和调研', consequence: '采取有条理的方法' },
          { text: '加入写作小组', consequence: '获得支持和督促' }
        ]
      },
      health_challenge: {
        title: '健康警钟',
        description: '医生建议你做重大生活方式调整。是时候优先考虑健康了，但这意味着要改变多年的习惯。',
        aiInsight: '健康是一切的基础，小而持续的改变往往比激进转变更有效。',
        choices: [
          { text: '彻底改变生活方式', consequence: '立刻做出巨大改变' },
          { text: '逐步改善', consequence: '一次改变一个习惯' },
          { text: '请健康教练指导', consequence: '获得专业建议' }
        ]
      },
      financial_opportunity: {
        title: '投资抉择',
        description: '朋友邀请你投资他们的创业项目，可能回报很高，但你需要动用应急储蓄。',
        aiInsight: '高风险投资可能带来高回报，但切勿投入无法承受损失的钱，请结合自身风险承受度考虑。',
        choices: [
          { text: '全额投资', consequence: '全力押注这个机会' },
          { text: '小额参与', consequence: '参与但控制风险' },
          { text: '拒绝投资', consequence: '保障你的储蓄安全' }
        ]
      }
    },
    loading: '正在生成场景，请稍候',
    analyzing: '正在分析您的真实生活数据...',
    actions: {
      randomScenario: '随机场景',
      analyzeRealLife: '分析真实生活',
      resetSimulation: '重置模拟'
    },
    aiInsights: {
      riskComfort: '基于你{risk}%的风险承受度，该场景与你的舒适区高度契合。',
      creativity: '你的高创造力设定意味着你可能会找到创新的解决方案。',
      focusArea: '鉴于你专注于{focus}，这个决策可能会显著影响你的目标。',
      balance: '该场景在当前人生阶段为你带来了风险与回报的良好平衡。',
      vision: '请思考这个选择是否符合你的长期愿景和价值观。'
    }
  },

  // AI生活教练
  aiCoach: {
    title: 'AI生活教练',
    subtitle: '您的智能生活顾问',
    
    // 洞察
    insights: {
      title: '个性化洞察',
      today: '今日洞察',
      lifeBalance: '生活平衡',
      patterns: '行为模式',
      suggestions: '改进建议',
      trends: '趋势分析',
      messages: {
        0: '你近期过于专注于{category}，建议多探索其他人生领域以获得更好平衡。',
        1: '我注意到你最近的事件中压力较大。可以尝试虚拟人生模拟，探索减压策略。',
        2: '你的许多事件重要性评分较低，建议设定更大、更有意义的目标。',
        3: '开始记录更多元化的人生事件，获取个性化洞察和建议。'
      },
      categories: {
        Balance: '平衡',
        Wellness: '健康',
        Growth: '成长',
        'Getting Started': '新手指引',
        general: '综合'
      }
    },

    // 平衡评分
    balance: {
      title: '生活平衡评分',
      work: '工作',
      health: '健康',
      relationships: '人际关系',
      personal: '个人发展',
      entertainment: '娱乐休闲'
    },

    // 建议类型
    suggestions: {
      improve: '改进建议',
      maintain: '保持现状',
      explore: '探索机会',
      balance: '平衡调整'
    }
  },

  // 错误消息
  errors: {
    networkError: '网络连接错误',
    serverError: '服务器错误',
    unauthorized: '未授权访问',
    notFound: '页面未找到',
    validationError: '输入验证失败',
    unknownError: '未知错误'
  },

  // 成功消息
  success: {
    saved: '保存成功',
    updated: '更新成功',
    deleted: '删除成功',
    created: '创建成功'
  },

  // 确认对话框
  confirm: {
    delete: '确定要删除吗？',
    reset: '确定要重置吗？',
    logout: '确定要退出登录吗？'
  },

  // 时间格式
  time: {
    now: '刚刚',
    minutesAgo: '{n} 分钟前',
    hoursAgo: '{n} 小时前',
    daysAgo: '{n} 天前',
    weeksAgo: '{n} 周前',
    monthsAgo: '{n} 个月前',
    yearsAgo: '{n} 年前'
  },

  // 平行宇宙
  parallelUniverse: {
    modal: {
      title: '进入平行宇宙',
      description: '选择您想要探索这条替代人生路径的方式',
      triggerEvent: '触发事件',
      userDefinedTitle: '用户自定义路径',
      userDefinedDescription: '创建您自己的定制平行宇宙旅程',
      aiPlannedTitle: 'AI规划路径',
      aiPlannedDescription: '让AI生成完整的平行人生体验',
      selectTheme: '选择宇宙主题',
      startUniverse: '启动宇宙'
    },
    
    themes: {
      entrepreneur: '创业人生',
      artist: '艺术人生',
      adventurer: '冒险人生',
      scholar: '学者人生',
      family: '家庭人生',
      general: '通用人生'
    },
    
    grid: {
      title: '平行宇宙',
      description: '探索您的替代人生路径并比较不同的选择',
      createNew: '创建新宇宙',
      createNewDescription: '开始新的平行宇宙旅程',
      empty: {
        title: '还没有平行宇宙',
        description: '创建您的第一个平行宇宙来探索替代人生路径',
        action: '创建第一个宇宙'
      }
    },
    
    stats: {
      total: '总宇宙数',
      active: '活跃',
      completed: '已完成',
      insights: '洞察'
    },
    
    status: {
      active: '活跃',
      completed: '已完成',
      paused: '暂停'
    },
    
    actions: {
      continue: '继续',
      view: '查看',
      compare: '对比'
    },
    
    level: '等级'
  },

  // 时间轴
  timeline: {
    title: '人生时间轴',
    subtitle: '您的双轨人生旅程',
    realLife: '真实人生',
    parallelUniverses: '平行宇宙',
    comparison: '对比分析',
    addEvent: '添加事件',
    noEvents: '暂无事件',
    addFirstEvent: '添加您的第一个人生事件',
    noLocation: '无位置',
    enterParallel: '进入平行'
  },

  // 对比功能
  comparison: {
    title: '人生对比',
    description: '比较您的真实人生与平行宇宙体验',
    realLife: '真实人生',
    parallelUniverse: '平行宇宙',
    selectUniverse: '选择一个平行宇宙进行对比',
    chooseUniverse: '选择宇宙...',
    totalEvents: '总事件数',
    avgImportance: '平均重要性',
    categoryDistribution: '分类分布',
    level: '等级',
    decisions: '决策数',
    statsComparison: '统计对比',
    real: '真实',
    virtual: '虚拟',
    virtualHigher: '虚拟更高',
    realHigher: '真实更高',
    equal: '相等',
    insights: '洞察与建议',
    keyDifferences: '关键差异',
    recommendations: '建议',
    virtualHigherIn: '虚拟人生在{metric}方面高出{diff}分',
    realHigherIn: '真实人生在{metric}方面高出{diff}分',
    improveReal: '考虑在真实生活中改善{metric}',
    learnFromVirtual: '从虚拟体验中学习{metric}方面的经验',
    experienceTransfer: '经验迁移',
    availableInsights: '可用洞察',
    transferredInsights: '已迁移洞察',
    transfer: '迁移',
    transferred: '已迁移',
    noTransfers: '还没有迁移任何洞察'
  }
}

