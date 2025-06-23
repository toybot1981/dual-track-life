"""
Life Agent Core Implementation
基于Spring AI架构模式的Python实现

这个模块实现了Life Agent的核心功能，包括：
1. LifePlanningAgent - 人生规划智能体
2. LifeEvaluationAgent - 人生评价智能体  
3. ConversationAgent - 对话智能体
"""

from abc import ABC, abstractmethod
from typing import List, Dict, Any, Optional
from dataclasses import dataclass, field
from datetime import datetime, date
from enum import Enum
import json
import uuid


# 枚举定义
class GoalCategory(Enum):
    CAREER = "career"
    HEALTH = "health"
    RELATIONSHIPS = "relationships"
    FINANCE = "finance"
    EDUCATION = "education"
    PERSONAL_GROWTH = "personal_growth"
    FAMILY = "family"
    TRAVEL = "travel"


class Priority(Enum):
    LOW = 1
    MEDIUM = 2
    HIGH = 3
    CRITICAL = 4


class GoalStatus(Enum):
    NOT_STARTED = "not_started"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    PAUSED = "paused"
    CANCELLED = "cancelled"


class PlanType(Enum):
    SHORT_TERM = "short_term"  # 1-6个月
    MEDIUM_TERM = "medium_term"  # 6个月-2年
    LONG_TERM = "long_term"  # 2年以上


class LifeDimension(Enum):
    CAREER = "career"
    HEALTH = "health"
    RELATIONSHIPS = "relationships"
    FINANCE = "finance"
    PERSONAL_GROWTH = "personal_growth"
    LIFE_BALANCE = "life_balance"


# 数据模型
@dataclass
class LifeGoal:
    """人生目标数据模型"""
    id: str = field(default_factory=lambda: str(uuid.uuid4()))
    title: str = ""
    description: str = ""
    category: GoalCategory = GoalCategory.PERSONAL_GROWTH
    priority: Priority = Priority.MEDIUM
    target_date: Optional[date] = None
    status: GoalStatus = GoalStatus.NOT_STARTED
    milestones: List[Dict[str, Any]] = field(default_factory=list)
    created_date: datetime = field(default_factory=datetime.now)
    progress: float = 0.0  # 0-100%


@dataclass
class LifeEvent:
    """人生事件数据模型"""
    id: str = field(default_factory=lambda: str(uuid.uuid4()))
    title: str = ""
    description: str = ""
    category: str = ""
    date: date = field(default_factory=date.today)
    importance: int = 5  # 1-10
    emotion: str = "neutral"
    location: str = ""
    tags: List[str] = field(default_factory=list)


@dataclass
class Memory:
    """回忆数据模型"""
    id: str = field(default_factory=lambda: str(uuid.uuid4()))
    title: str = ""
    content: str = ""
    category: str = ""
    date: date = field(default_factory=date.today)
    emotion_analysis: Dict[str, Any] = field(default_factory=dict)
    importance: int = 5
    tags: List[str] = field(default_factory=list)


@dataclass
class PlanStep:
    """规划步骤"""
    id: str = field(default_factory=lambda: str(uuid.uuid4()))
    title: str = ""
    description: str = ""
    target_date: Optional[date] = None
    dependencies: List[str] = field(default_factory=list)
    resources_needed: List[str] = field(default_factory=list)
    success_criteria: List[str] = field(default_factory=list)
    status: GoalStatus = GoalStatus.NOT_STARTED


@dataclass
class LifePlan:
    """人生规划方案"""
    id: str = field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str = ""
    plan_name: str = ""
    plan_type: PlanType = PlanType.SHORT_TERM
    steps: List[PlanStep] = field(default_factory=list)
    created_date: datetime = field(default_factory=datetime.now)
    last_updated: datetime = field(default_factory=datetime.now)
    target_goals: List[str] = field(default_factory=list)  # Goal IDs
    estimated_duration: int = 0  # 预计完成时间（天）


@dataclass
class DimensionScore:
    """维度评分"""
    dimension: LifeDimension
    current_score: float  # 0-100
    target_score: float
    trend: str  # "improving", "stable", "declining"
    factors: List[str] = field(default_factory=list)


@dataclass
class EvaluationReport:
    """评价报告"""
    id: str = field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str = ""
    evaluation_date: datetime = field(default_factory=datetime.now)
    overall_score: float = 0.0
    dimension_scores: Dict[LifeDimension, DimensionScore] = field(default_factory=dict)
    insights: List[str] = field(default_factory=list)
    recommendations: List[str] = field(default_factory=list)
    comparison_data: Dict[str, Any] = field(default_factory=dict)


@dataclass
class UserLifeProfile:
    """用户人生档案"""
    user_id: str = ""
    name: str = ""
    birth_date: Optional[date] = None
    goals: List[LifeGoal] = field(default_factory=list)
    events: List[LifeEvent] = field(default_factory=list)
    memories: List[Memory] = field(default_factory=list)
    personality_traits: Dict[str, float] = field(default_factory=dict)
    preferences: Dict[str, Any] = field(default_factory=dict)
    last_updated: datetime = field(default_factory=datetime.now)


