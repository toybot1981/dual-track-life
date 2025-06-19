-- 双轨人生数据库初始化脚本
-- 创建用户表
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    full_name TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 创建事件表
CREATE TABLE IF NOT EXISTS events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL,
    event_date TEXT NOT NULL,
    emotion TEXT,
    importance INTEGER,
    location TEXT,
    user_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id)
);

-- 创建虚拟人生统计表
CREATE TABLE IF NOT EXISTS virtual_life_stats (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    happiness INTEGER DEFAULT 50,
    success INTEGER DEFAULT 50,
    growth INTEGER DEFAULT 50,
    experience INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id)
);

-- 创建平行宇宙表
CREATE TABLE IF NOT EXISTS parallel_universes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    theme TEXT,
    mode TEXT,
    trigger_event_id INTEGER,
    status TEXT DEFAULT 'active',
    stats TEXT,
    timeline TEXT,
    insights TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id),
    FOREIGN KEY (trigger_event_id) REFERENCES events (id)
);

-- 插入演示数据
INSERT OR IGNORE INTO users (id, username, email, password_hash, full_name) VALUES 
(1, 'demo', 'demo@example.com', 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f', 'Demo User');

INSERT OR IGNORE INTO events (title, description, category, event_date, emotion, importance, location, user_id) VALUES 
('大学毕业', '完成了计算机科学学位，准备进入职场', 'Learning', '2023-06-15', 'excited', 9, '北京大学', 1),
('第一份工作', '加入了一家科技公司担任软件工程师', 'Work', '2023-07-01', 'nervous', 8, '北京', 1),
('学习新技能', '开始学习机器学习和人工智能', 'Learning', '2023-08-15', 'motivated', 7, '在线课程', 1),
('升职加薪', '工作表现出色，获得晋升机会', 'Work', '2023-12-01', 'proud', 8, '公司', 1),
('开始健身', '为了保持健康开始定期锻炼', 'Health', '2024-01-15', 'determined', 6, '健身房', 1),
('学习投资', '开始学习理财和投资知识', 'Finance', '2024-03-01', 'curious', 7, '在线', 1);

INSERT OR IGNORE INTO virtual_life_stats (user_id, happiness, success, growth, experience, level) VALUES 
(1, 75, 68, 82, 150, 3);

