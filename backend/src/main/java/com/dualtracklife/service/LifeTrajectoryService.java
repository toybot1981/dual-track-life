package com.dualtracklife.service;

import com.dualtracklife.model.*;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

/**
 * 增强的人生轨迹分析服务
 * 提供深度的人生事件分析和轨迹洞察
 */
@Service
public class LifeTrajectoryService {
    
    @Autowired
    private AIRoleService aiRoleService;
    
    // 模拟数据存储
    private Map<Long, List<LifeEvent>> userEventsRepository = new HashMap<>();
    
    /**
     * 添加人生事件
     */
    public LifeEvent addLifeEvent(LifeEvent event) {
        // 自动分析和增强事件信息
        enhanceEventWithAI(event);
        
        // 推荐相关AI角色
        List<String> recommendedRoles = aiRoleService.recommendMultipleRoles(event);
        event.setRecommendedRoles(String.join(",", recommendedRoles));
        
        // 存储事件
        userEventsRepository.computeIfAbsent(event.getUserId(), k -> new ArrayList<>()).add(event);
        
        return event;
    }
    
    /**
     * 使用AI增强事件信息
     */
    private void enhanceEventWithAI(LifeEvent event) {
        // 自动分析事件的生活领域
        if (event.getLifeDomains() == null) {
            event.setLifeDomains(analyzeLifeDomains(event));
        }
        
        // 自动评估影响时间范围
        if (event.getImpactTimeframe() == null) {
            event.setImpactTimeframe(analyzeImpactTimeframe(event));
        }
        
        // 自动判断是否为里程碑事件
        if (event.getImportanceLevel() != null && event.getImportanceLevel() >= 8) {
            event.setIsMilestone(true);
        }
    }
    
    /**
     * 分析事件涉及的生活领域
     */
    private String analyzeLifeDomains(LifeEvent event) {
        List<String> domains = new ArrayList<>();
        
        String content = (event.getTitle() + " " + event.getDescription()).toLowerCase();
        
        if (content.contains("工作") || content.contains("职业") || content.contains("升职") || content.contains("跳槽")) {
            domains.add("career");
        }
        if (content.contains("健康") || content.contains("运动") || content.contains("身体") || content.contains("医院")) {
            domains.add("health");
        }
        if (content.contains("朋友") || content.contains("家人") || content.contains("恋爱") || content.contains("结婚")) {
            domains.add("relationship");
        }
        if (content.contains("学习") || content.contains("课程") || content.contains("技能") || content.contains("知识")) {
            domains.add("learning");
        }
        if (content.contains("理财") || content.contains("投资") || content.contains("买房") || content.contains("金钱")) {
            domains.add("finance");
        }
        if (content.contains("成长") || content.contains("反思") || content.contains("价值观") || content.contains("人生")) {
            domains.add("personal_growth");
        }
        
        return domains.isEmpty() ? "personal_growth" : String.join(",", domains);
    }
    
    /**
     * 分析事件的影响时间范围
     */
    private String analyzeImpactTimeframe(LifeEvent event) {
        if (event.getImportanceLevel() == null) {
            return "immediate";
        }
        
        int importance = event.getImportanceLevel();
        String eventType = event.getEventType();
        
        if (importance >= 9 || "achievement".equals(eventType) && importance >= 7) {
            return "long_term";
        } else if (importance >= 6 || "learning".equals(eventType)) {
            return "medium_term";
        } else if (importance >= 4) {
            return "short_term";
        } else {
            return "immediate";
        }
    }
    
    /**
     * 获取用户的人生轨迹概览
     */
    public LifeTrajectoryOverview getTrajectoryOverview(Long userId) {
        List<LifeEvent> events = getUserEvents(userId);
        
        LifeTrajectoryOverview overview = new LifeTrajectoryOverview();
        overview.setUserId(userId);
        overview.setTotalEvents(events.size());
        overview.setMilestoneEvents(countMilestoneEvents(events));
        overview.setRecentEvents(getRecentEvents(events, 30));
        overview.setLifeDomainDistribution(analyzeLifeDomainDistribution(events));
        overview.setEmotionalTrend(analyzeEmotionalTrend(events));
        overview.setGrowthInsights(generateGrowthInsights(events));
        
        return overview;
    }
    
