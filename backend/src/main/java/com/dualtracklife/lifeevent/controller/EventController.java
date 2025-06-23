package com.dualtracklife.lifeevent.controller;

import com.dualtracklife.lifeevent.model.LifeEvent;
import com.dualtracklife.user.model.User;
import com.dualtracklife.lifeevent.service.EventService;
import com.dualtracklife.user.service.UserService;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.beans.factory.annotation.Autowired;

import java.time.LocalDate;
import java.util.Map;
import java.util.HashMap;
import java.util.List;

/**
 * 事件管理控制器
 * 处理人生事件的CRUD操作和相关查询
 */
@RestController
@RequestMapping("/api/events")
@CrossOrigin(origins = "*")
public class EventController {
    
    @Autowired
    private EventService eventService;
    
    @Autowired
    private UserService userService;
    
    /**
     * 创建新事件
     */
    @PostMapping
    public ResponseEntity<Map<String, Object>> createEvent(
            @RequestHeader("Authorization") String sessionId,
            @RequestBody Map<String, Object> eventData) {
        try {
            User currentUser = userService.validateSession(sessionId);
            if (currentUser == null) {
                return ResponseEntity.status(401).body(createErrorResponse("会话已过期，请重新登录"));
            }
            
            // 基本验证
            if (eventData.get("title") == null || eventData.get("title").toString().trim().isEmpty()) {
                return ResponseEntity.badRequest().body(createErrorResponse("事件标题不能为空"));
            }
            
            LifeEvent event = eventService.createEvent(currentUser.getId(), eventData);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "事件创建成功");
            response.put("event", event);
            
            return ResponseEntity.ok(response);
            
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(createErrorResponse(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(createErrorResponse("创建事件失败"));
        }
    }
    
    /**
     * 获取当前用户的所有事件
     */
    @GetMapping
    public ResponseEntity<Map<String, Object>> getUserEvents(@RequestHeader("Authorization") String sessionId) {
        try {
            User currentUser = userService.validateSession(sessionId);
            if (currentUser == null) {
                return ResponseEntity.status(401).body(createErrorResponse("会话已过期，请重新登录"));
            }
            
            List<LifeEvent> events = eventService.getUserEvents(currentUser.getId());
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("events", events);
            response.put("total", events.size());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(createErrorResponse("获取事件列表失败"));
        }
    }
    
    /**
     * 根据ID获取事件详情
     */
    @GetMapping("/{eventId}")
    public ResponseEntity<Map<String, Object>> getEventById(
            @RequestHeader("Authorization") String sessionId,
            @PathVariable Long eventId) {
        try {
            User currentUser = userService.validateSession(sessionId);
            if (currentUser == null) {
                return ResponseEntity.status(401).body(createErrorResponse("会话已过期，请重新登录"));
            }
            
            LifeEvent event = eventService.getEventById(eventId);
            if (event == null) {
                return ResponseEntity.notFound().build();
            }
            
            // 检查权限
            if (!event.getUserId().equals(currentUser.getId())) {
                return ResponseEntity.status(403).body(createErrorResponse("无权限访问此事件"));
            }
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("event", event);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(createErrorResponse("获取事件详情失败"));
        }
    }
    
    /**
     * 更新事件
     */
    @PutMapping("/{eventId}")
    public ResponseEntity<Map<String, Object>> updateEvent(
            @RequestHeader("Authorization") String sessionId,
            @PathVariable Long eventId,
            @RequestBody Map<String, Object> updates) {
        try {
            User currentUser = userService.validateSession(sessionId);
            if (currentUser == null) {
                return ResponseEntity.status(401).body(createErrorResponse("会话已过期，请重新登录"));
            }
            
            LifeEvent event = eventService.updateEvent(eventId, currentUser.getId(), updates);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "事件更新成功");
            response.put("event", event);
            
            return ResponseEntity.ok(response);
            
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(createErrorResponse(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(createErrorResponse("更新事件失败"));
        }
    }
    
    /**
     * 删除事件
     */
    @DeleteMapping("/{eventId}")
    public ResponseEntity<Map<String, Object>> deleteEvent(
            @RequestHeader("Authorization") String sessionId,
            @PathVariable Long eventId) {
        try {
            User currentUser = userService.validateSession(sessionId);
            if (currentUser == null) {
                return ResponseEntity.status(401).body(createErrorResponse("会话已过期，请重新登录"));
            }
            
            eventService.deleteEvent(eventId, currentUser.getId());
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "事件删除成功");
            
            return ResponseEntity.ok(response);
            
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(createErrorResponse(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(createErrorResponse("删除事件失败"));
        }
    }
    
    /**
     * 按类型获取事件
     */
    @GetMapping("/type/{eventType}")
    public ResponseEntity<Map<String, Object>> getEventsByType(
            @RequestHeader("Authorization") String sessionId,
            @PathVariable String eventType) {
        try {
            User currentUser = userService.validateSession(sessionId);
            if (currentUser == null) {
                return ResponseEntity.status(401).body(createErrorResponse("会话已过期，请重新登录"));
            }
            
            List<LifeEvent> events = eventService.getEventsByType(currentUser.getId(), eventType);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("events", events);
            response.put("eventType", eventType);
            response.put("total", events.size());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(createErrorResponse("获取事件失败"));
        }
    }
    
    /**
     * 按日期范围获取事件
     */
    @GetMapping("/date-range")
    public ResponseEntity<Map<String, Object>> getEventsByDateRange(
            @RequestHeader("Authorization") String sessionId,
            @RequestParam String startDate,
            @RequestParam String endDate) {
        try {
            User currentUser = userService.validateSession(sessionId);
            if (currentUser == null) {
                return ResponseEntity.status(401).body(createErrorResponse("会话已过期，请重新登录"));
            }
            
            LocalDate start = LocalDate.parse(startDate);
            LocalDate end = LocalDate.parse(endDate);
            
            List<LifeEvent> events = eventService.getEventsByDateRange(currentUser.getId(), start, end);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("events", events);
            response.put("startDate", startDate);
            response.put("endDate", endDate);
            response.put("total", events.size());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(createErrorResponse("获取事件失败"));
        }
    }
    
    /**
     * 搜索事件
     */
    @GetMapping("/search")
    public ResponseEntity<Map<String, Object>> searchEvents(
            @RequestHeader("Authorization") String sessionId,
            @RequestParam String keyword) {
        try {
            User currentUser = userService.validateSession(sessionId);
            if (currentUser == null) {
                return ResponseEntity.status(401).body(createErrorResponse("会话已过期，请重新登录"));
            }
            
            if (keyword == null || keyword.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(createErrorResponse("搜索关键词不能为空"));
            }
            
            List<LifeEvent> events = eventService.searchEvents(currentUser.getId(), keyword.trim());
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("events", events);
            response.put("keyword", keyword);
            response.put("total", events.size());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(createErrorResponse("搜索事件失败"));
        }
    }
    
    /**
     * 获取事件统计信息
     */
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getEventStats(@RequestHeader("Authorization") String sessionId) {
        try {
            User currentUser = userService.validateSession(sessionId);
            if (currentUser == null) {
                return ResponseEntity.status(401).body(createErrorResponse("会话已过期，请重新登录"));
            }
            
            Map<String, Object> stats = eventService.getEventStats(currentUser.getId());
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("stats", stats);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(createErrorResponse("获取统计信息失败"));
        }
    }
    
    /**
     * 获取时间线
     */
    @GetMapping("/timeline")
    public ResponseEntity<Map<String, Object>> getTimeline(
            @RequestHeader("Authorization") String sessionId,
            @RequestParam(defaultValue = "20") int limit) {
        try {
            User currentUser = userService.validateSession(sessionId);
            if (currentUser == null) {
                return ResponseEntity.status(401).body(createErrorResponse("会话已过期，请重新登录"));
            }
            
            List<Map<String, Object>> timeline = eventService.getTimeline(currentUser.getId(), limit);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("timeline", timeline);
            response.put("total", timeline.size());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(createErrorResponse("获取时间线失败"));
        }
    }
    
    /**
     * 获取重要事件
     */
    @GetMapping("/important")
    public ResponseEntity<Map<String, Object>> getImportantEvents(@RequestHeader("Authorization") String sessionId) {
        try {
            User currentUser = userService.validateSession(sessionId);
            if (currentUser == null) {
                return ResponseEntity.status(401).body(createErrorResponse("会话已过期，请重新登录"));
            }
            
            List<LifeEvent> events = eventService.getImportantEvents(currentUser.getId());
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("events", events);
            response.put("total", events.size());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(createErrorResponse("获取重要事件失败"));
        }
    }
    
    /**
     * 获取最近事件
     */
    @GetMapping("/recent")
    public ResponseEntity<Map<String, Object>> getRecentEvents(
            @RequestHeader("Authorization") String sessionId,
            @RequestParam(defaultValue = "30") int days,
            @RequestParam(defaultValue = "10") int limit) {
        try {
            User currentUser = userService.validateSession(sessionId);
            if (currentUser == null) {
                return ResponseEntity.status(401).body(createErrorResponse("会话已过期，请重新登录"));
            }
            
            List<LifeEvent> events = eventService.getRecentEvents(currentUser.getId(), days, limit);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("events", events);
            response.put("days", days);
            response.put("total", events.size());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(createErrorResponse("获取最近事件失败"));
        }
    }
    
    // 辅助方法
    private Map<String, Object> createErrorResponse(String message) {
        Map<String, Object> response = new HashMap<>();
        response.put("success", false);
        response.put("error", message);
        return response;
    }
}

