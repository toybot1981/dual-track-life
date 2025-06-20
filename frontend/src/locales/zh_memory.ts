// 回忆记录器相关翻译
export default {
  memory: {
    // 页面标题和导航
    title: '回忆记录器',
    subtitle: '记录生活中的珍贵时刻',
    description: '通过多媒体支持记录和整理您的回忆',
    
    // 操作按钮
    actions: {
      addMemory: '添加回忆',
      editMemory: '编辑回忆',
      deleteMemory: '删除回忆',
      saveMemory: '保存回忆',
      cancelEdit: '取消',
      viewDetails: '查看详情',
      shareMemory: '分享回忆',
      exportMemory: '导出回忆'
    },
    
    // 表单字段
    form: {
      title: '回忆标题',
      titlePlaceholder: '给这个回忆起个标题...',
      content: '回忆内容',
      contentPlaceholder: '详细描述这个回忆...',
      category: '分类',
      importance: '重要性',
      tags: '标签',
      tagsPlaceholder: '添加标签（按回车键添加）',
      location: '地点',
      locationPlaceholder: '这发生在哪里？',
      date: '日期',
      time: '时间',
      isPrivate: '私密回忆',
      companions: '同伴',
      companionsPlaceholder: '当时和谁在一起？'
    },
    
    // 媒体文件
    media: {
      title: '媒体文件',
      uploadTitle: '添加媒体文件',
      uploadDescription: '拖拽文件到这里，或点击选择文件',
      supportedFormats: '支持图片、音频和视频文件',
      maxSize: '最大文件大小：50MB',
      uploading: '上传中...',
      uploadSuccess: '上传成功',
      uploadError: '上传失败',
      removeFile: '删除文件',
      previewFile: '预览文件',
      downloadFile: '下载文件'
    },
    
    // 情感分析
    emotion: {
      title: '情感分析',
      analyzing: '正在分析情感...',
      detected: '检测到情感',
      primary: '主要情感',
      secondary: '次要情感',
      intensity: '强度',
      confidence: '置信度',
      sentiment: '情感倾向',
      keywords: '情感关键词',
      sentiments: {
        positive: '积极',
        negative: '消极',
        neutral: '中性'
      },
      emotions: {
        joy: '喜悦',
        sadness: '悲伤',
        anger: '愤怒',
        fear: '恐惧',
        surprise: '惊讶',
        disgust: '厌恶',
        love: '爱',
        excitement: '兴奋',
        calm: '平静',
        nostalgia: '怀念'
      }
    },
    
    // 位置信息
    location: {
      title: '位置信息',
      detecting: '正在检测位置...',
      detected: '位置已检测',
      manual: '手动输入',
      current: '使用当前位置',
      address: '地址',
      city: '城市',
      country: '国家',
      venue: '场所',
      accuracy: '精确度',
      weather: '天气',
      temperature: '温度',
      condition: '天气状况',
      humidity: '湿度'
    },
    
    // 分类
    categories: {
      personal: '个人',
      family: '家庭',
      friends: '朋友',
      work: '工作',
      travel: '旅行',
      food: '美食',
      hobby: '爱好',
      achievement: '成就',
      milestone: '里程碑',
      celebration: '庆祝',
      learning: '学习',
      health: '健康',
      other: '其他'
    },
    
    // 筛选和搜索
    filter: {
      title: '筛选回忆',
      dateRange: '日期范围',
      startDate: '开始日期',
      endDate: '结束日期',
      categories: '分类',
      emotions: '情感',
      types: '媒体类型',
      locations: '地点',
      tags: '标签',
      importance: '重要性范围',
      minImportance: '最小值',
      maxImportance: '最大值',
      applyFilter: '应用筛选',
      clearFilter: '清除筛选',
      resetAll: '重置全部'
    },
    
    // 视图模式
    views: {
      timeline: '时间轴',
      grid: '网格',
      list: '列表',
      calendar: '日历',
      map: '地图'
    },
    
    // 统计信息
    stats: {
      title: '回忆统计',
      totalMemories: '总回忆数',
      memoriesByType: '按类型',
      memoriesByEmotion: '按情感',
      memoriesByCategory: '按分类',
      averageImportance: '平均重要性',
      mostActiveMonth: '最活跃月份',
      emotionalTrend: '情感趋势',
      recentActivity: '最近活动'
    },
    
    // 消息提示
    messages: {
      memoryAdded: '回忆添加成功',
      memoryUpdated: '回忆更新成功',
      memoryDeleted: '回忆删除成功',
      loadingMemories: '正在加载回忆...',
      noMemories: '暂无回忆记录',
      noMemoriesDescription: '开始记录您的第一个回忆吧！',
      searchNoResults: '没有找到匹配的回忆',
      filterNoResults: '没有符合筛选条件的回忆',
      deleteConfirm: '确定要删除这个回忆吗？',
      deleteWarning: '此操作无法撤销',
      saveSuccess: '回忆保存成功',
      saveError: '保存回忆失败',
      loadError: '加载回忆失败',
      networkError: '网络错误，请重试'
    },
    
    // 时间相关
    time: {
      justNow: '刚刚',
      minutesAgo: '{count}分钟前',
      hoursAgo: '{count}小时前',
      daysAgo: '{count}天前',
      weeksAgo: '{count}周前',
      monthsAgo: '{count}个月前',
      yearsAgo: '{count}年前',
      today: '今天',
      yesterday: '昨天',
      thisWeek: '本周',
      thisMonth: '本月',
      thisYear: '今年'
    }
  }
}

