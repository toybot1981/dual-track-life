package com.dualtracklife.user.service;

import com.dualtracklife.user.model.User;
import org.springframework.stereotype.Service;
import jakarta.annotation.PostConstruct;

import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

/**
 * 用户管理服务
 * 负责用户注册、登录、个人资料管理等功能
 */
@Service
public class UserService {
    
    // 内存存储 - 实际项目中应该使用数据库
    private final Map<Long, User> users = new ConcurrentHashMap<>();
    private final Map<String, User> usersByUsername = new ConcurrentHashMap<>();
    private final Map<String, User> usersByEmail = new ConcurrentHashMap<>();
    private final Map<String, String> activeSessions = new ConcurrentHashMap<>(); // sessionId -> userId
    
    private Long nextUserId = 1L;
    
    @PostConstruct
    public void initializeDefaultUsers() {
        // 创建默认演示用户
        User demoUser = createUser("demo_user", "demo@dualtracklife.com", "demo123");
        demoUser.setDisplayName("演示用户");
        demoUser.setBio("这是一个演示账户，用于体验双轨人生的所有功能。");
        demoUser.setEmailVerified(true);
        
        User testUser = createUser("test_user", "test@dualtracklife.com", "test123");
        testUser.setDisplayName("测试用户");
        testUser.setBio("测试账户");
        testUser.setEmailVerified(true);
    }
    
    /**
     * 用户注册
     */
    public User registerUser(String username, String email, String password) {
        // 验证用户名和邮箱是否已存在
        if (usersByUsername.containsKey(username)) {
            throw new RuntimeException("用户名已存在");
        }
        if (usersByEmail.containsKey(email)) {
            throw new RuntimeException("邮箱已被注册");
        }
        
        // 创建新用户
        User user = createUser(username, email, password);
        return user;
    }
    
    /**
     * 用户登录
     */
    public Map<String, Object> loginUser(String usernameOrEmail, String password) {
        User user = null;
        
        // 支持用户名或邮箱登录
        if (usernameOrEmail.contains("@")) {
            user = usersByEmail.get(usernameOrEmail);
        } else {
            user = usersByUsername.get(usernameOrEmail);
        }
        
        if (user == null) {
            throw new RuntimeException("用户不存在");
        }
        
        if (!user.getIsActive()) {
            throw new RuntimeException("账户已被禁用");
        }
        
        // 简单密码验证（实际项目中应该使用加密验证）
        if (!user.getPassword().equals(password)) {
            throw new RuntimeException("密码错误");
        }
        
        // 更新最后登录时间
        user.updateLastLogin();
        
        // 生成会话ID
        String sessionId = UUID.randomUUID().toString();
        activeSessions.put(sessionId, user.getId().toString());
        
        // 返回登录结果
        Map<String, Object> result = new HashMap<>();
        result.put("success", true);
        result.put("sessionId", sessionId);
        result.put("user", user.getPublicInfo());
        result.put("message", "登录成功");
        
        return result;
    }
    
    /**
     * 用户登出
     */
    public void logoutUser(String sessionId) {
        activeSessions.remove(sessionId);
    }
    
    /**
     * 验证会话
     */
    public User validateSession(String sessionId) {
        String userId = activeSessions.get(sessionId);
        if (userId == null) {
            return null;
        }
        return getUserById(Long.valueOf(userId));
    }
    
    /**
     * 根据ID获取用户
     */
    public User getUserById(Long userId) {
        return users.get(userId);
    }
    
    /**
     * 根据用户名获取用户
     */
    public User getUserByUsername(String username) {
        return usersByUsername.get(username);
    }
    
    /**
     * 根据邮箱获取用户
     */
    public User getUserByEmail(String email) {
        return usersByEmail.get(email);
    }
    
    /**
     * 更新用户资料
     */
    public User updateUserProfile(Long userId, Map<String, Object> updates) {
        User user = users.get(userId);
        if (user == null) {
            throw new RuntimeException("用户不存在");
        }
        
        // 更新允许的字段
        if (updates.containsKey("displayName")) {
            user.setDisplayName((String) updates.get("displayName"));
        }
        if (updates.containsKey("bio")) {
            user.setBio((String) updates.get("bio"));
        }
        if (updates.containsKey("avatarUrl")) {
            user.setAvatarUrl((String) updates.get("avatarUrl"));
        }
        if (updates.containsKey("birthDate")) {
            user.setBirthDate((String) updates.get("birthDate"));
        }
        if (updates.containsKey("gender")) {
            user.setGender((String) updates.get("gender"));
        }
        if (updates.containsKey("location")) {
            user.setLocation((String) updates.get("location"));
        }
        if (updates.containsKey("occupation")) {
            user.setOccupation((String) updates.get("occupation"));
        }
        if (updates.containsKey("privacyLevel")) {
            user.setPrivacyLevel((String) updates.get("privacyLevel"));
        }
        
        user.preUpdate();
        return user;
    }
    
