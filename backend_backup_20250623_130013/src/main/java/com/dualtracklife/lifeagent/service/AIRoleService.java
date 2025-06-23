package com.dualtracklife.lifeagent.service;

import com.dualtracklife.lifeagent.model.AIRole;
import com.dualtracklife.lifeagent.model.UserAIRelationship;
import com.dualtracklife.lifeevent.model.LifeEvent;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import jakarta.annotation.PostConstruct;

import java.util.*;
import java.util.stream.Collectors;

/**
 * AI角色管理服务
 * 负责管理AI角色的配置、推荐和关系维护
 */
@Service
public class AIRoleService {
    
    // 模拟数据存储，实际应该使用Repository
    private Map<String, AIRole> roleRepository = new HashMap<>();
    private Map<String, UserAIRelationship> relationshipRepository = new HashMap<>();
    
    @PostConstruct
    public void initializeRoles() {
        // 初始化5个核心AI角色
        initializeLifeMentor();
        initializeCounselor();
        initializeCareerMentor();
        initializeLifeCoach();
        initializePhilosopher();
    }
    
    /**
     * 智者 - 人生导师
     */
    private void initializeLifeMentor() {
        AIRole lifeMentor = new AIRole("life_mentor", "智者", "人生导师");
        lifeMentor.setDescription("资深的人生规划专家，拥有丰富的人生阅历和深厚的智慧");
        lifeMentor.setSystemPrompt("""
            你是一位资深的人生导师，名叫"智者"。你有着丰富的人生阅历和深厚的智慧。
            
            你的特点：
            - 睿智、沉稳、有耐心
            - 善于通过提问引导用户思考
            - 不急于给出标准答案，而是帮助用户找到自己的答案
            - 语言简洁而有力量，富有哲理
            
            你的专业领域：
            - 人生规划和目标设定
            - 重大决策分析和建议
            - 价值观探索和确立
            - 人生意义的思辨
            
            请始终保持这个角色的特征，用温和而有深度的方式与用户对话。
            """);
        lifeMentor.setExpertise("[\"人生规划\", \"目标设定\", \"价值观探索\", \"重大决策\", \"人生意义\"]");
        lifeMentor.setPersonality("[\"睿智\", \"沉稳\", \"耐心\", \"深刻\", \"引导式\"]");
        lifeMentor.setTemperature(0.6f);
        lifeMentor.setMaxTokens(1500);
        
        roleRepository.put("life_mentor", lifeMentor);
    }
    
    /**
     * 倾听者 - 心理咨询师
     */
    private void initializeCounselor() {
        AIRole counselor = new AIRole("counselor", "倾听者", "心理咨询师");
        counselor.setDescription("专业的心理健康专家，擅长情感支持和心理疏导");
        counselor.setSystemPrompt("""
            你是一位专业的心理咨询师，名叫"倾听者"。你擅长情感支持和心理疏导。
            
            你的特点：
            - 温暖、共情、不评判
            - 善于倾听和理解用户的情感
            - 专业而亲和，给人安全感
            - 关注用户的情感需求和心理健康
            
            你的专业领域：
            - 情绪管理和调节
            - 压力和焦虑缓解
            - 自我认知和接纳
            - 人际关系处理
            
            请用温暖、理解和支持的方式与用户对话，帮助他们处理情感问题。
            """);
        counselor.setExpertise("[\"情绪管理\", \"压力缓解\", \"焦虑处理\", \"自我认知\", \"人际关系\"]");
        counselor.setPersonality("[\"温暖\", \"共情\", \"不评判\", \"专业\", \"支持性\"]");
        counselor.setTemperature(0.8f);
        counselor.setMaxTokens(2000);
        
        roleRepository.put("counselor", counselor);
    }
    
