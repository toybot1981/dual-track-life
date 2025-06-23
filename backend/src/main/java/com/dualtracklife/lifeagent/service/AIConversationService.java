package com.dualtracklife.lifeagent.service;

import com.dualtracklife.lifeagent.model.*;
import com.dualtracklife.lifeevent.model.LifeEvent;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

/**
 * AI对话管理服务
 * 管理用户与AI角色的对话会话和消息
 */
@Service
public class AIConversationService {
    
    @Autowired
    private AIRoleService aiRoleService;
    
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
        
        // 生成开场消息
        String openingMessage = generateEventOpeningMessage(event, recommendedRoleId);
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
        
        // 生成AI回复
        String aiResponse = generateAIResponse(conversation, userMessage);
        AIMessage aiMessage = sendMessage(conversationId, userId, conversation.getRoleId(), "ai", aiResponse);
        
        // 更新用户与AI角色的关系
        aiRoleService.updateRelationship(userId, conversation.getRoleId());
        
        return aiMessage;
    }
    
    /**
     * 生成AI回复
     */
    private String generateAIResponse(AIConversation conversation, String userMessage) {
        AIRole role = aiRoleService.getRoleById(conversation.getRoleId());
        if (role == null) {
            return "抱歉，我现在无法回复您的消息。";
        }
        
        // 获取对话历史
        List<AIMessage> history = getConversationHistory(conversation.getId(), 10);
        
        // 构建上下文
        String context = buildConversationContext(conversation, history, userMessage);
        
        // 这里应该调用实际的AI模型，现在使用模拟回复
        return generateMockAIResponse(role, context, userMessage);
    }
    
    /**
     * 构建对话上下文
     */
    private String buildConversationContext(AIConversation conversation, List<AIMessage> history, String userMessage) {
        StringBuilder context = new StringBuilder();
        
        // 添加会话类型信息
        context.append("对话类型：").append(conversation.getConversationType()).append("\n");
        
        // 添加相关事件信息（如果有）
        if (conversation.getRelatedEventId() != null) {
            context.append("相关事件ID：").append(conversation.getRelatedEventId()).append("\n");
        }
        
        // 添加对话历史
        if (!history.isEmpty()) {
            context.append("对话历史：\n");
            for (AIMessage msg : history) {
                String speaker = msg.isUserMessage() ? "用户" : "AI";
                context.append(speaker).append("：").append(msg.getContent()).append("\n");
            }
        }
        
        context.append("当前用户消息：").append(userMessage);
        
        return context.toString();
    }
    
    /**
     * 生成模拟AI回复
     */
    private String generateMockAIResponse(AIRole role, String context, String userMessage) {
        String roleId = role.getRoleId();
        
        switch (roleId) {
            case "life_mentor":
                return generateLifeMentorResponse(userMessage);
            case "counselor":
                return generateCounselorResponse(userMessage);
            case "career_mentor":
                return generateCareerMentorResponse(userMessage);
            case "life_coach":
                return generateLifeCoachResponse(userMessage);
            case "philosopher":
                return generatePhilosopherResponse(userMessage);
            default:
                return "我理解您的想法。让我们一起深入探讨这个问题。";
        }
    }
    
    private String generateLifeMentorResponse(String userMessage) {
        return "我听到了您的想法。这确实是一个值得深思的问题。让我问您一个问题：在这个情况中，什么对您来说是最重要的？这个问题的答案可能会帮助我们找到前进的方向。";
    }
    
    private String generateCounselorResponse(String userMessage) {
        return "感谢您与我分享这些。我能感受到您现在的情感状态。这些感受都是完全正常的，您不需要为此感到不安。让我们一起探索一下，什么样的支持对您最有帮助？";
    }
    
    private String generateCareerMentorResponse(String userMessage) {
        return "从职业发展的角度来看，这是一个很好的思考点。让我们分析一下当前的情况：您的优势是什么？面临的挑战又是什么？基于这些，我们可以制定一个具体的行动计划。";
    }
    
    private String generateLifeCoachResponse(String userMessage) {
        return "这听起来是一个很实际的问题！我很高兴您想要改善这个方面。让我们从小步骤开始：您觉得最容易实现的第一步是什么？我们可以一起制定一个可行的计划。";
    }
    
    private String generatePhilosopherResponse(String userMessage) {
        return "这是一个深刻的问题，值得我们仔细思考。从哲学的角度来看，这涉及到存在的本质问题。您有没有想过，这个问题背后反映的是什么样的价值观和人生观？";
    }
    
    /**
     * 生成基于事件的开场消息
     */
    private String generateEventOpeningMessage(LifeEvent event, String roleId) {
        AIRole role = aiRoleService.getRoleById(roleId);
        String roleName = role != null ? role.getRoleName() : "AI助手";
        
        return String.format("您好！我是%s。我注意到您记录了一个重要的人生事件：「%s」。这看起来是一个%s的经历。我很想听听您对这个事件的感受和想法，让我们一起深入探讨它对您的意义。",
                roleName, event.getTitle(), getEventTypeDescription(event.getEventType()));
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
        
        // 生成切换消息
        AIRole newRole = aiRoleService.getRoleById(newRoleId);
        String switchMessage = String.format("您好！我是%s。我了解到您刚才在与其他导师交流，现在我来为您提供帮助。请告诉我，您希望我在哪些方面为您提供支持？", 
                newRole.getRoleName());
        
        sendMessage(newConversation.getId(), newConversation.getUserId(), newRoleId, "ai", switchMessage);
        
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

