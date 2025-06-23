package com.dualtracklife.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

/**
 * AI角色定义模型
 */
@Entity
@Table(name = "ai_roles")
public class AIRole {
    @Id
    private String roleId;
    
    @Column(nullable = false)
    private String roleName;
    
    @Column(nullable = false)
    private String roleType;
    
    @Column(length = 2000)
    private String description;
    
    @Column(length = 5000)
    private String systemPrompt;
    
    @Column(nullable = false)
    private String expertise; // JSON格式存储专业领域
    
    @Column(nullable = false)
    private String personality; // JSON格式存储性格特征
    
    private Float temperature = 0.7f;
    private Integer maxTokens = 1500;
    private String model = "qwen-max";
    
    @Column(nullable = false)
    private Boolean isActive = true;
    
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // 构造函数
    public AIRole() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }
    
    public AIRole(String roleId, String roleName, String roleType) {
        this();
        this.roleId = roleId;
        this.roleName = roleName;
        this.roleType = roleType;
    }
    
    // Getters and Setters
    public String getRoleId() { return roleId; }
    public void setRoleId(String roleId) { this.roleId = roleId; }
    
    public String getRoleName() { return roleName; }
    public void setRoleName(String roleName) { this.roleName = roleName; }
    
    public String getRoleType() { return roleType; }
    public void setRoleType(String roleType) { this.roleType = roleType; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public String getSystemPrompt() { return systemPrompt; }
    public void setSystemPrompt(String systemPrompt) { this.systemPrompt = systemPrompt; }
    
    public String getExpertise() { return expertise; }
    public void setExpertise(String expertise) { this.expertise = expertise; }
    
    public String getPersonality() { return personality; }
    public void setPersonality(String personality) { this.personality = personality; }
    
    public Float getTemperature() { return temperature; }
    public void setTemperature(Float temperature) { this.temperature = temperature; }
    
    public Integer getMaxTokens() { return maxTokens; }
    public void setMaxTokens(Integer maxTokens) { this.maxTokens = maxTokens; }
    
    public String getModel() { return model; }
    public void setModel(String model) { this.model = model; }
    
    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    
    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}