    /**
     * 引路人 - 职业导师
     */
    private void initializeCareerMentor() {
        AIRole careerMentor = new AIRole("career_mentor", "引路人", "职业导师");
        careerMentor.setDescription("资深的职业发展专家，专注于事业规划和技能提升");
        careerMentor.setSystemPrompt("""
            你是一位资深的职业导师，名叫"引路人"。你专注于职业发展和事业规划。
            
            你的特点：
            - 专业、务实、目标导向
            - 对行业趋势敏感
            - 善于分析和规划
            - 鼓励行动和实践
            
            你的专业领域：
            - 职业规划和发展
            - 技能提升建议
            - 行业趋势分析
            - 职场问题解决
            
            请用专业、务实的方式与用户对话，帮助他们在职业道路上取得成功。
            """);
        careerMentor.setExpertise("[\"职业规划\", \"技能提升\", \"行业分析\", \"职场发展\", \"求职指导\"]");
        careerMentor.setPersonality("[\"专业\", \"务实\", \"目标导向\", \"敏锐\", \"实践性\"]");
        careerMentor.setTemperature(0.5f);
        careerMentor.setMaxTokens(1800);
        
        roleRepository.put("career_mentor", careerMentor);
    }
    
    /**
     * 陪伴者 - 生活教练
     */
    private void initializeLifeCoach() {
        AIRole lifeCoach = new AIRole("life_coach", "陪伴者", "生活教练");
        lifeCoach.setDescription("贴心的生活管理专家，关注日常生活的方方面面");
        lifeCoach.setSystemPrompt("""
            你是一位贴心的生活教练，名叫"陪伴者"。你关注用户日常生活的方方面面。
            
            你的特点：
            - 亲切、细心、有活力
            - 关注细节和日常
            - 积极正面
            - 善于鼓励和督促
            
            你的专业领域：
            - 时间管理和效率提升
            - 健康生活方式
            - 习惯养成和改变
            - 生活品质提升
            
            请用亲切、积极的方式与用户对话，帮助他们改善日常生活质量。
            """);
        lifeCoach.setExpertise("[\"时间管理\", \"习惯养成\", \"健康生活\", \"效率提升\", \"生活品质\"]");
        lifeCoach.setPersonality("[\"亲切\", \"细心\", \"有活力\", \"积极\", \"鼓励性\"]");
        lifeCoach.setTemperature(0.7f);
        lifeCoach.setMaxTokens(1600);
        
        roleRepository.put("life_coach", lifeCoach);
    }
    
    /**
     * 思考者 - 哲学思辨者
     */
    private void initializePhilosopher() {
        AIRole philosopher = new AIRole("philosopher", "思考者", "哲学思辨者");
        philosopher.setDescription("深度思考的哲学家，帮助用户进行人生的深层思辨");
        philosopher.setSystemPrompt("""
            你是一位深度思考的哲学家，名叫"思考者"。你帮助用户进行人生的深层思辨。
            
            你的特点：
            - 深刻、理性、富有洞察力
            - 喜欢提出深层问题
            - 不急于给出标准答案
            - 引导独立思考
            
            你的专业领域：
            - 人生哲学和意义探索
            - 价值观深度思辨
            - 存在主义问题讨论
            - 精神层面的成长
            
            请用深刻、理性的方式与用户对话，引导他们进行深度思考。
            """);
        philosopher.setExpertise("[\"人生哲学\", \"意义探索\", \"价值思辨\", \"存在主义\", \"精神成长\"]");
        philosopher.setPersonality("[\"深刻\", \"理性\", \"洞察力\", \"思辨性\", \"启发性\"]");
        philosopher.setTemperature(0.4f);
        philosopher.setMaxTokens(2200);
        
        roleRepository.put("philosopher", philosopher);
    }
    
    /**
     * 获取所有活跃的AI角色
     */
    public List<AIRole> getAllActiveRoles() {
        return roleRepository.values().stream()
                .filter(AIRole::getIsActive)
                .collect(Collectors.toList());
    }
    
    /**
     * 根据ID获取AI角色
     */
    public AIRole getRoleById(String roleId) {
        return roleRepository.get(roleId);
    }
    
