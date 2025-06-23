package com.dualtracklife.lifeagent.service;

import com.dualtracklife.lifeagent.model.*;
import com.dualtracklife.lifeevent.model.LifeEvent;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import reactor.core.publisher.Flux;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

/**
 * AI对话管理服务 - 集成Spring AI
 * 管理用户与AI角色的对话会话和消息，使用真实的AI模型
 */
@Service
public class AIConversationService {
    
    @Autowired
    private AIRoleService aiRoleService;
    
    @Autowired
    private SpringAIService springAIService;
    
    // 模拟数据存储
    private Map<Long, AIConversation> conversationRepository = new HashMap<>();
    private Map<Long, List<AIMessage>> messageRepository = new HashMap<>();
    private Long conversationIdCounter = 1L;
    private Long messageIdCounter = 1L;
    
    /**
     * 开始新的对话会话
     */
    public AIConversation startConversation(Long userId, String roleId, String conversationType) {
        AIConversation conversation = new AIConversation(userId, roleId, conversationType);
        conversation.setId(conversationIdCounter++);
        
        conversationRepository.put(conversation.getId(), conversation);
        messageRepository.put(conversation.getId(), new ArrayList<>());
        
        // 更新用户与AI角色的关系
        aiRoleService.updateRelationship(userId, roleId);
        
        return conversation;
    }
    
    /**
     * 基于人生事件开始对话
     */
    public AIConversation startEventBasedConversation(Long userId, LifeEvent event) {
        // 推荐最适合的AI角色
        String recommendedRoleId = aiRoleService.recommendRoleForEvent(event);
        
        AIConversation conversation = startConversation(userId, recommendedRoleId, "event_analysis");
        conversation.setRelatedEventId(event.getId());
        conversation.setSessionTitle("关于「" + event.getTitle() + "」的深度分析");
        
        // 使用Spring AI生成开场消息
        String openingMessage = generateEventOpeningMessageWithAI(event, recommendedRoleId);
        sendMessage(conversation.getId(), userId, recommendedRoleId, "ai", openingMessage);
        
        return conversation;
    }
    
    /**
     * 发送消息
     */
    public AIMessage sendMessage(Long conversationId, Long userId, String roleId, String messageType, String content) {
        AIConversation conversation = conversationRepository.get(conversationId);
        if (conversation == null) {
            throw new IllegalArgumentException("对话会话不存在");
        }
        
        List<AIMessage> messages = messageRepository.get(conversationId);
        int messageOrder = messages.size() + 1;
        
        AIMessage message = new AIMessage(conversationId, userId, roleId, messageType, content);
        message.setId(messageIdCounter++);
        message.setMessageOrder(messageOrder);
        
        messages.add(message);
        
        // 更新会话的最后活跃时间
        conversation.updateLastActive();
        
        return message;
    }
    
    /**
     * 用户发送消息并获取AI回复
     */
    public AIMessage chatWithAI(Long conversationId, Long userId, String userMessage) {
        AIConversation conversation = conversationRepository.get(conversationId);
        if (conversation == null) {
            throw new IllegalArgumentException("对话会话不存在");
        }
        
        // 保存用户消息
        sendMessage(conversationId, userId, conversation.getRoleId(), "user", userMessage);
        
        // 使用Spring AI生成回复
        String aiResponse = generateAIResponseWithSpringAI(conversation, userMessage);
        AIMessage aiMessage = sendMessage(conversationId, userId, conversation.getRoleId(), "ai", aiResponse);
        
        // 更新用户与AI角色的关系
        aiRoleService.updateRelationship(userId, conversation.getRoleId());
        
        return aiMessage;
    }
    
