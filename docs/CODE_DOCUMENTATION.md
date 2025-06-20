# 双轨人生代码说明书

## 📋 目录

1. [项目架构概述](#项目架构概述)
2. [前端代码详解](#前端代码详解)
3. [后端代码详解](#后端代码详解)
4. [数据库设计](#数据库设计)
5. [核心功能实现](#核心功能实现)
6. [开发环境配置](#开发环境配置)
7. [部署指南](#部署指南)
8. [常见问题](#常见问题)

---

## 项目架构概述

双轨人生采用现代化的前后端分离架构：

### 整体架构
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   前端 (Vue3)    │    │   后端 (Java)    │    │   数据库 (SQLite) │
│                 │    │                 │    │                 │
│ - Vue 3 + TS    │◄──►│ - Spring Boot   │◄──►│ - 用户数据       │
│ - Pinia Store   │    │ - Spring Security│    │ - 事件记录       │
│ - Vue Router    │    │ - JWT Auth      │    │ - 虚拟人生       │
│ - Tailwind CSS  │    │ - RESTful API   │    │ - 平行宇宙       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### 技术选型理由

**前端选择 Vue 3 + TypeScript：**
- Vue 3 的 Composition API 提供更好的逻辑复用
- TypeScript 提供类型安全，减少运行时错误
- Vite 构建工具提供极快的开发体验

**后端选择 Spring Boot：**
- 成熟的企业级框架，生态丰富
- Spring Security 提供完善的安全机制
- 易于扩展和维护

**数据库选择 SQLite：**
- 轻量级，无需额外安装
- 适合中小型应用
- 易于备份和迁移

---

## 前端代码详解

### 项目结构分析

```
frontend/
├── src/
│   ├── components/          # 可复用组件
│   │   ├── EventModal.vue          # 事件编辑模态框
│   │   ├── SimulationModal.vue     # 虚拟人生模拟模态框
│   │   ├── ParallelUniverseModal.vue # 平行宇宙选择模态框
│   │   ├── ParallelUniverseGrid.vue  # 平行宇宙网格展示
│   │   ├── LifeComparisonView.vue    # 人生对比分析
│   │   └── AILifeCoach.vue          # AI生活教练
│   ├── views/               # 页面视图
│   │   ├── WelcomeView.vue         # 欢迎页面
│   │   ├── LoginView.vue           # 登录页面
│   │   ├── RegisterView.vue        # 注册页面
│   │   ├── DashboardView.vue       # 控制台主页
│   │   ├── TimelineView.vue        # 时间轴视图
│   │   └── LanguageSelect.vue      # 语言选择
│   ├── stores/              # Pinia状态管理
│   │   ├── auth.ts                 # 用户认证状态
│   │   ├── events.ts               # 事件数据管理
│   │   ├── virtualLife.ts          # 虚拟人生状态
│   │   └── parallelUniverse.ts     # 平行宇宙管理
│   ├── router/              # 路由配置
│   │   └── index.ts                # 路由定义
│   ├── services/            # API服务
│   │   └── api.ts                  # HTTP请求封装
│   ├── locales/             # 国际化
│   │   ├── en.ts                   # 英文翻译
│   │   ├── zh.ts                   # 中文翻译
│   │   └── index.ts                # 国际化配置
│   └── assets/              # 静态资源
└── public/                  # 公共文件
```

### 核心组件详解

#### 1. 状态管理 (Pinia Stores)

**认证状态管理 (`stores/auth.ts`)**
```typescript
export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(localStorage.getItem('token'))
  const isAuthenticated = computed(() => !!token.value)

  const login = async (credentials: LoginCredentials) => {
    // 登录逻辑
    const response = await api.post('/auth/login', credentials)
    token.value = response.data.access_token
    localStorage.setItem('token', token.value)
    await fetchUser()
  }

  const logout = () => {
    user.value = null
    token.value = null
    localStorage.removeItem('token')
    router.push('/login')
  }

  return { user, token, isAuthenticated, login, logout }
})
```

**事件管理状态 (`stores/events.ts`)**
```typescript
export const useEventStore = defineStore('events', () => {
  const events = ref<Event[]>([])
  const loading = ref(false)

  const fetchEvents = async () => {
    loading.value = true
    try {
      const response = await api.get('/events')
      events.value = response.data
    } finally {
      loading.value = false
    }
  }

  const addEvent = async (eventData: EventCreate) => {
    const response = await api.post('/events', eventData)
    events.value.unshift(response.data)
    return response.data
  }

  return { events, loading, fetchEvents, addEvent }
})
```

#### 2. 路由配置 (`router/index.ts`)

```typescript
const routes = [
  {
    path: '/',
    name: 'welcome',
    component: WelcomeView
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: DashboardView,
    meta: { requiresAuth: true }
  },
  {
    path: '/timeline',
    name: 'timeline',
    component: TimelineView,
    meta: { requiresAuth: true }
  }
]

// 路由守卫
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  } else {
    next()
  }
})
```

#### 3. API服务封装 (`services/api.ts`)

```typescript
import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
  timeout: 10000
})

// 请求拦截器 - 添加认证头
api.interceptors.request.use((config) => {
  const authStore = useAuthStore()
  if (authStore.token) {
    config.headers.Authorization = `Bearer ${authStore.token}`
  }
  return config
})

// 响应拦截器 - 处理错误
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const authStore = useAuthStore()
      authStore.logout()
    }
    return Promise.reject(error)
  }
)

export default api
```

### 关键功能组件

#### 1. 平行宇宙模态框 (`ParallelUniverseModal.vue`)

这是平行宇宙功能的核心组件，负责：
- 显示触发事件信息
- 提供用户自定义和AI规划两种模式选择
- 主题选择和宇宙创建

```vue
<template>
  <Transition name="modal">
    <div v-if="isVisible" class="modal-overlay">
      <div class="modal-container">
        <!-- 模态框内容 -->
        <div class="modal-header">
          <h2>{{ $t('parallelUniverse.modal.title') }}</h2>
          <button @click="$emit('close')" class="close-btn">×</button>
        </div>
        
        <div class="modal-body">
          <!-- 触发事件信息 -->
          <div v-if="realLifeEvent" class="trigger-event">
            <h3>{{ $t('parallelUniverse.modal.triggerEvent') }}</h3>
            <p>{{ realLifeEvent.title }}</p>
          </div>
          
          <!-- 模式选择 -->
          <div class="mode-selection">
            <div class="mode-card" @click="selectMode('user-defined')">
              <h4>{{ $t('parallelUniverse.modal.userDefinedTitle') }}</h4>
              <p>{{ $t('parallelUniverse.modal.userDefinedDescription') }}</p>
            </div>
            
            <div class="mode-card" @click="selectMode('ai-planned')">
              <h4>{{ $t('parallelUniverse.modal.aiPlannedTitle') }}</h4>
              <p>{{ $t('parallelUniverse.modal.aiPlannedDescription') }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
const emit = defineEmits(['close', 'universe-started'])

const selectMode = (mode: string) => {
  // 创建平行宇宙逻辑
  const universe = parallelUniverseStore.createParallelUniverse({
    mode,
    triggerEvent: realLifeEvent.value,
    theme: selectedTheme.value
  })
  
  emit('universe-started', universe)
}
</script>
```

#### 2. 人生对比分析 (`LifeComparisonView.vue`)

这个组件实现了真实人生与平行宇宙的对比分析：

```vue
<template>
  <div class="comparison-view">
    <!-- 统计对比图表 -->
    <div class="stats-comparison">
      <div v-for="metric in comparisonMetrics" :key="metric.key" class="metric-card">
        <h4>{{ metric.name }}</h4>
        <div class="comparison-bar">
          <div class="real-bar" :style="{ width: `${metric.realPercentage}%` }"></div>
          <div class="virtual-bar" :style="{ width: `${metric.virtualPercentage}%` }"></div>
        </div>
        <div class="metric-values">
          <span class="real-value">{{ metric.realValue }}</span>
          <span class="virtual-value">{{ metric.virtualValue }}</span>
        </div>
      </div>
    </div>
    
    <!-- 洞察和建议 -->
    <div class="insights-section">
      <h3>{{ $t('comparison.insights') }}</h3>
      <div class="insights-grid">
        <div class="key-differences">
          <h4>{{ $t('comparison.keyDifferences') }}</h4>
          <ul>
            <li v-for="diff in keyDifferences" :key="diff.id">
              {{ diff.text }}
            </li>
          </ul>
        </div>
        
        <div class="recommendations">
          <h4>{{ $t('comparison.recommendations') }}</h4>
          <ul>
            <li v-for="rec in recommendations" :key="rec.id">
              {{ rec.text }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const comparisonMetrics = computed(() => {
  if (!selectedUniverse.value) return []
  
  return [
    {
      key: 'happiness',
      name: t('virtualLife.stats.happiness'),
      realValue: calculateRealLifeHappiness(),
      virtualValue: selectedUniverse.value.stats.happiness,
      difference: selectedUniverse.value.stats.happiness - calculateRealLifeHappiness()
    },
    // 更多指标...
  ]
})

const keyDifferences = computed(() => {
  // 分析关键差异
  const differences = []
  comparisonMetrics.value.forEach(metric => {
    if (Math.abs(metric.difference) > 10) {
      differences.push({
        id: metric.key,
        text: metric.difference > 0 
          ? t('comparison.virtualHigherIn', { metric: metric.name, diff: Math.abs(metric.difference) })
          : t('comparison.realHigherIn', { metric: metric.name, diff: Math.abs(metric.difference) })
      })
    }
  })
  return differences
})
</script>
```

### 国际化实现

项目使用 Vue I18n 实现多语言支持：

**配置文件 (`locales/index.ts`)**
```typescript
import { createI18n } from 'vue-i18n'
import en from './en'
import zh from './zh'

const messages = { en, zh }

const i18n = createI18n({
  legacy: false,
  locale: localStorage.getItem('language') || 'zh',
  fallbackLocale: 'en',
  messages
})

export default i18n
```

**使用示例**
```vue
<template>
  <h1>{{ $t('welcome.title') }}</h1>
  <p>{{ $t('welcome.description') }}</p>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t, locale } = useI18n()

const switchLanguage = (lang: string) => {
  locale.value = lang
  localStorage.setItem('language', lang)
}
</script>
```

---

## 后端代码详解

### Java Spring Boot 后端

#### 项目结构
```
backend-java/
├── src/main/java/com/dualtracklife/
│   ├── DualTrackLifeApplication.java    # 主启动类
│   ├── config/                          # 配置类
│   │   ├── SecurityConfig.java          # 安全配置
│   │   └── JpaConfig.java              # JPA配置
│   ├── controller/                      # 控制器
│   │   ├── AuthController.java          # 认证控制器
│   │   └── EventController.java         # 事件控制器
│   ├── service/                         # 服务层
│   │   ├── UserService.java             # 用户服务
│   │   └── EventService.java            # 事件服务
│   ├── repository/                      # 数据访问层
│   │   ├── UserRepository.java          # 用户仓库
│   │   └── EventRepository.java         # 事件仓库
│   ├── model/                           # 实体模型
│   │   ├── User.java                    # 用户实体
│   │   └── Event.java                   # 事件实体
│   ├── dto/                             # 数据传输对象
│   │   ├── LoginRequest.java            # 登录请求
│   │   ├── RegisterRequest.java         # 注册请求
│   │   └── EventRequest.java            # 事件请求
│   └── security/                        # 安全相关
│       ├── JwtTokenProvider.java        # JWT令牌提供者
│       └── JwtAuthenticationFilter.java # JWT认证过滤器
└── src/main/resources/
    ├── application.yml                  # 应用配置
    └── data.sql                        # 初始数据
```

#### 核心类详解

**1. 主启动类 (`DualTrackLifeApplication.java`)**
```java
@SpringBootApplication
@EnableJpaRepositories
@EnableWebSecurity
public class DualTrackLifeApplication {
    public static void main(String[] args) {
        SpringApplication.run(DualTrackLifeApplication.class, args);
    }
}
```

**2. 安全配置 (`SecurityConfig.java`)**
```java
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    @Autowired
    private JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.csrf(csrf -> csrf.disable())
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(authz -> authz
                .requestMatchers("/auth/**").permitAll()
                .requestMatchers("/public/**").permitAll()
                .anyRequest().authenticated()
            )
            .exceptionHandling(ex -> ex.authenticationEntryPoint(jwtAuthenticationEntryPoint))
            .addFilterBefore(new JwtAuthenticationFilter(jwtTokenProvider), 
                           UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
```

**3. JWT令牌提供者 (`JwtTokenProvider.java`)**
```java
@Component
public class JwtTokenProvider {

    private static final String JWT_SECRET = "mySecretKey";
    private static final int JWT_EXPIRATION = 86400000; // 24小时

    public String generateToken(UserPrincipal userPrincipal) {
        Date expiryDate = new Date(System.currentTimeMillis() + JWT_EXPIRATION);

        return Jwts.builder()
                .setSubject(Long.toString(userPrincipal.getId()))
                .setIssuedAt(new Date())
                .setExpiration(expiryDate)
                .signWith(SignatureAlgorithm.HS512, JWT_SECRET)
                .compact();
    }

    public Long getUserIdFromToken(String token) {
        Claims claims = Jwts.parser()
                .setSigningKey(JWT_SECRET)
                .parseClaimsJws(token)
                .getBody();

        return Long.parseLong(claims.getSubject());
    }

    public boolean validateToken(String authToken) {
        try {
            Jwts.parser().setSigningKey(JWT_SECRET).parseClaimsJws(authToken);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }
}
```

**4. 认证控制器 (`AuthController.java`)**
```java
@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtTokenProvider tokenProvider;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody RegisterRequest registerRequest) {
        if (userService.existsByUsername(registerRequest.getUsername())) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, "Username is already taken!"));
        }

        if (userService.existsByEmail(registerRequest.getEmail())) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, "Email Address already in use!"));
        }

        // 创建用户账户
        User user = new User(registerRequest.getUsername(),
                           registerRequest.getEmail(),
                           passwordEncoder.encode(registerRequest.getPassword()));

        user.setFullName(registerRequest.getFullName());

        User result = userService.save(user);

        // 生成JWT令牌
        UserPrincipal userPrincipal = UserPrincipal.create(result);
        String jwt = tokenProvider.generateToken(userPrincipal);

        return ResponseEntity.ok(new JwtAuthenticationResponse(jwt));
    }

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getUsername(),
                        loginRequest.getPassword()
                )
        );

        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        String jwt = tokenProvider.generateToken(userPrincipal);

        return ResponseEntity.ok(new JwtAuthenticationResponse(jwt));
    }
}
```

**5. 事件服务 (`EventService.java`)**
```java
@Service
@Transactional
public class EventService {

    @Autowired
    private EventRepository eventRepository;

    public List<Event> getAllEventsByUser(Long userId) {
        return eventRepository.findByUserIdOrderByEventDateDesc(userId);
    }

    public Event createEvent(EventRequest eventRequest, Long userId) {
        Event event = new Event();
        event.setTitle(eventRequest.getTitle());
        event.setDescription(eventRequest.getDescription());
        event.setCategory(eventRequest.getCategory());
        event.setEventDate(eventRequest.getEventDate());
        event.setEmotion(eventRequest.getEmotion());
        event.setImportance(eventRequest.getImportance());
        event.setLocation(eventRequest.getLocation());
        event.setUserId(userId);

        return eventRepository.save(event);
    }

    public Event updateEvent(Long eventId, EventRequest eventRequest, Long userId) {
        Event event = eventRepository.findByIdAndUserId(eventId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Event", "id", eventId));

        event.setTitle(eventRequest.getTitle());
        event.setDescription(eventRequest.getDescription());
        event.setCategory(eventRequest.getCategory());
        event.setEventDate(eventRequest.getEventDate());
        event.setEmotion(eventRequest.getEmotion());
        event.setImportance(eventRequest.getImportance());
        event.setLocation(eventRequest.getLocation());

        return eventRepository.save(event);
    }

    public void deleteEvent(Long eventId, Long userId) {
        Event event = eventRepository.findByIdAndUserId(eventId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Event", "id", eventId));

        eventRepository.delete(event);
    }
}
```

### Python FastAPI 后端 (可选)

**主应用文件 (`main.py`)**
```python
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
import sqlite3
import hashlib
import jwt
import datetime

app = FastAPI(title="Dual Track Life API", version="1.0.0")

# CORS配置
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# JWT配置
SECRET_KEY = "your-secret-key-here"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

security = HTTPBearer()

# 数据库初始化
def init_database():
    conn = sqlite3.connect("dual_track_life.db")
    cursor = conn.cursor()
    
    # 创建用户表
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            full_name TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # 创建事件表
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS events (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT,
            category TEXT NOT NULL,
            event_date TEXT NOT NULL,
            emotion TEXT,
            importance INTEGER,
            location TEXT,
            user_id INTEGER NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    ''')
    
    conn.commit()
    conn.close()

# API路由
@app.on_event("startup")
async def startup_event():
    init_database()

@app.post("/auth/register")
async def register(user: UserCreate):
    conn = sqlite3.connect("dual_track_life.db")
    cursor = conn.cursor()
    
    try:
        # 检查用户名和邮箱是否已存在
        cursor.execute("SELECT id FROM users WHERE username = ? OR email = ?", 
                      (user.username, user.email))
        if cursor.fetchone():
            raise HTTPException(status_code=400, detail="Username or email already registered")
        
        # 创建新用户
        password_hash = hashlib.sha256(user.password.encode()).hexdigest()
        cursor.execute(
            "INSERT INTO users (username, email, password_hash, full_name) VALUES (?, ?, ?, ?)",
            (user.username, user.email, password_hash, user.full_name)
        )
        user_id = cursor.lastrowid
        conn.commit()
        
        # 创建访问令牌
        access_token = create_access_token(data={"sub": user_id})
        return {"access_token": access_token, "token_type": "bearer"}
        
    finally:
        conn.close()

@app.get("/events")
async def get_events(current_user_id: int = Depends(get_current_user)):
    conn = sqlite3.connect("dual_track_life.db")
    cursor = conn.cursor()
    
    try:
        cursor.execute(
            "SELECT * FROM events WHERE user_id = ? ORDER BY event_date DESC",
            (current_user_id,)
        )
        results = cursor.fetchall()
        
        events = []
        for row in results:
            events.append({
                "id": row[0],
                "title": row[1],
                "description": row[2],
                "category": row[3],
                "event_date": row[4],
                "emotion": row[5],
                "importance": row[6],
                "location": row[7],
                "user_id": row[8],
                "created_at": row[9],
                "updated_at": row[10]
            })
        
        return events
        
    finally:
        conn.close()
```

---

## 数据库设计

### 数据库表结构

#### 1. 用户表 (users)
```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,           -- 用户名
    email TEXT UNIQUE NOT NULL,              -- 邮箱
    password_hash TEXT NOT NULL,             -- 密码哈希
    full_name TEXT,                          -- 全名
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP  -- 创建时间
);
```

#### 2. 事件表 (events)
```sql
CREATE TABLE events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,                     -- 事件标题
    description TEXT,                        -- 事件描述
    category TEXT NOT NULL,                  -- 事件分类
    event_date TEXT NOT NULL,                -- 事件日期
    emotion TEXT,                            -- 情感标记
    importance INTEGER,                      -- 重要性 (1-10)
    location TEXT,                           -- 地点
    user_id INTEGER NOT NULL,                -- 用户ID
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- 创建时间
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- 更新时间
    FOREIGN KEY (user_id) REFERENCES users (id)
);
```

#### 3. 虚拟人生统计表 (virtual_life_stats)
```sql
CREATE TABLE virtual_life_stats (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,                -- 用户ID
    happiness INTEGER DEFAULT 50,            -- 幸福感 (0-100)
    success INTEGER DEFAULT 50,              -- 成功度 (0-100)
    growth INTEGER DEFAULT 50,               -- 成长值 (0-100)
    experience INTEGER DEFAULT 0,            -- 经验值
    level INTEGER DEFAULT 1,                 -- 等级
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- 更新时间
    FOREIGN KEY (user_id) REFERENCES users (id)
);
```

#### 4. 平行宇宙表 (parallel_universes)
```sql
CREATE TABLE parallel_universes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,                -- 用户ID
    title TEXT NOT NULL,                     -- 宇宙标题
    description TEXT,                        -- 宇宙描述
    theme TEXT,                              -- 主题
    mode TEXT,                               -- 模式 (user-defined/ai-planned)
    trigger_event_id INTEGER,                -- 触发事件ID
    status TEXT DEFAULT 'active',            -- 状态 (active/completed/paused)
    stats TEXT,                              -- 统计数据 (JSON)
    timeline TEXT,                           -- 时间线数据 (JSON)
    insights TEXT,                           -- 洞察数据 (JSON)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- 创建时间
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- 更新时间
    FOREIGN KEY (user_id) REFERENCES users (id),
    FOREIGN KEY (trigger_event_id) REFERENCES events (id)
);
```

### 数据库关系图

```
┌─────────────┐    1:N    ┌─────────────┐
│    users    │◄─────────►│   events    │
│             │           │             │
│ - id        │           │ - id        │
│ - username  │           │ - title     │
│ - email     │           │ - category  │
│ - password  │           │ - user_id   │
└─────────────┘           └─────────────┘
       │                         │
       │ 1:1                     │ 1:N
       ▼                         ▼
┌─────────────┐           ┌─────────────┐
│virtual_life │           │ parallel_   │
│   _stats    │           │ universes   │
│             │           │             │
│ - user_id   │           │ - trigger_  │
│ - happiness │           │   event_id  │
│ - success   │           │ - user_id   │
└─────────────┘           └─────────────┘
```

### 数据库索引优化

```sql
-- 用户表索引
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);

-- 事件表索引
CREATE INDEX idx_events_user_id ON events(user_id);
CREATE INDEX idx_events_date ON events(event_date);
CREATE INDEX idx_events_category ON events(category);
CREATE INDEX idx_events_importance ON events(importance);

-- 平行宇宙表索引
CREATE INDEX idx_parallel_universes_user_id ON parallel_universes(user_id);
CREATE INDEX idx_parallel_universes_trigger_event ON parallel_universes(trigger_event_id);
CREATE INDEX idx_parallel_universes_status ON parallel_universes(status);
```

---

## 核心功能实现

### 1. 用户认证系统

#### JWT认证流程
```
1. 用户登录 → 2. 验证凭据 → 3. 生成JWT → 4. 返回令牌
                     ↓
5. 客户端存储 → 6. 请求携带令牌 → 7. 服务器验证 → 8. 返回数据
```

#### 前端认证实现
```typescript
// 登录函数
const login = async (credentials: LoginCredentials) => {
  try {
    const response = await api.post('/auth/login', credentials)
    const { access_token } = response.data
    
    // 存储令牌
    token.value = access_token
    localStorage.setItem('token', access_token)
    
    // 获取用户信息
    await fetchUser()
    
    // 跳转到控制台
    router.push('/dashboard')
  } catch (error) {
    throw new Error('登录失败')
  }
}

// 自动登录检查
const checkAuth = async () => {
  const savedToken = localStorage.getItem('token')
  if (savedToken) {
    token.value = savedToken
    try {
      await fetchUser()
    } catch (error) {
      logout()
    }
  }
}
```

#### 后端认证实现
```java
@PostMapping("/login")
public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
    // 验证用户凭据
    Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                    loginRequest.getUsername(),
                    loginRequest.getPassword()
            )
    );

    // 生成JWT令牌
    UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
    String jwt = tokenProvider.generateToken(userPrincipal);

    return ResponseEntity.ok(new JwtAuthenticationResponse(jwt));
}
```

### 2. 事件管理系统

#### 事件CRUD操作

**创建事件**
```typescript
const addEvent = async (eventData: EventCreate) => {
  try {
    const response = await api.post('/events', eventData)
    events.value.unshift(response.data)
    return response.data
  } catch (error) {
    throw new Error('创建事件失败')
  }
}
```

**事件列表展示**
```vue
<template>
  <div class="events-timeline">
    <div v-for="event in filteredEvents" :key="event.id" class="event-card">
      <div class="event-header">
        <h3>{{ event.title }}</h3>
        <span class="event-date">{{ formatDate(event.eventDate) }}</span>
      </div>
      <p class="event-description">{{ event.description }}</p>
      <div class="event-meta">
        <span class="category">{{ event.category }}</span>
        <span class="importance">重要性: {{ event.importance }}/10</span>
        <span v-if="event.emotion" class="emotion">{{ getEmotionEmoji(event.emotion) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const filteredEvents = computed(() => {
  let filtered = events.value
  
  // 按搜索关键词过滤
  if (searchQuery.value) {
    filtered = filtered.filter(event => 
      event.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      event.description?.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }
  
  // 按分类过滤
  if (selectedCategory.value) {
    filtered = filtered.filter(event => event.category === selectedCategory.value)
  }
  
  return filtered.sort((a, b) => new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime())
})
</script>
```

### 3. 平行宇宙系统

#### 平行宇宙创建流程
```
1. 用户点击高重要性事件 → 2. 显示平行宇宙模态框 → 3. 选择模式和主题
                                      ↓
4. 创建平行宇宙记录 → 5. 初始化统计数据 → 6. 生成初始时间线
```

#### 平行宇宙状态管理
```typescript
export const useParallelUniverseStore = defineStore('parallelUniverse', () => {
  const parallelUniverseHistory = ref<ParallelUniverse[]>([])
  const currentParallelUniverse = ref<ParallelUniverse | null>(null)

  const createParallelUniverse = (config: UniverseConfig) => {
    const universe: ParallelUniverse = {
      id: generateId(),
      title: generateTitle(config),
      description: config.description,
      theme: config.theme,
      mode: config.mode,
      triggeredByEvent: config.triggerEvent,
      status: 'active',
      stats: initializeStats(),
      timeline: [],
      insights: [],
      createdAt: new Date()
    }

    parallelUniverseHistory.value.push(universe)
    currentParallelUniverse.value = universe

    return universe
  }

  const generateAIPlannedPath = (universe: ParallelUniverse) => {
    // AI规划逻辑
    const aiEvents = [
      {
        title: '选择不同的职业道路',
        description: '基于触发事件，探索另一种职业可能性',
        impact: { happiness: +10, success: +5, growth: +15 }
      },
      // 更多AI生成的事件...
    ]

    universe.timeline = aiEvents
    updateUniverseStats(universe, aiEvents)
  }

  return {
    parallelUniverseHistory,
    currentParallelUniverse,
    createParallelUniverse,
    generateAIPlannedPath
  }
})
```

### 4. 双轨对比分析

#### 对比算法实现
```typescript
const calculateComparisonMetrics = () => {
  const realLifeStats = calculateRealLifeStats()
  const virtualStats = selectedUniverse.value?.stats

  return [
    {
      key: 'happiness',
      name: '幸福感',
      realValue: realLifeStats.happiness,
      virtualValue: virtualStats.happiness,
      difference: virtualStats.happiness - realLifeStats.happiness
    },
    {
      key: 'success',
      name: '成功度',
      realValue: realLifeStats.success,
      virtualValue: virtualStats.success,
      difference: virtualStats.success - realLifeStats.success
    }
    // 更多指标...
  ]
}

const calculateRealLifeStats = () => {
  const events = eventStore.events
  
  // 基于事件计算真实人生统计
  const happiness = calculateHappinessFromEvents(events)
  const success = calculateSuccessFromEvents(events)
  const growth = calculateGrowthFromEvents(events)
  
  return { happiness, success, growth }
}

const calculateHappinessFromEvents = (events: Event[]) => {
  const positiveEmotions = ['happy', 'excited', 'grateful', 'proud']
  const positiveCount = events.filter(e => 
    positiveEmotions.includes(e.emotion || '')
  ).length
  
  return Math.min(Math.round((positiveCount / Math.max(events.length, 1)) * 100), 100)
}
```

#### 洞察生成算法
```typescript
const generateInsights = (metrics: ComparisonMetric[]) => {
  const insights = []
  
  metrics.forEach(metric => {
    if (Math.abs(metric.difference) > 15) {
      if (metric.difference > 0) {
        insights.push({
          type: 'opportunity',
          text: `虚拟人生在${metric.name}方面表现更好，可以考虑将相关经验应用到真实生活中`,
          actionable: true,
          metric: metric.key
        })
      } else {
        insights.push({
          type: 'strength',
          text: `真实人生在${metric.name}方面已经很出色，继续保持这种优势`,
          actionable: false,
          metric: metric.key
        })
      }
    }
  })
  
  return insights
}
```

### 5. AI生活教练

#### 生活平衡分析
```typescript
const analyzeLifeBalance = (events: Event[]) => {
  const categories = ['Work', 'Health', 'Relationships', 'Personal', 'Entertainment']
  const categoryStats = {}
  
  categories.forEach(category => {
    const categoryEvents = events.filter(e => e.category === category)
    const totalImportance = categoryEvents.reduce((sum, e) => sum + (e.importance || 0), 0)
    const avgImportance = categoryEvents.length > 0 ? totalImportance / categoryEvents.length : 0
    
    categoryStats[category] = {
      count: categoryEvents.length,
      avgImportance,
      percentage: (categoryEvents.length / events.length) * 100
    }
  })
  
  return categoryStats
}

const generateBalanceRecommendations = (balanceStats: any) => {
  const recommendations = []
  
  Object.entries(balanceStats).forEach(([category, stats]: [string, any]) => {
    if (stats.percentage < 10) {
      recommendations.push({
        type: 'increase',
        category,
        text: `建议增加${category}相关的活动，目前占比较低`
      })
    } else if (stats.percentage > 40) {
      recommendations.push({
        type: 'balance',
        category,
        text: `${category}占比较高，可以考虑平衡其他方面的发展`
      })
    }
  })
  
  return recommendations
}
```

---

## 开发环境配置

### 前端开发环境

#### 1. 环境要求
- Node.js 18.0.0 或更高版本
- npm 8.0.0 或更高版本
- 现代浏览器 (Chrome 90+, Firefox 88+, Safari 14+)

#### 2. 安装依赖
```bash
cd frontend
npm install
```

#### 3. 环境变量配置
创建 `.env.local` 文件：
```env
# API基础URL
VITE_API_BASE_URL=http://localhost:8080

# 应用标题
VITE_APP_TITLE=双轨人生

# 调试模式
VITE_DEBUG=true
```

#### 4. 开发服务器启动
```bash
# 启动开发服务器
npm run dev

# 类型检查
npm run type-check

# 代码格式化
npm run format

# 构建生产版本
npm run build
```

#### 5. VSCode配置
创建 `.vscode/settings.json`：
```json
{
  "typescript.preferences.importModuleSpecifier": "relative",
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "files.associations": {
    "*.vue": "vue"
  }
}
```

推荐的VSCode扩展：
- Vue Language Features (Volar)
- TypeScript Vue Plugin (Volar)
- ESLint
- Prettier
- Tailwind CSS IntelliSense

### Java后端开发环境

#### 1. 环境要求
- Java 17 或更高版本
- Maven 3.6.0 或更高版本
- IDE: IntelliJ IDEA 或 Eclipse

#### 2. 项目导入
```bash
# 克隆项目
git clone <repository-url>
cd backend-java

# 安装依赖
mvn clean install

# 运行应用
mvn spring-boot:run
```

#### 3. 应用配置
`application.yml` 配置：
```yaml
server:
  port: 8080

spring:
  datasource:
    url: jdbc:sqlite:dual_track_life.db
    driver-class-name: org.sqlite.JDBC
  
  jpa:
    hibernate:
      ddl-auto: update
    show-sql: true
    properties:
      hibernate:
        dialect: org.hibernate.dialect.SQLiteDialect

jwt:
  secret: mySecretKey
  expiration: 86400000

logging:
  level:
    com.dualtracklife: DEBUG
```

#### 4. 数据库配置
SQLite数据库会自动创建，也可以配置MySQL：
```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/dual_track_life
    username: your_username
    password: your_password
    driver-class-name: com.mysql.cj.jdbc.Driver
  
  jpa:
    hibernate:
      ddl-auto: update
    properties:
      hibernate:
        dialect: org.hibernate.dialect.MySQL8Dialect
```

### Python后端开发环境 (可选)

#### 1. 环境要求
- Python 3.8 或更高版本
- pip 包管理器

#### 2. 虚拟环境设置
```bash
cd backend-python

# 创建虚拟环境
python -m venv venv

# 激活虚拟环境
# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate

# 安装依赖
pip install -r requirements.txt
```

#### 3. 运行应用
```bash
# 开发模式运行
python main.py

# 或使用uvicorn
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### 数据库开发环境

#### 1. SQLite (默认)
SQLite数据库文件会自动创建在项目根目录，无需额外配置。

#### 2. 数据库管理工具
推荐使用以下工具管理数据库：
- **SQLite Browser** - 轻量级SQLite管理工具
- **DBeaver** - 通用数据库管理工具
- **DataGrip** - JetBrains的数据库IDE

#### 3. 数据库初始化
```bash
# 使用SQL脚本初始化
sqlite3 dual_track_life.db < database/init.sql

# 或在应用启动时自动初始化
```

---

## 部署指南

### 前端部署

#### 1. 构建生产版本
```bash
cd frontend
npm run build
```

#### 2. 静态文件部署
构建后的文件在 `dist/` 目录，可以部署到：

**Nginx配置示例：**
```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

**Apache配置示例：**
```apache
<VirtualHost *:80>
    ServerName your-domain.com
    DocumentRoot /path/to/dist
    
    <Directory /path/to/dist>
        Options Indexes FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>
    
    # API代理
    ProxyPass /api http://localhost:8080/
    ProxyPassReverse /api http://localhost:8080/
</VirtualHost>
```

#### 3. CDN部署
可以将静态资源部署到CDN：
- 阿里云OSS
- 腾讯云COS
- AWS S3
- Vercel
- Netlify

### Java后端部署

#### 1. 打包应用
```bash
cd backend-java
mvn clean package -DskipTests
```

#### 2. 运行JAR文件
```bash
java -jar target/dual-track-life-backend-1.0.0.jar
```

#### 3. 系统服务配置
创建systemd服务文件 `/etc/systemd/system/dual-track-life.service`：
```ini
[Unit]
Description=Dual Track Life Backend
After=network.target

[Service]
Type=simple
User=ubuntu
WorkingDirectory=/opt/dual-track-life
ExecStart=/usr/bin/java -jar dual-track-life-backend.jar
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

启动服务：
```bash
sudo systemctl enable dual-track-life
sudo systemctl start dual-track-life
sudo systemctl status dual-track-life
```

#### 4. Docker部署
创建 `Dockerfile`：
```dockerfile
FROM openjdk:17-jre-slim

WORKDIR /app
COPY target/dual-track-life-backend.jar app.jar

EXPOSE 8080

CMD ["java", "-jar", "app.jar"]
```

构建和运行：
```bash
docker build -t dual-track-life-backend .
docker run -d -p 8080:8080 --name dual-track-life dual-track-life-backend
```

### 数据库部署

#### 1. SQLite部署
SQLite数据库文件可以直接复制到生产环境，确保应用有读写权限。

#### 2. MySQL部署
```sql
-- 创建数据库
CREATE DATABASE dual_track_life CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 创建用户
CREATE USER 'dual_track_user'@'%' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON dual_track_life.* TO 'dual_track_user'@'%';
FLUSH PRIVILEGES;

-- 导入数据
mysql -u dual_track_user -p dual_track_life < database/init.sql
```

#### 3. 数据库备份
```bash
# SQLite备份
cp dual_track_life.db dual_track_life_backup_$(date +%Y%m%d).db

# MySQL备份
mysqldump -u dual_track_user -p dual_track_life > backup_$(date +%Y%m%d).sql
```

### 环境变量配置

#### 生产环境变量
```bash
# 数据库配置
DATABASE_URL=jdbc:mysql://localhost:3306/dual_track_life
DATABASE_USERNAME=dual_track_user
DATABASE_PASSWORD=your_password

# JWT配置
JWT_SECRET=your_production_jwt_secret
JWT_EXPIRATION=86400000

# 应用配置
SERVER_PORT=8080
CORS_ALLOWED_ORIGINS=https://your-domain.com

# 日志配置
LOGGING_LEVEL=INFO
```

### 监控和日志

#### 1. 应用监控
使用Spring Boot Actuator：
```yaml
management:
  endpoints:
    web:
      exposure:
        include: health,info,metrics
  endpoint:
    health:
      show-details: always
```

#### 2. 日志配置
`logback-spring.xml`：
```xml
<configuration>
    <appender name="STDOUT" class="ch.qos.logback.core.ConsoleAppender">
        <encoder>
            <pattern>%d{HH:mm:ss.SSS} [%thread] %-5level %logger{36} - %msg%n</pattern>
        </encoder>
    </appender>
    
    <appender name="FILE" class="ch.qos.logback.core.rolling.RollingFileAppender">
        <file>logs/dual-track-life.log</file>
        <rollingPolicy class="ch.qos.logback.core.rolling.TimeBasedRollingPolicy">
            <fileNamePattern>logs/dual-track-life.%d{yyyy-MM-dd}.log</fileNamePattern>
            <maxHistory>30</maxHistory>
        </rollingPolicy>
        <encoder>
            <pattern>%d{yyyy-MM-dd HH:mm:ss} [%thread] %-5level %logger{36} - %msg%n</pattern>
        </encoder>
    </appender>
    
    <root level="INFO">
        <appender-ref ref="STDOUT" />
        <appender-ref ref="FILE" />
    </root>
</configuration>
```

---

## 常见问题

### 开发环境问题

#### Q1: 前端启动时出现端口占用错误
**A:** 
```bash
# 查找占用端口的进程
lsof -i :5173
# 或
netstat -tulpn | grep 5173

# 杀死进程
kill -9 <PID>

# 或使用不同端口启动
npm run dev -- --port 5174
```

#### Q2: TypeScript类型检查错误
**A:** 
```bash
# 清除类型缓存
rm -rf node_modules/.vite
rm -rf node_modules/.vue-global-types

# 重新安装依赖
npm install

# 手动类型检查
npm run type-check
```

#### Q3: Java后端启动失败
**A:** 
```bash
# 检查Java版本
java -version

# 检查Maven版本
mvn -version

# 清理并重新构建
mvn clean install -DskipTests

# 查看详细错误日志
mvn spring-boot:run -X
```

### 数据库问题

#### Q4: SQLite数据库锁定错误
**A:** 
```bash
# 检查数据库文件权限
ls -la dual_track_life.db

# 修改权限
chmod 664 dual_track_life.db

# 检查是否有其他进程占用
lsof dual_track_life.db
```

#### Q5: 数据库连接失败
**A:** 
检查配置文件中的数据库连接信息：
```yaml
spring:
  datasource:
    url: jdbc:sqlite:dual_track_life.db  # 确保路径正确
    driver-class-name: org.sqlite.JDBC
```

### 部署问题

#### Q6: 前端路由404错误
**A:** 
配置服务器支持SPA路由：
```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

#### Q7: CORS跨域错误
**A:** 
检查后端CORS配置：
```java
@CrossOrigin(origins = "https://your-domain.com")
```

或在配置文件中设置：
```yaml
cors:
  allowed-origins: https://your-domain.com
  allowed-methods: GET,POST,PUT,DELETE
  allowed-headers: "*"
```

#### Q8: JWT令牌过期问题
**A:** 
检查令牌过期时间配置：
```yaml
jwt:
  expiration: 86400000  # 24小时，单位毫秒
```

前端添加令牌刷新逻辑：
```typescript
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // 令牌过期，重新登录
      authStore.logout()
      router.push('/login')
    }
    return Promise.reject(error)
  }
)
```

### 性能问题

#### Q9: 前端加载缓慢
**A:** 
1. 启用代码分割：
```typescript
const DashboardView = () => import('@/views/DashboardView.vue')
```

2. 优化图片资源：
```bash
# 压缩图片
npm install -D vite-plugin-imagemin
```

3. 启用Gzip压缩：
```nginx
gzip on;
gzip_types text/plain text/css application/json application/javascript;
```

#### Q10: 数据库查询慢
**A:** 
1. 添加数据库索引：
```sql
CREATE INDEX idx_events_user_date ON events(user_id, event_date);
```

2. 优化查询语句：
```java
@Query("SELECT e FROM Event e WHERE e.userId = :userId ORDER BY e.eventDate DESC")
List<Event> findByUserIdOrderByEventDateDesc(@Param("userId") Long userId);
```

3. 启用查询缓存：
```yaml
spring:
  jpa:
    properties:
      hibernate:
        cache:
          use_second_level_cache: true
```

### 安全问题

#### Q11: JWT密钥安全
**A:** 
使用环境变量存储敏感信息：
```bash
export JWT_SECRET=$(openssl rand -base64 32)
```

#### Q12: SQL注入防护
**A:** 
使用参数化查询：
```java
@Query("SELECT e FROM Event e WHERE e.title LIKE %:keyword%")
List<Event> searchByKeyword(@Param("keyword") String keyword);
```

#### Q13: XSS攻击防护
**A:** 
前端输入验证和转义：
```typescript
const sanitizeInput = (input: string) => {
  return input.replace(/[<>]/g, '')
}
```

后端数据验证：
```java
@NotBlank
@Size(max = 255)
private String title;
```

---

这份代码说明书涵盖了双轨人生项目的完整技术实现，包括架构设计、核心功能、开发环境配置、部署指南和常见问题解决方案。开发者可以根据这份文档快速理解项目结构，进行功能开发和系统维护。