    /**
     * 获取用户的所有事件
     */
    public List<LifeEvent> getUserEvents(Long userId) {
        return userEventsRepository.getOrDefault(userId, new ArrayList<>());
    }
    
    /**
     * 获取最近的事件
     */
    public List<LifeEvent> getRecentEvents(List<LifeEvent> events, int days) {
        LocalDate cutoffDate = LocalDate.now().minusDays(days);
        return events.stream()
                .filter(event -> event.getEventDate().isAfter(cutoffDate))
                .sorted((e1, e2) -> e2.getEventDate().compareTo(e1.getEventDate()))
                .collect(Collectors.toList());
    }
    
    /**
     * 统计里程碑事件数量
     */
    private int countMilestoneEvents(List<LifeEvent> events) {
        return (int) events.stream().filter(LifeEvent::getIsMilestone).count();
    }
    
    /**
     * 分析生活领域分布
     */
    private Map<String, Integer> analyzeLifeDomainDistribution(List<LifeEvent> events) {
        Map<String, Integer> distribution = new HashMap<>();
        
        for (LifeEvent event : events) {
            if (event.getLifeDomains() != null) {
                String[] domains = event.getLifeDomains().split(",");
                for (String domain : domains) {
                    distribution.merge(domain.trim(), 1, Integer::sum);
                }
            }
        }
        
        return distribution;
    }
    
    /**
     * 分析情感趋势
     */
    private EmotionalTrend analyzeEmotionalTrend(List<LifeEvent> events) {
        EmotionalTrend trend = new EmotionalTrend();
        
        // 按时间排序
        List<LifeEvent> sortedEvents = events.stream()
                .filter(e -> e.getEmotionalState() != null && e.getEmotionalIntensity() != null)
                .sorted(Comparator.comparing(LifeEvent::getEventDate))
                .collect(Collectors.toList());
        
        if (sortedEvents.isEmpty()) {
            trend.setOverallTrend("stable");
            trend.setAverageIntensity(5.0f);
            return trend;
        }
        
        // 计算平均情感强度
        double avgIntensity = sortedEvents.stream()
                .mapToInt(LifeEvent::getEmotionalIntensity)
                .average()
                .orElse(5.0);
        trend.setAverageIntensity((float) avgIntensity);
        
        // 分析趋势方向
        if (sortedEvents.size() >= 3) {
            List<LifeEvent> recentEvents = sortedEvents.subList(Math.max(0, sortedEvents.size() - 5), sortedEvents.size());
            double recentAvg = recentEvents.stream()
                    .mapToInt(LifeEvent::getEmotionalIntensity)
                    .average()
                    .orElse(5.0);
            
            if (recentAvg > avgIntensity + 1) {
                trend.setOverallTrend("improving");
            } else if (recentAvg < avgIntensity - 1) {
                trend.setOverallTrend("declining");
            } else {
                trend.setOverallTrend("stable");
            }
        } else {
            trend.setOverallTrend("stable");
        }
        
        // 统计情感状态分布
        Map<String, Integer> emotionalDistribution = new HashMap<>();
        for (LifeEvent event : sortedEvents) {
            emotionalDistribution.merge(event.getEmotionalState(), 1, Integer::sum);
        }
        trend.setEmotionalDistribution(emotionalDistribution);
        
        return trend;
    }
    