    /**
     * 流式聊天接口
     */
    public Flux<String> streamChatWithAI(Long conversationId, Long userId, String userMessage) {
        AIConversation conversation = conversationRepository.get(conversationId);
        if (conversation == null) {
            return Flux.error(new IllegalArgumentException("对话会话不存在"));
        }
        
        // 保存用户消息
        sendMessage(conversationId, userId, conversation.getRoleId(), "user", userMessage);
        
        // 构建对话上下文
        String context = buildConversationContext(conversation, userMessage);
        
        // 使用Spring AI生成流式回复
        Flux<String> responseStream = springAIService.roleBasedStreamChat(
                conversation.getRoleId(), userMessage, context);
        
        // 收集完整回复并保存
        StringBuilder fullResponse = new StringBuilder();
        return responseStream.doOnNext(chunk -> fullResponse.append(chunk))
                .doOnComplete(() -> {
                    // 保存完整的AI回复
                    sendMessage(conversationId, userId, conversation.getRoleId(), "ai", fullResponse.toString());
                    // 更新用户与AI角色的关系
                    aiRoleService.updateRelationship(userId, conversation.getRoleId());
                });
    }
    
    /**
     * 使用Spring AI生成AI回复
     */
    private String generateAIResponseWithSpringAI(AIConversation conversation, String userMessage) {
        try {
            // 构建对话上下文
            String context = buildConversationContext(conversation, userMessage);
            
            // 根据对话类型选择不同的AI服务方法
            switch (conversation.getConversationType()) {
                case "event_analysis":
                    return generateEventAnalysisResponse(conversation, userMessage, context);
                case "emotional_support":
                    return generateEmotionalSupportResponse(conversation, userMessage, context);
                case "decision_support":
                    return generateDecisionSupportResponse(conversation, userMessage, context);
                case "life_planning":
                    return generateLifePlanningResponse(conversation, userMessage, context);
                default:
                    return springAIService.roleBasedChat(conversation.getRoleId(), userMessage, context);
            }
        } catch (Exception e) {
            // 如果AI服务出错，返回友好的错误消息
            return "抱歉，我现在遇到了一些技术问题。请稍后再试，或者换个方式表达您的问题。";
        }
    }
    
    /**
     * 生成事件分析回复
     */
    private String generateEventAnalysisResponse(AIConversation conversation, String userMessage, String context) {
        // 如果有关联事件，获取事件信息
        if (conversation.getRelatedEventId() != null) {
            // 这里应该从数据库获取事件详情，现在使用模拟数据
            return springAIService.eventAnalysisChat(
                    "用户事件", "事件描述", "reflection", userMessage);
        }
        return springAIService.roleBasedChat(conversation.getRoleId(), userMessage, context);
    }
    
    /**
     * 生成情感支持回复
     */
    private String generateEmotionalSupportResponse(AIConversation conversation, String userMessage, String context) {
        return springAIService.emotionalSupportChat("需要支持", context, userMessage);
    }
    
    /**
     * 生成决策支持回复
     */
    private String generateDecisionSupportResponse(AIConversation conversation, String userMessage, String context) {
        return springAIService.decisionSupportAnalysis(userMessage, "待分析", context);
    }
    
    /**
     * 生成人生规划回复
     */
    private String generateLifePlanningResponse(AIConversation conversation, String userMessage, String context) {
        return springAIService.generatePersonalizedAdvice("用户档案", context, userMessage);
    }
    
    /**
     * 使用Spring AI生成基于事件的开场消息
     */
    private String generateEventOpeningMessageWithAI(LifeEvent event, String roleId) {
        try {
            AIRole role = aiRoleService.getRoleById(roleId);
            String roleName = role != null ? role.getRoleName() : "AI助手";
            
            String prompt = String.format(
                    "作为%s，用户刚刚记录了一个人生事件：「%s」，类型是%s。请生成一个温暖、专业的开场问候，表达对这个事件的关注，并引导用户分享更多想法。",
                    roleName, event.getTitle(), getEventTypeDescription(event.getEventType())
            );
            
            return springAIService.roleBasedChat(roleId, prompt, "");
        } catch (Exception e) {
            // 如果AI生成失败，使用默认消息
            AIRole role = aiRoleService.getRoleById(roleId);
            String roleName = role != null ? role.getRoleName() : "AI助手";
            return String.format("您好！我是%s。我注意到您记录了一个重要的人生事件：「%s」。我很想听听您对这个事件的感受和想法，让我们一起深入探讨它对您的意义。",
                    roleName, event.getTitle());
        }
    }
    
