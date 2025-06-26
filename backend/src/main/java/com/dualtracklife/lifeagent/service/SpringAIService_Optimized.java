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
 * Spring AI集成服务 - 基于markdown-it-sse-template最佳实践优化
 * 提供基于阿里云通义千问的AI对话能力，专门优化了Markdown格式输出
 */
@Service
public class SpringAIService {
    
    private final ChatClient dashScopeChatClient;
    
    // 优化的Markdown格式指令
    private static final String OPTIMIZED_MARKDOWN_INSTRUCTION = """
            
            **重要：请严格按照以下Markdown格式规范回复，确保前端渲染效果最佳：**
            
            ## 标题使用规范
            - 只对真正的章节、主题使用标题（#、##、###）
            - 标题后必须有空格：`# 标题` 而不是 `#标题`
            - 标题前后必须有空行分隔
            - 不要滥用标题，避免把普通内容包装成标题
            
            ## 列表格式规范
            - 使用 `- ` 或 `1. ` 创建列表
            - 每个列表项后换行，不需要额外空行
            - 嵌套列表使用两个空格缩进
            
            ## 段落和换行
            - 段落之间用空行分隔
            - 普通换行直接使用单个换行符
            - 避免不必要的空行
            
            ## 强调和引用
            - 用 **粗体** 强调重点内容
            - 用 *斜体* 表示次要强调
            - 用 > 创建引用块，引用前后要有空行
            
            ## 代码格式
            - 行内代码用 `代码` 包围
            - 代码块用 ```语言名 开始，``` 结束
            
            ## 避免的格式问题
            - 不要输出空标题或无意义标题
            - 不要在标题和内容之间添加多余空行
            - 不要把所有内容都用标题包裹
            - 确保标点符号紧跟文字，不要分离
            
            请确保输出的内容结构清晰、层次分明，便于SSE流式传输和前端markdown-it渲染。
            """;
    
    @Autowired
    public SpringAIService(ChatClient.Builder chatClientBuilder) {
        this.dashScopeChatClient = chatClientBuilder
                .defaultSystem(buildOptimizedSystemPrompt())
                .defaultAdvisors(new SimpleLoggerAdvisor())
                .defaultOptions(
                        DashScopeChatOptions.builder()
                                .withTopP(0.7)
                                .withTemperature(0.8)
                                .withMaxTokens(2000) // 控制输出长度，适合流式传输
                                .build()
                )
                .build();
    }
    
    /**
     * 构建优化的系统提示词
     */
    private String buildOptimizedSystemPrompt() {
        return """
                你是一个专业的人生导师和心理咨询师，具有丰富的人生阅历和专业知识。
                你善于倾听、理解和引导，能够为用户提供有价值的人生建议和情感支持。
                
                ## 你的核心能力
                - **深度倾听**：理解用户的真实需求和情感状态
                - **专业分析**：从心理学和人生发展角度提供洞察
                - **实用建议**：提供具体可行的行动方案
                - **情感支持**：给予温暖、理解和鼓励
                
                ## 回复原则
                1. **个性化**：根据用户的具体情况和需求定制回复
                2. **结构化**：使用清晰的逻辑结构组织内容
                3. **实用性**：提供具体可行的建议和方法
                4. **温暖感**：保持温暖、支持性的语调
                5. **专业性**：基于心理学和人生发展理论
                
                ## 内容组织建议
                - 先理解和共情用户的情况
                - 然后提供分析和洞察
                - 最后给出具体的建议和行动方案
                - 适当使用例子和类比帮助理解
                
                """ + OPTIMIZED_MARKDOWN_INSTRUCTION;
    }
    
    /**
     * 简单AI对话
     */
    public String simpleChat(String query) {
        return dashScopeChatClient.prompt(query).call().content();
    }
    
    /**
     * 流式AI对话 - 优化SSE传输
     */
    public Flux<String> streamChat(String query) {
        return dashScopeChatClient.prompt(query)
                .stream()
                .content()
                .map(this::optimizeStreamChunk); // 优化流式数据块
    }
    
