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
    
        private static final String markdownInstruction =
        "严格按照以下规范，将内容组织并输出为清晰、易读的Markdown格式。\n" +
        "\n" +
        "请**务必**遵守以下Markdown格式要求：\n" +
        "\n" +
        "## Markdown格式规范\n" +
        "\n" +
        "1.  **标题 (Headings):**\n" +
        "    *   使用 `#`、`##`、`###` 来表示标题。**最多使用三级标题**。\n" +
        "    *   **每个标题后必须空一行**，以确保内容与标题分隔。\n" +
        "    *   示例：\n" +
        "        ```markdown\n" +
        "        # 一级标题\n" +
        "        \n" +
        "        ## 二级标题\n" +
        "        \n" +
        "        ### 三级标题\n" +
        "        ```\n" +
        "\n" +
        "2.  **文本格式 (Text Formatting):**\n" +
        "    *   **加粗:** 使用双星号 `**文本**` 包裹关键信息。\n" +
        "    *   **斜体:** 使用单星号 `*文本*` 包裹。\n" +
        "    *   **引用:** 使用 `>` 符号表示引用。引用内容可以多行，但**禁止复杂嵌套**（例如，引用内再嵌套列表或代码块）。\n" +
        "    *   **段落:** 段落之间**必须使用空行分隔**，以保持排版简洁。\n" +
        "\n" +
        "3.  **列表 (Lists):**\n" +
        "    *   **无序列表:** 使用 `-` 或 `*` 作为列表项标记，后跟一个空格。\n" +
        "        *   示例：`- 条目`\n" +
        "    *   **有序列表:** 使用数字和点号 `1.`，后跟一个空格。\n" +
        "        *   示例：`1. 第一步`\n" +
        "    *   **列表项内禁止复杂嵌套**（例如，列表项内再嵌套列表）。\n" +
        "    *   **单级列表内条目不超过5项**，避免阅读冗余。\n" +
        "    *   **列表前后必须空一行**，除非紧跟在标题之后。\n" +
        "\n" +
        "4.  **其他限制:**\n" +
        "    *   **禁止使用**表格、代码块、复杂公式、图片、链接等高级Markdown格式。\n" +
        "    *   **禁止使用**除标题、加粗、斜体、引用、无序列表、有序列表之外的任何Markdown语法。\n" +
        "\n" +
        "## 输出示例\n" +
        "\n" +
        "请严格参照以下示例的格式和空行处理：\n" +
        "\n" +
        "```markdown\n" +
        "# 这是一个主标题\n" +
        "\n" +
        "## 这是一个二级标题\n" +
        "\n" +
        "- 内容1 **关键信息**\n" +
        "- 内容2\n" +
        "\n" +
        "> 这是一个引用说明，\n" +
        "> 可以是多行内容。\n" +
        "\n" +
        "1. 这是步骤一\n" +
        "2. 这是步骤二 **重点步骤**\n" +
        "```\n" +
        "\n" +
        "在必要的地方增加换行符，确保内容清晰易读。\n" +
        "请根据上述规范，生成用户请求的内容。请确保Markdown格式准确且易读！";
        
    
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

        return dashScopeChatClient.prompt(query + markdownInstruction).call().content();
    }
    
    /**
     * 流式AI对话
     */
    public Flux<String> streamChat(String query) {
       
        return dashScopeChatClient.prompt(query + markdownInstruction).stream().content();
    }
    
    /**
     * 基于角色的AI对话
     */
    public String roleBasedChat(String roleId, String query, String context) {
     
        String systemPrompt = buildRoleSystemPrompt(roleId) + markdownInstruction;
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
      
        String systemPrompt = buildRoleSystemPrompt(roleId) + markdownInstruction;
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
      
        String systemPrompt = "你是一个专业的人生事件分析师，擅长帮助用户深入理解和分析人生中的重要事件。你会从多个角度分析事件的意义、影响和启示，并提供建设性的建议。" + markdownInstruction;
        
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
      
        String systemPrompt = "你是一个专业的人生轨迹分析师，能够从用户的人生事件中发现模式、趋势和深层含义。你会提供深入的分析和有价值的洞察。" + markdownInstruction;
        
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
        
   
        
        rolePrompts.put("life_mentor", 
                "你是一位智慧的人生导师，拥有丰富的人生阅历和深刻的洞察力。你善于从宏观角度看待问题，能够帮助用户找到人生的方向和意义。你的回答总是充满智慧、温暖而富有启发性。" + markdownInstruction);
        
        rolePrompts.put("counselor", 
                "你是一位专业的心理咨询师，具有深厚的心理学背景和丰富的咨询经验。你善于倾听、理解和共情，能够帮助用户处理情感问题、缓解心理压力。你的回答总是温暖、支持性的，注重用户的情感需求。" + markdownInstruction);
        
        rolePrompts.put("career_mentor", 
                "你是一位资深的职业导师，对各行各业都有深入的了解。你善于分析职业发展趋势，能够帮助用户制定职业规划、提升职业技能。你的回答总是实用、具体而富有前瞻性。" + markdownInstruction);
        
        rolePrompts.put("life_coach", 
                "你是一位专业的生活教练，擅长帮助用户改善生活习惯、提高生活质量。你注重实际行动和目标达成，能够提供具体可行的建议和方法。你的回答总是积极、实用而富有激励性。" + markdownInstruction);
        
        rolePrompts.put("philosopher", 
                "你是一位深思的哲学家，善于从哲学角度思考人生的根本问题。你能够帮助用户探索存在的意义、价值观和世界观。你的回答总是深刻、思辨而富有哲理。" + markdownInstruction);
        
        return rolePrompts.getOrDefault(roleId, 
                "你是一个专业的AI助手，能够为用户提供有价值的建议和支持。" + markdownInstruction);
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
 
        String systemPrompt = "你是一位专业的人生规划师，能够根据用户的个人情况、当前状态和目标，提供个性化的建议和行动计划。" + markdownInstruction;
        
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
       
        String systemPrompt = "你是一位温暖、有同理心的情感支持专家。你善于理解用户的情感状态，提供安慰、鼓励和支持。你的回答总是充满关爱和理解。" + markdownInstruction;
        
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
       
        String systemPrompt = "你是一位专业的决策分析师，能够帮助用户理性分析各种选择的利弊，提供客观的决策支持。" + markdownInstruction;
        
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

