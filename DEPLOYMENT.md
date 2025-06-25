# Dual Track Life 部署说明

## 环境变量配置

### 前端环境变量

在部署前端应用时，需要配置以下环境变量：

#### 开发环境
```bash
# 创建 .env.local 文件
VITE_API_BASE_URL=http://localhost:10003
```

#### 生产环境
```bash
# 创建 .env.production 文件
VITE_API_BASE_URL=https://your-backend-api.manus.space
```

### 后端环境变量

#### Spring Boot 应用
```bash
# DashScope API Key (必需)
ALI_DASHSCOPE_API_KEY=your_dashscope_api_key

# 服务端口 (可选，默认10003)
SERVER_PORT=10003
```

## 部署步骤

### 1. 后端部署

#### 本地运行
```bash
cd backend
mvn clean package -DskipTests
ALI_DASHSCOPE_API_KEY="your_api_key" java -jar target/backend-1.0.0.jar
```

#### 生产部署
使用Flask包装器部署到生产环境，确保Spring Boot服务在本地运行。

### 2. 前端部署

#### 配置环境变量
```bash
cd frontend
cp .env.example .env.local
# 编辑 .env.local 文件，设置正确的API地址
```

#### 构建和部署
```bash
npm install
npm run build-only
# 部署 dist 目录到静态文件服务器
```

## API 端点

### 健康检查
- `GET /api/life-agent/health`

### AI 聊天
- `POST /api/spring-ai/simple/chat`
- `POST /api/spring-ai/role/chat`
- `POST /api/spring-ai/role/stream/chat`

### 数据管理
- `GET /api/users`
- `GET /api/events`

## 故障排除

### 常见问题

1. **Life Agent 页面无法加载**
   - 检查Vue组件是否正确渲染
   - 确认路由配置正确
   - 检查浏览器控制台错误

2. **API 连接失败**
   - 确认环境变量 `VITE_API_BASE_URL` 设置正确
   - 检查后端服务是否运行
   - 验证CORS配置

3. **中文显示乱码**
   - 确认Flask包装器字符编码设置
   - 检查Content-Type头部设置

### 日志查看

#### 前端
- 浏览器开发者工具 Console
- Network 标签页查看API请求

#### 后端
- Spring Boot 应用日志
- Flask包装器日志

## 当前已知问题

1. **Vue组件渲染错误**: LifeAgentPageView组件在生产环境中可能无法正确渲染
2. **客户端路由**: SPA路由在某些部署环境中可能失效
3. **组件依赖**: Vue组件之间的依赖关系需要进一步优化

## 联系信息

如有问题，请查看GitHub仓库的Issues页面或提交新的Issue。