    /**
     * 构建对话上下文
     */
    private String buildConversationContext(AIConversation conversation, String currentMessage) {
        StringBuilder context = new StringBuilder();
        
        // 添加会话类型信息
        context.append("对话类型：").append(getConversationTypeDescription(conversation.getConversationType())).append("\n");
        
        // 添加相关事件信息（如果有）
        if (conversation.getRelatedEventId() != null) {
            context.append("相关事件ID：").append(conversation.getRelatedEventId()).append("\n");
        }
        
        // 添加最近的对话历史
        List<AIMessage> recentHistory = getConversationHistory(conversation.getId(), 5);
        if (!recentHistory.isEmpty()) {
            context.append("最近对话：\n");
            for (AIMessage msg : recentHistory) {
                String speaker = msg.isUserMessage() ? "用户" : "AI";
                context.append(speaker).append("：").append(msg.getContent()).append("\n");
            }
        }
        
        return context.toString();
    }
    
    /**
     * 获取对话类型描述
     */
    private String getConversationTypeDescription(String conversationType) {
        Map<String, String> descriptions = new HashMap<>();
        descriptions.put("general", "一般对话");
        descriptions.put("event_analysis", "事件分析");
        descriptions.put("emotional_support", "情感支持");
        descriptions.put("decision_support", "决策支持");
        descriptions.put("life_planning", "人生规划");
        descriptions.put("career_guidance", "职业指导");
        descriptions.put("relationship_advice", "人际关系建议");
        
        return descriptions.getOrDefault(conversationType, "一般对话");
    }
    
    private String getEventTypeDescription(String eventType) {
        switch (eventType) {
            case "achievement": return "值得庆祝的成就";
            case "learning": return "有价值的学习";
            case "challenge": return "具有挑战性";
            case "reflection": return "引人深思";
            case "relationship": return "关于人际关系";
            case "career": return "职业相关";
            case "health": return "健康相关";
            default: return "有意义";
        }
    }
    
    /**
     * 获取对话历史
     */
    public List<AIMessage> getConversationHistory(Long conversationId, int limit) {
        List<AIMessage> messages = messageRepository.getOrDefault(conversationId, new ArrayList<>());
        
        return messages.stream()
                .sorted(Comparator.comparing(AIMessage::getMessageOrder))
                .skip(Math.max(0, messages.size() - limit))
                .collect(Collectors.toList());
    }
    
    /**
     * 获取用户的所有对话会话
     */
    public List<AIConversation> getUserConversations(Long userId) {
        return conversationRepository.values().stream()
                .filter(conv -> conv.getUserId().equals(userId))
                .sorted((c1, c2) -> c2.getLastActiveAt().compareTo(c1.getLastActiveAt()))
                .collect(Collectors.toList());
    }
    
    /**
     * 获取用户与特定角色的对话会话
     */
    public List<AIConversation> getUserRoleConversations(Long userId, String roleId) {
        return conversationRepository.values().stream()
                .filter(conv -> conv.getUserId().equals(userId) && conv.getRoleId().equals(roleId))
                .sorted((c1, c2) -> c2.getLastActiveAt().compareTo(c1.getLastActiveAt()))
                .collect(Collectors.toList());
    }
    
    /**
     * 结束对话会话
     */
    public void endConversation(Long conversationId, String summary, String insights) {
        AIConversation conversation = conversationRepository.get(conversationId);
        if (conversation != null) {
            conversation.completeSession(summary, insights);
        }
    }
    