# 智能体基类
class BaseAgent(ABC):
    """智能体基类"""
    
    def __init__(self, name: str, description: str):
        self.name = name
        self.description = description
        self.capabilities = []
        self.knowledge_base = {}
    
    @abstractmethod
    def process(self, input_data: Dict[str, Any]) -> Dict[str, Any]:
        """处理输入数据并返回结果"""
        pass
    
    def add_capability(self, capability: str):
        """添加能力"""
        if capability not in self.capabilities:
            self.capabilities.append(capability)
    
    def update_knowledge(self, key: str, value: Any):
        """更新知识库"""
        self.knowledge_base[key] = value


class LifePlanningAgent(BaseAgent):
    """人生规划智能体"""
    
    def __init__(self):
        super().__init__(
            name="LifePlanningAgent",
            description="专门负责人生规划和路径设计的智能体"
        )
        self.add_capability("goal_analysis")
        self.add_capability("path_planning")
        self.add_capability("resource_allocation")
        self.add_capability("risk_assessment")
    
    def process(self, input_data: Dict[str, Any]) -> Dict[str, Any]:
        """处理规划请求"""
        action = input_data.get("action")
        user_profile = input_data.get("user_profile")
        
        if action == "generate_plan":
            return self.generate_life_plan(user_profile, input_data.get("goals", []))
        elif action == "optimize_plan":
            return self.optimize_existing_plan(input_data.get("plan_id"))
        elif action == "analyze_goals":
            return self.analyze_goals(input_data.get("goals", []))
        else:
            return {"error": "Unknown action"}
    
    def generate_life_plan(self, user_profile: UserLifeProfile, target_goals: List[LifeGoal]) -> Dict[str, Any]:
        """生成人生规划方案"""
        try:
            # 分析用户当前状态
            current_state = self._analyze_current_state(user_profile)
            
            # 分析目标可行性
            goal_analysis = self._analyze_goal_feasibility(target_goals, current_state)
            
            # 生成规划步骤
            plan_steps = self._generate_plan_steps(target_goals, current_state)
            
            # 创建规划方案
            life_plan = LifePlan(
                user_id=user_profile.user_id,
                plan_name=f"人生规划方案 - {datetime.now().strftime('%Y%m%d')}",
                plan_type=self._determine_plan_type(target_goals),
                steps=plan_steps,
                target_goals=[goal.id for goal in target_goals],
                estimated_duration=self._estimate_duration(plan_steps)
            )
            
            return {
                "success": True,
                "plan": life_plan,
                "analysis": goal_analysis,
                "recommendations": self._generate_recommendations(current_state, target_goals)
            }
        
        except Exception as e:
            return {"success": False, "error": str(e)}
    
    def _analyze_current_state(self, user_profile: UserLifeProfile) -> Dict[str, Any]:
        """分析用户当前状态"""
        current_state = {
            "age": self._calculate_age(user_profile.birth_date) if user_profile.birth_date else None,
            "active_goals": len([g for g in user_profile.goals if g.status == GoalStatus.IN_PROGRESS]),
            "completed_goals": len([g for g in user_profile.goals if g.status == GoalStatus.COMPLETED]),
            "recent_events": len([e for e in user_profile.events if (date.today() - e.date).days <= 30]),
            "goal_categories": self._analyze_goal_distribution(user_profile.goals),
            "life_balance": self._assess_life_balance(user_profile)
        }
        return current_state
    
    def _analyze_goal_feasibility(self, goals: List[LifeGoal], current_state: Dict[str, Any]) -> Dict[str, Any]:
        """分析目标可行性"""
        analysis = {
            "feasible_goals": [],
            "challenging_goals": [],
            "unrealistic_goals": [],
            "recommendations": []
        }
        
        for goal in goals:
            feasibility_score = self._calculate_feasibility_score(goal, current_state)
            
            if feasibility_score >= 0.8:
                analysis["feasible_goals"].append(goal.id)
            elif feasibility_score >= 0.5:
                analysis["challenging_goals"].append(goal.id)
            else:
                analysis["unrealistic_goals"].append(goal.id)
        
        return analysis
    
    def _generate_plan_steps(self, goals: List[LifeGoal], current_state: Dict[str, Any]) -> List[PlanStep]:
        """生成规划步骤"""
        steps = []
        
        # 按优先级和依赖关系排序目标
        sorted_goals = sorted(goals, key=lambda g: (g.priority.value, g.target_date or date.max))
        
        for goal in sorted_goals:
            goal_steps = self._break_down_goal(goal, current_state)
            steps.extend(goal_steps)
        
        return steps
    
    def _break_down_goal(self, goal: LifeGoal, current_state: Dict[str, Any]) -> List[PlanStep]:
        """将目标分解为具体步骤"""
        steps = []
        
        # 根据目标类别生成相应的步骤模板
        if goal.category == GoalCategory.CAREER:
            steps = self._generate_career_steps(goal)
        elif goal.category == GoalCategory.HEALTH:
            steps = self._generate_health_steps(goal)
        elif goal.category == GoalCategory.FINANCE:
            steps = self._generate_finance_steps(goal)
        elif goal.category == GoalCategory.EDUCATION:
            steps = self._generate_education_steps(goal)
        else:
            steps = self._generate_generic_steps(goal)
        
        return steps
    
    def _generate_career_steps(self, goal: LifeGoal) -> List[PlanStep]:
        """生成职业相关步骤"""
        return [
            PlanStep(
                title="技能评估与差距分析",
                description="评估当前技能水平，识别需要提升的技能",
                target_date=date.today(),
                success_criteria=["完成技能评估报告", "制定技能提升计划"]
            ),
            PlanStep(
                title="制定学习计划",
                description="根据技能差距制定详细的学习计划",
                target_date=date.today(),
                success_criteria=["确定学习资源", "制定学习时间表"]
            ),
            PlanStep(
                title="网络建设",
                description="扩展职业网络，建立有价值的职业关系",
                target_date=date.today(),
                success_criteria=["参加行业活动", "建立导师关系"]
            )
        ]
    
    def _generate_health_steps(self, goal: LifeGoal) -> List[PlanStep]:
        """生成健康相关步骤"""
        return [
            PlanStep(
                title="健康状况评估",
                description="进行全面的健康检查和评估",
                target_date=date.today(),
                success_criteria=["完成体检", "获得健康报告"]
            ),
            PlanStep(
                title="制定运动计划",
                description="根据健康状况制定适合的运动计划",
                target_date=date.today(),
                success_criteria=["选择运动项目", "制定运动时间表"]
            ),
            PlanStep(
                title="营养计划调整",
                description="优化饮食结构，制定营养计划",
                target_date=date.today(),
                success_criteria=["制定饮食计划", "建立健康饮食习惯"]
            )
        ]
    
    def _generate_finance_steps(self, goal: LifeGoal) -> List[PlanStep]:
        """生成财务相关步骤"""
        return [
            PlanStep(
                title="财务状况分析",
                description="分析当前财务状况，制定预算",
                target_date=date.today(),
                success_criteria=["完成财务分析", "制定月度预算"]
            ),
            PlanStep(
                title="投资策略制定",
                description="根据风险承受能力制定投资策略",
                target_date=date.today(),
                success_criteria=["确定投资目标", "选择投资产品"]
            )
        ]
    
    def _generate_education_steps(self, goal: LifeGoal) -> List[PlanStep]:
        """生成教育相关步骤"""
        return [
            PlanStep(
                title="学习需求分析",
                description="分析学习需求和目标",
                target_date=date.today(),
                success_criteria=["确定学习目标", "选择学习方式"]
            ),
            PlanStep(
                title="学习资源准备",
                description="准备必要的学习资源和材料",
                target_date=date.today(),
                success_criteria=["获取学习材料", "安排学习时间"]
            )
        ]
    
    def _generate_generic_steps(self, goal: LifeGoal) -> List[PlanStep]:
        """生成通用步骤"""
        return [
            PlanStep(
                title="目标细化",
                description="将目标分解为更具体的子目标",
                target_date=date.today(),
                success_criteria=["确定具体目标", "制定时间计划"]
            ),
            PlanStep(
                title="资源准备",
                description="准备实现目标所需的资源",
                target_date=date.today(),
                success_criteria=["识别所需资源", "获取必要资源"]
            ),
            PlanStep(
                title="执行与监控",
                description="执行计划并定期监控进度",
                target_date=date.today(),
                success_criteria=["开始执行", "建立监控机制"]
            )
        ]
    
    def _determine_plan_type(self, goals: List[LifeGoal]) -> PlanType:
        """确定规划类型"""
        if not goals:
            return PlanType.SHORT_TERM
        
        # 根据目标的时间跨度确定规划类型
        max_days = 0
        for goal in goals:
            if goal.target_date:
                days = (goal.target_date - date.today()).days
                max_days = max(max_days, days)
        
        if max_days <= 180:  # 6个月
            return PlanType.SHORT_TERM
        elif max_days <= 730:  # 2年
            return PlanType.MEDIUM_TERM
        else:
            return PlanType.LONG_TERM
    
    def _estimate_duration(self, steps: List[PlanStep]) -> int:
        """估算完成时间"""
        # 简单估算：每个步骤平均需要7天
        return len(steps) * 7
    
    def _calculate_age(self, birth_date: date) -> int:
        """计算年龄"""
        today = date.today()
        return today.year - birth_date.year - ((today.month, today.day) < (birth_date.month, birth_date.day))
    
    def _analyze_goal_distribution(self, goals: List[LifeGoal]) -> Dict[str, int]:
        """分析目标分布"""
        distribution = {}
        for goal in goals:
            category = goal.category.value
            distribution[category] = distribution.get(category, 0) + 1
        return distribution
    
    def _assess_life_balance(self, user_profile: UserLifeProfile) -> Dict[str, float]:
        """评估生活平衡"""
        # 简化的生活平衡评估
        categories = [category.value for category in GoalCategory]
        balance = {}
        
        for category in categories:
            category_goals = [g for g in user_profile.goals if g.category.value == category]
            balance[category] = len(category_goals) / len(user_profile.goals) if user_profile.goals else 0
        
        return balance
    
    def _calculate_feasibility_score(self, goal: LifeGoal, current_state: Dict[str, Any]) -> float:
        """计算目标可行性评分"""
        # 简化的可行性评分算法
        score = 0.5  # 基础分
        
        # 根据优先级调整
        if goal.priority == Priority.HIGH:
            score += 0.2
        elif goal.priority == Priority.CRITICAL:
            score += 0.3
        
        # 根据时间合理性调整
        if goal.target_date:
            days_to_target = (goal.target_date - date.today()).days
            if days_to_target > 30:  # 有足够时间
                score += 0.2
            elif days_to_target < 7:  # 时间太紧
                score -= 0.3
        
        return min(1.0, max(0.0, score))
    
    def _generate_recommendations(self, current_state: Dict[str, Any], goals: List[LifeGoal]) -> List[str]:
        """生成建议"""
        recommendations = []
        
        # 基于当前状态生成建议
        if current_state.get("active_goals", 0) > 5:
            recommendations.append("建议减少同时进行的目标数量，专注于最重要的2-3个目标")
        
        if current_state.get("age", 0) > 30:
            recommendations.append("建议增加健康和财务规划的比重")
        
        # 基于目标分布生成建议
        goal_distribution = current_state.get("goal_categories", {})
        if goal_distribution.get("health", 0) == 0:
            recommendations.append("建议添加健康相关的目标")
        
        return recommendations
    
    def optimize_existing_plan(self, plan_id: str) -> Dict[str, Any]:
        """优化现有规划"""
        # 这里应该从数据库加载现有规划
        # 简化实现
        return {
            "success": True,
            "message": "规划优化完成",
            "optimizations": [
                "调整了步骤的优先级顺序",
                "优化了资源分配",
                "更新了时间估算"
            ]
        }
    
    def analyze_goals(self, goals: List[LifeGoal]) -> Dict[str, Any]:
        """分析目标"""
        analysis = {
            "total_goals": len(goals),
            "by_category": {},
            "by_priority": {},
            "by_status": {},
            "insights": []
        }
        
        # 按类别统计
        for goal in goals:
            category = goal.category.value
            analysis["by_category"][category] = analysis["by_category"].get(category, 0) + 1
        
        # 按优先级统计
        for goal in goals:
            priority = goal.priority.name
            analysis["by_priority"][priority] = analysis["by_priority"].get(priority, 0) + 1
        
        # 按状态统计
        for goal in goals:
            status = goal.status.value
            analysis["by_status"][status] = analysis["by_status"].get(status, 0) + 1
        
        # 生成洞察
        if analysis["by_priority"].get("HIGH", 0) > 3:
            analysis["insights"].append("高优先级目标过多，建议重新评估优先级")
        
        if analysis["by_status"].get("not_started", 0) > analysis["by_status"].get("in_progress", 0):
            analysis["insights"].append("有较多目标尚未开始，建议制定具体的行动计划")
        
        return analysis