    /**
     * 修改密码
     */
    public void changePassword(Long userId, String oldPassword, String newPassword) {
        User user = users.get(userId);
        if (user == null) {
            throw new RuntimeException("用户不存在");
        }
        
        if (!user.getPassword().equals(oldPassword)) {
            throw new RuntimeException("原密码错误");
        }
        
        user.setPassword(newPassword);
        user.preUpdate();
    }
    
    /**
     * 获取所有用户（管理员功能）
     */
    public List<User> getAllUsers() {
        return new ArrayList<>(users.values());
    }
    
    /**
     * 搜索用户
     */
    public List<User> searchUsers(String keyword, int limit) {
        return users.values().stream()
                .filter(user -> user.getIsActive())
                .filter(user -> 
                    user.getUsername().toLowerCase().contains(keyword.toLowerCase()) ||
                    user.getDisplayName().toLowerCase().contains(keyword.toLowerCase()) ||
                    (user.getBio() != null && user.getBio().toLowerCase().contains(keyword.toLowerCase()))
                )
                .limit(limit)
                .map(User::getPublicInfo)
                .collect(Collectors.toList());
    }
    
    /**
     * 获取用户统计信息
     */
    public Map<String, Object> getUserStats(Long userId) {
        User user = users.get(userId);
        if (user == null) {
            throw new RuntimeException("用户不存在");
        }
        
        Map<String, Object> stats = new HashMap<>();
        stats.put("userId", userId);
        stats.put("username", user.getUsername());
        stats.put("joinDate", user.getCreatedAt());
        stats.put("lastLogin", user.getLastLoginAt());
        stats.put("profileCompleteness", calculateProfileCompleteness(user));
        stats.put("isActive", user.getIsActive());
        stats.put("emailVerified", user.getEmailVerified());
        
        return stats;
    }
    
    /**
     * 计算个人资料完整度
     */
    private int calculateProfileCompleteness(User user) {
        int total = 10;
        int completed = 0;
        
        if (user.getDisplayName() != null && !user.getDisplayName().isEmpty()) completed++;
        if (user.getBio() != null && !user.getBio().isEmpty()) completed++;
        if (user.getAvatarUrl() != null && !user.getAvatarUrl().isEmpty()) completed++;
        if (user.getBirthDate() != null && !user.getBirthDate().isEmpty()) completed++;
        if (user.getGender() != null && !user.getGender().isEmpty()) completed++;
        if (user.getLocation() != null && !user.getLocation().isEmpty()) completed++;
        if (user.getOccupation() != null && !user.getOccupation().isEmpty()) completed++;
        if (user.getEmailVerified()) completed++;
        if (user.getPrimaryMentorRoleId() != null) completed++;
        completed++; // 基础信息（用户名、邮箱）
        
        return (completed * 100) / total;
    }
    
    /**
     * 验证邮箱
     */
    public void verifyEmail(Long userId) {
        User user = users.get(userId);
        if (user != null) {
            user.setEmailVerified(true);
            user.preUpdate();
        }
    }
    
    /**
     * 禁用/启用用户
     */
    public void toggleUserStatus(Long userId, boolean isActive) {
        User user = users.get(userId);
        if (user != null) {
            user.setIsActive(isActive);
            user.preUpdate();
            
            // 如果禁用用户，清除其所有会话
            if (!isActive) {
                activeSessions.entrySet().removeIf(entry -> 
                    entry.getValue().equals(userId.toString()));
            }
        }
    }
    
    /**
     * 获取在线用户数量
     */
    public int getOnlineUserCount() {
        return activeSessions.size();
    }
    
    /**
     * 获取活跃会话信息
     */
    public List<Map<String, Object>> getActiveSessions() {
        return activeSessions.entrySet().stream()
                .map(entry -> {
                    Map<String, Object> session = new HashMap<>();
                    session.put("sessionId", entry.getKey());
                    session.put("userId", entry.getValue());
                    User user = getUserById(Long.valueOf(entry.getValue()));
                    if (user != null) {
                        session.put("username", user.getUsername());
                        session.put("lastLogin", user.getLastLoginAt());
                    }
                    return session;
                })
                .collect(Collectors.toList());
    }
    
    // 私有辅助方法
    private User createUser(String username, String email, String password) {
        User user = new User(username, email, password);
        user.setId(nextUserId++);
        
        users.put(user.getId(), user);
        usersByUsername.put(username, user);
        usersByEmail.put(email, user);
        
        return user;
    }
}

