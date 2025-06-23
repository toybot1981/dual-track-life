package com.dualtracklife.lifeevent.service;

import com.dualtracklife.lifeevent.model.LifeEvent;
import com.dualtracklife.user.model.User;
import com.dualtracklife.user.service.UserService;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import jakarta.annotation.PostConstruct;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

/**
 * 事件管理服务
 * 负责人生事件的CRUD操作和相关分析
 */
@Service
public class EventService {
    
    @Autowired
    private UserService userService;
    
    // 内存存储 - 实际项目中应该使用数据库
    private final Map<Long, LifeEvent> events = new ConcurrentHashMap<>();
    private final Map<Long, List<Long>> userEvents = new ConcurrentHashMap<>(); // userId -> List<eventId>
    
    private Long nextEventId = 1L;
    
    @PostConstruct
    public void initializeDefaultEvents() {
        // 为演示用户创建一些示例事件
        User demoUser = userService.getUserByUsername("demo_user");
        if (demoUser != null) {
            createSampleEvents(demoUser.getId());
        }
    }
    
    /**
     * 创建新事件
     */
    public LifeEvent createEvent(Long userId, Map<String, Object> eventData) {
        User user = userService.getUserById(userId);
        if (user == null) {
            throw new RuntimeException("用户不存在");
        }
        
        LifeEvent event = new LifeEvent();
        event.setId(nextEventId++);
        event.setUserId(userId);
        event.setTitle((String) eventData.get("title"));
        event.setDescription((String) eventData.get("description"));
        event.setEventType((String) eventData.get("eventType"));
        
        // 处理日期
        if (eventData.get("eventDate") != null) {
            event.setEventDate(LocalDate.parse((String) eventData.get("eventDate")));
        } else {
            event.setEventDate(LocalDate.now());
        }
        
        // 处理可选字段
        if (eventData.get("emotionalState") != null) {
            event.setEmotionalState((String) eventData.get("emotionalState"));
        }
        if (eventData.get("emotionalIntensity") != null) {
            event.setEmotionalIntensity((Integer) eventData.get("emotionalIntensity"));
        }
        if (eventData.get("importanceLevel") != null) {
            event.setImportanceLevel((Integer) eventData.get("importanceLevel"));
        }
        if (eventData.get("location") != null) {
            event.setLocation((String) eventData.get("location"));
        }
        if (eventData.get("tags") != null) {
            event.setTags((String) eventData.get("tags"));
        }
        if (eventData.get("isPrivate") != null) {
            event.setIsPrivate((Boolean) eventData.get("isPrivate"));
        }
        
        event.setCreatedAt(LocalDateTime.now());
        event.setUpdatedAt(LocalDateTime.now());
        
        // 保存事件
        events.put(event.getId(), event);
        userEvents.computeIfAbsent(userId, k -> new ArrayList<>()).add(event.getId());
        
        return event;
    }
    
    /**
     * 获取用户的所有事件
     */
    public List<LifeEvent> getUserEvents(Long userId) {
        List<Long> eventIds = userEvents.getOrDefault(userId, new ArrayList<>());
        return eventIds.stream()
                .map(events::get)
                .filter(Objects::nonNull)
                .sorted((e1, e2) -> e2.getEventDate().compareTo(e1.getEventDate())) // 按日期倒序
                .collect(Collectors.toList());
    }
    
    /**
     * 根据ID获取事件
     */
    public LifeEvent getEventById(Long eventId) {
        return events.get(eventId);
    }
    
