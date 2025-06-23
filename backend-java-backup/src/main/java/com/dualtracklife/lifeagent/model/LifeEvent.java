package com.dualtracklife.lifeagent.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

/**
 * 增强的人生事件模型
 * 支持更丰富的事件类型和AI分析
 */
@Entity
@Table(name = "life_events")
public class LifeEvent {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private Long userId;
    
    @Column(nullable = false, length = 200)
    private String title;
    
    @Column(length = 5000)
    private String description;
    
    // 事件类型：achievement, learning, challenge, reflection, relationship, career, health, daily
    @Column(nullable = false)
    private String eventType;
    
    // 事件发生日期
    @Column(nullable = false)
    private LocalDate eventDate;
    
    // 情感状态：excited, happy, calm, thoughtful, worried, sad, angry, confused
    private String emotionalState;
    
    // 情绪强度 (1-10)
    private Integer emotionalIntensity;
    
    // 事件重要性 (1-10)
    private Integer importanceLevel;
    
    // 是否为人生里程碑
    @Column(nullable = false)
    private Boolean isMilestone = false;
    
    // 事件标签 (JSON格式)
    private String tags;
    
    // 相关的人生领域：career, health, relationship, learning, finance, personal_growth
    private String lifeDomains;
    
    // 事件影响的时间范围：immediate, short_term, medium_term, long_term
    private String impactTimeframe;
    
    // 媒体附件 (JSON格式存储文件路径)
    private String mediaAttachments;
    
    // AI分析结果ID
    private Long aiAnalysisId;
    
    // 关联的AI角色建议
    private String recommendedRoles;
    
    // 事件状态：draft, completed, archived
    @Column(nullable = false)
    private String status = "completed";
    
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // 构造函数
    public LifeEvent() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }
    
    public LifeEvent(Long userId, String title, String eventType, LocalDate eventDate) {
        this();
        this.userId = userId;
        this.title = title;
        this.eventType = eventType;
        this.eventDate = eventDate;
    }
    
    // 业务方法
    public boolean isRecentEvent() {
        return this.eventDate.isAfter(LocalDate.now().minusDays(30));
    }
    
    public boolean isHighImpact() {
        return this.importanceLevel != null && this.importanceLevel >= 8;
    }
    
    public boolean needsAIAnalysis() {
        return this.aiAnalysisId == null && (this.isHighImpact() || this.isMilestone);
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public String getEventType() { return eventType; }
    public void setEventType(String eventType) { this.eventType = eventType; }
    
    public LocalDate getEventDate() { return eventDate; }
    public void setEventDate(LocalDate eventDate) { this.eventDate = eventDate; }
    
    public String getEmotionalState() { return emotionalState; }
    public void setEmotionalState(String emotionalState) { this.emotionalState = emotionalState; }
    
    public Integer getEmotionalIntensity() { return emotionalIntensity; }
    public void setEmotionalIntensity(Integer emotionalIntensity) { this.emotionalIntensity = emotionalIntensity; }
    
    public Integer getImportanceLevel() { return importanceLevel; }
    public void setImportanceLevel(Integer importanceLevel) { this.importanceLevel = importanceLevel; }
    
    public Boolean getIsMilestone() { return isMilestone; }
    public void setIsMilestone(Boolean isMilestone) { this.isMilestone = isMilestone; }
    
    public String getTags() { return tags; }
    public void setTags(String tags) { this.tags = tags; }
    
    public String getLifeDomains() { return lifeDomains; }
    public void setLifeDomains(String lifeDomains) { this.lifeDomains = lifeDomains; }
    
    public String getImpactTimeframe() { return impactTimeframe; }
    public void setImpactTimeframe(String impactTimeframe) { this.impactTimeframe = impactTimeframe; }
    
    public String getMediaAttachments() { return mediaAttachments; }
    public void setMediaAttachments(String mediaAttachments) { this.mediaAttachments = mediaAttachments; }
    
    public Long getAiAnalysisId() { return aiAnalysisId; }
    public void setAiAnalysisId(Long aiAnalysisId) { this.aiAnalysisId = aiAnalysisId; }
    
    public String getRecommendedRoles() { return recommendedRoles; }
    public void setRecommendedRoles(String recommendedRoles) { this.recommendedRoles = recommendedRoles; }
    
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    
    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}

