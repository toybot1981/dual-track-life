/**
 * ErrorHandler - 错误处理和监控系统
 * 基于Manus最佳实践，提供全面的错误处理和性能监控
 */
export interface ErrorInfo {
  type: 'render' | 'network' | 'buffer' | 'scroll' | 'cache'
  message: string
  stack?: string
  context?: any
  timestamp: number
  severity: 'low' | 'medium' | 'high' | 'critical'
}

export interface PerformanceMetrics {
  renderTime: number
  bufferEfficiency: number
  cacheHitRate: number
  scrollResponsiveness: number
  memoryUsage: number
}

export class ErrorHandler {
  private errors: ErrorInfo[] = []
  private maxErrors: number = 100
  private metrics: PerformanceMetrics = {
    renderTime: 0,
    bufferEfficiency: 0,
    cacheHitRate: 0,
    scrollResponsiveness: 0,
    memoryUsage: 0
  }
  private performanceObserver: PerformanceObserver | null = null

  constructor() {
    this.setupPerformanceMonitoring()
    this.setupGlobalErrorHandling()
  }

  /**
   * 记录错误
   */
  logError(error: Partial<ErrorInfo>): void {
    const errorInfo: ErrorInfo = {
      type: error.type || 'render',
      message: error.message || 'Unknown error',
      stack: error.stack,
      context: error.context,
      timestamp: Date.now(),
      severity: error.severity || 'medium'
    }

    this.errors.push(errorInfo)

    // 保持错误日志大小
    if (this.errors.length > this.maxErrors) {
      this.errors.shift()
    }

    // 根据严重程度决定处理方式
    this.handleErrorBySeverity(errorInfo)
  }

  /**
   * 根据严重程度处理错误
   */
  private handleErrorBySeverity(error: ErrorInfo): void {
    switch (error.severity) {
      case 'critical':
        console.error('Critical error:', error)
        this.notifyUser('系统遇到严重错误，正在尝试恢复...')
        break
      
      case 'high':
        console.error('High severity error:', error)
        break
      
      case 'medium':
        console.warn('Medium severity error:', error)
        break
      
      case 'low':
        console.log('Low severity error:', error)
        break
    }
  }

  /**
   * 安全渲染包装器
   */
  safeRender<T>(
    renderFn: () => T,
    fallbackFn: () => T,
    context?: string
  ): T {
    try {
      const startTime = performance.now()
      const result = renderFn()
      const endTime = performance.now()
      
      // 记录渲染性能
      this.updateMetrics('renderTime', endTime - startTime)
      
      return result
    } catch (error) {
      this.logError({
        type: 'render',
        message: `Render error in ${context || 'unknown context'}`,
        stack: error instanceof Error ? error.stack : undefined,
        context: { context, error },
        severity: 'medium'
      })
      
      return fallbackFn()
    }
  }

  /**
   * 安全异步操作包装器
   */
  async safeAsync<T>(
    asyncFn: () => Promise<T>,
    fallbackValue: T,
    context?: string
  ): Promise<T> {
    try {
      return await asyncFn()
    } catch (error) {
      this.logError({
        type: 'network',
        message: `Async operation failed in ${context || 'unknown context'}`,
        stack: error instanceof Error ? error.stack : undefined,
        context: { context, error },
        severity: 'high'
      })
      
      return fallbackValue
    }
  }

  /**
   * 缓冲操作监控
   */
  monitorBufferOperation<T>(
    operation: () => T,
    expectedSize: number,
    context?: string
  ): T {
    try {
      const startTime = performance.now()
      const result = operation()
      const endTime = performance.now()
      
      // 计算缓冲效率
      const efficiency = expectedSize > 0 ? 
        Math.min(1, (endTime - startTime) / expectedSize) : 1
      
      this.updateMetrics('bufferEfficiency', efficiency)
      
      return result
    } catch (error) {
      this.logError({
        type: 'buffer',
        message: `Buffer operation failed in ${context || 'unknown context'}`,
        stack: error instanceof Error ? error.stack : undefined,
        context: { context, error, expectedSize },
        severity: 'medium'
      })
      
      throw error
    }
  }

  /**
   * 滚动性能监控
   */
  monitorScrollPerformance(scrollFn: () => void): void {
    const startTime = performance.now()
    
    try {
      scrollFn()
      
      requestAnimationFrame(() => {
        const endTime = performance.now()
        const responsiveness = Math.max(0, 1 - (endTime - startTime) / 16) // 16ms = 60fps
        this.updateMetrics('scrollResponsiveness', responsiveness)
      })
    } catch (error) {
      this.logError({
        type: 'scroll',
        message: 'Scroll operation failed',
        stack: error instanceof Error ? error.stack : undefined,
        context: { error },
        severity: 'low'
      })
    }
  }

