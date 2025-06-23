package com.dualtracklife.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * AI对话会话模型
 * 管理用户与AI角色的对话会话
 */
@Entity
@Table(name = "ai_conversations")
public class AIConversation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private Long userId;
    
    @Column(nullable = false)
    private String roleId;
    
    @Column(nullable = false, length = 200)
    private String sessionTitle;
    
    // 会话类型：general_chat, event_analysis, goal_planning, emotional_support, decision_making
    @Column(nullable = false)
    private String conversationType;
    
    // 关联的人生事件ID（如果是基于事件的对话）
    private Long relatedEventId;
    
    // 关联的目标ID（如果是基于目标的对话）
    private Long relatedGoalId;
    
    // 会话状态：active, paused, completed, archived
    @Column(nullable = false)
    private String status = "active";
    
    // 会话摘要
    @Column(length = 1000)
    private String summary;
    
    // 关键洞察和建议
    @Column(length = 2000)
    private String keyInsights;
    
    // 用户满意度评分 (1-5)
    private Float satisfactionRating;
    
    // 会话开始时间
    @Column(nullable = false)
    private LocalDateTime startedAt;
    
    // 最后活跃时间
    private LocalDateTime lastActiveAt;
    
    // 会话结束时间
    private LocalDateTime endedAt;
    
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // 构造函数
    public AIConversation() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        this.startedAt = LocalDateTime.now();
        this.lastActiveAt = LocalDateTime.now();
    }
    
    public AIConversation(Long userId, String roleId, String conversationType) {
        this();
        this.userId = userId;
        this.roleId = roleId;
        this.conversationType = conversationType;
        this.sessionTitle = generateSessionTitle(conversationType);
    }
    
    // 业务方法
    private String generateSessionTitle(String type) {
        switch (type) {
            case "event_analysis": return "人生事件深度分析";
            case "goal_planning": return "目标规划讨论";
            case "emotional_support": return "情感支持对话";
            case "decision_making": return "重要决策咨询";
            default: return "日常交流";
        }
    }
    
    public void updateLastActive() {
        this.lastActiveAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }
    
    public void completeSession(String summary, String insights) {
        this.status = "completed";
        this.endedAt = LocalDateTime.now();
        this.summary = summary;
        this.keyInsights = insights;
        this.updatedAt = LocalDateTime.now();
    }
    
    public boolean isActive() {
        return "active".equals(this.status);
    }
    
    public long getDurationMinutes() {
        LocalDateTime endTime = this.endedAt != null ? this.endedAt : LocalDateTime.now();
        return java.time.Duration.between(this.startedAt, endTime).toMinutes();
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    
    public String getRoleId() { return roleId; }
    public void setRoleId(String roleId) { this.roleId = roleId; }
    
    public String getSessionTitle() { return sessionTitle; }
    public void setSessionTitle(String sessionTitle) { this.sessionTitle = sessionTitle; }
    
    public String getConversationType() { return conversationType; }
    public void setConversationType(String conversationType) { this.conversationType = conversationType; }
    
    public Long getRelatedEventId() { return relatedEventId; }
    public void setRelatedEventId(Long relatedEventId) { this.relatedEventId = relatedEventId; }
    
    public Long getRelatedGoalId() { return relatedGoalId; }
    public void setRelatedGoalId(Long relatedGoalId) { this.relatedGoalId = relatedGoalId; }
    
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    
    public String getSummary() { return summary; }
    public void setSummary(String summary) { this.summary = summary; }
    
    public String getKeyInsights() { return keyInsights; }
    public void setKeyInsights(String keyInsights) { this.keyInsights = keyInsights; }
    
    public Float getSatisfactionRating() { return satisfactionRating; }
    public void setSatisfactionRating(Float satisfactionRating) { this.satisfactionRating = satisfactionRating; }
    
    public LocalDateTime getStartedAt() { return startedAt; }
    public void setStartedAt(LocalDateTime startedAt) { this.startedAt = startedAt; }
    
    public LocalDateTime getLastActiveAt() { return lastActiveAt; }
    public void setLastActiveAt(LocalDateTime lastActiveAt) { this.lastActiveAt = lastActiveAt; }
    
    public LocalDateTime getEndedAt() { return endedAt; }
    public void setEndedAt(LocalDateTime endedAt) { this.endedAt = endedAt; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    
    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}

