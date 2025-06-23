package com.dualtracklife.lifeagent;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;

/**
 * Life Agent应用启动类
 * 
 * @author Life Agent Team
 */
@SpringBootApplication
@EnableAutoConfiguration(exclude = {
    org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration.class
})
public class LifeAgentApplication {
    
    public static void main(String[] args) {
        SpringApplication.run(LifeAgentApplication.class, args);
        System.out.println("Life Agent服务启动成功！");
        System.out.println("健康检查: http://localhost:10001/api/life-agent/health");
    }
}

