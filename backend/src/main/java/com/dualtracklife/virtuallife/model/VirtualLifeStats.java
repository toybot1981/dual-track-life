package com.dualtracklife.virtuallife.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * 虚拟人生统计模型
 * 对应数据库中的virtual_life_stats表
 */
@Entity
@Table(name = "virtual_life_stats")
public class VirtualLifeStats {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private Long userId;
    
    // 幸福度 (0-100)
    @Column(nullable = false)
    private Integer happiness = 50;
    
    // 成功度 (0-100)
    @Column(nullable = false)
    private Integer success = 50;
    
    // 成长度 (0-100)
    @Column(nullable = false)
    private Integer growth = 50;
    
    // 经验值
    @Column(nullable = false)
    private Integer experience = 0;
    
    // 等级
    @Column(nullable = false)
    private Integer level = 1;
    
    private LocalDateTime updatedAt;
    
    // 构造函数
    public VirtualLifeStats() {
        this.updatedAt = LocalDateTime.now();
    }
    
    public VirtualLifeStats(Long userId) {
        this();
        this.userId = userId;
    }
    
    // 业务方法
    public void updateStats(Integer happinessChange, Integer successChange, Integer growthChange, Integer expGain) {
        if (happinessChange != null) {
            this.happiness = Math.max(0, Math.min(100, this.happiness + happinessChange));
        }
        if (successChange != null) {
            this.success = Math.max(0, Math.min(100, this.success + successChange));
        }
        if (growthChange != null) {
            this.growth = Math.max(0, Math.min(100, this.growth + growthChange));
        }
        if (expGain != null) {
            this.experience += expGain;
            // 检查是否升级
            checkLevelUp();
        }
        this.updatedAt = LocalDateTime.now();
    }
    
    private void checkLevelUp() {
        int newLevel = calculateLevel(this.experience);
        if (newLevel > this.level) {
            this.level = newLevel;
        }
    }
    
    private int calculateLevel(int exp) {
        // 简单的等级计算：每100经验升一级
        return Math.max(1, exp / 100 + 1);
    }
    
    public double getOverallScore() {
        return (happiness + success + growth) / 3.0;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    
    public Integer getHappiness() { return happiness; }
    public void setHappiness(Integer happiness) { this.happiness = happiness; }
    
    public Integer getSuccess() { return success; }
    public void setSuccess(Integer success) { this.success = success; }
    
    public Integer getGrowth() { return growth; }
    public void setGrowth(Integer growth) { this.growth = growth; }
    
    public Integer getExperience() { return experience; }
    public void setExperience(Integer experience) { this.experience = experience; }
    
    public Integer getLevel() { return level; }
    public void setLevel(Integer level) { this.level = level; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    
    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}