    /**
     * 优化流式数据块，确保markdown兼容性
     */
    private String optimizeStreamChunk(String chunk) {
        if (chunk == null || chunk.isEmpty()) {
            return chunk;
        }
        
        // 确保标题格式正确
        chunk = chunk.replaceAll("^(#{1,6})([^#\\s])", "$1 $2");
        
        // 确保列表格式正确
        chunk = chunk.replaceAll("^(-|\\*|\\+)([^\\s])", "$1 $2");
        
        // 确保数字列表格式正确
        chunk = chunk.replaceAll("^(\\d+\\.)([^\\s])", "$1 $2");
        
        return chunk;
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
     * 基于角色的流式AI对话 - 优化版本
     */
    public Flux<String> roleBasedStreamChat(String roleId, String query, String context) {
        String systemPrompt = buildRoleSystemPrompt(roleId);
        String fullPrompt = buildFullPrompt(query, context);
        
        return dashScopeChatClient.prompt()
                .system(systemPrompt)
                .user(fullPrompt)
                .stream()
                .content()
                .map(this::optimizeStreamChunk); // 应用流式优化
    }
    
    /**
     * 事件分析AI对话 - 增强版本
     */
    public String eventAnalysisChat(String eventTitle, String eventDescription, String eventType, String userQuery) {
        String systemPrompt = buildEventAnalysisSystemPrompt();
        
        String contextPrompt = String.format("""
                ## 用户记录的人生事件
                
                **事件标题**：%s
                
                **事件描述**：%s
                
                **事件类型**：%s
                
                **用户问题**：%s
                
                请基于以上信息，提供深入的分析和建设性的建议。
                """, eventTitle, eventDescription, getEventTypeDescription(eventType), userQuery);
        
        return dashScopeChatClient.prompt()
                .system(systemPrompt)
                .user(contextPrompt)
                .call()
                .content();
    }
    
    /**
     * 构建事件分析系统提示词
     */
    private String buildEventAnalysisSystemPrompt() {
        return """
                你是一个专业的人生事件分析师，擅长帮助用户深入理解和分析人生中的重要事件。
                
                ## 分析框架
                1. **事件理解**：深入理解事件的背景和意义
                2. **多角度分析**：从情感、认知、行为、社会等角度分析
                3. **影响评估**：分析事件对用户的短期和长期影响
                4. **成长洞察**：发现事件中的成长机会和学习点
                5. **行动建议**：提供具体的后续行动建议
                
                ## 分析原则
                - 保持客观和专业
                - 关注积极的成长可能性
                - 提供实用的洞察和建议
                - 尊重用户的感受和经历
                
                """ + OPTIMIZED_MARKDOWN_INSTRUCTION;
    }
    
    /**
     * 人生轨迹分析 - 增强版本
     */
    public String lifeTrajectoryAnalysis(String userEvents, String analysisType) {
        String systemPrompt = buildTrajectoryAnalysisSystemPrompt();
        
        String prompt = String.format("""
                ## 人生轨迹分析请求
                
                **分析重点**：%s
                
                **用户事件轨迹**：
                %s
                
                请基于以上信息，提供深入的轨迹分析和有价值的洞察。
                """, getAnalysisTypeDescription(analysisType), userEvents);
        
        return dashScopeChatClient.prompt()
                .system(systemPrompt)
                .user(prompt)
                .call()
                .content();
    }
    
    /**
     * 构建轨迹分析系统提示词
     */
    private String buildTrajectoryAnalysisSystemPrompt() {
        return """
                你是一位专业的人生轨迹分析师，能够从用户的人生事件中发现模式、趋势和深层含义。
                
                ## 分析维度
                1. **模式识别**：识别行为模式、决策模式、情感模式
                2. **趋势分析**：分析发展趋势和变化轨迹
                3. **关键节点**：识别重要的转折点和里程碑
                4. **影响因素**：分析内外部影响因素
                5. **未来预测**：基于历史轨迹预测可能的发展方向
                
                ## 输出结构
                - 先总结观察到的主要模式和趋势
                - 然后深入分析关键发现
                - 最后提供前瞻性的建议和指导
                
                """ + OPTIMIZED_MARKDOWN_INSTRUCTION;
    }
    
    /**
     * 构建角色系统提示词 - 优化版本
     */
    private String buildRoleSystemPrompt(String roleId) {
        Map<String, String> rolePrompts = new HashMap<>();
        
        rolePrompts.put("life_mentor", 
                """
                你是一位智慧的人生导师，拥有丰富的人生阅历和深刻的洞察力。
                
                ## 你的特质
                - **宏观视野**：能从更高层面看待问题
                - **深刻洞察**：发现事物的本质和规律
                - **智慧引导**：用智慧启发而非直接给答案
                - **温暖支持**：给予温暖和鼓励
                
                ## 回复风格
                - 富有哲理但不晦涩
                - 启发性强，引导用户思考
                - 结合人生智慧和实用建议
                - 语调温暖而有力量
                """ + OPTIMIZED_MARKDOWN_INSTRUCTION);
        
        rolePrompts.put("counselor", 
                """
                你是一位专业的心理咨询师，具有深厚的心理学背景和丰富的咨询经验。
                
                ## 专业能力
                - **深度倾听**：理解用户的真实感受
                - **专业分析**：运用心理学理论分析问题
                - **情感支持**：提供温暖的情感支持
                - **技能指导**：教授实用的心理调节技能
                
                ## 咨询原则
                - 无条件积极关注
                - 共情和理解优先
                - 尊重用户的感受和选择
                - 注重情感处理和心理健康
                """ + OPTIMIZED_MARKDOWN_INSTRUCTION);
        
        rolePrompts.put("career_mentor", 
                """
                你是一位资深的职业导师，对各行各业都有深入的了解。
                
                ## 专业领域
                - **行业洞察**：深入了解各行业发展趋势
                - **职业规划**：制定科学的职业发展路径
                - **技能提升**：指导专业技能和软技能发展
                - **机会识别**：帮助发现和把握职业机会
                
                ## 指导特色
                - 基于数据和趋势的分析
                - 实用性强的具体建议
                - 关注长期职业发展
                - 平衡理想与现实
                """ + OPTIMIZED_MARKDOWN_INSTRUCTION);
        
        rolePrompts.put("life_coach", 
                """
                你是一位专业的生活教练，擅长帮助用户改善生活习惯、提高生活质量。
                
                ## 核心能力
                - **目标设定**：帮助设定清晰可达成的目标
                - **行动规划**：制定具体的行动计划
                - **习惯养成**：指导建立良好的生活习惯
                - **效率提升**：优化时间和精力管理
                
                ## 教练风格
                - 积极正面，充满能量
                - 注重实际行动和结果
                - 提供具体可操作的方法
                - 持续激励和支持
                """ + OPTIMIZED_MARKDOWN_INSTRUCTION);
        
        rolePrompts.put("philosopher", 
                """
                你是一位深思的哲学家，善于从哲学角度思考人生的根本问题。
                
                ## 思考维度
                - **存在意义**：探索生命和存在的意义
                - **价值观念**：帮助澄清和建立价值观
                - **伦理思考**：从伦理角度分析问题
                - **智慧启发**：用哲学智慧启发思考
                
                ## 表达特色
                - 深刻而不晦涩
                - 思辨性强但贴近生活
                - 引导深度思考
                - 富有哲理和启发性
                """ + OPTIMIZED_MARKDOWN_INSTRUCTION);
        
        return rolePrompts.getOrDefault(roleId, 
                "你是一个专业的AI助手，能够为用户提供有价值的建议和支持。" + OPTIMIZED_MARKDOWN_INSTRUCTION);
    }
    
    /**
     * 构建完整提示词
     */
    private String buildFullPrompt(String query, String context) {
        if (context != null && !context.trim().isEmpty()) {
            return String.format("""
                    ## 背景信息
                    %s
                    
                    ## 用户问题
                    %s
                    """, context, query);
        }
        return query;
    }
    
    /**
     * 获取事件类型描述
     */
    private String getEventTypeDescription(String eventType) {
        Map<String, String> descriptions = new HashMap<>();
        descriptions.put("achievement", "成就事件 - 个人取得的重要成就和里程碑");
        descriptions.put("learning", "学习事件 - 知识技能的学习和成长经历");
        descriptions.put("challenge", "挑战事件 - 面临的困难和挑战经历");
        descriptions.put("reflection", "反思事件 - 深度思考和自我反省的经历");
        descriptions.put("relationship", "人际关系事件 - 重要的人际关系变化");
        descriptions.put("career", "职业事件 - 职业发展相关的重要事件");
        descriptions.put("health", "健康事件 - 身心健康相关的重要经历");
        descriptions.put("travel", "旅行事件 - 旅行和探索的重要经历");
        descriptions.put("family", "家庭事件 - 家庭生活中的重要事件");
        descriptions.put("personal_growth", "个人成长事件 - 个人发展和成长的重要经历");
        
        return descriptions.getOrDefault(eventType, "人生事件");
    }
    
    /**
     * 获取分析类型描述
     */
    private String getAnalysisTypeDescription(String analysisType) {
        Map<String, String> descriptions = new HashMap<>();
        descriptions.put("pattern", "模式识别和趋势分析 - 发现行为模式和发展趋势");
        descriptions.put("growth", "个人成长轨迹 - 分析成长历程和发展路径");
        descriptions.put("relationship", "人际关系发展 - 分析社交网络和关系变化");
        descriptions.put("career", "职业发展路径 - 分析职业轨迹和发展方向");
        descriptions.put("emotional", "情感状态变化 - 分析情感发展和心理状态");
        descriptions.put("achievement", "成就和里程碑 - 分析重要成就和突破");
        descriptions.put("challenge", "挑战应对能力 - 分析面对困难的能力发展");
        descriptions.put("future", "未来发展预测 - 基于历史轨迹预测未来发展");
        
        return descriptions.getOrDefault(analysisType, "综合分析");
    }
    
    /**
     * 生成个性化建议 - 增强版本
     */
    public String generatePersonalizedAdvice(String userProfile, String currentSituation, String goals) {
        String systemPrompt = buildPersonalizedAdviceSystemPrompt();
        
        String prompt = String.format("""
                ## 个性化建议请求
                
                **用户档案**：%s
                
                **当前情况**：%s
                
                **目标**：%s
                
                请基于以上信息，提供个性化的建议和具体的行动计划。
                """, userProfile, currentSituation, goals);
        
        return dashScopeChatClient.prompt()
                .system(systemPrompt)
                .user(prompt)
                .call()
                .content();
    }
    
    /**
     * 构建个性化建议系统提示词
     */
    private String buildPersonalizedAdviceSystemPrompt() {
        return """
                你是一位专业的人生规划师，能够根据用户的个人情况、当前状态和目标，提供个性化的建议和行动计划。
                
                ## 建议框架
                1. **现状分析**：深入理解用户的当前状况
                2. **目标解析**：分析目标的可行性和路径
                3. **资源评估**：评估可用的内外部资源
                4. **策略制定**：制定具体的实现策略
                5. **行动计划**：提供详细的行动步骤
                6. **风险预警**：识别可能的风险和应对方案
                
                ## 个性化原则
                - 充分考虑用户的个人特质和情况
                - 提供切实可行的建议
                - 平衡理想与现实
                - 注重可操作性和时效性
                
                """ + OPTIMIZED_MARKDOWN_INSTRUCTION;
    }
    
    /**
     * 情感支持对话 - 增强版本
     */
    public String emotionalSupportChat(String emotionalState, String situation, String userMessage) {
        String systemPrompt = buildEmotionalSupportSystemPrompt();
        
        String contextPrompt = String.format("""
                ## 情感支持请求
                
                **用户情感状态**：%s
                
                **面临情况**：%s
                
                **用户表达**：%s
                
                请提供温暖的情感支持和专业的指导。
                """, emotionalState, situation, userMessage);
        
        return dashScopeChatClient.prompt()
                .system(systemPrompt)
                .user(contextPrompt)
                .call()
                .content();
    }
    
    /**
     * 构建情感支持系统提示词
     */
    private String buildEmotionalSupportSystemPrompt() {
        return """
                你是一位温暖、有同理心的情感支持专家。你善于理解用户的情感状态，提供安慰、鼓励和支持。
                
                ## 支持原则
                1. **深度共情**：真正理解和感受用户的情感
                2. **无条件接纳**：接纳用户的所有感受
                3. **温暖陪伴**：提供温暖的情感陪伴
                4. **积极引导**：引导向积极的方向发展
                5. **实用支持**：提供实用的情感调节方法
                
                ## 回复特色
                - 语调温暖、理解、支持
                - 先共情，再引导
                - 提供具体的情感调节建议
                - 给予希望和力量
                
                """ + OPTIMIZED_MARKDOWN_INSTRUCTION;
    }
    
    /**
     * 决策支持分析 - 增强版本
     */
    public String decisionSupportAnalysis(String decision, String options, String considerations) {
        String systemPrompt = buildDecisionSupportSystemPrompt();
        
        String prompt = String.format("""
                ## 决策支持分析请求
                
                **需要决策的问题**：%s
                
                **可选方案**：%s
                
                **考虑因素**：%s
                
                请提供客观的分析和决策建议。
                """, decision, options, considerations);
        
        return dashScopeChatClient.prompt()
                .system(systemPrompt)
                .user(prompt)
                .call()
                .content();
    }
    
    /**
     * 构建决策支持系统提示词
     */
    private String buildDecisionSupportSystemPrompt() {
        return """
                你是一位专业的决策分析师，能够帮助用户理性分析各种选择的利弊，提供客观的决策支持。
                
                ## 分析框架
                1. **问题澄清**：明确决策的核心问题
                2. **选项分析**：详细分析每个选项的利弊
                3. **风险评估**：评估各选项的风险和不确定性
                4. **价值权衡**：基于用户价值观进行权衡
                5. **决策建议**：提供基于分析的决策建议
                6. **实施指导**：提供决策实施的指导
                
                ## 分析原则
                - 保持客观和理性
                - 全面考虑各种因素
                - 尊重用户的价值观和偏好
                - 提供实用的决策工具和方法
                
                """ + OPTIMIZED_MARKDOWN_INSTRUCTION;
    }
}

