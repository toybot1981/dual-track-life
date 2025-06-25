/**
 * SmartScroller - 智能滚动管理器
 * 基于Manus最佳实践，实现智能的滚动行为管理
 */
import { ErrorHandler } from './ErrorHandler'

export class SmartScroller {
  private container: HTMLElement
  private isUserScrolling: boolean = false
  private scrollThreshold: number = 100
  private scrollTimer: number | null = null
  private autoScrollEnabled: boolean = true
  private lastScrollTop: number = 0
  private scrollDirection: 'up' | 'down' = 'down'
  private errorHandler: ErrorHandler

  constructor(container: HTMLElement, options: Partial<SmartScrollerOptions> = {}) {
    this.container = container
    this.scrollThreshold = options.scrollThreshold || 100
    this.autoScrollEnabled = options.autoScrollEnabled !== false
    this.errorHandler = new ErrorHandler()
    
    this.setupEventListeners()
  }

  /**
   * 设置事件监听器
   */
  private setupEventListeners(): void {
    this.container.addEventListener('scroll', this.handleScroll.bind(this), { passive: true })
    this.container.addEventListener('wheel', this.handleWheel.bind(this), { passive: true })
    this.container.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: true })
    this.container.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: true })
  }

  /**
   * 处理滚动事件
   */
  private handleScroll(): void {
    const currentScrollTop = this.container.scrollTop
    this.scrollDirection = currentScrollTop > this.lastScrollTop ? 'down' : 'up'
    this.lastScrollTop = currentScrollTop
    
    // 检测用户是否在主动滚动
    if (this.scrollDirection === 'up' || !this.isNearBottom()) {
      this.setUserScrolling(true)
    }
    
    this.resetScrollTimer()
  }

  /**
   * 处理鼠标滚轮事件
   */
  private handleWheel(): void {
    this.setUserScrolling(true)
    this.resetScrollTimer()
  }

  /**
   * 处理触摸开始事件
   */
  private handleTouchStart(): void {
    this.setUserScrolling(true)
  }

  /**
   * 处理触摸移动事件
   */
  private handleTouchMove(): void {
    this.setUserScrolling(true)
    this.resetScrollTimer()
  }

  /**
   * 设置用户滚动状态
   */
  private setUserScrolling(scrolling: boolean): void {
    this.isUserScrolling = scrolling
    
    if (scrolling) {
      this.container.classList.add('user-scrolling')
    } else {
      this.container.classList.remove('user-scrolling')
    }
  }

  /**
   * 重置滚动计时器
   */
  private resetScrollTimer(): void {
    if (this.scrollTimer) {
      clearTimeout(this.scrollTimer)
    }
    
    this.scrollTimer = window.setTimeout(() => {
      this.setUserScrolling(false)
    }, 1500) // 1.5秒后认为用户停止滚动
  }

  /**
   * 检查是否接近底部
   */
  private isNearBottom(): boolean {
    const { scrollTop, scrollHeight, clientHeight } = this.container
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight
    return distanceFromBottom <= this.scrollThreshold
  }

  /**
   * 检查是否应该自动滚动
   */
  shouldAutoScroll(): boolean {
    return this.autoScrollEnabled && 
           this.isNearBottom() && 
           !this.isUserScrolling &&
           this.scrollDirection === 'down'
  }

  /**
   * 平滑滚动到底部
   */
  smoothScrollToBottom(): void {
    if (this.shouldAutoScroll()) {
      this.errorHandler.monitorScrollPerformance(() => {
        this.container.scrollTo({
          top: this.container.scrollHeight,
          behavior: 'smooth'
        })
      })
    }
  }

  /**
   * 立即滚动到底部
   */
  scrollToBottom(): void {
    this.errorHandler.monitorScrollPerformance(() => {
      this.container.scrollTop = this.container.scrollHeight
    })
  }

  /**
   * 滚动到指定元素
   */
  scrollToElement(element: HTMLElement, behavior: ScrollBehavior = 'smooth'): void {
    this.errorHandler.monitorScrollPerformance(() => {
      element.scrollIntoView({ 
        behavior, 
        block: 'nearest',
        inline: 'nearest'
      })
    })
  }

  /**
   * 启用/禁用自动滚动
   */
  setAutoScrollEnabled(enabled: boolean): void {
    this.autoScrollEnabled = enabled
  }

  /**
   * 获取滚动状态
   */
  getScrollState() {
    const { scrollTop, scrollHeight, clientHeight } = this.container
    
    return {
      scrollTop,
      scrollHeight,
      clientHeight,
      distanceFromBottom: scrollHeight - scrollTop - clientHeight,
      isNearBottom: this.isNearBottom(),
      isUserScrolling: this.isUserScrolling,
      scrollDirection: this.scrollDirection,
      autoScrollEnabled: this.autoScrollEnabled,
      performance: this.errorHandler.getPerformanceReport().metrics
    }
  }

  /**
   * 获取性能报告
   */
  getPerformanceReport() {
    return this.errorHandler.getPerformanceReport()
  }

  /**
   * 销毁滚动管理器
   */
  destroy(): void {
    if (this.scrollTimer) {
      clearTimeout(this.scrollTimer)
    }
    
    this.container.removeEventListener('scroll', this.handleScroll.bind(this))
    this.container.removeEventListener('wheel', this.handleWheel.bind(this))
    this.container.removeEventListener('touchstart', this.handleTouchStart.bind(this))
    this.container.removeEventListener('touchmove', this.handleTouchMove.bind(this))
    
    this.errorHandler.destroy()
  }
}

export interface SmartScrollerOptions {
  scrollThreshold: number
  autoScrollEnabled: boolean
}

