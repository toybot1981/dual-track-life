#!/bin/bash

echo "Starting Backend Service..."
echo "Port: 10001"
echo "Health Check: http://localhost:10001/api/life-agent/health"

# 验证Java版本
echo "当前Java版本:"
java -version

# 使用Maven启动应用
echo "正在启动后端服务..."
mvn spring-boot:run

