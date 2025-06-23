package com.dualtracklife.lifeagent.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.dualtracklife.lifeagent.service.SimpleAIService;

import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/spring-ai")
@CrossOrigin(origins = "*")
public class SimpleSpringAIController {

    @Autowired
    private SimpleAIService simpleAIService;

    @PostMapping("/simple/chat")
    public ResponseEntity<Map<String, Object>> simpleChat(@RequestBody Map<String, String> request) {
        try {
            String query = request.get("query");
            if (query == null || query.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "查询内容不能为空"));
            }

            String response = simpleAIService.simpleChat(query);
            
            Map<String, Object> result = new HashMap<>();
            result.put("response", response);
            result.put("status", "success");
            result.put("timestamp", System.currentTimeMillis());
            
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", "AI服务调用失败: " + e.getMessage());
            error.put("status", "error");
            return ResponseEntity.status(500).body(error);
        }
    }

    @PostMapping("/role/chat")
    public ResponseEntity<Map<String, Object>> roleBasedChat(@RequestBody Map<String, String> request) {
        try {
            String roleId = request.get("roleId");
            String query = request.get("query");
            String context = request.get("context");

            if (roleId == null || query == null || query.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "角色ID和查询内容不能为空"));
            }

            String response = simpleAIService.roleBasedChat(roleId, query, context);
            
            Map<String, Object> result = new HashMap<>();
            result.put("response", response);
            result.put("roleId", roleId);
            result.put("status", "success");
            result.put("timestamp", System.currentTimeMillis());
            
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", "角色对话服务调用失败: " + e.getMessage());
            error.put("status", "error");
            return ResponseEntity.status(500).body(error);
        }
    }

    @PostMapping("/event/analysis")
    public ResponseEntity<Map<String, Object>> eventAnalysis(@RequestBody Map<String, String> request) {
        try {
            String eventTitle = request.get("eventTitle");
            String eventDescription = request.get("eventDescription");
            String eventType = request.get("eventType");
            String userQuery = request.get("userQuery");

            if (eventTitle == null || eventDescription == null || userQuery == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "事件信息不完整"));
            }

            String analysis = simpleAIService.eventAnalysis(eventTitle, eventDescription, eventType, userQuery);
            
            Map<String, Object> result = new HashMap<>();
            result.put("analysis", analysis);
            result.put("eventTitle", eventTitle);
            result.put("eventType", eventType);
            result.put("status", "success");
            result.put("timestamp", System.currentTimeMillis());
            
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", "事件分析服务调用失败: " + e.getMessage());
            error.put("status", "error");
            return ResponseEntity.status(500).body(error);
        }
    }

    @PostMapping("/trajectory/analysis")
    public ResponseEntity<Map<String, Object>> trajectoryAnalysis(@RequestBody Map<String, String> request) {
        try {
            String currentSituation = request.get("currentSituation");
            String goals = request.get("goals");
            String timeFrame = request.get("timeFrame");

            if (currentSituation == null || goals == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "当前状况和目标不能为空"));
            }

            String analysis = simpleAIService.trajectoryAnalysis(currentSituation, goals, timeFrame);
            
            Map<String, Object> result = new HashMap<>();
            result.put("analysis", analysis);
            result.put("currentSituation", currentSituation);
            result.put("goals", goals);
            result.put("timeFrame", timeFrame);
            result.put("status", "success");
            result.put("timestamp", System.currentTimeMillis());
            
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", "轨迹分析服务调用失败: " + e.getMessage());
            error.put("status", "error");
            return ResponseEntity.status(500).body(error);
        }
    }

    @PostMapping("/personalized/advice")
    public ResponseEntity<Map<String, Object>> personalizedAdvice(@RequestBody Map<String, String> request) {
        try {
            String userProfile = request.get("userProfile");
            String currentSituation = request.get("currentSituation");
            String goals = request.get("goals");

            if (userProfile == null || currentSituation == null || goals == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "用户档案、当前状况和目标不能为空"));
            }

            String advice = simpleAIService.personalizedAdvice(userProfile, currentSituation, goals);
            
            Map<String, Object> result = new HashMap<>();
            result.put("advice", advice);
            result.put("userProfile", userProfile);
            result.put("status", "success");
            result.put("timestamp", System.currentTimeMillis());
            
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", "个性化建议服务调用失败: " + e.getMessage());
            error.put("status", "error");
            return ResponseEntity.status(500).body(error);
        }
    }

    @PostMapping("/emotional/support")
    public ResponseEntity<Map<String, Object>> emotionalSupport(@RequestBody Map<String, String> request) {
        try {
            String emotionalState = request.get("emotionalState");
            String situation = request.get("situation");
            String userMessage = request.get("userMessage");

            if (emotionalState == null || situation == null || userMessage == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "情感状态、情况描述和用户消息不能为空"));
            }

            String support = simpleAIService.emotionalSupport(emotionalState, situation, userMessage);
            
            Map<String, Object> result = new HashMap<>();
            result.put("support", support);
            result.put("emotionalState", emotionalState);
            result.put("status", "success");
            result.put("timestamp", System.currentTimeMillis());
            
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", "情感支持服务调用失败: " + e.getMessage());
            error.put("status", "error");
            return ResponseEntity.status(500).body(error);
        }
    }

    @GetMapping("/test")
    public ResponseEntity<Map<String, Object>> healthCheck() {
        Map<String, Object> result = new HashMap<>();
        result.put("status", "healthy");
        result.put("service", "Spring AI Service");
        result.put("timestamp", System.currentTimeMillis());
        result.put("message", "AI服务运行正常");
        
        return ResponseEntity.ok(result);
    }
}

