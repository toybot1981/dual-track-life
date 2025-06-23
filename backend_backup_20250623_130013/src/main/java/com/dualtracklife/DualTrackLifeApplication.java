package com.dualtracklife;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;

/**
 * 双轨人生应用统一启动类
 * 
 * 扫描所有com.dualtracklife包下的组件，包括：
 * - user: 用户管理模块
 * - lifeevent: 人生事件模块  
 * - virtuallife: 虚拟人生模块
 * - paralleluniverse: 平行宇宙模块
 * - memory: 回忆记录模块
 * - lifeagent: AI服务模块
 * 
 * @author Dual Track Life Team
 */
@SpringBootApplication(scanBasePackages = "com.dualtracklife")
@EnableAutoConfiguration(exclude = {
    org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration.class
})
public class DualTrackLifeApplication {
    
    public static void main(String[] args) {
        SpringApplication.run(DualTrackLifeApplication.class, args);
        System.out.println("🎉 双轨人生服务启动成功！");
        System.out.println("📊 健康检查: http://localhost:10001/api/life-agent/health");
        System.out.println("👤 用户服务: http://localhost:10001/api/users/*");
        System.out.println("📅 事件服务: http://localhost:10001/api/events/*");
        System.out.println("🤖 AI服务: http://localhost:10001/api/life-agent/*");
        System.out.println("🌟 前端地址: https://fmhrzacu.manus.space");
    }
}

