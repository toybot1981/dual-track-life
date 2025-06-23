package com.dualtracklife.user.controller;

import com.dualtracklife.user.model.User;
import com.dualtracklife.user.service.UserService;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.Map;
import java.util.HashMap;
import java.util.List;

/**
 * 用户管理控制器
 * 处理用户注册、登录、个人资料管理等功能
 */
@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {
    
    @Autowired
    private UserService userService;
    
    /**
     * 用户注册
     */
    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> register(@RequestBody Map<String, String> request) {
        try {
            String username = request.get("username");
            String email = request.get("email");
            String password = request.get("password");
            
            // 基本验证
            if (username == null || username.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(createErrorResponse("用户名不能为空"));
            }
            if (email == null || email.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(createErrorResponse("邮箱不能为空"));
            }
            if (password == null || password.length() < 6) {
                return ResponseEntity.badRequest().body(createErrorResponse("密码长度至少6位"));
            }
            
            User user = userService.registerUser(username.trim(), email.trim(), password);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "注册成功");
            response.put("user", user.getPublicInfo());
            
            return ResponseEntity.ok(response);
            
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(createErrorResponse(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(createErrorResponse("注册失败，请稍后重试"));
        }
    }
    
    /**
     * 用户登录
     */
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> request) {
        try {
            String usernameOrEmail = request.get("usernameOrEmail");
            String password = request.get("password");
            
            if (usernameOrEmail == null || usernameOrEmail.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(createErrorResponse("用户名或邮箱不能为空"));
            }
            if (password == null || password.isEmpty()) {
                return ResponseEntity.badRequest().body(createErrorResponse("密码不能为空"));
            }
            
            Map<String, Object> result = userService.loginUser(usernameOrEmail.trim(), password);
            return ResponseEntity.ok(result);
            
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(createErrorResponse(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(createErrorResponse("登录失败，请稍后重试"));
        }
    }
    
    /**
     * 用户登出
     */
    @PostMapping("/logout")
    public ResponseEntity<Map<String, Object>> logout(@RequestHeader("Authorization") String sessionId) {
        try {
            userService.logoutUser(sessionId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "登出成功");
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(createErrorResponse("登出失败"));
        }
    }
    
    /**
     * 获取当前用户信息
     */
    @GetMapping("/me")
    public ResponseEntity<Map<String, Object>> getCurrentUser(@RequestHeader("Authorization") String sessionId) {
        try {
            User user = userService.validateSession(sessionId);
            if (user == null) {
                return ResponseEntity.status(401).body(createErrorResponse("会话已过期，请重新登录"));
            }
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("user", user);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(createErrorResponse("获取用户信息失败"));
        }
    }
    
    /**
     * 更新用户资料
     */
    @PutMapping("/me")
    public ResponseEntity<Map<String, Object>> updateProfile(
            @RequestHeader("Authorization") String sessionId,
            @RequestBody Map<String, Object> updates) {
        try {
            User currentUser = userService.validateSession(sessionId);
            if (currentUser == null) {
                return ResponseEntity.status(401).body(createErrorResponse("会话已过期，请重新登录"));
            }
            
            User updatedUser = userService.updateUserProfile(currentUser.getId(), updates);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "资料更新成功");
            response.put("user", updatedUser);
            
            return ResponseEntity.ok(response);
            
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(createErrorResponse(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(createErrorResponse("更新失败，请稍后重试"));
        }
    }
    
    /**
     * 修改密码
     */
    @PostMapping("/change-password")
    public ResponseEntity<Map<String, Object>> changePassword(
            @RequestHeader("Authorization") String sessionId,
            @RequestBody Map<String, String> request) {
        try {
            User currentUser = userService.validateSession(sessionId);
            if (currentUser == null) {
                return ResponseEntity.status(401).body(createErrorResponse("会话已过期，请重新登录"));
            }
            
            String oldPassword = request.get("oldPassword");
            String newPassword = request.get("newPassword");
            
            if (oldPassword == null || oldPassword.isEmpty()) {
                return ResponseEntity.badRequest().body(createErrorResponse("请输入原密码"));
            }
            if (newPassword == null || newPassword.length() < 6) {
                return ResponseEntity.badRequest().body(createErrorResponse("新密码长度至少6位"));
            }
            
            userService.changePassword(currentUser.getId(), oldPassword, newPassword);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "密码修改成功");
            
            return ResponseEntity.ok(response);
            
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(createErrorResponse(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(createErrorResponse("密码修改失败"));
        }
    }
    
    /**
     * 获取用户统计信息
     */
    @GetMapping("/me/stats")
    public ResponseEntity<Map<String, Object>> getUserStats(@RequestHeader("Authorization") String sessionId) {
        try {
            User currentUser = userService.validateSession(sessionId);
            if (currentUser == null) {
                return ResponseEntity.status(401).body(createErrorResponse("会话已过期，请重新登录"));
            }
            
            Map<String, Object> stats = userService.getUserStats(currentUser.getId());
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("stats", stats);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(createErrorResponse("获取统计信息失败"));
        }
    }
    
    /**
     * 根据ID获取用户公开信息
     */
    @GetMapping("/{userId}")
    public ResponseEntity<Map<String, Object>> getUserById(@PathVariable Long userId) {
        try {
            User user = userService.getUserById(userId);
            if (user == null) {
                return ResponseEntity.notFound().build();
            }
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("user", user.getPublicInfo());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(createErrorResponse("获取用户信息失败"));
        }
    }
    
    /**
     * 搜索用户
     */
    @GetMapping("/search")
    public ResponseEntity<Map<String, Object>> searchUsers(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "10") int limit) {
        try {
            if (keyword == null || keyword.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(createErrorResponse("搜索关键词不能为空"));
            }
            
            List<User> users = userService.searchUsers(keyword.trim(), limit);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("users", users);
            response.put("total", users.size());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(createErrorResponse("搜索失败"));
        }
    }
    
    /**
     * 验证邮箱
     */
    @PostMapping("/verify-email")
    public ResponseEntity<Map<String, Object>> verifyEmail(@RequestHeader("Authorization") String sessionId) {
        try {
            User currentUser = userService.validateSession(sessionId);
            if (currentUser == null) {
                return ResponseEntity.status(401).body(createErrorResponse("会话已过期，请重新登录"));
            }
            
            userService.verifyEmail(currentUser.getId());
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "邮箱验证成功");
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(createErrorResponse("邮箱验证失败"));
        }
    }
    
    /**
     * 获取系统统计信息（管理员功能）
     */
    @GetMapping("/admin/stats")
    public ResponseEntity<Map<String, Object>> getSystemStats() {
        try {
            List<User> allUsers = userService.getAllUsers();
            int onlineCount = userService.getOnlineUserCount();
            
            Map<String, Object> stats = new HashMap<>();
            stats.put("totalUsers", allUsers.size());
            stats.put("activeUsers", allUsers.stream().mapToInt(u -> u.getIsActive() ? 1 : 0).sum());
            stats.put("onlineUsers", onlineCount);
            stats.put("verifiedUsers", allUsers.stream().mapToInt(u -> u.getEmailVerified() ? 1 : 0).sum());
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("stats", stats);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(createErrorResponse("获取系统统计失败"));
        }
    }
    
    /**
     * 获取活跃会话（管理员功能）
     */
    @GetMapping("/admin/sessions")
    public ResponseEntity<Map<String, Object>> getActiveSessions() {
        try {
            List<Map<String, Object>> sessions = userService.getActiveSessions();
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("sessions", sessions);
            response.put("total", sessions.size());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(createErrorResponse("获取会话信息失败"));
        }
    }
    
    // 辅助方法
    private Map<String, Object> createErrorResponse(String message) {
        Map<String, Object> response = new HashMap<>();
        response.put("success", false);
        response.put("error", message);
        return response;
    }
}