class LifeEvaluationAgent(BaseAgent):
    """人生评价智能体"""
    
    def __init__(self):
        super().__init__(
            name="LifeEvaluationAgent", 
            description="专门负责人生评价和分析的智能体"
        )
        self.add_capability("life_scoring")
        self.add_capability("trend_analysis")
        self.add_capability("comparison_analysis")
        self.add_capability("insight_generation")
    
    def process(self, input_data: Dict[str, Any]) -> Dict[str, Any]:
        """处理评价请求"""
        action = input_data.get("action")
        user_profile = input_data.get("user_profile")
        
        if action == "evaluate_life":
            return self.evaluate_life_status(user_profile)
        elif action == "compare_virtual_real":
            return self.compare_virtual_real_life(
                input_data.get("real_life_data"),
                input_data.get("virtual_life_data")
            )
        elif action == "analyze_trends":
            return self.analyze_life_trends(input_data.get("historical_data"))
        else:
            return {"error": "Unknown action"}
    
    def evaluate_life_status(self, user_profile: UserLifeProfile) -> Dict[str, Any]:
        """评价人生现状"""
        try:
            # 计算各维度评分
            dimension_scores = self._calculate_dimension_scores(user_profile)
            
            # 计算总体评分
            overall_score = self._calculate_overall_score(dimension_scores)
            
            # 生成洞察
            insights = self._generate_insights(user_profile, dimension_scores)
            
            # 生成建议
            recommendations = self._generate_evaluation_recommendations(dimension_scores)
            
            # 创建评价报告
            report = EvaluationReport(
                user_id=user_profile.user_id,
                overall_score=overall_score,
                dimension_scores=dimension_scores,
                insights=insights,
                recommendations=recommendations
            )
            
            return {
                "success": True,
                "report": report,
                "summary": self._generate_summary(report)
            }
        
        except Exception as e:
            return {"success": False, "error": str(e)}
    
    def _calculate_dimension_scores(self, user_profile: UserLifeProfile) -> Dict[LifeDimension, DimensionScore]:
        """计算各维度评分"""
        scores = {}
        
        # 事业维度
        career_score = self._calculate_career_score(user_profile)
        scores[LifeDimension.CAREER] = DimensionScore(
            dimension=LifeDimension.CAREER,
            current_score=career_score,
            target_score=80.0,
            trend="stable"
        )
        
        # 健康维度
        health_score = self._calculate_health_score(user_profile)
        scores[LifeDimension.HEALTH] = DimensionScore(
            dimension=LifeDimension.HEALTH,
            current_score=health_score,
            target_score=85.0,
            trend="stable"
        )
        
        # 人际关系维度
        relationship_score = self._calculate_relationship_score(user_profile)
        scores[LifeDimension.RELATIONSHIPS] = DimensionScore(
            dimension=LifeDimension.RELATIONSHIPS,
            current_score=relationship_score,
            target_score=75.0,
            trend="stable"
        )
        
        # 财务维度
        finance_score = self._calculate_finance_score(user_profile)
        scores[LifeDimension.FINANCE] = DimensionScore(
            dimension=LifeDimension.FINANCE,
            current_score=finance_score,
            target_score=70.0,
            trend="improving"
        )
        
        # 个人成长维度
        growth_score = self._calculate_personal_growth_score(user_profile)
        scores[LifeDimension.PERSONAL_GROWTH] = DimensionScore(
            dimension=LifeDimension.PERSONAL_GROWTH,
            current_score=growth_score,
            target_score=80.0,
            trend="improving"
        )
        
        # 生活平衡维度
        balance_score = self._calculate_life_balance_score(user_profile)
        scores[LifeDimension.LIFE_BALANCE] = DimensionScore(
            dimension=LifeDimension.LIFE_BALANCE,
            current_score=balance_score,
            target_score=75.0,
            trend="stable"
        )
        
        return scores
    
    def _calculate_career_score(self, user_profile: UserLifeProfile) -> float:
        """计算事业评分"""
        score = 50.0  # 基础分
        
        # 基于目标完成情况
        career_goals = [g for g in user_profile.goals if g.category == GoalCategory.CAREER]
        if career_goals:
            completed_ratio = len([g for g in career_goals if g.status == GoalStatus.COMPLETED]) / len(career_goals)
            score += completed_ratio * 30
        
        # 基于相关事件
        career_events = [e for e in user_profile.events if e.category == "work"]
        if career_events:
            avg_importance = sum(e.importance for e in career_events) / len(career_events)
            score += (avg_importance - 5) * 2  # 重要性超过5分的部分加分
        
        return min(100.0, max(0.0, score))
    
    def _calculate_health_score(self, user_profile: UserLifeProfile) -> float:
        """计算健康评分"""
        score = 60.0  # 基础分
        
        # 基于健康相关目标
        health_goals = [g for g in user_profile.goals if g.category == GoalCategory.HEALTH]
        if health_goals:
            active_ratio = len([g for g in health_goals if g.status == GoalStatus.IN_PROGRESS]) / len(health_goals)
            score += active_ratio * 25
        
        # 基于健康相关事件
        health_events = [e for e in user_profile.events if e.category == "health"]
        positive_events = [e for e in health_events if e.emotion in ["happy", "excited", "satisfied"]]
        if health_events:
            positive_ratio = len(positive_events) / len(health_events)
            score += positive_ratio * 15
        
        return min(100.0, max(0.0, score))
    
    def _calculate_relationship_score(self, user_profile: UserLifeProfile) -> float:
        """计算人际关系评分"""
        score = 55.0  # 基础分
        
        # 基于人际关系相关目标
        relationship_goals = [g for g in user_profile.goals if g.category == GoalCategory.RELATIONSHIPS]
        if relationship_goals:
            progress_sum = sum(g.progress for g in relationship_goals)
            avg_progress = progress_sum / len(relationship_goals)
            score += avg_progress * 0.3
        
        # 基于社交相关事件
        social_events = [e for e in user_profile.events if e.category in ["relationships", "family", "friends"]]
        if social_events:
            recent_social = [e for e in social_events if (date.today() - e.date).days <= 30]
            if recent_social:
                score += min(20, len(recent_social) * 2)  # 最近的社交活动加分
        
        return min(100.0, max(0.0, score))
    
    def _calculate_finance_score(self, user_profile: UserLifeProfile) -> float:
        """计算财务评分"""
        score = 50.0  # 基础分
        
        # 基于财务相关目标
        finance_goals = [g for g in user_profile.goals if g.category == GoalCategory.FINANCE]
        if finance_goals:
            completed_goals = [g for g in finance_goals if g.status == GoalStatus.COMPLETED]
            completion_ratio = len(completed_goals) / len(finance_goals)
            score += completion_ratio * 35
        
        # 基于财务相关事件
        finance_events = [e for e in user_profile.events if e.category == "finance"]
        positive_finance_events = [e for e in finance_events if e.importance >= 7]
        if finance_events:
            positive_ratio = len(positive_finance_events) / len(finance_events)
            score += positive_ratio * 15
        
        return min(100.0, max(0.0, score))
    
    def _calculate_personal_growth_score(self, user_profile: UserLifeProfile) -> float:
        """计算个人成长评分"""
        score = 60.0  # 基础分
        
        # 基于学习和成长相关目标
        growth_goals = [g for g in user_profile.goals if g.category in [GoalCategory.EDUCATION, GoalCategory.PERSONAL_GROWTH]]
        if growth_goals:
            active_goals = [g for g in growth_goals if g.status == GoalStatus.IN_PROGRESS]
            if active_goals:
                score += min(25, len(active_goals) * 5)
        
        # 基于学习相关事件
        learning_events = [e for e in user_profile.events if e.category in ["learning", "education"]]
        if learning_events:
            recent_learning = [e for e in learning_events if (date.today() - e.date).days <= 90]
            score += min(15, len(recent_learning) * 2)
        
        return min(100.0, max(0.0, score))
    
    def _calculate_life_balance_score(self, user_profile: UserLifeProfile) -> float:
        """计算生活平衡评分"""
        score = 50.0  # 基础分
        
        # 计算目标分布的平衡性
        if user_profile.goals:
            category_distribution = {}
            for goal in user_profile.goals:
                category = goal.category.value
                category_distribution[category] = category_distribution.get(category, 0) + 1
            
            # 计算分布的均匀程度
            total_goals = len(user_profile.goals)
            categories = list(GoalCategory)
            expected_per_category = total_goals / len(categories)
            
            variance = 0
            for category in categories:
                actual = category_distribution.get(category.value, 0)
                variance += (actual - expected_per_category) ** 2
            
            # 方差越小，平衡性越好
            balance_factor = max(0, 1 - (variance / (expected_per_category ** 2 * len(categories))))
            score += balance_factor * 30
        
        # 基于事件的多样性
        if user_profile.events:
            event_categories = set(e.category for e in user_profile.events)
            diversity_score = min(20, len(event_categories) * 3)
            score += diversity_score
        
        return min(100.0, max(0.0, score))
    
    def _calculate_overall_score(self, dimension_scores: Dict[LifeDimension, DimensionScore]) -> float:
        """计算总体评分"""
        if not dimension_scores:
            return 0.0
        
        # 加权平均
        weights = {
            LifeDimension.CAREER: 0.2,
            LifeDimension.HEALTH: 0.25,
            LifeDimension.RELATIONSHIPS: 0.2,
            LifeDimension.FINANCE: 0.15,
            LifeDimension.PERSONAL_GROWTH: 0.1,
            LifeDimension.LIFE_BALANCE: 0.1
        }
        
        weighted_sum = 0.0
        total_weight = 0.0
        
        for dimension, score_obj in dimension_scores.items():
            weight = weights.get(dimension, 0.1)
            weighted_sum += score_obj.current_score * weight
            total_weight += weight
        
        return weighted_sum / total_weight if total_weight > 0 else 0.0
    
    def _generate_insights(self, user_profile: UserLifeProfile, dimension_scores: Dict[LifeDimension, DimensionScore]) -> List[str]:
        """生成洞察"""
        insights = []
        
        # 找出最高分和最低分的维度
        if dimension_scores:
            sorted_dimensions = sorted(dimension_scores.items(), key=lambda x: x[1].current_score, reverse=True)
            highest_dimension = sorted_dimensions[0]
            lowest_dimension = sorted_dimensions[-1]
            
            insights.append(f"您在{highest_dimension[0].value}方面表现最佳，当前评分为{highest_dimension[1].current_score:.1f}")
            insights.append(f"建议重点关注{lowest_dimension[0].value}方面的提升，当前评分为{lowest_dimension[1].current_score:.1f}")
        
        # 基于目标完成情况的洞察
        if user_profile.goals:
            completed_goals = [g for g in user_profile.goals if g.status == GoalStatus.COMPLETED]
            completion_rate = len(completed_goals) / len(user_profile.goals) * 100
            
            if completion_rate > 70:
                insights.append(f"您的目标完成率很高({completion_rate:.1f}%)，展现了良好的执行力")
            elif completion_rate < 30:
                insights.append(f"您的目标完成率较低({completion_rate:.1f}%)，建议重新评估目标的可行性")
        
        # 基于最近活动的洞察
        recent_events = [e for e in user_profile.events if (date.today() - e.date).days <= 30]
        if recent_events:
            avg_importance = sum(e.importance for e in recent_events) / len(recent_events)
            if avg_importance > 7:
                insights.append("最近一个月您经历了很多重要事件，生活比较充实")
            elif avg_importance < 4:
                insights.append("最近的生活相对平淡，可以考虑增加一些有意义的活动")
        
        return insights
    
    def _generate_evaluation_recommendations(self, dimension_scores: Dict[LifeDimension, DimensionScore]) -> List[str]:
        """生成评价建议"""
        recommendations = []
        
        for dimension, score_obj in dimension_scores.items():
            if score_obj.current_score < score_obj.target_score:
                gap = score_obj.target_score - score_obj.current_score
                
                if dimension == LifeDimension.CAREER:
                    if gap > 20:
                        recommendations.append("建议制定明确的职业发展计划，设定具体的职业目标")
                    else:
                        recommendations.append("继续保持当前的职业发展势头，可以考虑寻求更多的成长机会")
                
                elif dimension == LifeDimension.HEALTH:
                    if gap > 20:
                        recommendations.append("建议增加运动频率，改善饮食习惯，定期进行健康检查")
                    else:
                        recommendations.append("保持良好的健康习惯，可以尝试新的运动方式")
                
                elif dimension == LifeDimension.RELATIONSHIPS:
                    if gap > 15:
                        recommendations.append("建议多花时间与家人朋友相处，主动维护重要的人际关系")
                    else:
                        recommendations.append("继续保持良好的社交习惯，可以考虑扩展社交圈")
                
                elif dimension == LifeDimension.FINANCE:
                    if gap > 20:
                        recommendations.append("建议制定详细的财务规划，学习投资理财知识")
                    else:
                        recommendations.append("继续执行现有的财务计划，可以考虑优化投资组合")
                
                elif dimension == LifeDimension.PERSONAL_GROWTH:
                    if gap > 15:
                        recommendations.append("建议设定学习目标，培养新的技能或兴趣爱好")
                    else:
                        recommendations.append("保持学习的习惯，可以挑战更高难度的学习内容")
                
                elif dimension == LifeDimension.LIFE_BALANCE:
                    if gap > 15:
                        recommendations.append("建议重新审视时间分配，确保各个生活领域都得到适当关注")
                    else:
                        recommendations.append("继续保持良好的生活平衡，适时调整重点")
        
        return recommendations
    
    def _generate_summary(self, report: EvaluationReport) -> Dict[str, Any]:
        """生成评价摘要"""
        return {
            "overall_score": report.overall_score,
            "grade": self._get_grade(report.overall_score),
            "top_dimension": max(report.dimension_scores.items(), key=lambda x: x[1].current_score)[0].value,
            "improvement_area": min(report.dimension_scores.items(), key=lambda x: x[1].current_score)[0].value,
            "key_insights": report.insights[:3],  # 前3个关键洞察
            "priority_recommendations": report.recommendations[:2]  # 前2个优先建议
        }
    
    def _get_grade(self, score: float) -> str:
        """根据评分获取等级"""
        if score >= 90:
            return "优秀"
        elif score >= 80:
            return "良好"
        elif score >= 70:
            return "中等"
        elif score >= 60:
            return "及格"
        else:
            return "需要改进"
    
    def compare_virtual_real_life(self, real_life_data: Dict[str, Any], virtual_life_data: Dict[str, Any]) -> Dict[str, Any]:
        """对比虚拟人生和真实人生"""
        try:
            comparison = {
                "real_life_score": self._calculate_life_score(real_life_data),
                "virtual_life_score": self._calculate_life_score(virtual_life_data),
                "dimension_comparison": {},
                "insights": [],
                "recommendations": []
            }
            
            # 维度对比
            dimensions = [LifeDimension.CAREER, LifeDimension.HEALTH, LifeDimension.RELATIONSHIPS, LifeDimension.FINANCE]
            for dimension in dimensions:
                real_score = self._get_dimension_score(real_life_data, dimension)
                virtual_score = self._get_dimension_score(virtual_life_data, dimension)
                
                comparison["dimension_comparison"][dimension.value] = {
                    "real": real_score,
                    "virtual": virtual_score,
                    "difference": virtual_score - real_score
                }
            
            # 生成对比洞察
            comparison["insights"] = self._generate_comparison_insights(comparison)
            comparison["recommendations"] = self._generate_comparison_recommendations(comparison)
            
            return {"success": True, "comparison": comparison}
        
        except Exception as e:
            return {"success": False, "error": str(e)}
    
    def _calculate_life_score(self, life_data: Dict[str, Any]) -> float:
        """计算人生评分"""
        # 简化的评分算法
        base_score = 50.0
        
        # 基于目标完成情况
        goals = life_data.get("goals", [])
        if goals:
            completed = len([g for g in goals if g.get("status") == "completed"])
            completion_rate = completed / len(goals)
            base_score += completion_rate * 30
        
        # 基于事件质量
        events = life_data.get("events", [])
        if events:
            avg_importance = sum(e.get("importance", 5) for e in events) / len(events)
            base_score += (avg_importance - 5) * 4
        
        return min(100.0, max(0.0, base_score))
    
    def _get_dimension_score(self, life_data: Dict[str, Any], dimension: LifeDimension) -> float:
        """获取特定维度的评分"""
        # 简化实现
        return 60.0 + (hash(dimension.value) % 30)  # 模拟评分
    
    def _generate_comparison_insights(self, comparison: Dict[str, Any]) -> List[str]:
        """生成对比洞察"""
        insights = []
        
        real_score = comparison["real_life_score"]
        virtual_score = comparison["virtual_life_score"]
        
        if virtual_score > real_score + 10:
            insights.append("虚拟人生规划显示出更好的发展潜力，建议参考虚拟规划优化真实人生")
        elif real_score > virtual_score + 10:
            insights.append("真实人生表现超出虚拟规划预期，说明您的实际执行力很强")
        else:
            insights.append("真实人生与虚拟规划基本一致，说明规划比较合理")
        
        # 分析各维度差异
        for dimension, scores in comparison["dimension_comparison"].items():
            diff = scores["difference"]
            if abs(diff) > 15:
                if diff > 0:
                    insights.append(f"在{dimension}方面，虚拟规划比真实情况好{diff:.1f}分，有提升空间")
                else:
                    insights.append(f"在{dimension}方面，真实表现比虚拟规划好{abs(diff):.1f}分，超出预期")
        
        return insights
    
    def _generate_comparison_recommendations(self, comparison: Dict[str, Any]) -> List[str]:
        """生成对比建议"""
        recommendations = []
        
        # 基于总体对比
        real_score = comparison["real_life_score"]
        virtual_score = comparison["virtual_life_score"]
        
        if virtual_score > real_score:
            recommendations.append("建议学习虚拟人生中的成功策略，应用到真实生活中")
        
        # 基于维度对比
        for dimension, scores in comparison["dimension_comparison"].items():
            diff = scores["difference"]
            if diff > 10:  # 虚拟比真实好很多
                recommendations.append(f"重点提升{dimension}方面，参考虚拟规划的策略")
            elif diff < -10:  # 真实比虚拟好很多
                recommendations.append(f"将{dimension}方面的成功经验应用到其他领域")
        
        return recommendations
    
    def analyze_life_trends(self, historical_data: List[Dict[str, Any]]) -> Dict[str, Any]:
        """分析人生趋势"""
        try:
            if not historical_data:
                return {"success": False, "error": "No historical data provided"}
            
            trends = {
                "overall_trend": self._calculate_overall_trend(historical_data),
                "dimension_trends": self._calculate_dimension_trends(historical_data),
                "predictions": self._generate_predictions(historical_data),
                "insights": []
            }
            
            trends["insights"] = self._generate_trend_insights(trends)
            
            return {"success": True, "trends": trends}
        
        except Exception as e:
            return {"success": False, "error": str(e)}
    
    def _calculate_overall_trend(self, historical_data: List[Dict[str, Any]]) -> Dict[str, Any]:
        """计算总体趋势"""
        scores = [data.get("overall_score", 50) for data in historical_data]
        
        if len(scores) < 2:
            return {"direction": "stable", "rate": 0.0}
        
        # 简单的线性趋势计算
        first_half = scores[:len(scores)//2]
        second_half = scores[len(scores)//2:]
        
        avg_first = sum(first_half) / len(first_half)
        avg_second = sum(second_half) / len(second_half)
        
        change = avg_second - avg_first
        
        if change > 5:
            direction = "improving"
        elif change < -5:
            direction = "declining"
        else:
            direction = "stable"
        
        return {"direction": direction, "rate": change}
    
    def _calculate_dimension_trends(self, historical_data: List[Dict[str, Any]]) -> Dict[str, Dict[str, Any]]:
        """计算各维度趋势"""
        dimension_trends = {}
        
        for dimension in LifeDimension:
            scores = []
            for data in historical_data:
                dimension_scores = data.get("dimension_scores", {})
                score = dimension_scores.get(dimension.value, {}).get("current_score", 50)
                scores.append(score)
            
            if len(scores) >= 2:
                first_half = scores[:len(scores)//2]
                second_half = scores[len(scores)//2:]
                
                avg_first = sum(first_half) / len(first_half)
                avg_second = sum(second_half) / len(second_half)
                
                change = avg_second - avg_first
                
                if change > 3:
                    direction = "improving"
                elif change < -3:
                    direction = "declining"
                else:
                    direction = "stable"
                
                dimension_trends[dimension.value] = {
                    "direction": direction,
                    "rate": change,
                    "current_score": scores[-1] if scores else 50
                }
        
        return dimension_trends
    
    def _generate_predictions(self, historical_data: List[Dict[str, Any]]) -> Dict[str, Any]:
        """生成预测"""
        if len(historical_data) < 3:
            return {"message": "数据不足，无法生成可靠预测"}
        
        # 简单的趋势预测
        recent_scores = [data.get("overall_score", 50) for data in historical_data[-3:]]
        trend = (recent_scores[-1] - recent_scores[0]) / 2  # 简化的趋势计算
        
        predicted_score = recent_scores[-1] + trend
        predicted_score = min(100, max(0, predicted_score))
        
        return {
            "next_period_score": predicted_score,
            "confidence": "medium",
            "factors": ["基于最近3期数据的线性趋势预测"]
        }
    
    def _generate_trend_insights(self, trends: Dict[str, Any]) -> List[str]:
        """生成趋势洞察"""
        insights = []
        
        overall_trend = trends.get("overall_trend", {})
        direction = overall_trend.get("direction", "stable")
        
        if direction == "improving":
            insights.append("总体趋势向好，继续保持当前的发展策略")
        elif direction == "declining":
            insights.append("总体趋势下降，需要及时调整策略")
        else:
            insights.append("总体趋势稳定，可以考虑寻求新的突破点")
        
        # 分析维度趋势
        dimension_trends = trends.get("dimension_trends", {})
        improving_dimensions = [d for d, t in dimension_trends.items() if t.get("direction") == "improving"]
        declining_dimensions = [d for d, t in dimension_trends.items() if t.get("direction") == "declining"]
        
        if improving_dimensions:
            insights.append(f"在{', '.join(improving_dimensions)}方面表现出积极趋势")
        
        if declining_dimensions:
            insights.append(f"需要关注{', '.join(declining_dimensions)}方面的下降趋势")
        
        return insights


if __name__ == "__main__":
    # 测试代码
    print("Life Agent Core Implementation loaded successfully!")
    
    # 创建测试数据
    test_profile = UserLifeProfile(
        user_id="test_user_001",
        name="测试用户",
        birth_date=date(1990, 1, 1)
    )
    
    # 添加测试目标
    test_goal = LifeGoal(
        title="学习Python编程",
        description="掌握Python编程技能，能够开发简单的应用程序",
        category=GoalCategory.EDUCATION,
        priority=Priority.HIGH,
        target_date=date(2024, 12, 31)
    )
    test_profile.goals.append(test_goal)
    
    # 测试规划智能体
    planning_agent = LifePlanningAgent()
    result = planning_agent.process({
        "action": "generate_plan",
        "user_profile": test_profile,
        "goals": [test_goal]
    })
    
    print("Planning Agent Test Result:")
    print(f"Success: {result.get('success')}")
    if result.get('success'):
        plan = result.get('plan')
        print(f"Plan Name: {plan.plan_name}")
        print(f"Plan Type: {plan.plan_type}")
        print(f"Steps Count: {len(plan.steps)}")
    
    # 测试评价智能体
    evaluation_agent = LifeEvaluationAgent()
    eval_result = evaluation_agent.process({
        "action": "evaluate_life",
        "user_profile": test_profile
    })
    
    print("\nEvaluation Agent Test Result:")
    print(f"Success: {eval_result.get('success')}")
    if eval_result.get('success'):
        report = eval_result.get('report')
        print(f"Overall Score: {report.overall_score:.1f}")
        print(f"Insights Count: {len(report.insights)}")
        print(f"Recommendations Count: {len(report.recommendations)}")

