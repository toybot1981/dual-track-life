-- 双轨人生数据库初始化脚本
-- 创建用户表
CREATE TABLE IF NOT EXISTS users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 创建事件表
CREATE TABLE IF NOT EXISTS events (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(50) NOT NULL,
    event_date DATE NOT NULL,
    emotion VARCHAR(50),
    importance INT,
    location VARCHAR(255),
    user_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id)
);

-- 创建虚拟人生统计表
CREATE TABLE IF NOT EXISTS virtual_life_stats (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    happiness INT DEFAULT 50,
    success INT DEFAULT 50,
    growth INT DEFAULT 50,
    experience INT DEFAULT 0,
    level INT DEFAULT 1,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id)
);

-- 创建平行宇宙表
CREATE TABLE IF NOT EXISTS parallel_universes (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    theme VARCHAR(100),
    mode VARCHAR(50),
    trigger_event_id BIGINT,
    status VARCHAR(50) DEFAULT 'active',
    stats TEXT,
    timeline TEXT,
    insights TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id),
    FOREIGN KEY (trigger_event_id) REFERENCES events (id)
);

-- 插入演示数据
INSERT IGNORE INTO users (id, username, email, password_hash, full_name) VALUES 
(1, 'demo', 'demo@example.com', 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f', 'Demo User');

INSERT IGNORE INTO events (title, description, category, event_date, emotion, importance, location, user_id) VALUES 
('大学毕业', '完成了计算机科学学位，准备进入职场', 'Learning', '2023-06-15', 'excited', 9, '北京大学', 1),
('第一份工作', '加入了一家科技公司担任软件工程师', 'Work', '2023-07-01', 'nervous', 8, '北京', 1),
('学习新技能', '开始学习机器学习和人工智能', 'Learning', '2023-08-15', 'motivated', 7, '在线课程', 1),
('升职加薪', '工作表现出色，获得晋升机会', 'Work', '2023-12-01', 'proud', 8, '公司', 1),
('开始健身', '为了保持健康开始定期锻炼', 'Health', '2024-01-15', 'determined', 6, '健身房', 1),
('学习投资', '开始学习理财和投资知识', 'Finance', '2024-03-01', 'curious', 7, '在线', 1);

INSERT IGNORE INTO virtual_life_stats (user_id, happiness, success, growth, experience, level) VALUES 
(1, 75, 68, 82, 150, 3);