    /**
     * 更新事件
     */
    public LifeEvent updateEvent(Long eventId, Long userId, Map<String, Object> updates) {
        LifeEvent event = events.get(eventId);
        if (event == null) {
            throw new RuntimeException("事件不存在");
        }
        
        if (!event.getUserId().equals(userId)) {
            throw new RuntimeException("无权限修改此事件");
        }
        
        // 更新允许的字段
        if (updates.containsKey("title")) {
            event.setTitle((String) updates.get("title"));
        }
        if (updates.containsKey("description")) {
            event.setDescription((String) updates.get("description"));
        }
        if (updates.containsKey("eventType")) {
            event.setEventType((String) updates.get("eventType"));
        }
        if (updates.containsKey("eventDate")) {
            event.setEventDate(LocalDate.parse((String) updates.get("eventDate")));
        }
        if (updates.containsKey("emotionalState")) {
            event.setEmotionalState((String) updates.get("emotionalState"));
        }
        if (updates.containsKey("emotionalIntensity")) {
            event.setEmotionalIntensity((Integer) updates.get("emotionalIntensity"));
        }
        if (updates.containsKey("importanceLevel")) {
            event.setImportanceLevel((Integer) updates.get("importanceLevel"));
        }
        if (updates.containsKey("location")) {
            event.setLocation((String) updates.get("location"));
        }
        if (updates.containsKey("tags")) {
            event.setTags((String) updates.get("tags"));
        }
        if (updates.containsKey("isPrivate")) {
            event.setIsPrivate((Boolean) updates.get("isPrivate"));
        }
        
        event.setUpdatedAt(LocalDateTime.now());
        return event;
    }
    
    /**
     * 删除事件
     */
    public void deleteEvent(Long eventId, Long userId) {
        LifeEvent event = events.get(eventId);
        if (event == null) {
            throw new RuntimeException("事件不存在");
        }
        
        if (!event.getUserId().equals(userId)) {
            throw new RuntimeException("无权限删除此事件");
        }
        
        events.remove(eventId);
        List<Long> userEventList = userEvents.get(userId);
        if (userEventList != null) {
            userEventList.remove(eventId);
        }
    }
    
    /**
     * 按类型获取事件
     */
    public List<LifeEvent> getEventsByType(Long userId, String eventType) {
        return getUserEvents(userId).stream()
                .filter(event -> eventType.equals(event.getEventType()))
                .collect(Collectors.toList());
    }
    
    /**
     * 按日期范围获取事件
     */
    public List<LifeEvent> getEventsByDateRange(Long userId, LocalDate startDate, LocalDate endDate) {
        return getUserEvents(userId).stream()
                .filter(event -> {
                    LocalDate eventDate = event.getEventDate();
                    return eventDate.isAfter(startDate.minusDays(1)) && 
                           eventDate.isBefore(endDate.plusDays(1));
                })
                .collect(Collectors.toList());
    }
    
    /**
     * 搜索事件
     */
    public List<LifeEvent> searchEvents(Long userId, String keyword) {
        return getUserEvents(userId).stream()
                .filter(event -> 
                    event.getTitle().toLowerCase().contains(keyword.toLowerCase()) ||
                    (event.getDescription() != null && 
                     event.getDescription().toLowerCase().contains(keyword.toLowerCase())) ||
                    (event.getTags() != null && 
                     event.getTags().toLowerCase().contains(keyword.toLowerCase()))
                )
                .collect(Collectors.toList());
    }
    
    /**
     * 获取事件统计信息
     */
    public Map<String, Object> getEventStats(Long userId) {
        List<LifeEvent> userEventList = getUserEvents(userId);
        
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalEvents", userEventList.size());
        
        // 按类型统计
        Map<String, Long> typeStats = userEventList.stream()
                .collect(Collectors.groupingBy(
                    event -> event.getEventType() != null ? event.getEventType() : "未分类",
                    Collectors.counting()
                ));
        stats.put("eventsByType", typeStats);
        
        // 按情绪状态统计
        Map<String, Long> emotionStats = userEventList.stream()
                .filter(event -> event.getEmotionalState() != null)
                .collect(Collectors.groupingBy(
                    LifeEvent::getEmotionalState,
                    Collectors.counting()
                ));
        stats.put("eventsByEmotion", emotionStats);
        
        // 重要性分布
        Map<String, Long> importanceStats = userEventList.stream()
                .filter(event -> event.getImportanceLevel() != null)
                .collect(Collectors.groupingBy(
                    event -> {
                        int level = event.getImportanceLevel();
                        if (level <= 3) return "低";
                        else if (level <= 6) return "中";
                        else return "高";
                    },
                    Collectors.counting()
                ));
        stats.put("eventsByImportance", importanceStats);
        
        // 最近活动
        LocalDate oneMonthAgo = LocalDate.now().minusMonths(1);
        long recentEvents = userEventList.stream()
                .filter(event -> event.getEventDate().isAfter(oneMonthAgo))
                .count();
        stats.put("recentEvents", recentEvents);
        
        // 平均重要性
        double avgImportance = userEventList.stream()
                .filter(event -> event.getImportanceLevel() != null)
                .mapToInt(LifeEvent::getImportanceLevel)
                .average()
                .orElse(0.0);
        stats.put("averageImportance", Math.round(avgImportance * 100.0) / 100.0);
        
        return stats;
    }
    