    /**
     * 切换AI角色
     */
    public AIConversation switchRole(Long currentConversationId, String newRoleId, String reason) {
        AIConversation currentConversation = conversationRepository.get(currentConversationId);
        if (currentConversation == null) {
            throw new IllegalArgumentException("当前对话会话不存在");
        }
        
        // 结束当前会话
        endConversation(currentConversationId, "用户切换到其他AI角色", "角色切换：" + reason);
        
        // 开始新的会话
        AIConversation newConversation = startConversation(
                currentConversation.getUserId(), 
                newRoleId, 
                currentConversation.getConversationType()
        );
        
        // 复制相关信息
        newConversation.setRelatedEventId(currentConversation.getRelatedEventId());
        newConversation.setRelatedGoalId(currentConversation.getRelatedGoalId());
        
        // 使用Spring AI生成切换消息
        try {
            AIRole newRole = aiRoleService.getRoleById(newRoleId);
            String switchPrompt = String.format(
                    "作为%s，用户刚刚从其他AI角色切换到你这里。原因是：%s。请生成一个专业、温暖的问候，表达你愿意提供帮助。",
                    newRole.getRoleName(), reason
            );
            
            String switchMessage = springAIService.roleBasedChat(newRoleId, switchPrompt, "");
            sendMessage(newConversation.getId(), newConversation.getUserId(), newRoleId, "ai", switchMessage);
        } catch (Exception e) {
            // 如果AI生成失败，使用默认消息
            AIRole newRole = aiRoleService.getRoleById(newRoleId);
            String switchMessage = String.format("您好！我是%s。我了解到您刚才在与其他导师交流，现在我来为您提供帮助。请告诉我，您希望我在哪些方面为您提供支持？", 
                    newRole.getRoleName());
            sendMessage(newConversation.getId(), newConversation.getUserId(), newRoleId, "ai", switchMessage);
        }
        
        return newConversation;
    }
    
    /**
     * 获取对话统计信息
     */
    public ConversationStats getConversationStats(Long userId) {
        List<AIConversation> userConversations = getUserConversations(userId);
        List<AIMessage> allMessages = new ArrayList<>();
        
        for (AIConversation conv : userConversations) {
            allMessages.addAll(messageRepository.getOrDefault(conv.getId(), new ArrayList<>()));
        }
        
        ConversationStats stats = new ConversationStats();
        stats.setTotalConversations(userConversations.size());
        stats.setTotalMessages(allMessages.size());
        stats.setActiveConversations((int) userConversations.stream().filter(AIConversation::isActive).count());
        
        // 统计各角色的对话次数
        Map<String, Integer> roleStats = userConversations.stream()
                .collect(Collectors.groupingBy(
                        AIConversation::getRoleId,
                        Collectors.collectingAndThen(Collectors.counting(), Math::toIntExact)
                ));
        stats.setRoleInteractionStats(roleStats);
        
        // 计算平均会话时长
        double avgDuration = userConversations.stream()
                .filter(conv -> conv.getEndedAt() != null)
                .mapToLong(AIConversation::getDurationMinutes)
                .average()
                .orElse(0.0);
        stats.setAverageSessionDuration(avgDuration);
        
        return stats;
    }
    
    // 内部类定义
    public static class ConversationStats {
        private Integer totalConversations;
        private Integer totalMessages;
        private Integer activeConversations;
        private Map<String, Integer> roleInteractionStats;
        private Double averageSessionDuration;
        
        // Getters and Setters
        public Integer getTotalConversations() { return totalConversations; }
        public void setTotalConversations(Integer totalConversations) { this.totalConversations = totalConversations; }
        
        public Integer getTotalMessages() { return totalMessages; }
        public void setTotalMessages(Integer totalMessages) { this.totalMessages = totalMessages; }
        
        public Integer getActiveConversations() { return activeConversations; }
        public void setActiveConversations(Integer activeConversations) { this.activeConversations = activeConversations; }
        
        public Map<String, Integer> getRoleInteractionStats() { return roleInteractionStats; }
        public void setRoleInteractionStats(Map<String, Integer> roleInteractionStats) { this.roleInteractionStats = roleInteractionStats; }
        
        public Double getAverageSessionDuration() { return averageSessionDuration; }
        public void setAverageSessionDuration(Double averageSessionDuration) { this.averageSessionDuration = averageSessionDuration; }
    }
}

