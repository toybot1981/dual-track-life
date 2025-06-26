package com.dualtracklife.lifeagent.service;

import com.alibaba.cloud.ai.dashscope.chat.DashScopeChatOptions;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.client.advisor.SimpleLoggerAdvisor;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import reactor.core.publisher.Flux;

import java.util.Map;
import java.util.HashMap;

/**
 * Spring AI集成服务
 * 提供基于阿里云通义千问的AI对话能力
 */
@Service
public class SpringAIService {
    
    private final ChatClient dashScopeChatClient;
    
    @Autowired
    public SpringAIService(ChatClient.Builder chatClientBuilder) {
        this.dashScopeChatClient = chatClientBuilder
                .defaultSystem("你是一个专业的人生导师和心理咨询师，具有丰富的人生阅历和专业知识。你善于倾听、理解和引导，能够为用户提供有价值的人生建议和情感支持。请根据用户的具体情况和需求，提供个性化的回复。\n\n请严格使用标准的Markdown格式回复：\n- 仅对真正的章节或主题使用 #、##、### 等标题，不要滥用标题。\n- 普通分点请用 - 或 1. 2. 3. 作为列表，且每个列表项前后要有空行。\n- 用 **粗体** 强调重点。\n- 用 > 创建引用块。\n- 段落之间必须有空行分隔。\n- 保持内容结构清晰、层次分明，便于前端渲染。\n- 不要把所有内容都用标题包裹。\n- 不要输出无意义的空标题。")
                .defaultAdvisors(new SimpleLoggerAdvisor())
                .defaultOptions(
                        DashScopeChatOptions.builder()
                                .withTopP(0.7)
                                .withTemperature(0.8)
                                .build()
                )
                .build();
    }
    
    /**
     * 简单AI对话
     */
    public String simpleChat(String query) {
        return dashScopeChatClient.prompt(query).call().content();
    }
    
    /**
     * 流式AI对话
     */
    public Flux<String> streamChat(String query) {
        return dashScopeChatClient.prompt(query).stream().content();
    }
    
    /**
     * 基于角色的AI对话
     */
    public String roleBasedChat(String roleId, String query, String context) {
        String systemPrompt = buildRoleSystemPrompt(roleId);
        String fullPrompt = buildFullPrompt(query, context);
        
        return dashScopeChatClient.prompt()
                .system(systemPrompt)
                .user(fullPrompt)
                .call()
                .content();
    }
    
    /**
     * 基于角色的流式AI对话
     */
    public Flux<String> roleBasedStreamChat(String roleId, String query, String context) {
        String systemPrompt = buildRoleSystemPrompt(roleId);
        String fullPrompt = buildFullPrompt(query, context);
        
        return dashScopeChatClient.prompt()
                .system(systemPrompt)
                .user(fullPrompt)
                .stream()
                .content();
    }
    
    /**
     * 事件分析AI对话
     */
    public String eventAnalysisChat(String eventTitle, String eventDescription, String eventType, String userQuery) {
        String systemPrompt = "你是一个专业的人生事件分析师，擅长帮助用户深入理解和分析人生中的重要事件。你会从多个角度分析事件的意义、影响和启示，并提供建设性的建议。";
        
        String contextPrompt = String.format(
                "用户记录了一个人生事件：\n标题：%s\n描述：%s\n类型：%s\n\n用户的问题：%s",
                eventTitle, eventDescription, getEventTypeDescription(eventType), userQuery
        );
        
        return dashScopeChatClient.prompt()
                .system(systemPrompt)
                .user(contextPrompt)
                .call()
                .content();
    }
    
    /**
     * 人生轨迹分析
     */
    public String lifeTrajectoryAnalysis(String userEvents, String analysisType) {
        String systemPrompt = "你是一个专业的人生轨迹分析师，能够从用户的人生事件中发现模式、趋势和深层含义。你会提供深入的分析和有价值的洞察。";
        
        String prompt = String.format(
                "请分析以下用户的人生事件轨迹，重点关注%s：\n\n%s\n\n请提供详细的分析和建议。",
                getAnalysisTypeDescription(analysisType), userEvents
        );
        
        return dashScopeChatClient.prompt()
                .system(systemPrompt)
                .user(prompt)
                .call()
                .content();
    }
    
