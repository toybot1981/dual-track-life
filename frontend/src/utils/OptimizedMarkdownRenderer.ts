/**
 * OptimizedMarkdownRenderer - 基于markdown-it-sse-template和官方文档优化的渲染器
 * 结合了最佳实践和SSE流式渲染优化
 */

import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'

export interface MarkdownRenderOptions {
  // 渲染模式
  mode: 'stream' | 'complete'
  // 是否启用HTML
  enableHtml: boolean
  // 是否启用链接转换
  enableLinkify: boolean
  // 是否启用排版优化
  enableTypographer: boolean
  // 是否启用代码高亮
  enableHighlight: boolean
  // 自定义CSS类前缀
  cssPrefix?: string
}

export class OptimizedMarkdownRenderer {
  private streamRenderer: MarkdownIt
  private completeRenderer: MarkdownIt
  private renderCache = new Map<string, string>()
  private maxCacheSize = 100

  constructor() {
    this.initializeRenderers()
  }

  /**
   * 初始化渲染器
   */
  private initializeRenderers() {
    // 流式渲染器 - 性能优先，功能简化
    this.streamRenderer = new MarkdownIt({
      html: false,           // 流式时禁用HTML以提升安全性和性能
      breaks: true,          // 适合聊天场景的换行处理
      linkify: false,        // 流式时禁用链接转换以提升性能
      typographer: false,    // 流式时禁用排版优化以提升性能
      langPrefix: 'hljs language-'
    })

    // 完整渲染器 - 功能完整，质量优先
    this.completeRenderer = new MarkdownIt({
      html: true,            // 启用HTML支持
      breaks: true,          // 保持换行处理一致性
      linkify: true,         // 启用自动链接转换
      typographer: true,     // 启用智能排版
      langPrefix: 'hljs language-',
      highlight: this.highlightCode.bind(this)
    })

    // 配置linkify选项
    this.completeRenderer.linkify.set({ 
      fuzzyEmail: false,     // 禁用模糊邮箱检测
      fuzzyLink: true,       // 启用模糊链接检测
      fuzzyIP: false         // 禁用IP地址检测
    })
  }

  /**
   * 代码高亮处理
   */
  private highlightCode(str: string, lang: string): string {
    if (lang && hljs.getLanguage(lang)) {
      try {
        const result = hljs.highlight(str, { 
          language: lang,
          ignoreIllegals: true 
        })
        return `<pre class="hljs"><code class="hljs language-${lang}">${result.value}</code></pre>`
      } catch (error) {
        console.warn('Code highlighting failed:', error)
      }
    }
    
    // 回退到普通代码块
    return `<pre class="hljs"><code>${this.escapeHtml(str)}</code></pre>`
  }