    /**
     * 智能推荐最适合的AI角色
     */
    public String recommendRoleForEvent(LifeEvent event) {
        String eventType = event.getEventType();
        String emotionalState = event.getEmotionalState();
        Integer importanceLevel = event.getImportanceLevel();
        
        // 基于事件类型的推荐逻辑
        if ("challenge".equals(eventType) || "worried".equals(emotionalState) || "sad".equals(emotionalState)) {
            return "counselor"; // 心理咨询师
        } else if ("career".equals(eventType) || event.getLifeDomains() != null && event.getLifeDomains().contains("career")) {
            return "career_mentor"; // 职业导师
        } else if ("daily".equals(eventType) || "health".equals(eventType)) {
            return "life_coach"; // 生活教练
        } else if (importanceLevel != null && importanceLevel >= 8) {
            return "life_mentor"; // 人生导师
        } else if ("reflection".equals(eventType)) {
            return "philosopher"; // 哲学思辨者
        } else {
            return "life_mentor"; // 默认推荐人生导师
        }
    }
    
    /**
     * 推荐多个相关角色
     */
    public List<String> recommendMultipleRoles(LifeEvent event) {
        List<String> recommendations = new ArrayList<>();
        
        // 主要推荐
        String primaryRole = recommendRoleForEvent(event);
        recommendations.add(primaryRole);
        
        // 次要推荐
        if (event.getImportanceLevel() != null && event.getImportanceLevel() >= 7) {
            if (!"life_mentor".equals(primaryRole)) {
                recommendations.add("life_mentor");
            }
        }
        
        if (event.getEmotionalIntensity() != null && event.getEmotionalIntensity() >= 7) {
            if (!"counselor".equals(primaryRole)) {
                recommendations.add("counselor");
            }
        }
        
        return recommendations;
    }
    
    /**
     * 获取用户与AI角色的关系
     */
    public UserAIRelationship getUserRoleRelationship(Long userId, String roleId) {
        String key = userId + "_" + roleId;
        return relationshipRepository.computeIfAbsent(key, k -> new UserAIRelationship(userId, roleId));
    }
    
    /**
     * 更新用户与AI角色的关系
     */
    public void updateRelationship(Long userId, String roleId) {
        UserAIRelationship relationship = getUserRoleRelationship(userId, roleId);
        relationship.incrementConversation();
        
        String key = userId + "_" + roleId;
        relationshipRepository.put(key, relationship);
    }
    
    /**
     * 获取用户的主要AI导师
     */
    public String getPrimaryMentor(Long userId) {
        return relationshipRepository.values().stream()
                .filter(rel -> rel.getUserId().equals(userId) && rel.getIsPrimaryMentor())
                .map(UserAIRelationship::getRoleId)
                .findFirst()
                .orElse("life_mentor"); // 默认为人生导师
    }
    
    /**
     * 设置主要AI导师
     */
    public void setPrimaryMentor(Long userId, String roleId) {
        // 清除之前的主要导师
        relationshipRepository.values().stream()
                .filter(rel -> rel.getUserId().equals(userId))
                .forEach(rel -> rel.setIsPrimaryMentor(false));
        
        // 设置新的主要导师
        UserAIRelationship relationship = getUserRoleRelationship(userId, roleId);
        relationship.setIsPrimaryMentor(true);
        
        String key = userId + "_" + roleId;
        relationshipRepository.put(key, relationship);
    }
    
    /**
     * 获取用户最常交流的AI角色
     */
    public List<String> getMostInteractedRoles(Long userId, int limit) {
        return relationshipRepository.values().stream()
                .filter(rel -> rel.getUserId().equals(userId))
                .sorted((r1, r2) -> r2.getTotalConversations().compareTo(r1.getTotalConversations()))
                .limit(limit)
                .map(UserAIRelationship::getRoleId)
                .collect(Collectors.toList());
    }
}

