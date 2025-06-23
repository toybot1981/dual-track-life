package com.dualtracklife.lifeagent.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * AI对话消息模型
 * 存储具体的对话消息内容
 */
@Entity
@Table(name = "ai_messages")
public class AIMessage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private Long conversationId;
    
    @Column(nullable = false)
    private Long userId;
    
    @Column(nullable = false)
    private String roleId;
    
    // 消息类型：user, ai, system
    @Column(nullable = false)
    private String messageType;
    
    @Column(nullable = false, length = 5000)
    private String content;
    
    // 消息上下文信息（JSON格式）
    private String contextInfo;
    
    // AI响应的置信度 (0-1)
    private Float confidence;
    
    // 消息情感分析结果
    private String emotionalAnalysis;
    
    // 用户对AI回复的反馈：helpful, not_helpful, neutral
    private String userFeedback;
    
    // 消息序号（在会话中的顺序）
    @Column(nullable = false)
    private Integer messageOrder;
    
    // 是否为关键消息
    @Column(nullable = false)
    private Boolean isKeyMessage = false;
    
    // 消息标签
    private String tags;
    
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // 构造函数
    public AIMessage() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }
    
    public AIMessage(Long conversationId, Long userId, String roleId, String messageType, String content) {
        this();
        this.conversationId = conversationId;
        this.userId = userId;
        this.roleId = roleId;
        this.messageType = messageType;
        this.content = content;
    }
    
    // 业务方法
    public boolean isUserMessage() {
        return "user".equals(this.messageType);
    }
    
    public boolean isAIMessage() {
        return "ai".equals(this.messageType);
    }
    
    public boolean isSystemMessage() {
        return "system".equals(this.messageType);
    }
    
    public void markAsKey() {
        this.isKeyMessage = true;
        this.updatedAt = LocalDateTime.now();
    }
    
    public void updateUserFeedback(String feedback) {
        this.userFeedback = feedback;
        this.updatedAt = LocalDateTime.now();
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Long getConversationId() { return conversationId; }
    public void setConversationId(Long conversationId) { this.conversationId = conversationId; }
    
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    
    public String getRoleId() { return roleId; }
    public void setRoleId(String roleId) { this.roleId = roleId; }
    
    public String getMessageType() { return messageType; }
    public void setMessageType(String messageType) { this.messageType = messageType; }
    
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    
    public String getContextInfo() { return contextInfo; }
    public void setContextInfo(String contextInfo) { this.contextInfo = contextInfo; }
    
    public Float getConfidence() { return confidence; }
    public void setConfidence(Float confidence) { this.confidence = confidence; }
    
    public String getEmotionalAnalysis() { return emotionalAnalysis; }
    public void setEmotionalAnalysis(String emotionalAnalysis) { this.emotionalAnalysis = emotionalAnalysis; }
    
    public String getUserFeedback() { return userFeedback; }
    public void setUserFeedback(String userFeedback) { this.userFeedback = userFeedback; }
    
    public Integer getMessageOrder() { return messageOrder; }
    public void setMessageOrder(Integer messageOrder) { this.messageOrder = messageOrder; }
    
    public Boolean getIsKeyMessage() { return isKeyMessage; }
    public void setIsKeyMessage(Boolean isKeyMessage) { this.isKeyMessage = isKeyMessage; }
    
    public String getTags() { return tags; }
    public void setTags(String tags) { this.tags = tags; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    
    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}