    /**
     * 生成成长洞察
     */
    private List<String> generateGrowthInsights(List<LifeEvent> events) {
        List<String> insights = new ArrayList<>();
        
        // 分析成长模式
        long learningEvents = events.stream().filter(e -> "learning".equals(e.getEventType())).count();
        long achievementEvents = events.stream().filter(e -> "achievement".equals(e.getEventType())).count();
        long challengeEvents = events.stream().filter(e -> "challenge".equals(e.getEventType())).count();
        
        if (learningEvents > events.size() * 0.3) {
            insights.add("你是一个热爱学习的人，持续的学习让你不断成长");
        }
        
        if (achievementEvents > events.size() * 0.2) {
            insights.add("你在各个方面都有不错的成就，继续保持这种积极的态度");
        }
        
        if (challengeEvents > events.size() * 0.3) {
            insights.add("你面临了不少挑战，这些经历正在让你变得更加坚强");
        }
        
        // 分析时间模式
        Map<String, List<LifeEvent>> eventsByMonth = events.stream()
                .collect(Collectors.groupingBy(e -> e.getEventDate().getYear() + "-" + e.getEventDate().getMonthValue()));
        
        if (eventsByMonth.size() > 3) {
            insights.add("你保持着良好的记录习惯，这有助于更好地了解自己的成长轨迹");
        }
        
        // 分析里程碑事件
        long milestones = events.stream().filter(LifeEvent::getIsMilestone).count();
        if (milestones > 0) {
            insights.add("你已经达成了" + milestones + "个重要的人生里程碑，这是值得庆祝的成就");
        }
        
        return insights;
    }
    
    /**
     * 分析事件之间的关联性
     */
    public List<EventConnection> analyzeEventConnections(Long userId) {
        List<LifeEvent> events = getUserEvents(userId);
        List<EventConnection> connections = new ArrayList<>();
        
        for (int i = 0; i < events.size(); i++) {
            for (int j = i + 1; j < events.size(); j++) {
                LifeEvent event1 = events.get(i);
                LifeEvent event2 = events.get(j);
                
                EventConnection connection = findConnection(event1, event2);
                if (connection != null) {
                    connections.add(connection);
                }
            }
        }
        
        return connections.stream()
                .sorted((c1, c2) -> Float.compare(c2.getConnectionStrength(), c1.getConnectionStrength()))
                .limit(10)
                .collect(Collectors.toList());
    }
    
    /**
     * 查找两个事件之间的关联
     */
    private EventConnection findConnection(LifeEvent event1, LifeEvent event2) {
        float connectionStrength = 0.0f;
        List<String> connectionTypes = new ArrayList<>();
        
        // 时间关联
        long daysBetween = Math.abs(ChronoUnit.DAYS.between(event1.getEventDate(), event2.getEventDate()));
        if (daysBetween <= 7) {
            connectionStrength += 0.3f;
            connectionTypes.add("时间相近");
        }
        
        // 领域关联
        if (event1.getLifeDomains() != null && event2.getLifeDomains() != null) {
            Set<String> domains1 = Set.of(event1.getLifeDomains().split(","));
            Set<String> domains2 = Set.of(event2.getLifeDomains().split(","));
            
            Set<String> intersection = new HashSet<>(domains1);
            intersection.retainAll(domains2);
            
            if (!intersection.isEmpty()) {
                connectionStrength += 0.4f * intersection.size();
                connectionTypes.add("相同领域");
            }
        }
        
        // 情感关联
        if (event1.getEmotionalState() != null && event2.getEmotionalState() != null) {
            if (event1.getEmotionalState().equals(event2.getEmotionalState())) {
                connectionStrength += 0.2f;
                connectionTypes.add("相似情感");
            }
        }
        
        // 重要性关联
        if (event1.getImportanceLevel() != null && event2.getImportanceLevel() != null) {
            int importanceDiff = Math.abs(event1.getImportanceLevel() - event2.getImportanceLevel());
            if (importanceDiff <= 2) {
                connectionStrength += 0.1f;
                connectionTypes.add("重要性相近");
            }
        }
        
        if (connectionStrength > 0.3f) {
            EventConnection connection = new EventConnection();
            connection.setEvent1Id(event1.getId());
            connection.setEvent2Id(event2.getId());
            connection.setConnectionStrength(connectionStrength);
            connection.setConnectionTypes(connectionTypes);
            return connection;
        }
        
        return null;
    }
    
