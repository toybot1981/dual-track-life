package com.dualtracklife.controller;

import com.dualtracklife.model.*;
import com.dualtracklife.service.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.beans.factory.annotation.Autowired;

import java.time.LocalDate;
import java.util.Map;
import java.util.HashMap;
import java.util.List;

/**
 * 增强的Life Agent REST API控制器
 * 支持AI角色管理、人生轨迹分析和智能对话
 * 
 * @author Life Agent Team
 */
@RestController
@RequestMapping("/api/life-agent")
@CrossOrigin(origins = "*")
public class LifeAgentController {
    
    @Autowired
    private AIRoleService aiRoleService;
    
    @Autowired
    private LifeTrajectoryService lifeTrajectoryService;
    
    @Autowired
    private AIConversationService aiConversationService;
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private EventService eventService;
    
    /**
     * 健康检查接口
     */
    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> health() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "UP");
        response.put("service", "Life Agent Enhanced");
        response.put("version", "2.0.0");
        response.put("timestamp", System.currentTimeMillis());
        response.put("features", new String[]{"AI角色管理", "人生轨迹分析", "智能对话"});
        return ResponseEntity.ok(response);
    }
    
    // ==================== AI角色管理相关接口 ====================
    
    /**
     * 获取所有AI角色
     */
    @GetMapping("/roles")
    public ResponseEntity<List<AIRole>> getAllRoles() {
        List<AIRole> roles = aiRoleService.getAllActiveRoles();
        return ResponseEntity.ok(roles);
    }
    
    /**
     * 获取特定AI角色信息
     */
    @GetMapping("/roles/{roleId}")
    public ResponseEntity<AIRole> getRole(@PathVariable String roleId) {
        AIRole role = aiRoleService.getRoleById(roleId);
        if (role == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(role);
    }
    
    /**
     * 获取用户与AI角色的关系
     */
    @GetMapping("/users/{userId}/roles/{roleId}/relationship")
    public ResponseEntity<UserAIRelationship> getUserRoleRelationship(
            @PathVariable Long userId, @PathVariable String roleId) {
        UserAIRelationship relationship = aiRoleService.getUserRoleRelationship(userId, roleId);
        return ResponseEntity.ok(relationship);
    }
    
    /**
     * 设置主要AI导师
     */
    @PostMapping("/users/{userId}/primary-mentor")
    public ResponseEntity<Map<String, Object>> setPrimaryMentor(
            @PathVariable Long userId, @RequestBody Map<String, String> request) {
        String roleId = request.get("roleId");
        aiRoleService.setPrimaryMentor(userId, roleId);
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "主要导师设置成功");
        response.put("primaryMentor", roleId);
        return ResponseEntity.ok(response);
    }
    
    /**
     * 获取用户最常交流的AI角色
     */
    @GetMapping("/users/{userId}/most-interacted-roles")
    public ResponseEntity<List<String>> getMostInteractedRoles(@PathVariable Long userId) {
        List<String> roles = aiRoleService.getMostInteractedRoles(userId, 5);
        return ResponseEntity.ok(roles);
    }
    
    // ==================== 人生事件管理相关接口 ====================
    
    /**
     * 添加人生事件
     */
    @PostMapping("/users/{userId}/events")
    public ResponseEntity<LifeEvent> addLifeEvent(@PathVariable Long userId, @RequestBody Map<String, Object> request) {
        LifeEvent event = new LifeEvent();
        event.setUserId(userId);
        event.setTitle((String) request.get("title"));
        event.setDescription((String) request.get("description"));
        event.setEventType((String) request.get("eventType"));
        event.setEventDate(LocalDate.parse((String) request.get("eventDate")));
        event.setEmotionalState((String) request.get("emotionalState"));
        
        if (request.get("emotionalIntensity") != null) {
            event.setEmotionalIntensity((Integer) request.get("emotionalIntensity"));
        }
        if (request.get("importanceLevel") != null) {
            event.setImportanceLevel((Integer) request.get("importanceLevel"));
        }
        
        LifeEvent savedEvent = lifeTrajectoryService.addLifeEvent(event);
        return ResponseEntity.ok(savedEvent);
    }
    
    /**
     * 获取用户的人生轨迹概览
     */
    @GetMapping("/users/{userId}/trajectory-overview")
    public ResponseEntity<LifeTrajectoryService.LifeTrajectoryOverview> getTrajectoryOverview(@PathVariable Long userId) {
        LifeTrajectoryService.LifeTrajectoryOverview overview = lifeTrajectoryService.getTrajectoryOverview(userId);
        return ResponseEntity.ok(overview);
    }
    
    /**
     * 获取用户的所有人生事件
     */
    @GetMapping("/users/{userId}/events")
    public ResponseEntity<List<LifeEvent>> getUserEvents(@PathVariable Long userId) {
        List<LifeEvent> events = lifeTrajectoryService.getUserEvents(userId);
        return ResponseEntity.ok(events);
    }
    
    /**
     * 分析事件关联性
     */
    @GetMapping("/users/{userId}/event-connections")
    public ResponseEntity<List<LifeTrajectoryService.EventConnection>> analyzeEventConnections(@PathVariable Long userId) {
        List<LifeTrajectoryService.EventConnection> connections = lifeTrajectoryService.analyzeEventConnections(userId);
        return ResponseEntity.ok(connections);
    }
    
    /**
     * 预测未来趋势
     */
    @GetMapping("/users/{userId}/future-trends")
    public ResponseEntity<LifeTrajectoryService.FutureTrendPrediction> predictFutureTrends(@PathVariable Long userId) {
        LifeTrajectoryService.FutureTrendPrediction prediction = lifeTrajectoryService.predictFutureTrends(userId);
        return ResponseEntity.ok(prediction);
    }
    
    /**
     * 为事件推荐AI角色
     */
    @PostMapping("/events/recommend-roles")
    public ResponseEntity<Map<String, Object>> recommendRolesForEvent(@RequestBody LifeEvent event) {
        List<String> recommendedRoles = aiRoleService.recommendMultipleRoles(event);
        
        Map<String, Object> response = new HashMap<>();
        response.put("recommendedRoles", recommendedRoles);
        response.put("primaryRecommendation", recommendedRoles.isEmpty() ? null : recommendedRoles.get(0));
        return ResponseEntity.ok(response);
    }
    
    // ==================== AI对话相关接口 ====================
    
    /**
     * 开始新的对话会话
     */
    @PostMapping("/users/{userId}/conversations")
    public ResponseEntity<AIConversation> startConversation(
            @PathVariable Long userId, @RequestBody Map<String, Object> request) {
        String roleId = (String) request.get("roleId");
        String conversationType = (String) request.get("conversationType");
        
        AIConversation conversation = aiConversationService.startConversation(userId, roleId, conversationType);
        return ResponseEntity.ok(conversation);
    }
    
    /**
     * 基于人生事件开始对话
     */
    @PostMapping("/users/{userId}/events/{eventId}/start-conversation")
    public ResponseEntity<AIConversation> startEventBasedConversation(
            @PathVariable Long userId, @PathVariable Long eventId) {
        // 这里应该从数据库获取事件，现在使用模拟数据
        LifeEvent event = new LifeEvent();
        event.setId(eventId);
        event.setUserId(userId);
        event.setTitle("模拟事件");
        event.setEventType("reflection");
        event.setImportanceLevel(7);
        
        AIConversation conversation = aiConversationService.startEventBasedConversation(userId, event);
        return ResponseEntity.ok(conversation);
    }
    
    /**
     * 发送消息并获取AI回复
     */
    @PostMapping("/conversations/{conversationId}/messages")
    public ResponseEntity<AIMessage> chatWithAI(
            @PathVariable Long conversationId, @RequestBody Map<String, Object> request) {
        Long userId = Long.valueOf(request.get("userId").toString());
        String userMessage = (String) request.get("message");
        
        AIMessage aiResponse = aiConversationService.chatWithAI(conversationId, userId, userMessage);
        return ResponseEntity.ok(aiResponse);
    }
    
    /**
     * 获取对话历史
     */
    @GetMapping("/conversations/{conversationId}/messages")
    public ResponseEntity<List<AIMessage>> getConversationHistory(
            @PathVariable Long conversationId,
            @RequestParam(defaultValue = "50") int limit) {
        List<AIMessage> messages = aiConversationService.getConversationHistory(conversationId, limit);
        return ResponseEntity.ok(messages);
    }
    
    /**
     * 获取用户的所有对话会话
     */
    @GetMapping("/users/{userId}/conversations")
    public ResponseEntity<List<AIConversation>> getUserConversations(@PathVariable Long userId) {
        List<AIConversation> conversations = aiConversationService.getUserConversations(userId);
        return ResponseEntity.ok(conversations);
    }
    
    /**
     * 获取用户与特定角色的对话会话
     */
    @GetMapping("/users/{userId}/roles/{roleId}/conversations")
    public ResponseEntity<List<AIConversation>> getUserRoleConversations(
            @PathVariable Long userId, @PathVariable String roleId) {
        List<AIConversation> conversations = aiConversationService.getUserRoleConversations(userId, roleId);
        return ResponseEntity.ok(conversations);
    }
    
    /**
     * 切换AI角色
     */
    @PostMapping("/conversations/{conversationId}/switch-role")
    public ResponseEntity<AIConversation> switchRole(
            @PathVariable Long conversationId, @RequestBody Map<String, String> request) {
        String newRoleId = request.get("newRoleId");
        String reason = request.get("reason");
        
        AIConversation newConversation = aiConversationService.switchRole(conversationId, newRoleId, reason);
        return ResponseEntity.ok(newConversation);
    }
    
    /**
     * 结束对话会话
     */
    @PostMapping("/conversations/{conversationId}/end")
    public ResponseEntity<Map<String, Object>> endConversation(
            @PathVariable Long conversationId, @RequestBody Map<String, String> request) {
        String summary = request.get("summary");
        String insights = request.get("insights");
        
        aiConversationService.endConversation(conversationId, summary, insights);
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "对话会话已结束");
        return ResponseEntity.ok(response);
    }
    
    /**
     * 获取对话统计信息
     */
    @GetMapping("/users/{userId}/conversation-stats")
    public ResponseEntity<AIConversationService.ConversationStats> getConversationStats(@PathVariable Long userId) {
        AIConversationService.ConversationStats stats = aiConversationService.getConversationStats(userId);
        return ResponseEntity.ok(stats);
    }
    
    // ==================== 综合分析接口 ====================
    
    /**
     * 获取用户的完整分析报告
     */
    @GetMapping("/users/{userId}/comprehensive-analysis")
    public ResponseEntity<Map<String, Object>> getComprehensiveAnalysis(@PathVariable Long userId) {
        Map<String, Object> analysis = new HashMap<>();
        
        // 人生轨迹概览
        LifeTrajectoryService.LifeTrajectoryOverview trajectory = lifeTrajectoryService.getTrajectoryOverview(userId);
        analysis.put("trajectoryOverview", trajectory);
        
        // 对话统计
        AIConversationService.ConversationStats conversationStats = aiConversationService.getConversationStats(userId);
        analysis.put("conversationStats", conversationStats);
        
        // 未来趋势预测
        LifeTrajectoryService.FutureTrendPrediction futureTrends = lifeTrajectoryService.predictFutureTrends(userId);
        analysis.put("futureTrends", futureTrends);
        
        // 最常交流的AI角色
        List<String> mostInteractedRoles = aiRoleService.getMostInteractedRoles(userId, 3);
        analysis.put("mostInteractedRoles", mostInteractedRoles);
        
        // 主要导师
        String primaryMentor = aiRoleService.getPrimaryMentor(userId);
        analysis.put("primaryMentor", primaryMentor);
        
        return ResponseEntity.ok(analysis);
    }
    
    // ==================== 兼容性接口 ====================
    
    /**
     * 基础对话接口（保持向后兼容）
     */
    @PostMapping("/chat")
    public ResponseEntity<Map<String, Object>> chat(@RequestBody Map<String, Object> request) {
        String userId = (String) request.get("userId");
        String message = (String) request.get("message");
        
        Map<String, Object> response = new HashMap<>();
        response.put("userId", userId);
        response.put("message", "您好！我是您的智能人生助手。现在我有了更强大的能力，包括5个专业的AI角色可以为您提供不同领域的指导。您可以通过新的API接口体验更丰富的功能！");
        response.put("timestamp", System.currentTimeMillis());
        response.put("type", "response");
        response.put("suggestion", "建议使用 /api/life-agent/roles 接口查看所有可用的AI角色");
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * 获取用户信息接口（增强版）
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<Map<String, Object>> getUserInfo(@PathVariable String userId) {
        try {
            Long userIdLong = Long.valueOf(userId);
            User user = userService.getUserById(userIdLong);
            
            if (user == null) {
                Map<String, Object> response = new HashMap<>();
                response.put("userId", userId);
                response.put("name", "用户" + userId);
                response.put("status", "demo");
                response.put("joinDate", "2024-01-01");
                response.put("availableFeatures", new String[]{"AI角色对话", "人生轨迹分析", "智能推荐", "趋势预测"});
                return ResponseEntity.ok(response);
            }
            
            Map<String, Object> response = new HashMap<>();
            response.put("userId", user.getId());
            response.put("username", user.getUsername());
            response.put("displayName", user.getDisplayName());
            response.put("status", user.getIsActive() ? "active" : "inactive");
            response.put("joinDate", user.getCreatedAt().toLocalDate());
            response.put("lastLogin", user.getLastLoginAt());
            response.put("emailVerified", user.getEmailVerified());
            response.put("availableFeatures", new String[]{"AI角色对话", "人生轨迹分析", "智能推荐", "趋势预测", "事件管理"});
            
            return ResponseEntity.ok(response);
            
        } catch (NumberFormatException e) {
            // 兼容字符串userId的情况
            Map<String, Object> response = new HashMap<>();
            response.put("userId", userId);
            response.put("name", "用户" + userId);
            response.put("status", "demo");
            response.put("joinDate", "2024-01-01");
            response.put("availableFeatures", new String[]{"AI角色对话", "人生轨迹分析", "智能推荐", "趋势预测"});
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(createErrorResponse("获取用户信息失败"));
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

