package com.dualtracklife.lifeagent.controller;

import com.dualtracklife.lifeagent.service.SpringAIService;
import com.dualtracklife.lifeagent.service.AIConversationService;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.http.MediaType;
import org.springframework.beans.factory.annotation.Autowired;
import reactor.core.publisher.Flux;

import java.util.Map;
import java.util.HashMap;

/**
 * Spring AI增强控制器
 * 提供基于Spring AI的高级对话功能
 */
@RestController
@RequestMapping("/api/spring-ai")
@CrossOrigin(origins = "*")
public class SpringAIController {
    
    @Autowired
    private SpringAIService springAIService;
    
    @Autowired
    private AIConversationService aiConversationService;
    
    /**
     * 健康检查接口
     */
    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> health() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "UP");
        response.put("service", "Spring AI Enhanced Life Agent");
        response.put("version", "3.0.0");
        response.put("timestamp", System.currentTimeMillis());
        response.put("features", new String[]{"Spring AI集成", "阿里云通义千问", "流式对话", "角色化AI"});
        response.put("aiModel", "qwen-max");
        return ResponseEntity.ok(response);
    }
    
    /**
     * 简单AI聊天接口
     */
    @PostMapping("/simple/chat")
    public ResponseEntity<Map<String, Object>> simpleChat(@RequestBody Map<String, Object> request) {
        String query = (String) request.get("query");
        if (query == null || query.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(createErrorResponse("查询内容不能为空"));
        }
        
        try {
            String response = springAIService.simpleChat(query);
            
            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("query", query);
            result.put("response", response);
            result.put("timestamp", System.currentTimeMillis());
            result.put("model", "qwen-max");
            
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(createErrorResponse("AI服务暂时不可用：" + e.getMessage()));
        }
    }
    
    /**
     * 流式AI聊天接口
     */
    @PostMapping(value = "/stream/chat", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public Flux<String> streamChat(@RequestBody Map<String, Object> request) {
        String query = (String) request.get("query");
        System.out.println("[streamChat] 收到请求: query=" + query);
        if (query == null || query.trim().isEmpty()) {
            return Flux.just("错误：查询内容不能为空");
        }
        try {
            return springAIService.streamChat(query)
                .doOnNext(chunk -> System.out.println("[streamChat] 输出: " + chunk));
        } catch (Exception e) {
            System.out.println("[streamChat] 异常: " + e.getMessage());
            return Flux.just("AI服务暂时不可用：" + e.getMessage());
        }
    }
    
    /**
     * 基于角色的AI聊天
     */
    @PostMapping("/role/chat")
    public ResponseEntity<Map<String, Object>> roleBasedChat(@RequestBody Map<String, Object> request) {
        String roleId = (String) request.get("roleId");
        String query = (String) request.get("query");
        String context = (String) request.get("context");
        
        if (roleId == null || query == null) {
            return ResponseEntity.badRequest().body(createErrorResponse("角色ID和查询内容不能为空"));
        }
        
        try {
            String response = springAIService.roleBasedChat(roleId, query, context);
            
            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("roleId", roleId);
            result.put("query", query);
            result.put("response", response);
            result.put("timestamp", System.currentTimeMillis());
            result.put("model", "qwen-max");
            
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(createErrorResponse("AI服务暂时不可用：" + e.getMessage()));
        }
    }
    
    /**
     * 基于角色的流式AI聊天
     */
    @PostMapping(value = "/role/stream/chat", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public Flux<String> roleBasedStreamChat(@RequestBody Map<String, Object> request) {
        String roleId = (String) request.get("roleId");
        String query = (String) request.get("query");
        String context = (String) request.get("context");
        System.out.println("[roleBasedStreamChat] 收到请求: roleId=" + roleId + ", query=" + query + ", context=" + context);
        if (roleId == null || query == null) {
            return Flux.just("错误：角色ID和查询内容不能为空");
        }
        try {
            return springAIService.roleBasedStreamChat(roleId, query, context)
                .doOnNext(chunk -> System.out.println("[roleBasedStreamChat] 输出: " + chunk));
        } catch (Exception e) {
            System.out.println("[roleBasedStreamChat] 异常: " + e.getMessage());
            return Flux.just("AI服务暂时不可用：" + e.getMessage());
        }
    }
    
    /**
     * 事件分析AI聊天
     */
    @PostMapping("/event/analysis")
    public ResponseEntity<Map<String, Object>> eventAnalysis(@RequestBody Map<String, Object> request) {
        String eventTitle = (String) request.get("eventTitle");
        String eventDescription = (String) request.get("eventDescription");
        String eventType = (String) request.get("eventType");
        String userQuery = (String) request.get("userQuery");
        
        if (eventTitle == null || userQuery == null) {
            return ResponseEntity.badRequest().body(createErrorResponse("事件标题和用户问题不能为空"));
        }
        
        try {
            String response = springAIService.eventAnalysisChat(eventTitle, eventDescription, eventType, userQuery);
            
            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("eventTitle", eventTitle);
            result.put("userQuery", userQuery);
            result.put("analysis", response);
            result.put("timestamp", System.currentTimeMillis());
            result.put("analysisType", "event_analysis");
            
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(createErrorResponse("AI分析服务暂时不可用：" + e.getMessage()));
        }
    }
    
    /**
     * 人生轨迹分析
     */
    @PostMapping("/trajectory/analysis")
    public ResponseEntity<Map<String, Object>> trajectoryAnalysis(@RequestBody Map<String, Object> request) {
        String userEvents = (String) request.get("userEvents");
        String analysisType = (String) request.get("analysisType");
        
        if (userEvents == null || analysisType == null) {
            return ResponseEntity.badRequest().body(createErrorResponse("用户事件和分析类型不能为空"));
        }
        
        try {
            String response = springAIService.lifeTrajectoryAnalysis(userEvents, analysisType);
            
            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("analysisType", analysisType);
            result.put("analysis", response);
            result.put("timestamp", System.currentTimeMillis());
            result.put("scope", "life_trajectory");
            
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(createErrorResponse("轨迹分析服务暂时不可用：" + e.getMessage()));
        }
    }
    
    /**
     * 个性化建议生成
     */
    @PostMapping("/personalized/advice")
    public ResponseEntity<Map<String, Object>> personalizedAdvice(@RequestBody Map<String, Object> request) {
        String userProfile = (String) request.get("userProfile");
        String currentSituation = (String) request.get("currentSituation");
        String goals = (String) request.get("goals");
        
        if (userProfile == null || currentSituation == null || goals == null) {
            return ResponseEntity.badRequest().body(createErrorResponse("用户档案、当前情况和目标不能为空"));
        }
        
        try {
            String response = springAIService.generatePersonalizedAdvice(userProfile, currentSituation, goals);
            
            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("advice", response);
            result.put("timestamp", System.currentTimeMillis());
            result.put("adviceType", "personalized");
            
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(createErrorResponse("个性化建议服务暂时不可用：" + e.getMessage()));
        }
    }
    
    /**
     * 情感支持对话
     */
    @PostMapping("/emotional/support")
    public ResponseEntity<Map<String, Object>> emotionalSupport(@RequestBody Map<String, Object> request) {
        String emotionalState = (String) request.get("emotionalState");
        String situation = (String) request.get("situation");
        String userMessage = (String) request.get("userMessage");
        
        if (emotionalState == null || userMessage == null) {
            return ResponseEntity.badRequest().body(createErrorResponse("情感状态和用户消息不能为空"));
        }
        
        try {
            String response = springAIService.emotionalSupportChat(emotionalState, situation, userMessage);
            
            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("emotionalState", emotionalState);
            result.put("support", response);
            result.put("timestamp", System.currentTimeMillis());
            result.put("supportType", "emotional");
            
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(createErrorResponse("情感支持服务暂时不可用：" + e.getMessage()));
        }
    }
    
    /**
     * 决策支持分析
     */
    @PostMapping("/decision/support")
    public ResponseEntity<Map<String, Object>> decisionSupport(@RequestBody Map<String, Object> request) {
        String decision = (String) request.get("decision");
        String options = (String) request.get("options");
        String considerations = (String) request.get("considerations");
        
        if (decision == null || options == null) {
            return ResponseEntity.badRequest().body(createErrorResponse("决策内容和选项不能为空"));
        }
        
        try {
            String response = springAIService.decisionSupportAnalysis(decision, options, considerations);
            
            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("decision", decision);
            result.put("analysis", response);
            result.put("timestamp", System.currentTimeMillis());
            result.put("analysisType", "decision_support");
            
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(createErrorResponse("决策支持服务暂时不可用：" + e.getMessage()));
        }
    }
    
    /**
     * 会话流式聊天（集成到对话管理）
     */
    @PostMapping(value = "/conversation/{conversationId}/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public Flux<String> conversationStreamChat(
            @PathVariable Long conversationId,
            @RequestBody Map<String, Object> request) {
        Long userId = Long.valueOf(request.get("userId").toString());
        String userMessage = (String) request.get("message");
        System.out.println("[conversationStreamChat] 收到请求: conversationId=" + conversationId + ", userId=" + userId + ", message=" + userMessage);
        if (userMessage == null || userMessage.trim().isEmpty()) {
            return Flux.just("错误：消息内容不能为空");
        }
        try {
            return aiConversationService.streamChatWithAI(conversationId, userId, userMessage)
                .doOnNext(chunk -> System.out.println("[conversationStreamChat] 输出: " + chunk));
        } catch (Exception e) {
            System.out.println("[conversationStreamChat] 异常: " + e.getMessage());
            return Flux.just("对话服务暂时不可用：" + e.getMessage());
        }
    }
    
    /**
     * 测试AI连接
     */
    @GetMapping("/test")
    public ResponseEntity<Map<String, Object>> testAI() {
        try {
            String testResponse = springAIService.simpleChat("你好，请简单介绍一下你自己。");
            
            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("message", "AI服务连接正常");
            result.put("testResponse", testResponse);
            result.put("timestamp", System.currentTimeMillis());
            result.put("model", "qwen-max");
            result.put("provider", "阿里云通义千问");
            
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            Map<String, Object> result = new HashMap<>();
            result.put("success", false);
            result.put("message", "AI服务连接失败");
            result.put("error", e.getMessage());
            result.put("timestamp", System.currentTimeMillis());
            
            return ResponseEntity.internalServerError().body(result);
        }
    }
    
    // 辅助方法
    private Map<String, Object> createErrorResponse(String message) {
        Map<String, Object> response = new HashMap<>();
        response.put("success", false);
        response.put("error", message);
        response.put("timestamp", System.currentTimeMillis());
        return response;
    }
}