  /**
   * 缓存性能监控
   */
  recordCacheHit(hit: boolean): void {
    const currentHitRate = this.metrics.cacheHitRate
    const newHitRate = hit ? 
      Math.min(1, currentHitRate + 0.01) : 
      Math.max(0, currentHitRate - 0.01)
    
    this.updateMetrics('cacheHitRate', newHitRate)
  }

  /**
   * 更新性能指标
   */
  private updateMetrics(metric: keyof PerformanceMetrics, value: number): void {
    // 使用指数移动平均来平滑指标
    const alpha = 0.1
    this.metrics[metric] = this.metrics[metric] * (1 - alpha) + value * alpha
  }

  /**
   * 设置性能监控
   */
  private setupPerformanceMonitoring(): void {
    if ('PerformanceObserver' in window) {
      this.performanceObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        
        entries.forEach((entry) => {
          if (entry.entryType === 'measure') {
            this.updateMetrics('renderTime', entry.duration)
          }
        })
      })
      
      this.performanceObserver.observe({ entryTypes: ['measure'] })
    }
    
    // 监控内存使用（如果支持）
    if ('memory' in performance) {
      setInterval(() => {
        const memory = (performance as any).memory
        if (memory) {
          const usage = memory.usedJSHeapSize / memory.totalJSHeapSize
          this.updateMetrics('memoryUsage', usage)
        }
      }, 5000) // 每5秒检查一次
    }
  }

  /**
   * 设置全局错误处理
   */
  private setupGlobalErrorHandling(): void {
    // 捕获未处理的Promise拒绝
    window.addEventListener('unhandledrejection', (event) => {
      this.logError({
        type: 'network',
        message: 'Unhandled promise rejection',
        stack: event.reason?.stack,
        context: { reason: event.reason },
        severity: 'high'
      })
    })
    
    // 捕获全局JavaScript错误
    window.addEventListener('error', (event) => {
      this.logError({
        type: 'render',
        message: event.message,
        stack: event.error?.stack,
        context: { 
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno
        },
        severity: 'high'
      })
    })
  }

  /**
   * 通知用户
   */
  private notifyUser(message: string): void {
    // 这里可以集成到您的通知系统
    console.warn('User notification:', message)
  }

  /**
   * 获取错误统计
   */
  getErrorStats() {
    const now = Date.now()
    const recentErrors = this.errors.filter(e => now - e.timestamp < 300000) // 5分钟内
    
    const errorsByType = recentErrors.reduce((acc, error) => {
      acc[error.type] = (acc[error.type] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    
    const errorsBySeverity = recentErrors.reduce((acc, error) => {
      acc[error.severity] = (acc[error.severity] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    
    return {
      totalErrors: this.errors.length,
      recentErrors: recentErrors.length,
      errorsByType,
      errorsBySeverity,
      metrics: { ...this.metrics }
    }
  }

  /**
   * 获取性能报告
   */
  getPerformanceReport() {
    return {
      metrics: { ...this.metrics },
      recommendations: this.generateRecommendations(),
      timestamp: Date.now()
    }
  }

  /**
   * 生成性能建议
   */
  private generateRecommendations(): string[] {
    const recommendations: string[] = []
    
    if (this.metrics.renderTime > 16) {
      recommendations.push('渲染时间过长，考虑优化markdown解析或使用更小的渲染块')
    }
    
    if (this.metrics.bufferEfficiency < 0.7) {
      recommendations.push('缓冲效率较低，考虑调整安全点检测策略')
    }
    
    if (this.metrics.cacheHitRate < 0.5) {
      recommendations.push('缓存命中率较低，考虑增加缓存大小或优化缓存策略')
    }
    
    if (this.metrics.scrollResponsiveness < 0.8) {
      recommendations.push('滚动响应性较差，考虑减少滚动时的DOM操作')
    }
    
    if (this.metrics.memoryUsage > 0.8) {
      recommendations.push('内存使用率较高，考虑清理缓存或减少内存占用')
    }
    
    return recommendations
  }

  /**
   * 清理资源
   */
  destroy(): void {
    if (this.performanceObserver) {
      this.performanceObserver.disconnect()
      this.performanceObserver = null
    }
    
    this.errors = []
  }
}

