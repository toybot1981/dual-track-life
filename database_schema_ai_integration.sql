-- =============================================
-- 双轨人生项目 - Spring AI集成数据库表结构
-- 创建时间: 2025-06-23
-- 描述: Life Agent AI功能相关的数据库表结构
-- =============================================

-- 1. AI角色表
CREATE TABLE IF NOT EXISTS ai_roles (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    role_id VARCHAR(50) UNIQUE NOT NULL COMMENT 'AI角色唯一标识',
    role_name VARCHAR(100) NOT NULL COMMENT 'AI角色名称',
    description TEXT COMMENT 'AI角色描述',
    expertise JSON COMMENT 'AI角色专长领域',
    personality TEXT COMMENT 'AI角色性格特点',
    system_prompt TEXT COMMENT 'AI角色系统提示词',
    is_active BOOLEAN DEFAULT TRUE COMMENT '是否启用',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_role_id (role_id),
    INDEX idx_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='AI角色配置表';

-- 插入默认AI角色数据
INSERT INTO ai_roles (role_id, role_name, description, expertise, personality, system_prompt) VALUES
('life_mentor', '人生导师', '经验丰富的人生指导者，帮助用户做出重要人生决策', 
 '["人生规划", "价值观引导", "目标设定", "人生哲学"]', 
 '智慧、耐心、富有洞察力，善于从宏观角度分析问题',
 '你是一位经验丰富的人生导师，拥有深厚的人生阅历和智慧。请以温和、耐心的方式为用户提供人生指导。'),

('psychologist', '心理咨询师', '专业的心理健康专家，提供情感支持和心理疏导', 
 '["心理健康", "情感支持", "压力管理", "心理疏导"]', 
 '专业、同理心强、善于倾听，能够提供安全的情感空间',
 '你是一位专业的心理咨询师，具有丰富的心理学知识和咨询经验。请以专业、同理心的方式为用户提供心理支持。'),

('career_coach', '职业导师', '专业的职业发展顾问，协助用户规划职业道路', 
 '["职业规划", "技能发展", "求职指导", "职场发展"]', 
 '专业、务实、目标导向，善于分析职业发展趋势',
 '你是一位专业的职业发展顾问，对各行业发展趋势有深入了解。请为用户提供实用的职业发展建议。'),

('life_coach', '生活教练', '全面的生活方式指导者，帮助用户优化生活质量', 
 '["生活方式", "健康管理", "时间管理", "习惯养成"]', 
 '积极、充满活力、注重实践，善于激励他人',
 '你是一位专业的生活教练，致力于帮助用户建立健康、平衡的生活方式。请提供积极、实用的生活建议。'),

('philosopher', '哲学家', '深度思考者，引导用户探索人生的深层意义', 
 '["人生哲学", "思辨能力", "价值思考", "精神成长"]', 
 '深邃、理性、善于思辨，能够引发深层思考',
 '你是一位富有智慧的哲学家，善于引导他人进行深度思考。请以启发性的方式帮助用户探索人生的意义。');

-- 2. AI对话记录表
CREATE TABLE IF NOT EXISTS ai_conversations (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL COMMENT '用户ID',
    role_id VARCHAR(50) COMMENT 'AI角色ID',
    conversation_type VARCHAR(50) DEFAULT 'general' COMMENT '对话类型: general, event_analysis, trajectory, advice, support',
    title VARCHAR(200) COMMENT '对话标题',
    context_data JSON COMMENT '对话上下文数据',
    status VARCHAR(20) DEFAULT 'active' COMMENT '对话状态: active, archived, deleted',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_user_id (user_id),
    INDEX idx_role_id (role_id),
    INDEX idx_conversation_type (conversation_type),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at),
    FOREIGN KEY (role_id) REFERENCES ai_roles(role_id) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='AI对话记录表';

-- 3. AI消息表
CREATE TABLE IF NOT EXISTS ai_messages (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    conversation_id BIGINT NOT NULL COMMENT '对话ID',
    user_id BIGINT NOT NULL COMMENT '用户ID',
    role_id VARCHAR(50) COMMENT 'AI角色ID',
    message_type ENUM('user', 'ai') NOT NULL COMMENT '消息类型',
    content TEXT NOT NULL COMMENT '消息内容',
    metadata JSON COMMENT '消息元数据(如token数量、响应时间等)',
    message_order INT NOT NULL COMMENT '消息顺序',
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_conversation_id (conversation_id),
    INDEX idx_user_id (user_id),
    INDEX idx_role_id (role_id),
    INDEX idx_message_type (message_type),
    INDEX idx_timestamp (timestamp),
    INDEX idx_message_order (message_order),
    FOREIGN KEY (conversation_id) REFERENCES ai_conversations(id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES ai_roles(role_id) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='AI消息表';

-- 4. AI分析记录表
CREATE TABLE IF NOT EXISTS ai_analysis_records (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL COMMENT '用户ID',
    analysis_type VARCHAR(50) NOT NULL COMMENT '分析类型: event, trajectory, personalized_advice, emotional_support, decision_support',
    input_data JSON NOT NULL COMMENT '输入数据',
    analysis_result JSON NOT NULL COMMENT '分析结果',
    ai_model VARCHAR(50) COMMENT '使用的AI模型',
    processing_time INT COMMENT '处理时间(毫秒)',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_id (user_id),
    INDEX idx_analysis_type (analysis_type),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='AI分析记录表';

-- 5. 用户AI关系表
CREATE TABLE IF NOT EXISTS user_ai_relationships (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL COMMENT '用户ID',
    role_id VARCHAR(50) NOT NULL COMMENT 'AI角色ID',
    relationship_level INT DEFAULT 1 COMMENT '关系等级(1-10)',
    interaction_count INT DEFAULT 0 COMMENT '互动次数',
    last_interaction_at TIMESTAMP NULL COMMENT '最后互动时间',
    preferences JSON COMMENT '用户对该AI角色的偏好设置',
    is_favorite BOOLEAN DEFAULT FALSE COMMENT '是否为收藏角色',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uk_user_role (user_id, role_id),
    INDEX idx_user_id (user_id),
    INDEX idx_role_id (role_id),
    INDEX idx_is_favorite (is_favorite),
    FOREIGN KEY (role_id) REFERENCES ai_roles(role_id) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户AI关系表';

-- 6. AI使用统计表
CREATE TABLE IF NOT EXISTS ai_usage_statistics (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL COMMENT '用户ID',
    date DATE NOT NULL COMMENT '统计日期',
    role_id VARCHAR(50) COMMENT 'AI角色ID',
    feature_type VARCHAR(50) COMMENT '功能类型',
    usage_count INT DEFAULT 0 COMMENT '使用次数',
    total_tokens INT DEFAULT 0 COMMENT '总token数',
    total_time_seconds INT DEFAULT 0 COMMENT '总使用时间(秒)',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uk_user_date_role_feature (user_id, date, role_id, feature_type),
    INDEX idx_user_id (user_id),
    INDEX idx_date (date),
    INDEX idx_role_id (role_id),
    INDEX idx_feature_type (feature_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='AI使用统计表';

-- 7. 更新现有的life_events表，添加AI分析相关字段
ALTER TABLE life_events 
ADD COLUMN ai_analysis_id BIGINT NULL COMMENT 'AI分析记录ID',
ADD COLUMN ai_insights JSON NULL COMMENT 'AI洞察和建议',
ADD COLUMN ai_analysis_status VARCHAR(20) DEFAULT 'pending' COMMENT 'AI分析状态: pending, completed, failed',
ADD INDEX idx_ai_analysis_id (ai_analysis_id),
ADD INDEX idx_ai_analysis_status (ai_analysis_status);

-- 8. 创建AI配置表
CREATE TABLE IF NOT EXISTS ai_configurations (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    config_key VARCHAR(100) UNIQUE NOT NULL COMMENT '配置键',
    config_value TEXT NOT NULL COMMENT '配置值',
    config_type VARCHAR(50) DEFAULT 'string' COMMENT '配置类型: string, number, boolean, json',
    description TEXT COMMENT '配置描述',
    is_active BOOLEAN DEFAULT TRUE COMMENT '是否启用',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_config_key (config_key),
    INDEX idx_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='AI配置表';

-- 插入默认AI配置
INSERT INTO ai_configurations (config_key, config_value, config_type, description) VALUES
('ai.model.default', 'qwen-max', 'string', '默认AI模型'),
('ai.model.temperature', '0.8', 'number', 'AI模型温度参数'),
('ai.model.max_tokens', '2000', 'number', '最大token数'),
('ai.model.top_p', '0.7', 'number', 'Top-P参数'),
('ai.rate_limit.requests_per_minute', '60', 'number', '每分钟请求限制'),
('ai.rate_limit.tokens_per_day', '100000', 'number', '每日token限制'),
('ai.features.event_analysis', 'true', 'boolean', '是否启用事件分析功能'),
('ai.features.trajectory_analysis', 'true', 'boolean', '是否启用轨迹分析功能'),
('ai.features.personalized_advice', 'true', 'boolean', '是否启用个性化建议功能'),
('ai.features.emotional_support', 'true', 'boolean', '是否启用情感支持功能');

-- =============================================
-- 创建视图和存储过程
-- =============================================

-- 创建用户AI互动统计视图
CREATE OR REPLACE VIEW v_user_ai_interaction_stats AS
SELECT 
    u.id as user_id,
    u.username,
    COUNT(DISTINCT c.id) as total_conversations,
    COUNT(m.id) as total_messages,
    COUNT(DISTINCT m.role_id) as unique_roles_used,
    MAX(m.timestamp) as last_interaction,
    SUM(CASE WHEN m.message_type = 'user' THEN 1 ELSE 0 END) as user_messages,
    SUM(CASE WHEN m.message_type = 'ai' THEN 1 ELSE 0 END) as ai_responses
FROM users u
LEFT JOIN ai_conversations c ON u.id = c.user_id
LEFT JOIN ai_messages m ON c.id = m.conversation_id
GROUP BY u.id, u.username;

-- 创建AI角色使用统计视图
CREATE OR REPLACE VIEW v_ai_role_usage_stats AS
SELECT 
    r.role_id,
    r.role_name,
    COUNT(DISTINCT c.user_id) as unique_users,
    COUNT(c.id) as total_conversations,
    COUNT(m.id) as total_messages,
    AVG(CASE WHEN m.message_type = 'ai' THEN 1 ELSE 0 END) as avg_ai_responses,
    MAX(m.timestamp) as last_used
FROM ai_roles r
LEFT JOIN ai_conversations c ON r.role_id = c.role_id
LEFT JOIN ai_messages m ON c.id = m.conversation_id
GROUP BY r.role_id, r.role_name;

-- =============================================
-- 索引优化建议
-- =============================================

-- 为高频查询创建复合索引
CREATE INDEX idx_messages_conversation_order ON ai_messages(conversation_id, message_order);
CREATE INDEX idx_conversations_user_updated ON ai_conversations(user_id, updated_at DESC);
CREATE INDEX idx_analysis_user_type_created ON ai_analysis_records(user_id, analysis_type, created_at DESC);

-- =============================================
-- 数据清理和维护
-- =============================================

-- 创建数据清理存储过程（可选）
DELIMITER //
CREATE PROCEDURE CleanupOldAIData(IN days_to_keep INT)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;
    
    START TRANSACTION;
    
    -- 删除超过指定天数的AI使用统计数据
    DELETE FROM ai_usage_statistics 
    WHERE date < DATE_SUB(CURDATE(), INTERVAL days_to_keep DAY);
    
    -- 删除已删除状态的对话记录（超过30天）
    DELETE c, m FROM ai_conversations c
    LEFT JOIN ai_messages m ON c.id = m.conversation_id
    WHERE c.status = 'deleted' 
    AND c.updated_at < DATE_SUB(NOW(), INTERVAL 30 DAY);
    
    COMMIT;
END //
DELIMITER ;

-- =============================================
-- 权限和安全设置
-- =============================================

-- 注意：在生产环境中，请确保：
-- 1. 为AI相关表设置适当的用户权限
-- 2. 对敏感数据进行加密存储
-- 3. 定期备份AI对话数据
-- 4. 监控AI API使用量和成本
-- 5. 实施数据保留政策

-- 示例权限设置（根据实际需求调整）
-- GRANT SELECT, INSERT, UPDATE ON ai_conversations TO 'app_user'@'%';
-- GRANT SELECT, INSERT ON ai_messages TO 'app_user'@'%';
-- GRANT SELECT ON ai_roles TO 'app_user'@'%';

-- =============================================
-- 完成
-- =============================================

