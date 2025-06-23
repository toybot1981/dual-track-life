# Jmanus架构分析和Life Agent设计方案

## 1. Jmanus架构分析

### 1.1 核心架构组件

基于对Spring AI Alibaba Jmanus源码的分析，其核心架构包含以下组件：

#### 1.1.1 BaseAgent抽象基类
- **职责**: 提供智能体的基础框架和生命周期管理
- **核心功能**:
  - 状态管理 (NOT_STARTED, IN_PROGRESS, COMPLETED)
  - 步骤执行控制 (maxSteps, currentStep)
  - 记忆管理 (通过LlmService)
  - 卡住状态检测和处理
  - 执行记录和监控

#### 1.1.2 ReActAgent模式
- **设计模式**: Reasoning + Acting (思考 + 行动)
- **执行流程**:
  1. `think()` - 分析当前状态，决定是否需要行动
  2. `act()` - 执行具体的行动
  3. 循环执行直到任务完成

#### 1.1.3 工具系统
- **ToolCallback**: Spring AI的工具回调机制
- **内置工具**: TerminateTool, PlanningTool, FormInputTool等
- **动态工具**: 支持MCP (Model Context Protocol)集成

#### 1.1.4 配置管理
- **ManusProperties**: 全局配置管理
- **ConfigService**: 动态配置服务
- **环境数据**: envData和initSettingData分离

### 1.2 关键设计模式

1. **模板方法模式**: BaseAgent定义执行框架，子类实现具体逻辑
2. **策略模式**: 不同类型的Agent实现不同的执行策略
3. **观察者模式**: PlanExecutionRecorder记录执行过程
4. **工厂模式**: 动态Agent创建和管理

## 2. Life Agent设计方案

### 2.1 整体架构设计

```
Life Agent System
├── LifeAgent (主智能体)
│   ├── LifePlanningAgent (人生规划智能体)
│   ├── LifeEvaluationAgent (人生评价智能体)
│   └── LifeConversationAgent (对话智能体)
├── Tools (工具集)
│   ├── LifeDataTool (人生数据工具)
│   ├── GoalAnalysisTool (目标分析工具)
│   ├── PlanGenerationTool (规划生成工具)
│   ├── EvaluationTool (评价工具)
│   └── ConversationTool (对话工具)
├── Services (服务层)
│   ├── LifeDataService (人生数据服务)
│   ├── PlanningService (规划服务)
│   ├── EvaluationService (评价服务)
│   └── ConversationService (对话服务)
└── Models (数据模型)
    ├── UserLifeProfile (用户人生档案)
    ├── LifeGoal (人生目标)
    ├── LifePlan (人生规划)
    └── EvaluationReport (评价报告)
```

### 2.2 核心智能体设计

#### 2.2.1 LifeAgent (主智能体)
```java
@Component
public class LifeAgent extends ReActAgent {
    
    @Override
    public String getName() {
        return "LifeAgent";
    }
    
    @Override
    public String getDescription() {
        return "专门负责人生规划、评价和对话的综合智能体";
    }
    
    @Override
    protected boolean think() {
        // 分析用户请求类型
        // 决定调用哪个子智能体
        return true;
    }
    
    @Override
    protected AgentExecResult act() {
        // 根据请求类型执行相应操作
        // 调用相应的工具和服务
        return new AgentExecResult(result, AgentState.COMPLETED);
    }
}
```

#### 2.2.2 LifePlanningAgent (人生规划智能体)
```java
@Component
public class LifePlanningAgent extends ReActAgent {
    
    @Override
    protected boolean think() {
        // 分析用户的目标和当前状态
        // 判断是否需要生成或优化规划
        return shouldGeneratePlan();
    }
    
    @Override
    protected AgentExecResult act() {
        // 生成人生规划
        // 调用PlanGenerationTool
        return generateLifePlan();
    }
}
```

#### 2.2.3 LifeEvaluationAgent (人生评价智能体)
```java
@Component
public class LifeEvaluationAgent extends ReActAgent {
    
    @Override
    protected boolean think() {
        // 分析需要评价的维度
        // 判断是否有足够的数据进行评价
        return hasEnoughDataForEvaluation();
    }
    
    @Override
    protected AgentExecResult act() {
        // 执行人生评价
        // 调用EvaluationTool
        return evaluateLife();
    }
}
```

