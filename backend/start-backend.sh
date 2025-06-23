#!/bin/bash

echo "Starting Dual Track Life Backend..."
echo "Port: 10001"
echo "Health Check: http://localhost:10001/api/life-agent/health"

# Start the Spring Boot application
mvn spring-boot:run

