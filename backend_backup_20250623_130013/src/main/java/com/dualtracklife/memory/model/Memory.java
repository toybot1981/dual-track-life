package com.dualtracklife.memory.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * 回忆记录模型
 * 用于存储用户的重要回忆和记录
 */
@Entity
@Table(name = "memories")
public class Memory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private Long userId;
    
    @Column(nullable = false, length = 200)
    private String title;
    
    @Column(length = 5000)
    private String content;
    
    // 回忆类型：childhood, youth, achievement, relationship, travel, learning, family
    @Column(nullable = false)
    private String memoryType;
    
    // 回忆日期（可能是过去的日期）
    private LocalDate memoryDate;
    
    // 情感色彩：positive, negative, neutral, mixed
    private String emotionalTone;
    
    // 重要性等级 (1-10)
    private Integer importanceLevel;
    
    // 标签 (JSON格式)
    private String tags;
    
    // 相关人物
    private String relatedPeople;
    
    // 地点
    private String location;
    
    // 媒体附件 (JSON格式存储文件路径)
    private String mediaAttachments;
    
    // 是否私密
    @Column(nullable = false)
    private Boolean isPrivate = true;
    
    // 回忆状态：draft, published, archived
    @Column(nullable = false)
    private String status = "published";
    
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // 构造函数
    public Memory() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }
    
    public Memory(Long userId, String title, String memoryType) {
        this();
        this.userId = userId;
        this.title = title;
        this.memoryType = memoryType;
    }
    
    // 业务方法
    public boolean isRecentMemory() {
        return this.memoryDate != null && this.memoryDate.isAfter(LocalDate.now().minusYears(1));
    }
    
    public boolean isHighImportance() {
        return this.importanceLevel != null && this.importanceLevel >= 8;
    }
    
    public boolean isPositive() {
        return "positive".equals(this.emotionalTone);
    }
    
    public boolean isDraft() {
        return "draft".equals(this.status);
    }
    
    public void publish() {
        this.status = "published";
        this.updatedAt = LocalDateTime.now();
    }
    
    public void archive() {
        this.status = "archived";
        this.updatedAt = LocalDateTime.now();
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    
    public String getMemoryType() { return memoryType; }
    public void setMemoryType(String memoryType) { this.memoryType = memoryType; }
    
    public LocalDate getMemoryDate() { return memoryDate; }
    public void setMemoryDate(LocalDate memoryDate) { this.memoryDate = memoryDate; }
    
    public String getEmotionalTone() { return emotionalTone; }
    public void setEmotionalTone(String emotionalTone) { this.emotionalTone = emotionalTone; }
    
    public Integer getImportanceLevel() { return importanceLevel; }
    public void setImportanceLevel(Integer importanceLevel) { this.importanceLevel = importanceLevel; }
    
    public String getTags() { return tags; }
    public void setTags(String tags) { this.tags = tags; }
    
    public String getRelatedPeople() { return relatedPeople; }
    public void setRelatedPeople(String relatedPeople) { this.relatedPeople = relatedPeople; }
    
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    
    public String getMediaAttachments() { return mediaAttachments; }
    public void setMediaAttachments(String mediaAttachments) { this.mediaAttachments = mediaAttachments; }
    
    public Boolean getIsPrivate() { return isPrivate; }
    public void setIsPrivate(Boolean isPrivate) { this.isPrivate = isPrivate; }
    
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

