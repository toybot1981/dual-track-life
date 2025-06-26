/**
 * ProgressiveRenderer - 渐进式渲染器
 * 基于markdown-it-sse-template优化，集成OptimizedMarkdownRenderer
 */

import { markdownRenderer, type MarkdownRenderOptions } from './OptimizedMarkdownRenderer'
import { ErrorHandler } from './ErrorHandler'

export type RenderPhase = 'text' | 'basic' | 'markdown' | 'enhanced'

export interface ProgressiveRenderOptions {
  phase: RenderPhase
  enableCache: boolean
  enableHighlight: boolean
  enableLinkify: boolean
  cssPrefix?: string
}

export class ProgressiveRenderer {
  private errorHandler: ErrorHandler
  private renderCache = new Map<string, string>()
  private maxCacheSize = 50

  constructor() {
    this.errorHandler = new ErrorHandler()
  }

  /**
   * 主渲染方法
   */
  render(content: string, options: Partial<ProgressiveRenderOptions> = {}): string {
    const opts: ProgressiveRenderOptions = {
      phase: 'markdown',
      enableCache: true,
      enableHighlight: true,
      enableLinkify: true,
      ...options
    }

    const startTime = performance.now()

    try {
      let result: string

      switch (opts.phase) {
        case 'text':
          result = this.renderText(content)
          break
        case 'basic':
          result = this.renderBasic(content)
          break
        case 'markdown':
          result = this.renderMarkdown(content, opts)
          break
        case 'enhanced':
          result = this.renderEnhanced(content, opts)
          break
        default:
          result = this.renderMarkdown(content, opts)
      }

      // 性能监控
      const renderTime = performance.now() - startTime
      this.errorHandler.monitorPerformance('render', renderTime)

      return result
    } catch (error) {
      return this.errorHandler.safeRender(() => {
        throw error
      }, () => content)
    }
  }

  /**
   * 纯文本渲染（流式阶段）
   */
  private renderText(content: string): string {
    return content
      .replace(/\n/g, '<br>')
      .replace(/[ \t]+/g, ' ')
      .trim()
  }

  /**
   * 基础格式渲染
   */
  private renderBasic(content: string): string {
    return content
      // 基础粗体
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      // 基础斜体
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      // 基础换行
      .replace(/\n/g, '<br>')
      // 清理空格
      .replace(/[ \t]+/g, ' ')
      .trim()
  }

  /**
   * 完整Markdown渲染
   */
  private renderMarkdown(content: string, options: ProgressiveRenderOptions): string {
    const cacheKey = `markdown-${JSON.stringify(options)}-${content}`
    
    if (options.enableCache && this.renderCache.has(cacheKey)) {
      return this.renderCache.get(cacheKey)!
    }

    const markdownOptions: Partial<MarkdownRenderOptions> = {
      mode: 'complete',
      enableHtml: true,
      enableLinkify: options.enableLinkify,
      enableTypographer: true,
      enableHighlight: options.enableHighlight,
      cssPrefix: options.cssPrefix
    }

    const result = markdownRenderer.render(content, markdownOptions)

    if (options.enableCache) {
      this.cacheResult(cacheKey, result)
    }

    return result
  }

  /**
   * 增强渲染（添加额外功能）
   */
  private renderEnhanced(content: string, options: ProgressiveRenderOptions): string {
    let result = this.renderMarkdown(content, options)

    // 添加数学公式支持（如果需要）
    result = this.addMathSupport(result)

    // 添加图表支持（如果需要）
    result = this.addChartSupport(result)

    // 添加任务列表支持
    result = this.addTaskListSupport(result)

    return result
  }

  /**
   * 添加数学公式支持
   */
  private addMathSupport(html: string): string {
    // 简单的数学公式支持
    return html.replace(
      /\$\$(.*?)\$\$/g,
      '<div class="math-block">$1</div>'
    ).replace(
      /\$(.*?)\$/g,
      '<span class="math-inline">$1</span>'
    )
  }

  /**
   * 添加图表支持
   */
  private addChartSupport(html: string): string {
    // 简单的图表标记支持
    return html.replace(
      /```chart\n([\s\S]*?)\n```/g,
      '<div class="chart-container" data-chart="$1">图表加载中...</div>'
    )
  }

  /**
   * 添加任务列表支持
   */
  private addTaskListSupport(html: string): string {
    return html
      .replace(/- \[ \]/g, '<input type="checkbox" disabled> ')
      .replace(/- \[x\]/g, '<input type="checkbox" checked disabled> ')
  }

  /**
   * 流式渲染专用方法
   */
  renderStream(content: string): string {
    const markdownOptions: Partial<MarkdownRenderOptions> = {
      mode: 'stream',
      enableHtml: false,
      enableLinkify: false,
      enableTypographer: false,
      enableHighlight: false
    }

    return markdownRenderer.render(content, markdownOptions)
  }

  /**
   * 检查markdown完整性
   */
  isMarkdownComplete(content: string, position: number): boolean {
    return markdownRenderer.isMarkdownComplete(content, position)
  }

  /**
   * 缓存结果
   */
  private cacheResult(key: string, result: string) {
    if (this.renderCache.size >= this.maxCacheSize) {
      const firstKey = this.renderCache.keys().next().value
      this.renderCache.delete(firstKey)
    }
    this.renderCache.set(key, result)
  }

  /**
   * 清理缓存
   */
  clearCache() {
    this.renderCache.clear()
    markdownRenderer.clearCache()
  }

  /**
   * 获取性能统计
   */
  getPerformanceStats() {
    return {
      cache: {
        size: this.renderCache.size,
        maxSize: this.maxCacheSize,
        hitRate: this.renderCache.size / this.maxCacheSize
      },
      markdown: markdownRenderer.getCacheStats(),
      errors: this.errorHandler.getErrorStats()
    }
  }
}

// 导出单例实例
export const progressiveRenderer = new ProgressiveRenderer()