    /**
     * 预测未来发展趋势
     */
    public FutureTrendPrediction predictFutureTrends(Long userId) {
        List<LifeEvent> events = getUserEvents(userId);
        FutureTrendPrediction prediction = new FutureTrendPrediction();
        
        // 分析最近的事件模式
        List<LifeEvent> recentEvents = getRecentEvents(events, 90);
        
        // 预测情感趋势
        EmotionalTrend recentEmotionalTrend = analyzeEmotionalTrend(recentEvents);
        prediction.setEmotionalTrendPrediction(predictEmotionalTrend(recentEmotionalTrend));
        
        // 预测成长领域
        Map<String, Integer> domainDistribution = analyzeLifeDomainDistribution(recentEvents);
        prediction.setGrowthAreaPredictions(predictGrowthAreas(domainDistribution));
        
        // 预测挑战和机会
        prediction.setChallengesPrediction(predictChallenges(recentEvents));
        prediction.setOpportunitiesPrediction(predictOpportunities(recentEvents));
        
        return prediction;
    }
    
    private String predictEmotionalTrend(EmotionalTrend trend) {
        if ("improving".equals(trend.getOverallTrend())) {
            return "情感状态呈上升趋势，预计未来会继续保持积极的心态";
        } else if ("declining".equals(trend.getOverallTrend())) {
            return "最近情感状态有所下降，建议关注心理健康，寻求适当的支持";
        } else {
            return "情感状态相对稳定，继续保持当前的生活节奏";
        }
    }
    
    private List<String> predictGrowthAreas(Map<String, Integer> domainDistribution) {
        return domainDistribution.entrySet().stream()
                .sorted(Map.Entry.<String, Integer>comparingByValue().reversed())
                .limit(3)
                .map(entry -> {
                    String domain = entry.getKey();
                    switch (domain) {
                        case "career": return "职业发展将是你未来成长的重点领域";
                        case "learning": return "持续学习将为你带来更多机会";
                        case "health": return "健康管理将成为你关注的重要方面";
                        case "relationship": return "人际关系的发展将为你带来更多支持";
                        default: return "个人成长将是你持续关注的领域";
                    }
                })
                .collect(Collectors.toList());
    }
    
    private List<String> predictChallenges(List<LifeEvent> recentEvents) {
        List<String> challenges = new ArrayList<>();
        
        long challengeEvents = recentEvents.stream().filter(e -> "challenge".equals(e.getEventType())).count();
        if (challengeEvents > recentEvents.size() * 0.3) {
            challenges.add("可能会继续面临一些挑战，建议提前做好心理准备");
        }
        
        // 分析情感状态
        long negativeEvents = recentEvents.stream()
                .filter(e -> e.getEmotionalState() != null && 
                           (e.getEmotionalState().contains("worried") || 
                            e.getEmotionalState().contains("sad")))
                .count();
        
        if (negativeEvents > recentEvents.size() * 0.2) {
            challenges.add("注意情绪管理，避免负面情绪的累积");
        }
        
        return challenges;
    }
    
    private List<String> predictOpportunities(List<LifeEvent> recentEvents) {
        List<String> opportunities = new ArrayList<>();
        
        long learningEvents = recentEvents.stream().filter(e -> "learning".equals(e.getEventType())).count();
        if (learningEvents > 0) {
            opportunities.add("最近的学习经历将为你带来新的发展机会");
        }
        
        long achievementEvents = recentEvents.stream().filter(e -> "achievement".equals(e.getEventType())).count();
        if (achievementEvents > 0) {
            opportunities.add("最近的成就为你建立了良好的基础，可以考虑更大的目标");
        }
        
        return opportunities;
    }
    
    // 内部类定义
    public static class LifeTrajectoryOverview {
        private Long userId;
        private Integer totalEvents;
        private Integer milestoneEvents;
        private List<LifeEvent> recentEvents;
        private Map<String, Integer> lifeDomainDistribution;
        private EmotionalTrend emotionalTrend;
        private List<String> growthInsights;
        