  /**
   * HTML转义
   */
  private escapeHtml(text: string): string {
    const map: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    }
    return text.replace(/[&<>"']/g, (m) => map[m])
  }

  /**
   * 主渲染方法
   */
  render(content: string, options: Partial<MarkdownRenderOptions> = {}): string {
    const opts: MarkdownRenderOptions = {
      mode: 'complete',
      enableHtml: true,
      enableLinkify: true,
      enableTypographer: true,
      enableHighlight: true,
      ...options
    }

    // 生成缓存键
    const cacheKey = `${opts.mode}-${JSON.stringify(opts)}-${content}`
    
    // 检查缓存
    if (this.renderCache.has(cacheKey)) {
      return this.renderCache.get(cacheKey)!
    }

    let result: string

    try {
      if (opts.mode === 'stream') {
        result = this.renderStream(content, opts)
      } else {
        result = this.renderComplete(content, opts)
      }

      // 后处理
      result = this.postProcess(result, opts)

      // 缓存结果
      this.cacheResult(cacheKey, result)

      return result
    } catch (error) {
      console.error('Markdown rendering failed:', error)
      // 错误回退
      return this.renderFallback(content)
    }
  }

  /**
   * 流式渲染
   */
  private renderStream(content: string, options: MarkdownRenderOptions): string {
    // 预处理流式内容
    const processedContent = this.preprocessStreamContent(content)
    
    // 使用简化渲染器
    return this.streamRenderer.render(processedContent)
  }

  /**
   * 完整渲染
   */
  private renderComplete(content: string, options: MarkdownRenderOptions): string {
    // 预处理完整内容
    const processedContent = this.preprocessCompleteContent(content)
    
    // 使用完整渲染器
    return this.completeRenderer.render(processedContent)
  }

  /**
   * 预处理流式内容
   */
  private preprocessStreamContent(content: string): string {
    return content
      // 修复标点符号分离
      .replace(/([^\s])\s*\n\s*([？！。，；：、])/g, '$1$2')
      // 清理多余空格
      .replace(/[ \t]+/g, ' ')
      // 清理行尾空格
      .replace(/[ \t]+$/gm, '')
      // 确保标题格式正确
      .replace(/^(#{1,6})([^#\s])/gm, '$1 $2')
  }

  /**
   * 预处理完整内容
   */
  private preprocessCompleteContent(content: string): string {
    return content
      // 修复标点符号分离
      .replace(/([^\s])\s*\n\s*([？！。，；：、])/g, '$1$2')
      // 清理多余空格
      .replace(/[ \t]+/g, ' ')
      // 清理行尾空格
      .replace(/[ \t]+$/gm, '')
      // 确保标题格式正确
      .replace(/^(#{1,6})([^#\s])/gm, '$1 $2')
      // 修正标题前的格式
      .replace(/^(#{1,6})[-]+\s*/gm, '$1 ')
      // 确保标题前后有适当间距
      .replace(/([^\n])\n(#{1,6}\s)/g, '$1\n\n$2')
      .replace(/(#{1,6}\s[^\n]+)\n([^\n#])/g, '$1\n\n$2')
  }

  /**
   * 后处理渲染结果
   */
  private postProcess(html: string, options: MarkdownRenderOptions): string {
    let result = html

    // 添加代码复制按钮
    if (options.enableHighlight) {
      result = this.addCodeCopyButtons(result)
    }

    // 添加表格响应式包装
    result = this.addTableWrapper(result)

    // 添加链接安全属性
    if (options.enableLinkify) {
      result = this.addLinkSecurity(result)
    }

    // 添加自定义CSS类
    if (options.cssPrefix) {
      result = this.addCssPrefix(result, options.cssPrefix)
    }

    return result
  }

  /**
   * 添加代码复制按钮
   */
  private addCodeCopyButtons(html: string): string {
    return html.replace(
      /<pre class="hljs"><code([^>]*)>([\s\S]*?)<\/code><\/pre>/g,
      (match, attrs, code) => {
        const cleanCode = code.replace(/<[^>]*>/g, '')
        return `
          <div class="code-block-wrapper">
            <div class="code-block-header">
              <button class="copy-code-btn" onclick="navigator.clipboard.writeText(\`${cleanCode.replace(/`/g, '\\`')}\`)">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
                复制
              </button>
            </div>
            <pre class="hljs"><code${attrs}>${code}</code></pre>
          </div>
        `
      }
    )
  }

  /**
   * 添加表格响应式包装
   */
  private addTableWrapper(html: string): string {
    return html.replace(
      /<table>/g,
      '<div class="table-wrapper"><table>'
    ).replace(
      /<\/table>/g,
      '</table></div>'
    )
  }

  /**
   * 添加链接安全属性
   */
  private addLinkSecurity(html: string): string {
    return html.replace(
      /<a href="([^"]*)"([^>]*)>/g,
      '<a href="$1" target="_blank" rel="noopener noreferrer"$2>'
    )
  }

  /**
   * 添加CSS前缀
   */
  private addCssPrefix(html: string, prefix: string): string {
    return `<div class="${prefix}">${html}</div>`
  }

  /**
   * 错误回退渲染
   */
  private renderFallback(content: string): string {
    return `<div class="markdown-error">
      <p>Markdown渲染出现错误，显示原始内容：</p>
      <pre>${this.escapeHtml(content)}</pre>
    </div>`
  }

  /**
   * 缓存结果
   */
  private cacheResult(key: string, result: string) {
    // LRU缓存策略
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
  }

  /**
   * 获取缓存统计
   */
  getCacheStats() {
    return {
      size: this.renderCache.size,
      maxSize: this.maxCacheSize,
      hitRate: this.renderCache.size / this.maxCacheSize
    }
  }

  /**
   * 检查markdown语法完整性（用于SSE流式处理）
   */
  isMarkdownComplete(content: string, position: number): boolean {
    const beforeCursor = content.slice(0, position)
    const afterCursor = content.slice(position)

    // 检查是否在代码块中间
    const codeBlockMatches = beforeCursor.match(/```/g)
    if (codeBlockMatches && codeBlockMatches.length % 2 === 1) {
      return false
    }

    // 检查是否在标题中间
    const lines = beforeCursor.split('\n')
    const lastLine = lines[lines.length - 1]
    if (/^#{1,6}\s*$/.test(lastLine)) {
      return false
    }

    // 检查是否在链接中间
    const linkPattern = /\[([^\]]*)\]\([^)]*$/
    if (linkPattern.test(beforeCursor)) {
      return false
    }

    return true
  }
}

// 导出单例实例
export const markdownRenderer = new OptimizedMarkdownRenderer()

