# 双轨人生项目 - VSCode 开发指南

## 🚀 快速开始

### 1. 打开项目
在 VSCode 中打开整个 `dual-track-life-complete` 文件夹作为工作区。

### 2. 安装推荐扩展
VSCode 会自动提示安装推荐的扩展，包括：
- Vue Language Features (Volar)
- TypeScript Vue Plugin (Volar)
- ESLint
- Prettier
- Tailwind CSS IntelliSense
- Java Extension Pack
- Spring Boot Extension Pack

### 3. 环境设置
运行环境设置脚本：
```bash
# Linux/macOS
./scripts/setup.sh

# Windows
scripts\setup.bat
```

### 4. 启动项目
有多种方式启动项目：

#### 方式1: 使用脚本
```bash
# Linux/macOS
./scripts/start.sh

# Windows
scripts\start.bat
```

#### 方式2: 使用 VSCode 调试
按 `F5` 或点击调试面板的启动按钮

#### 方式3: 使用终端
```bash
# 启动前端
npm run dev:frontend

# 启动后端
npm run dev:backend
```

## 📁 项目结构说明

```
dual-track-life-complete/
├── .vscode/                 # VSCode 配置
│   ├── settings.json        # 工作区设置
│   ├── extensions.json      # 推荐扩展
│   └── launch.json         # 调试配置
├── frontend/               # Vue.js 前端
├── backend-java/           # Spring Boot 后端
├── backend-python/         # FastAPI 后端 (可选)
├── database/              # 数据库文件
├── docs/                  # 项目文档
├── scripts/               # 运行脚本
└── logs/                  # 日志文件
```

## 🔧 开发工作流

### 前端开发
1. 进入前端目录：`cd frontend`
2. 启动开发服务器：`npm run dev`
3. 访问：http://localhost:5173
4. 代码会自动热重载

### 后端开发
1. 进入后端目录：`cd backend-java`
2. 启动应用：`mvn spring-boot:run`
3. API地址：http://localhost:8080
4. 修改代码后需要重启服务

### 调试配置

#### 前端调试
- 在 Chrome 中安装 Vue DevTools 扩展
- 使用浏览器开发者工具调试
- VSCode 中可以设置断点调试 TypeScript 代码

#### 后端调试
- 在 VSCode 中设置断点
- 使用 F5 启动调试模式
- 或者在终端中使用：
  ```bash
  mvn spring-boot:run -Dspring-boot.run.jvmArguments="-Xdebug -Xrunjdwp:transport=dt_socket,server=y,suspend=n,address=5005"
  ```

## 📝 代码规范

### 前端代码规范
- 使用 ESLint + Prettier 进行代码格式化
- 遵循 Vue 3 Composition API 最佳实践
- TypeScript 严格模式
- 组件命名使用 PascalCase
- 文件命名使用 kebab-case

### 后端代码规范
- 遵循 Java 编码规范
- 使用 Spring Boot 最佳实践
- 类名使用 PascalCase
- 方法名使用 camelCase
- 包名使用小写

## 🧪 测试

### 前端测试
```bash
cd frontend
npm run test        # 运行单元测试
npm run test:e2e    # 运行端到端测试
```

### 后端测试
```bash
cd backend-java
mvn test           # 运行单元测试
mvn integration-test # 运行集成测试
```

## 📦 构建和部署

### 前端构建
```bash
cd frontend
npm run build      # 构建生产版本
```

### 后端构建
```bash
cd backend-java
mvn clean package  # 构建 JAR 文件
```

### 一键构建
```bash
npm run build:frontend
npm run build:backend
```

## 🔍 常用命令

### 项目管理
```bash
npm run setup      # 初始化开发环境
npm run start      # 启动所有服务
npm run stop       # 停止所有服务
npm run clean      # 清理构建文件
```

### 代码质量
```bash
npm run lint:frontend    # 前端代码检查
npm run format:frontend  # 前端代码格式化
```

### 日志查看
```bash
tail -f logs/frontend.log  # 查看前端日志
tail -f logs/backend.log   # 查看后端日志
```

## 🐛 常见问题

### 端口占用
如果遇到端口占用问题：
```bash
# 查看端口占用
lsof -i :5173  # 前端端口
lsof -i :8080  # 后端端口

# 杀死进程
kill -9 <PID>

# 或使用停止脚本
./scripts/stop.sh
```

### 依赖问题
如果遇到依赖问题：
```bash
# 清理并重新安装
npm run clean
npm run setup
```

### 数据库问题
如果数据库出现问题：
```bash
# 重新初始化数据库
rm dual_track_life.db
sqlite3 dual_track_life.db < database/init.sql
```

## 📚 相关文档

- [项目 README](../README.md)
- [代码说明书](CODE_DOCUMENTATION.md)
- [API 文档](http://localhost:8080/swagger-ui.html)
- [Vue 3 文档](https://vuejs.org/)
- [Spring Boot 文档](https://spring.io/projects/spring-boot)

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支：`git checkout -b feature/new-feature`
3. 提交更改：`git commit -am 'Add new feature'`
4. 推送分支：`git push origin feature/new-feature`
5. 创建 Pull Request

## 📞 获取帮助

如果遇到问题，可以：
1. 查看项目文档
2. 检查 GitHub Issues
3. 联系项目维护者

---

**祝您开发愉快！** 🎉