    /**
     * 获取时间线数据
     */
    public List<Map<String, Object>> getTimeline(Long userId, int limit) {
        return getUserEvents(userId).stream()
                .limit(limit)
                .map(event -> {
                    Map<String, Object> timelineItem = new HashMap<>();
                    timelineItem.put("id", event.getId());
                    timelineItem.put("title", event.getTitle());
                    timelineItem.put("description", event.getDescription());
                    timelineItem.put("eventType", event.getEventType());
                    timelineItem.put("eventDate", event.getEventDate());
                    timelineItem.put("emotionalState", event.getEmotionalState());
                    timelineItem.put("importanceLevel", event.getImportanceLevel());
                    timelineItem.put("location", event.getLocation());
                    timelineItem.put("tags", event.getTags());
                    return timelineItem;
                })
                .collect(Collectors.toList());
    }
    
    /**
     * 获取重要事件（重要性>=7）
     */
    public List<LifeEvent> getImportantEvents(Long userId) {
        return getUserEvents(userId).stream()
                .filter(event -> event.getImportanceLevel() != null && event.getImportanceLevel() >= 7)
                .collect(Collectors.toList());
    }
    
    /**
     * 获取最近事件
     */
    public List<LifeEvent> getRecentEvents(Long userId, int days, int limit) {
        LocalDate cutoffDate = LocalDate.now().minusDays(days);
        return getUserEvents(userId).stream()
                .filter(event -> event.getEventDate().isAfter(cutoffDate))
                .limit(limit)
                .collect(Collectors.toList());
    }
    
    // 私有辅助方法：创建示例事件
    private void createSampleEvents(Long userId) {
        List<Map<String, Object>> sampleEvents = Arrays.asList(
            createSampleEventData("完成了一个重要的项目演示", "经过三个月的努力，终于在公司年度会议上成功展示了我们团队的创新项目，获得了CEO的认可和同事们的掌声。", "work", LocalDate.now().minusDays(5), "excited", 9, "公司总部"),
            createSampleEventData("和老朋友重聚", "大学室友来城市出差，我们在老地方聚餐，回忆起大学时光，感觉时间过得真快。", "relationships", LocalDate.now().minusDays(12), "nostalgic", 7, "老地方餐厅"),
            createSampleEventData("开始学习新技能", "报名了在线编程课程，决定学习人工智能相关技术，为未来的职业发展做准备。", "learning", LocalDate.now().minusDays(20), "motivated", 8, "在线"),
            createSampleEventData("家庭聚餐", "全家人聚在一起庆祝妈妈的生日，做了她最喜欢的菜，看到她开心的笑容，觉得很温暖。", "family", LocalDate.now().minusDays(30), "warm", 8, "家里"),
            createSampleEventData("健身计划开始", "制定了新的健身计划，每周三次健身房，希望能够保持健康的生活方式。", "health", LocalDate.now().minusDays(45), "determined", 6, "健身房")
        );
        
        for (Map<String, Object> eventData : sampleEvents) {
            createEvent(userId, eventData);
        }
    }
    
    private Map<String, Object> createSampleEventData(String title, String description, String type, LocalDate date, String emotion, int importance, String location) {
        Map<String, Object> data = new HashMap<>();
        data.put("title", title);
        data.put("description", description);
        data.put("eventType", type);
        data.put("eventDate", date.toString());
        data.put("emotionalState", emotion);
        data.put("emotionalIntensity", importance);
        data.put("importanceLevel", importance);
        data.put("location", location);
        data.put("isPrivate", false);
        return data;
    }
}