#### 2.2.4 LifeConversationAgent (对话智能体)
```java
@Component
public class LifeConversationAgent extends ReActAgent {
    
    @Override
    protected boolean think() {
        // 理解用户的对话意图
        // 判断需要什么类型的回应
        return needsResponse();
    }
    
    @Override
    protected AgentExecResult act() {
        // 生成个性化回应
        // 基于用户的人生数据提供建议
        return generateResponse();
    }
}
```

### 2.3 工具系统设计

#### 2.3.1 LifeDataTool
```java
@Component
public class LifeDataTool implements Function<LifeDataTool.Request, LifeDataTool.Response> {
    
    public record Request(String userId, String dataType, Map<String, Object> filters) {}
    public record Response(boolean success, Object data, String message) {}
    
    @Override
    public Response apply(Request request) {
        // 获取用户的人生数据
        // 支持事件、回忆、目标等数据类型
        return new Response(true, data, "数据获取成功");
    }
}
```

#### 2.3.2 GoalAnalysisTool
```java
@Component
public class GoalAnalysisTool implements Function<GoalAnalysisTool.Request, GoalAnalysisTool.Response> {
    
    public record Request(String userId, List<String> goalIds) {}
    public record Response(boolean success, GoalAnalysisResult analysis, String message) {}
    
    @Override
    public Response apply(Request request) {
        // 分析目标的可行性和优先级
        // 提供目标优化建议
        return new Response(true, analysis, "目标分析完成");
    }
}
```

#### 2.3.3 PlanGenerationTool
```java
@Component
public class PlanGenerationTool implements Function<PlanGenerationTool.Request, PlanGenerationTool.Response> {
    
    public record Request(String userId, List<String> targetGoals, String planType) {}
    public record Response(boolean success, LifePlan plan, String message) {}
    
    @Override
    public Response apply(Request request) {
        // 生成个性化的人生规划
        // 考虑用户的当前状态和目标
        return new Response(true, plan, "规划生成成功");
    }
}
```

### 2.4 服务层设计

#### 2.4.1 LifeDataService
```java
@Service
public class LifeDataService {
    
    public UserLifeProfile getUserLifeProfile(String userId) {
        // 从数据库获取用户完整的人生档案
    }
    
    public List<LifeEvent> getLifeEvents(String userId, Map<String, Object> filters) {
        // 获取用户的人生事件
    }
    
    public List<Memory> getMemories(String userId, Map<String, Object> filters) {
        // 获取用户的回忆数据
    }
}
```

#### 2.4.2 PlanningService
```java
@Service
public class PlanningService {
    
    public LifePlan generateLifePlan(String userId, List<LifeGoal> goals) {
        // 生成人生规划
    }
    
    public LifePlan optimizePlan(String planId, Map<String, Object> constraints) {
        // 优化现有规划
    }
    
    public GoalAnalysisResult analyzeGoals(List<LifeGoal> goals, UserLifeProfile profile) {
        // 分析目标可行性
    }
}
```

#### 2.4.3 EvaluationService
```java
@Service
public class EvaluationService {
    
    public EvaluationReport evaluateLifeStatus(String userId) {
        // 评价用户当前人生状态
    }
    
    public ComparisonReport compareVirtualReal(String userId) {
        // 对比虚拟人生和真实人生
    }
    
    public TrendAnalysisReport analyzeTrends(String userId, int months) {
        // 分析人生发展趋势
    }
}
```

### 2.5 数据模型设计

#### 2.5.1 核心实体
```java
@Entity
@Table(name = "user_life_profile")
public class UserLifeProfile {
    @Id
    private String userId;
    private String name;
    private LocalDate birthDate;
    
    @OneToMany(mappedBy = "userId", cascade = CascadeType.ALL)
    private List<LifeGoal> goals;
    
    @OneToMany(mappedBy = "userId", cascade = CascadeType.ALL)
    private List<LifeEvent> events;
    
    @OneToMany(mappedBy = "userId", cascade = CascadeType.ALL)
    private List<Memory> memories;
    
    @Column(columnDefinition = "JSON")
    private Map<String, Object> personalityTraits;
    
    @Column(columnDefinition = "JSON")
    private Map<String, Object> preferences;
}
```

