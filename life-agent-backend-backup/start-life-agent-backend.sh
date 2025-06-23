#!/bin/bash

# 设置JDK 17
export JAVA_HOME=$(/usr/libexec/java_home -v 17)
export PATH=$JAVA_HOME/bin:$PATH

# 验证Java版本
echo "当前Java版本:"
java -version

# 使用Maven启动应用
echo "正在启动后端服务..."
mvn spring-boot:run
