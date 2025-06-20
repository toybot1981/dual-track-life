package com.dualtracklife.lifeagent.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import java.util.Map;
import java.util.HashMap;

/**
 * Life Agent REST API控制器
 * 提供基础的API接口
 * 
 * @author Life Agent Team
 */
@RestController
@RequestMapping("/api/life-agent")
@CrossOrigin(origins = "*")
public class LifeAgentController {
    
    /**
     * 健康检查接口
     */
    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> health() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "UP");
        response.put("service", "Life Agent");
        response.put("version", "1.0.0");
        response.put("timestamp", System.currentTimeMillis());
        return ResponseEntity.ok(response);
    }
    
    /**
     * 基础对话接口
     */
    @PostMapping("/chat")
    public ResponseEntity<Map<String, Object>> chat(@RequestBody Map<String, Object> request) {
        String userId = (String) request.get("userId");
        String message = (String) request.get("message");
        
        Map<String, Object> response = new HashMap<>();
        response.put("userId", userId);
        response.put("message", "您好！我是您的人生规划智能助手。我可以帮助您制定人生规划、评价当前状态、分析目标可行性等。请告诉我您需要什么帮助？");
        response.put("timestamp", System.currentTimeMillis());
        response.put("type", "response");
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * 获取用户信息接口
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<Map<String, Object>> getUserInfo(@PathVariable String userId) {
        Map<String, Object> response = new HashMap<>();
        response.put("userId", userId);
        response.put("name", "用户" + userId);
        response.put("status", "active");
        response.put("joinDate", "2024-01-01");
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * 生成规划接口
     */
    @PostMapping("/planning/generate")
    public ResponseEntity<Map<String, Object>> generatePlanning(@RequestBody Map<String, Object> request) {
        String userId = (String) request.get("userId");
        String planType = (String) request.get("planType");
        String requirements = (String) request.get("requirements");
        
        Map<String, Object> response = new HashMap<>();
        response.put("userId", userId);
        response.put("planType", planType);
        response.put("planId", "plan_" + System.currentTimeMillis());
        response.put("title", planType + "人生规划");
        response.put("content", "基于您的需求：" + requirements + "，我为您制定了详细的" + planType + "规划...");
        response.put("status", "draft");
        response.put("createdDate", System.currentTimeMillis());
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * 评价接口
     */
    @PostMapping("/evaluation/analyze")
    public ResponseEntity<Map<String, Object>> analyze(@RequestBody Map<String, Object> request) {
        String userId = (String) request.get("userId");
        String evaluationType = (String) request.get("evaluationType");
        
        Map<String, Object> response = new HashMap<>();
        response.put("userId", userId);
        response.put("evaluationType", evaluationType);
        response.put("overallScore", 8.2);
        response.put("analysis", "根据您的当前状态分析，整体发展良好，建议在以下方面继续努力...");
        response.put("recommendations", new String[]{"加强时间管理", "提升专业技能", "保持工作生活平衡"});
        response.put("timestamp", System.currentTimeMillis());
        
        return ResponseEntity.ok(response);
    }
}