#### 2.5.2 目标和规划
```java
@Entity
@Table(name = "life_goal")
public class LifeGoal {
    @Id
    private String id;
    private String userId;
    private String title;
    private String description;
    
    @Enumerated(EnumType.STRING)
    private GoalCategory category;
    
    @Enumerated(EnumType.STRING)
    private Priority priority;
    
    private LocalDate targetDate;
    
    @Enumerated(EnumType.STRING)
    private GoalStatus status;
    
    private Double progress; // 0-100%
    
    @Column(columnDefinition = "JSON")
    private List<Milestone> milestones;
}

@Entity
@Table(name = "life_plan")
public class LifePlan {
    @Id
    private String id;
    private String userId;
    private String planName;
    
    @Enumerated(EnumType.STRING)
    private PlanType planType;
    
    @Column(columnDefinition = "JSON")
    private List<PlanStep> steps;
    
    private LocalDateTime createdDate;
    private LocalDateTime lastUpdated;
    
    @Column(columnDefinition = "JSON")
    private List<String> targetGoals; // Goal IDs
    
    private Integer estimatedDuration; // 预计完成时间（天）
}
```

### 2.6 配置和集成

#### 2.6.1 Spring Boot配置
```java
@Configuration
@EnableJpaRepositories
@ComponentScan(basePackages = "com.dualtracklife.lifeagent")
public class LifeAgentConfiguration {
    
    @Bean
    public LifeAgent lifeAgent(LlmService llmService, 
                              PlanExecutionRecorder recorder,
                              ManusProperties properties) {
        Map<String, Object> settings = new HashMap<>();
        settings.put("domain", "life_planning");
        settings.put("capabilities", Arrays.asList("planning", "evaluation", "conversation"));
        
        return new LifeAgent(llmService, recorder, properties, settings);
    }
    
    @Bean
    public List<ToolCallback> lifeAgentTools(LifeDataTool lifeDataTool,
                                           GoalAnalysisTool goalAnalysisTool,
                                           PlanGenerationTool planGenerationTool,
                                           EvaluationTool evaluationTool) {
        return Arrays.asList(
            new ToolCallback("life_data", "获取用户人生数据", lifeDataTool),
            new ToolCallback("goal_analysis", "分析人生目标", goalAnalysisTool),
            new ToolCallback("plan_generation", "生成人生规划", planGenerationTool),
            new ToolCallback("evaluation", "评价人生状态", evaluationTool)
        );
    }
}
```

#### 2.6.2 应用配置
```yaml
# application.yml
spring:
  ai:
    alibaba:
      dashscope:
        api-key: ${AI_DASHSCOPE_API_KEY}
        chat:
          model: qwen-plus
          options:
            temperature: 0.7
            max-tokens: 2000

manus:
  max-steps: 10
  browser-debug: false
  
life-agent:
  planning:
    max-goals-per-plan: 5
    default-plan-duration: 90 # days
  evaluation:
    dimensions:
      - career
      - health
      - relationships
      - finance
      - personal_growth
      - life_balance
  conversation:
    context-window: 10 # 保留最近10轮对话
    personality: empathetic # 共情型对话风格
```

### 2.7 API接口设计

#### 2.7.1 Life Agent控制器
```java
@RestController
@RequestMapping("/api/life-agent")
@CrossOrigin(origins = "*")
public class LifeAgentController {
    
    @PostMapping("/planning/generate")
    public ResponseEntity<PlanningResponse> generatePlan(@RequestBody PlanningRequest request) {
        // 调用LifePlanningAgent生成规划
    }
    
    @PostMapping("/evaluation/analyze")
    public ResponseEntity<EvaluationResponse> evaluateLife(@RequestBody EvaluationRequest request) {
        // 调用LifeEvaluationAgent进行评价
    }
    
    @PostMapping("/conversation/chat")
    public ResponseEntity<ConversationResponse> chat(@RequestBody ConversationRequest request) {
        // 调用LifeConversationAgent进行对话
    }
    
    @GetMapping("/profile/{userId}")
    public ResponseEntity<UserLifeProfile> getUserProfile(@PathVariable String userId) {
        // 获取用户人生档案
    }
}
```

## 3. 实施计划

### 3.1 第一阶段：基础框架搭建
1. 创建Java项目结构
2. 配置Spring Boot和Spring AI依赖
3. 实现基础的数据模型和服务层

### 3.2 第二阶段：核心智能体实现
1. 实现LifeAgent主智能体
2. 实现三个子智能体
3. 实现核心工具集

### 3.3 第三阶段：API和集成
1. 创建REST API接口
2. 与前端Vue应用集成
3. 数据库集成和测试

### 3.4 第四阶段：优化和部署
1. 性能优化和错误处理
2. 单元测试和集成测试
3. 部署和监控

这个设计方案完全基于Jmanus的架构模式，使用Java语言和Spring AI框架，能够无缝集成到现有的dual-track-life项目中。