        // Getters and Setters
        public Long getUserId() { return userId; }
        public void setUserId(Long userId) { this.userId = userId; }
        
        public Integer getTotalEvents() { return totalEvents; }
        public void setTotalEvents(Integer totalEvents) { this.totalEvents = totalEvents; }
        
        public Integer getMilestoneEvents() { return milestoneEvents; }
        public void setMilestoneEvents(Integer milestoneEvents) { this.milestoneEvents = milestoneEvents; }
        
        public List<LifeEvent> getRecentEvents() { return recentEvents; }
        public void setRecentEvents(List<LifeEvent> recentEvents) { this.recentEvents = recentEvents; }
        
        public Map<String, Integer> getLifeDomainDistribution() { return lifeDomainDistribution; }
        public void setLifeDomainDistribution(Map<String, Integer> lifeDomainDistribution) { this.lifeDomainDistribution = lifeDomainDistribution; }
        
        public EmotionalTrend getEmotionalTrend() { return emotionalTrend; }
        public void setEmotionalTrend(EmotionalTrend emotionalTrend) { this.emotionalTrend = emotionalTrend; }
        
        public List<String> getGrowthInsights() { return growthInsights; }
        public void setGrowthInsights(List<String> growthInsights) { this.growthInsights = growthInsights; }
    }
    
    public static class EmotionalTrend {
        private String overallTrend;
        private Float averageIntensity;
        private Map<String, Integer> emotionalDistribution;
        
        // Getters and Setters
        public String getOverallTrend() { return overallTrend; }
        public void setOverallTrend(String overallTrend) { this.overallTrend = overallTrend; }
        
        public Float getAverageIntensity() { return averageIntensity; }
        public void setAverageIntensity(Float averageIntensity) { this.averageIntensity = averageIntensity; }
        
        public Map<String, Integer> getEmotionalDistribution() { return emotionalDistribution; }
        public void setEmotionalDistribution(Map<String, Integer> emotionalDistribution) { this.emotionalDistribution = emotionalDistribution; }
    }
    
    public static class EventConnection {
        private Long event1Id;
        private Long event2Id;
        private Float connectionStrength;
        private List<String> connectionTypes;
        
        // Getters and Setters
        public Long getEvent1Id() { return event1Id; }
        public void setEvent1Id(Long event1Id) { this.event1Id = event1Id; }
        
        public Long getEvent2Id() { return event2Id; }
        public void setEvent2Id(Long event2Id) { this.event2Id = event2Id; }
        
        public Float getConnectionStrength() { return connectionStrength; }
        public void setConnectionStrength(Float connectionStrength) { this.connectionStrength = connectionStrength; }
        
        public List<String> getConnectionTypes() { return connectionTypes; }
        public void setConnectionTypes(List<String> connectionTypes) { this.connectionTypes = connectionTypes; }
    }
    
    public static class FutureTrendPrediction {
        private String emotionalTrendPrediction;
        private List<String> growthAreaPredictions;
        private List<String> challengesPrediction;
        private List<String> opportunitiesPrediction;
        
        // Getters and Setters
        public String getEmotionalTrendPrediction() { return emotionalTrendPrediction; }
        public void setEmotionalTrendPrediction(String emotionalTrendPrediction) { this.emotionalTrendPrediction = emotionalTrendPrediction; }
        
        public List<String> getGrowthAreaPredictions() { return growthAreaPredictions; }
        public void setGrowthAreaPredictions(List<String> growthAreaPredictions) { this.growthAreaPredictions = growthAreaPredictions; }
        
        public List<String> getChallengesPrediction() { return challengesPrediction; }
        public void setChallengesPrediction(List<String> challengesPrediction) { this.challengesPrediction = challengesPrediction; }
        
        public List<String> getOpportunitiesPrediction() { return opportunitiesPrediction; }
        public void setOpportunitiesPrediction(List<String> opportunitiesPrediction) { this.opportunitiesPrediction = opportunitiesPrediction; }
    }
}