    /**
     * 构建角色系统提示词
     */
    private String buildRoleSystemPrompt(String roleId) {
        Map<String, String> rolePrompts = new HashMap<>();
        
        String baseMarkdownInstruction = "\n\n请严格使用标准的Markdown格式回复：\n" +
                "- 仅对真正的章节或主题使用 #、##、### 等标题，不要滥用标题。\n" +
                "- 普通分点请用 - 或 1. 2. 3. 作为列表，且每个列表项前后要有空行。\n" +
                "- 用 **粗体** 强调重点。\n" +
                "- 用 > 创建引用块。\n" +
                "- 段落之间必须有空行分隔。\n" +
                "- 保持内容结构清晰、层次分明，便于前端渲染。\n" +
                "- 不要把所有内容都用标题包裹。\n" +
                "- 不要输出无意义的空标题。";
        
        rolePrompts.put("life_mentor", 
                "你是一位智慧的人生导师，拥有丰富的人生阅历和深刻的洞察力。你善于从宏观角度看待问题，能够帮助用户找到人生的方向和意义。你的回答总是充满智慧、温暖而富有启发性。" + baseMarkdownInstruction);
        
        rolePrompts.put("counselor", 
                "你是一位专业的心理咨询师，具有深厚的心理学背景和丰富的咨询经验。你善于倾听、理解和共情，能够帮助用户处理情感问题、缓解心理压力。你的回答总是温暖、支持性的，注重用户的情感需求。" + baseMarkdownInstruction);
        
        rolePrompts.put("career_mentor", 
                "你是一位资深的职业导师，对各行各业都有深入的了解。你善于分析职业发展趋势，能够帮助用户制定职业规划、提升职业技能。你的回答总是实用、具体而富有前瞻性。" + baseMarkdownInstruction);
        
        rolePrompts.put("life_coach", 
                "你是一位专业的生活教练，擅长帮助用户改善生活习惯、提高生活质量。你注重实际行动和目标达成，能够提供具体可行的建议和方法。你的回答总是积极、实用而富有激励性。" + baseMarkdownInstruction);
        
        rolePrompts.put("philosopher", 
                "你是一位深思的哲学家，善于从哲学角度思考人生的根本问题。你能够帮助用户探索存在的意义、价值观和世界观。你的回答总是深刻、思辨而富有哲理。" + baseMarkdownInstruction);
        
        return rolePrompts.getOrDefault(roleId, 
                "你是一个专业的AI助手，能够为用户提供有价值的建议和支持。" + baseMarkdownInstruction);
    }
    
    /**
     * 构建完整提示词
     */
    private String buildFullPrompt(String query, String context) {
        if (context != null && !context.trim().isEmpty()) {
            return String.format("背景信息：%s\n\n用户问题：%s", context, query);
        }
        return query;
    }
    
    /**
     * 获取事件类型描述
     */
    private String getEventTypeDescription(String eventType) {
        Map<String, String> descriptions = new HashMap<>();
        descriptions.put("achievement", "成就事件");
        descriptions.put("learning", "学习事件");
        descriptions.put("challenge", "挑战事件");
        descriptions.put("reflection", "反思事件");
        descriptions.put("relationship", "人际关系事件");
        descriptions.put("career", "职业事件");
        descriptions.put("health", "健康事件");
        descriptions.put("travel", "旅行事件");
        descriptions.put("family", "家庭事件");
        descriptions.put("personal_growth", "个人成长事件");
        
        return descriptions.getOrDefault(eventType, "人生事件");
    }
    
    /**
     * 获取分析类型描述
     */
    private String getAnalysisTypeDescription(String analysisType) {
        Map<String, String> descriptions = new HashMap<>();
        descriptions.put("pattern", "模式识别和趋势分析");
        descriptions.put("growth", "个人成长轨迹");
        descriptions.put("relationship", "人际关系发展");
        descriptions.put("career", "职业发展路径");
        descriptions.put("emotional", "情感状态变化");
        descriptions.put("achievement", "成就和里程碑");
        descriptions.put("challenge", "挑战应对能力");
        descriptions.put("future", "未来发展预测");
        
        return descriptions.getOrDefault(analysisType, "综合分析");
    }
    
    /**
     * 生成个性化建议
     */
    public String generatePersonalizedAdvice(String userProfile, String currentSituation, String goals) {
        String systemPrompt = "你是一位专业的人生规划师，能够根据用户的个人情况、当前状态和目标，提供个性化的建议和行动计划。";
        
        String prompt = String.format(
                "用户档案：%s\n当前情况：%s\n目标：%s\n\n请为用户提供个性化的建议和具体的行动计划。",
                userProfile, currentSituation, goals
        );
        
        return dashScopeChatClient.prompt()
                .system(systemPrompt)
                .user(prompt)
                .call()
                .content();
    }
    
    /**
     * 情感支持对话
     */
    public String emotionalSupportChat(String emotionalState, String situation, String userMessage) {
        String systemPrompt = "你是一位温暖、有同理心的情感支持专家。你善于理解用户的情感状态，提供安慰、鼓励和支持。你的回答总是充满关爱和理解。";
        
        String contextPrompt = String.format(
                "用户当前的情感状态：%s\n面临的情况：%s\n用户的话：%s\n\n请提供温暖的情感支持和鼓励。",
                emotionalState, situation, userMessage
        );
        
        return dashScopeChatClient.prompt()
                .system(systemPrompt)
                .user(contextPrompt)
                .call()
                .content();
    }
    
    /**
     * 决策支持分析
     */
    public String decisionSupportAnalysis(String decision, String options, String considerations) {
        String systemPrompt = "你是一位专业的决策分析师，能够帮助用户理性分析各种选择的利弊，提供客观的决策支持。";
        
        String prompt = String.format(
                "需要做出的决策：%s\n可选方案：%s\n需要考虑的因素：%s\n\n请帮助分析各个选择的利弊，并提供决策建议。",
                decision, options, considerations
        );
        
        return dashScopeChatClient.prompt()
                .system(systemPrompt)
                .user(prompt)
                .call()
                .content();
    }
}

