package com.dualtracklife.lifeagent.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;

import java.util.Map;
import java.util.HashMap;

@Service
public class SimpleAIService {
    
    @Value("${dashscope.api-key:sk-491064bc248948098035424ff3c806d9}")
    private String apiKey;
    
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;
    
    public SimpleAIService() {
        this.restTemplate = new RestTemplate();
        this.objectMapper = new ObjectMapper();
    }
    
    public String simpleChat(String query) {
        try {
            String url = "https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation";
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("Authorization", "Bearer " + apiKey);
            
            ObjectNode requestBody = objectMapper.createObjectNode();
            requestBody.put("model", "qwen-max");
            
            ObjectNode input = objectMapper.createObjectNode();
            input.put("prompt", query);
            requestBody.set("input", input);
            
            ObjectNode parameters = objectMapper.createObjectNode();
            parameters.put("temperature", 0.8);
            parameters.put("max_tokens", 2000);
            parameters.put("top_p", 0.7);
            requestBody.set("parameters", parameters);
            
            HttpEntity<String> entity = new HttpEntity<>(requestBody.toString(), headers);
            
            ResponseEntity<String> response = restTemplate.exchange(
                url, HttpMethod.POST, entity, String.class);
            
            JsonNode responseJson = objectMapper.readTree(response.getBody());
            
            if (responseJson.has("output") && responseJson.get("output").has("text")) {
                return responseJson.get("output").get("text").asText();
            } else {
                return "AI服务暂时不可用，请稍后再试。";
            }
            
        } catch (Exception e) {
            return "AI服务调用失败: " + e.getMessage();
        }
    }
    
    public String roleBasedChat(String roleId, String query, String context) {
        String rolePrompt = getRolePrompt(roleId);
        String fullPrompt = rolePrompt + "\n\n";
        
        if (context != null && !context.trim().isEmpty()) {
            fullPrompt += "对话历史:\n" + context + "\n\n";
        }
        
        fullPrompt += "用户问题: " + query;
        
        return simpleChat(fullPrompt);
    }
    
    public String eventAnalysis(String eventTitle, String eventDescription, String eventType, String userQuery) {
        String prompt = String.format(
            "作为专业的人生事件分析师，请分析以下事件：\n\n" +
            "事件标题: %s\n" +
            "事件类型: %s\n" +
            "事件描述: %s\n\n" +
            "用户问题: %s\n\n" +
            "请提供深入的分析和建议。",
            eventTitle, eventType, eventDescription, userQuery
        );
        
        return simpleChat(prompt);
    }
    
    public String trajectoryAnalysis(String currentSituation, String goals, String timeFrame) {
        String prompt = String.format(
            "作为人生轨迹规划专家，请基于以下信息进行分析：\n\n" +
            "当前状况: %s\n" +
            "目标: %s\n" +
            "时间框架: %s\n\n" +
            "请提供详细的轨迹分析和规划建议。",
            currentSituation, goals, timeFrame
        );
        
        return simpleChat(prompt);
    }
    
    public String personalizedAdvice(String userProfile, String currentSituation, String goals) {
        String prompt = String.format(
            "作为个人发展顾问，请基于以下信息提供个性化建议：\n\n" +
            "用户档案: %s\n" +
            "当前状况: %s\n" +
            "目标: %s\n\n" +
            "请提供具体可行的个性化建议。",
            userProfile, currentSituation, goals
        );
        
        return simpleChat(prompt);
    }
    
    public String emotionalSupport(String emotionalState, String situation, String userMessage) {
        String prompt = String.format(
            "作为专业心理咨询师，请为用户提供情感支持：\n\n" +
            "情感状态: %s\n" +
            "具体情况: %s\n" +
            "用户表达: %s\n\n" +
            "请以温暖、理解、专业的方式提供情感支持和建议。",
            emotionalState, situation, userMessage
        );
        
        return simpleChat(prompt);
    }
    
    private String getRolePrompt(String roleId) {
        Map<String, String> rolePrompts = new HashMap<>();
        
        rolePrompts.put("life_mentor", 
            "你是一位经验丰富的人生导师，拥有深厚的人生阅历和智慧。你善于倾听，能够从不同角度分析问题，" +
            "并提供富有洞察力的建议。你的回答应该温暖、睿智、富有启发性。");
            
        rolePrompts.put("psychologist", 
            "你是一位专业的心理咨询师，具备扎实的心理学知识和丰富的咨询经验。你善于理解他人的情感，" +
            "能够提供专业的心理支持和指导。你的回答应该专业、温和、具有治疗性。");
            
        rolePrompts.put("career_coach", 
            "你是一位资深的职业发展教练，对各行各业都有深入了解。你能够帮助人们规划职业发展，" +
            "提供求职建议和职场指导。你的回答应该实用、专业、具有前瞻性。");
            
        rolePrompts.put("life_coach", 
            "你是一位专业的生活教练，专注于帮助人们改善生活质量，建立健康的生活方式。" +
            "你的回答应该积极、实用、鼓舞人心。");
            
        rolePrompts.put("philosopher", 
            "你是一位哲学家，善于从哲学角度思考人生的根本问题。你能够提供深刻的思辨和独特的视角。" +
            "你的回答应该深刻、富有哲理、启发思考。");
        
        return rolePrompts.getOrDefault(roleId, 
            "你是一位智能助手，能够在各个方面为用户提供帮助和建议。");
    }
}

