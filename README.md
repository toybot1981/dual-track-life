# Dual Track Life

一个创新的人生管理平台，让您记录真实的人生轨迹，同时通过AI驱动的虚拟人生模拟探索无限可能。

## 核心功能

### 📝 真实人生记录
记录您的真实人生事件，包括工作成就、个人成长、人际关系等。

### 🎮 虚拟人生模拟
通过AI驱动的虚拟人生模拟，探索不同的人生选择和可能性。

### 🤖 AI人生导师
获得个性化的AI洞察和建议，帮助您做出更好的人生决策。

## 技术栈

### 前端
- Vue 3 + TypeScript
- Vite
- Tailwind CSS
- Vue Router
- Pinia

### 后端
- Spring Boot 3.4.5
- Spring AI 1.0.0
- H2 Database
- Maven

### AI集成
- 阿里云通义千问 (qwen-max)
- DashScope API

## 快速开始

### 环境要求
- Node.js 18+
- Java 17+
- Maven 3.6+

### 安装和运行

#### 1. 克隆仓库
```bash
git clone https://github.com/toybot1981/dual-track-life.git
cd dual-track-life
```

#### 2. 后端设置
```bash
cd backend
mvn clean package -DskipTests
ALI_DASHSCOPE_API_KEY="your_api_key" java -jar target/backend-1.0.0.jar
```

#### 3. 前端设置
```bash
cd frontend
npm install
cp .env.example .env.local
# 编辑 .env.local 设置 VITE_API_BASE_URL
npm run dev
```

## 环境变量配置

### 前端
```bash
# .env.local
VITE_API_BASE_URL=http://localhost:10003
```

### 后端
```bash
# 环境变量
ALI_DASHSCOPE_API_KEY=your_dashscope_api_key
```

## 部署

详细的部署说明请参考 [DEPLOYMENT.md](./DEPLOYMENT.md)

## API文档

### 健康检查
```bash
GET /api/life-agent/health
```

### AI聊天
```bash
POST /api/spring-ai/simple/chat
Content-Type: application/json

{
  "query": "你好，请介绍一下自己"
}
```

## 项目结构

```
dual-track-life/
├── frontend/           # Vue.js 前端应用
│   ├── src/
│   │   ├── components/ # Vue组件
│   │   ├── views/      # 页面视图
│   │   ├── stores/     # Pinia状态管理
│   │   └── services/   # API服务
│   └── public/         # 静态资源
├── backend/            # Spring Boot 后端应用
│   ├── src/main/java/  # Java源代码
│   └── src/main/resources/ # 配置文件
└── docs/               # 文档
```

## 贡献

欢迎提交Issue和Pull Request！

## 许可证

MIT License

## 联系方式

- GitHub: [toybot1981/dual-track-life](https://github.com/toybot1981/dual-track-life)
- Issues: [GitHub Issues](https://github.com/toybot1981/dual-track-life/issues)

