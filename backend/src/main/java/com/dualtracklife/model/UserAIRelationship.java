package com.dualtracklife.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * 用户与AI角色的关系模型
 * 记录用户与每个AI角色的交互历史和关系深度
 */
@Entity
@Table(name = "user_ai_relationships")
public class UserAIRelationship {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private Long userId;
    
    @Column(nullable = false)
    private String roleId;
    
    // 关系深度 (1-10)
    @Column(nullable = false)
    private Integer relationshipLevel = 1;
    
    // 总对话次数
    @Column(nullable = false)
    private Integer totalConversations = 0;
    
    // 最后对话时间
    private LocalDateTime lastConversationAt;
    
    // 用户对该角色的偏好设置 (JSON格式)
    @Column(length = 2000)
    private String userPreferences;
    
    // AI角色对用户的了解和洞察 (JSON格式)
    @Column(length = 5000)
    private String roleInsights;
    
    // 用户对该角色的满意度评分 (1-5)
    private Float satisfactionScore;
    
    // 该角色是否为用户的主要导师
    @Column(nullable = false)
    private Boolean isPrimaryMentor = false;
    
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // 构造函数
    public UserAIRelationship() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }
    
    public UserAIRelationship(Long userId, String roleId) {
        this();
        this.userId = userId;
        this.roleId = roleId;
    }
    
    // 增加对话次数并更新关系
    public void incrementConversation() {
        this.totalConversations++;
        this.lastConversationAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        
        // 根据对话次数自动提升关系等级
        if (this.totalConversations >= 50 && this.relationshipLevel < 10) {
            this.relationshipLevel = Math.min(10, this.relationshipLevel + 1);
        } else if (this.totalConversations >= 20 && this.relationshipLevel < 5) {
            this.relationshipLevel = Math.min(5, this.relationshipLevel + 1);
        } else if (this.totalConversations >= 5 && this.relationshipLevel < 3) {
            this.relationshipLevel = Math.min(3, this.relationshipLevel + 1);
        }
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    
    public String getRoleId() { return roleId; }
    public void setRoleId(String roleId) { this.roleId = roleId; }
    
    public Integer getRelationshipLevel() { return relationshipLevel; }
    public void setRelationshipLevel(Integer relationshipLevel) { this.relationshipLevel = relationshipLevel; }
    
    public Integer getTotalConversations() { return totalConversations; }
    public void setTotalConversations(Integer totalConversations) { this.totalConversations = totalConversations; }
    
    public LocalDateTime getLastConversationAt() { return lastConversationAt; }
    public void setLastConversationAt(LocalDateTime lastConversationAt) { this.lastConversationAt = lastConversationAt; }
    
    public String getUserPreferences() { return userPreferences; }
    public void setUserPreferences(String userPreferences) { this.userPreferences = userPreferences; }
    
    public String getRoleInsights() { return roleInsights; }
    public void setRoleInsights(String roleInsights) { this.roleInsights = roleInsights; }
    
    public Float getSatisfactionScore() { return satisfactionScore; }
    public void setSatisfactionScore(Float satisfactionScore) { this.satisfactionScore = satisfactionScore; }
    
    public Boolean getIsPrimaryMentor() { return isPrimaryMentor; }
    public void setIsPrimaryMentor(Boolean isPrimaryMentor) { this.isPrimaryMentor = isPrimaryMentor; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    
    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}

