/**
 * ProgressiveRenderer - 渐进式渲染器
 * 基于Manus最佳实践，实现多阶段渲染策略
 */
import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'
import { ErrorHandler } from './ErrorHandler'

export type RenderPhase = 'text' | 'basic' | 'markdown' | 'enhanced'

export interface RenderOptions {
  phase: RenderPhase
  isStreaming: boolean
  enableCache: boolean
}

export class ProgressiveRenderer {
  private md: MarkdownIt
  private cache: Map<string, string> = new Map()
  private maxCacheSize: number = 100
  private errorHandler: ErrorHandler

  constructor() {
    this.errorHandler = new ErrorHandler()
    
    // 配置markdown-it
    this.md = new MarkdownIt({
      html: true,
      linkify: true,
      typographer: true,
      breaks: true,
      highlight: function(code, lang) {
        if (lang && hljs.getLanguage(lang)) {
          try {
            return hljs.highlight(code, { language: lang }).value
          } catch (err) {
            console.error('Highlight.js error:', err)
          }
        }
        return hljs.highlightAuto(code).value
      }
    })
  }

  /**
   * 主渲染方法
   */
  render(content: string, options: Partial<RenderOptions> = {}): string {
    const opts: RenderOptions = {
      phase: 'markdown',
      isStreaming: false,
      enableCache: true,
      ...options
    }

    // 检查缓存
    if (opts.enableCache && !opts.isStreaming) {
      const cacheKey = this.generateCacheKey(content, opts)
      const cached = this.cache.get(cacheKey)
      if (cached) {
        this.errorHandler.recordCacheHit(true)
        return cached
      }
      this.errorHandler.recordCacheHit(false)
    }

    // 使用错误处理包装器进行安全渲染
    const result = this.errorHandler.safeRender(
      () => this.renderByPhase(content, opts.phase, opts.isStreaming),
      () => this.safeRender(content),
      `${opts.phase}-render`
    )

    // 缓存结果
    if (opts.enableCache && !opts.isStreaming) {
      this.setCachedResult(content, opts, result)
    }

    return result
  }

  /**
   * 按阶段渲染
   */
  private renderByPhase(content: string, phase: RenderPhase, isStreaming: boolean): string {
    switch (phase) {
      case 'text':
        return this.textOnlyRender(content)
      
      case 'basic':
        return this.basicFormattingRender(content)
      
      case 'markdown':
        return this.fullMarkdownRender(content, isStreaming)
      
      case 'enhanced':
        return this.enhancedRender(content)
      
      default:
        return this.textOnlyRender(content)
    }
  }

  /**
   * 纯文本渲染（流式传输时使用）
   */
  private textOnlyRender(content: string): string {
    return content
      // 基本的标点符号修复
      .replace(/([^\s])\s*\n\s*([？！。，；：、])/g, '$1$2')
      // 清理多余空格
      .replace(/[ \t]+/g, ' ')
      .replace(/[ \t]+$/gm, '')
      // 转换换行为HTML
      .replace(/\n/g, '<br>')
  }

  /**
   * 基础格式化渲染
   */
  private basicFormattingRender(content: string): string {
    return content
      // 标点符号修复
      .replace(/([^\s])\s*\n\s*([？！。，；：、])/g, '$1$2')
      // 基础markdown格式
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      // 简单的标题处理
      .replace(/^(#{1,6})\s*(.+)$/gm, (match, hashes, content) => {
        const level = hashes.length
        return `<h${level}>${content.trim()}</h${level}>`
      })
      // 简单的列表处理
      .replace(/^[-*+]\s+(.+)$/gm, '<li>$1</li>')
      .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')
      // 换行处理
      .replace(/\n/g, '<br>')
  }

  /**
   * 完整markdown渲染
   */
  private fullMarkdownRender(content: string, isStreaming: boolean): string {
    // 预处理内容
    const processedContent = this.preprocessContent(content)
    
    // 使用markdown-it进行完整渲染
    return this.md.render(processedContent)
  }

  /**
   * 增强渲染（包含高级功能）
   */
  private enhancedRender(content: string): string {
    let result = this.fullMarkdownRender(content, false)
    
    // 添加增强功能
    result = this.addEnhancements(result)
    
    return result
  }

  /**
   * 安全渲染（错误回退）
   */
  private safeRender(content: string): string {
    return this.escapeHtml(content).replace(/\n/g, '<br>')
  }

  /**
   * 内容预处理
   */
  private preprocessContent(content: string): string {
    return content
      // 确保markdown标题格式正确
      .replace(/^(#{1,6})([^#\s])/gm, '$1 $2') // 确保#后有空格
      .replace(/^(#{1,6})[-]+\s*/gm, '$1 ') // 修正如'##-'为'## '
      // 标点符号不分离
      .replace(/([^\s])\s*\n\s*([？！。，；：、])/g, '$1$2')
      // 清理多余空格
      .replace(/[ \t]+/g, ' ')
      .replace(/[ \t]+$/gm, '')
      // 确保段落间有适当间距
      .replace(/\n{3,}/g, '\n\n')
      // 修复列表格式
      .replace(/^(\s*)([-*+])\s+/gm, '$1$2 ')
      // 修复引用格式
      .replace(/^>\s*/gm, '> ')
  }

  /**
   * 添加增强功能
   */
  private addEnhancements(html: string): string {
    // 添加代码复制按钮
    html = html.replace(
      /<pre><code class="language-(\w+)">/g,
      '<div class="code-block-wrapper"><div class="code-header"><span class="language">$1</span><button class="copy-btn">复制</button></div><pre><code class="language-$1">'
    )
    
    html = html.replace(
      /<\/code><\/pre>/g,
      '</code></pre></div>'
    )
    
    // 添加表格响应式包装
    html = html.replace(
      /<table>/g,
      '<div class="table-wrapper"><table>'
    )
    
    html = html.replace(
      /<\/table>/g,
      '</table></div>'
    )
    
    return html
  }

  /**
   * HTML转义
   */
  private escapeHtml(text: string): string {
    const div = document.createElement('div')
    div.textContent = text
    return div.innerHTML
  }

  /**
   * 生成缓存键
   */
  private generateCacheKey(content: string, options: RenderOptions): string {
    const contentHash = content.length + '_' + content.slice(0, 50)
    const optionsHash = JSON.stringify(options)
    return `${contentHash}_${optionsHash}`
  }

  /**
   * 设置缓存结果
   */
  private setCachedResult(content: string, options: RenderOptions, result: string): void {
    if (this.cache.size >= this.maxCacheSize) {
      // 删除最旧的缓存项
      const firstKey = this.cache.keys().next().value
      this.cache.delete(firstKey)
    }
    
    const key = this.generateCacheKey(content, options)
    this.cache.set(key, result)
  }

  /**
   * 清理缓存
   */
  clearCache(): void {
    this.cache.clear()
  }

  /**
   * 获取缓存统计
   */
  getCacheStats() {
    return {
      size: this.cache.size,
      maxSize: this.maxCacheSize,
      hitRate: this.errorHandler.getPerformanceReport().metrics.cacheHitRate
    }
  }

  /**
   * 获取性能报告
   */
  getPerformanceReport() {
    return this.errorHandler.getPerformanceReport()
  }

  /**
   * 获取错误统计
   */
  getErrorStats() {
    return this.errorHandler.getErrorStats()
  }

  /**
   * 销毁渲染器
   */
  destroy(): void {
    this.clearCache()
    this.errorHandler.destroy()
  }
}

