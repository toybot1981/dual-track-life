# Dual Track Life

一个创新的人生管理平台，让您记录真实人生轨迹的同时，通过AI驱动的虚拟人生模拟探索无限可能。

## 🌟 项目特色

- **双轨设计**: 真实与虚拟人生并行记录
- **AI驱动**: 人生智能体提供个性化规划和建议  
- **多功能**: 事件记录、虚拟模拟、平行宇宙、回忆记录器
- **多语言**: 完整的中英文支持
- **响应式**: 完美适配桌面和移动设备

## 🚀 在线体验

**网站地址**: https://jzjbridz.manus.space

点击 "Try Demo" 即可体验所有功能，无需注册！

## 🏗️ 技术架构

### 前端
- **框架**: Vue 3 + TypeScript + Vite
- **样式**: Tailwind CSS
- **状态管理**: Pinia
- **路由**: Vue Router
- **国际化**: Vue I18n
- **图标**: Lucide Vue

### 后端 (Life Agent)
- **框架**: Spring Boot 3.2
- **语言**: Java 17
- **API**: RESTful API
- **功能**: 智能对话、人生规划、评价分析

## 📦 项目结构

```
dual-track-life-main/
├── frontend/                 # Vue 3 前端应用
│   ├── src/
│   │   ├── components/      # 组件库
│   │   ├── views/          # 页面视图
│   │   ├── stores/         # Pinia状态管理
│   │   ├── locales/        # 国际化文件
│   │   └── router/         # 路由配置
│   ├── dist/               # 构建输出
│   └── package.json
├── life-agent-backend/      # Life Agent后端服务
│   ├── src/main/java/      # Java源码
│   ├── src/main/resources/ # 配置文件
│   └── pom.xml
└── README.md
```

## 🎯 核心功能

### 1. 真实人生记录
- 记录工作成就、个人成长、人际关系等人生事件
- 支持多媒体附件、地理位置、重要性评级
- 时间轴视图展示人生轨迹

### 2. 虚拟人生模拟
- AI驱动的人生选择模拟
- 探索不同决策的可能结果
- 虚拟角色成长和技能发展

### 3. 平行宇宙
- 基于真实事件创建假设场景
- 探索"如果当时选择不同会怎样"
- 多维度人生可能性分析

### 4. 回忆记录器
- 多媒体回忆记录和管理
- AI情感分析和分类
- 智能标签和搜索功能

### 5. 人生智能体 (Life Agent)
- **智能对话**: 自然语言人生咨询
- **人生规划**: 个性化规划生成
- **人生评价**: 多维度状态分析
- **目标分析**: 可行性评估和建议

### 6. AI生活教练
- 基于数据的个性化洞察
- 生活建议和改进方案
- 进度跟踪和目标管理

## 🛠️ 本地开发

### 前端开发
```bash
cd frontend
npm install
npm run dev
```

### 后端开发
```bash
cd life-agent-backend
mvn spring-boot:run
```

## 🌐 部署

### 前端部署
```bash
cd frontend
npm run build
# 将 dist/ 目录部署到静态托管服务
```

### 后端部署
```bash
cd life-agent-backend
mvn clean package
java -jar target/life-agent-simple-1.0.0.jar
```

## 🔧 环境要求

- **Node.js**: 18+
- **Java**: 17+
- **Maven**: 3.6+

## 📱 移动端支持

网站采用响应式设计，完美适配：
- 📱 手机 (iOS/Android)
- 📱 平板电脑
- 💻 桌面电脑

## 🌍 国际化

支持语言：
- 🇨🇳 简体中文
- 🇺🇸 English

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License

## 🎉 致谢

感谢所有为这个项目做出贡献的开发者！

---

**立即体验**: https://jzjbridz.manus.space 🚀

