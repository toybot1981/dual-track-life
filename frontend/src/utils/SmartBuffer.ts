/**
 * SmartBuffer - 智能缓冲类
 * 基于Manus最佳实践，实现智能的流式数据缓冲和安全渲染点检测
 */
export class SmartBuffer {
  private buffer: string = ''
  private lastSafePoint: number = 0
  private pendingContent: string = ''

  constructor() {
    this.reset()
  }

  /**
   * 添加新的数据块
   * @param chunk 新接收的数据块
   * @returns 可安全渲染的内容，如果没有安全点则返回null
   */
  addChunk(chunk: string): string | null {
    this.buffer += chunk
    
    // 寻找安全的渲染点
    const safePoint = this.findSafeRenderPoint()
    if (safePoint > this.lastSafePoint) {
      const renderableContent = this.buffer.slice(0, safePoint)
      this.lastSafePoint = safePoint
      this.pendingContent = this.buffer.slice(safePoint)
      return renderableContent
    }
    
    return null // 等待更多数据
  }

  /**
   * 获取完整的缓冲内容
   */
  getFullContent(): string {
    return this.buffer
  }

  /**
   * 获取待处理的内容
   */
  getPendingContent(): string {
    return this.pendingContent
  }

  /**
   * 重置缓冲区
   */
  reset(): void {
    this.buffer = ''
    this.lastSafePoint = 0
    this.pendingContent = ''
  }

  /**
   * 寻找安全的渲染点
   * 避免在markdown语法中间截断
   */
  private findSafeRenderPoint(): number {
    const patterns = [
      // 段落边界（双换行）
      { regex: /\n\n/g, priority: 10 },
      
      // 标题或列表前的换行
      { regex: /\n(?=[#\-\*\+\d])/g, priority: 8 },
      
      // 中文句号后
      { regex: /[。！？]\s*/g, priority: 6 },
      
      // 英文句号后
      { regex: /[.!?]\s+/g, priority: 6 },
      
      // 逗号后（优先级较低）
      { regex: /[，,]\s*/g, priority: 3 },
      
      // 单个换行（最低优先级）
      { regex: /\n/g, priority: 1 }
    ]

    let bestSafePoint = 0
    let bestPriority = 0

    patterns.forEach(({ regex, priority }) => {
      let match
      regex.lastIndex = 0 // 重置正则表达式状态
      
      while ((match = regex.exec(this.buffer)) !== null) {
        const position = match.index + match[0].length
        
        // 确保不在markdown语法中间
        if (this.isPositionSafe(position) && priority >= bestPriority) {
          bestSafePoint = position
          bestPriority = priority
        }
      }
    })

    return bestSafePoint
  }

  /**
   * 检查位置是否安全（不在markdown语法中间）
   */
  private isPositionSafe(position: number): boolean {
    const beforeContext = this.buffer.slice(Math.max(0, position - 20), position)
    const afterContext = this.buffer.slice(position, Math.min(this.buffer.length, position + 20))
    
    // 检查是否在代码块中间
    const codeBlockPattern = /```/g
    const beforeMatches = (beforeContext.match(codeBlockPattern) || []).length
    if (beforeMatches % 2 === 1) {
      return false // 在代码块中间
    }
    
    // 检查是否在行内代码中间
    const inlineCodePattern = /`/g
    const beforeInlineMatches = (beforeContext.match(inlineCodePattern) || []).length
    if (beforeInlineMatches % 2 === 1) {
      return false // 在行内代码中间
    }
    
    // 检查是否在链接语法中间
    if (beforeContext.includes('[') && !beforeContext.includes(']') && afterContext.includes(']')) {
      return false // 在链接文本中间
    }
    
    if (beforeContext.includes('](') && !beforeContext.includes(')') && afterContext.includes(')')) {
      return false // 在链接URL中间
    }
    
    // 检查是否在表格中间
    if (beforeContext.includes('|') && afterContext.includes('|')) {
      const lineStart = beforeContext.lastIndexOf('\n')
      const lineContent = beforeContext.slice(lineStart) + afterContext.slice(0, afterContext.indexOf('\n'))
      if (lineContent.includes('|')) {
        return false // 在表格行中间
      }
    }
    
    return true
  }

  /**
   * 获取缓冲区统计信息
   */
  getStats() {
    return {
      totalLength: this.buffer.length,
      lastSafePoint: this.lastSafePoint,
      pendingLength: this.pendingContent.length,
      safeRatio: this.buffer.length > 0 ? this.lastSafePoint / this.buffer.length : 0
    }
  }
}

