#!/bin/bash

# Set JAVA_HOME
export JAVA_HOME=/Library/Java/JavaVirtualMachines/jdk-17.jdk/Contents/Home

echo "Starting Dual Track Life Backend..."
echo "Port: 10001"
echo "Health Check: http://localhost:10001/api/life-agent/health"

# Start the Spring Boot application
mvn spring-boot:run
