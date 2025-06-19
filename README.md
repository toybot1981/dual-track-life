# 双轨人生 (Dual Track Life)

一个创新的人生管理平台，让您同时记录真实生活轨迹，并通过AI驱动的虚拟人生模拟探索无限可能。

## 🌟 项目概述

双轨人生是一个全栈Web应用，包含以下核心功能：

- **真实人生记录**：记录您的真实生活事件，包括工作成就、个人成长、人际关系等
- **虚拟人生模拟**：通过AI驱动的虚拟人生模拟，探索不同的人生选择和可能性
- **平行宇宙探索**：基于真实人生重要节点，创建和探索平行宇宙人生路径
- **双轨对比分析**：比较真实人生与虚拟人生的差异，获得洞察和建议
- **AI生活教练**：获得个性化的AI建议和洞察，帮助您做出更好的人生决策

## 📁 项目结构

```
dual-track-life-complete/
├── frontend/                    # Vue.js 前端应用
│   ├── src/
│   │   ├── components/         # Vue组件
│   │   ├── views/             # 页面视图
│   │   ├── stores/            # Pinia状态管理
│   │   ├── router/            # Vue Router路由
│   │   ├── locales/           # 国际化文件
│   │   ├── services/          # API服务
│   │   └── assets/            # 静态资源
│   ├── public/                # 公共文件
│   ├── dist/                  # 构建输出
│   ├── package.json           # 前端依赖
│   └── vite.config.ts         # Vite配置
├── backend-java/              # Spring Boot 后端 (主要版本)
│   ├── src/main/java/         # Java源代码
│   ├── src/main/resources/    # 配置文件
│   └── pom.xml               # Maven配置
├── backend-java-alt/          # Spring Boot 后端 (备用版本)
├── backend-python/            # FastAPI Python后端
│   ├── main.py               # 主应用文件
│   └── requirements.txt      # Python依赖
├── database/                  # 数据库文件
│   └── init.sql              # 数据库初始化脚本
├── docs/                      # 项目文档
├── scripts/                   # 运行脚本
└── README.md                 # 项目说明
```

## 🚀 快速开始

### 环境要求

- **前端**：Node.js 18+ 和 npm
- **Java后端**：Java 17+, Maven 3.6+
- **Python后端**：Python 3.8+, pip
- **数据库**：SQLite (内置) 或 MySQL/PostgreSQL

### 安装和运行

#### 1. 前端应用

```bash
cd frontend
npm install
npm run dev
```

前端将在 http://localhost:5173 运行

#### 2. Java后端 (推荐)

```bash
cd backend-java
mvn clean install
mvn spring-boot:run
```

后端将在 http://localhost:8080 运行

#### 3. Python后端 (可选)

```bash
cd backend-python
pip install -r requirements.txt
python main.py
```

后端将在 http://localhost:8000 运行

#### 4. 数据库初始化

SQLite数据库会自动创建。如需手动初始化：

```bash
sqlite3 dual_track_life.db < database/init.sql
```

## 🏗️ 技术栈

### 前端技术
- **Vue 3** - 渐进式JavaScript框架
- **TypeScript** - 类型安全的JavaScript
- **Vite** - 快速构建工具
- **Pinia** - Vue状态管理
- **Vue Router** - 路由管理
- **Tailwind CSS** - 实用优先的CSS框架
- **Lucide Vue** - 图标库
- **Vue I18n** - 国际化支持

### 后端技术
- **Spring Boot** (Java) - 企业级Java框架
- **FastAPI** (Python) - 现代Python Web框架
- **Spring Security** - 安全框架
- **JWT** - 身份验证
- **SQLite/MySQL** - 数据库
- **Maven** - Java依赖管理

### 数据库设计
- **users** - 用户信息表
- **events** - 事件记录表
- **virtual_life_stats** - 虚拟人生统计表
- **parallel_universes** - 平行宇宙表

## 📱 功能模块

### 1. 用户认证系统
- 用户注册和登录
- JWT令牌认证
- 密码加密存储

### 2. 事件管理系统
- 创建、编辑、删除生活事件
- 事件分类和重要性评级
- 情感标记和地点记录
- 时间轴展示

### 3. 虚拟人生模拟
- AI驱动的人生模拟
- 多种模拟模式选择
- 虚拟统计数据跟踪
- 场景和决策系统

### 4. 平行宇宙系统
- 基于真实事件触发平行宇宙
- 用户自定义和AI规划两种模式
- 多主题平行宇宙选择
- 平行宇宙状态管理

### 5. 双轨对比分析
- 真实vs虚拟人生对比
- 多维度统计分析
- 智能洞察和建议
- 经验迁移功能

### 6. AI生活教练
- 个性化建议系统
- 生活平衡分析
- 行为模式识别
- 趋势分析

## 🌐 国际化支持

项目支持中英文双语：
- 中文 (zh)
- English (en)

语言文件位于 `frontend/src/locales/`

## 🔧 开发指南

### 代码规范
- 使用 ESLint 和 Prettier 进行代码格式化
- 遵循 Vue 3 Composition API 最佳实践
- TypeScript 严格模式
- 组件化开发

### 状态管理
使用 Pinia 进行状态管理，主要 Store：
- `authStore` - 用户认证状态
- `eventStore` - 事件数据管理
- `virtualLifeStore` - 虚拟人生状态
- `parallelUniverseStore` - 平行宇宙管理

### API 接口
RESTful API 设计，主要端点：
- `/auth/*` - 认证相关
- `/events/*` - 事件管理
- `/virtual-life/*` - 虚拟人生
- `/parallel-universe/*` - 平行宇宙

## 🚀 部署指南

### 前端部署
```bash
cd frontend
npm run build
# 将 dist/ 目录部署到静态文件服务器
```

### 后端部署
```bash
cd backend-java
mvn clean package
java -jar target/dual-track-life-backend.jar
```

### 环境变量
创建 `.env` 文件配置：
```
DATABASE_URL=your_database_url
JWT_SECRET=your_jwt_secret
API_BASE_URL=your_api_url
```

## 📄 许可证

MIT License

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支
3. 提交更改
4. 推送到分支
5. 创建 Pull Request

## 📞 联系方式

如有问题或建议，请通过以下方式联系：
- 项目仓库：[GitHub链接]
- 邮箱：[联系邮箱]

---

**双轨人生 - 记录真实，探索可能** 🌟

