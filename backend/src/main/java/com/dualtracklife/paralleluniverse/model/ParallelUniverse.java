package com.dualtracklife.paralleluniverse.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * 平行宇宙模型
 * 对应数据库中的parallel_universes表
 */
@Entity
@Table(name = "parallel_universes")
public class ParallelUniverse {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private Long userId;
    
    @Column(nullable = false, length = 200)
    private String title;
    
    @Column(length = 5000)
    private String description;
    
    // 主题：career, relationship, education, health, finance, adventure
    private String theme;
    
    // 模式：optimistic, pessimistic, realistic, creative
    private String mode;
    
    // 触发事件ID
    private Long triggerEventId;
    
    // 状态：active, completed, archived
    @Column(nullable = false)
    private String status = "active";
    
    // 统计数据 (JSON格式)
    @Column(length = 2000)
    private String stats;
    
    // 时间线 (JSON格式)
    @Column(length = 5000)
    private String timeline;
    
    // 洞察和分析 (JSON格式)
    @Column(length = 3000)
    private String insights;
    
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // 构造函数
    public ParallelUniverse() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }
    
    public ParallelUniverse(Long userId, String title, String theme, String mode) {
        this();
        this.userId = userId;
        this.title = title;
        this.theme = theme;
        this.mode = mode;
    }
    
    // 业务方法
    public boolean isActive() {
        return "active".equals(this.status);
    }
    
    public boolean isCompleted() {
        return "completed".equals(this.status);
    }
    
    public void complete() {
        this.status = "completed";
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
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public String getTheme() { return theme; }
    public void setTheme(String theme) { this.theme = theme; }
    
    public String getMode() { return mode; }
    public void setMode(String mode) { this.mode = mode; }
    
    public Long getTriggerEventId() { return triggerEventId; }
    public void setTriggerEventId(Long triggerEventId) { this.triggerEventId = triggerEventId; }
    
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    
    public String getStats() { return stats; }
    public void setStats(String stats) { this.stats = stats; }
    
    public String getTimeline() { return timeline; }
    public void setTimeline(String timeline) { this.timeline = timeline; }
    
    public String getInsights() { return insights; }
    public void setInsights(String insights) { this.insights = insights; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    
    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}

