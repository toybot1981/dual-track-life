<template>
  <div class="life-agent-page">
    <div class="header">
      <div class="container">
        <div class="nav">
          <router-link to="/dashboard" class="back-btn">
            ← 返回仪表板
          </router-link>
          <h1>Life Agent</h1>
        </div>
      </div>
    </div>
    
    <div class="main-content">
      <div class="container">
        <div class="chat-container">
          <LifeAgentChat />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import LifeAgentChat from '@/components/LifeAgentChat.vue'
</script>

<style scoped>
.life-agent-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.header {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  padding: 1rem 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.nav {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.back-btn {
  color: white;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.1);
  transition: background 0.2s;
}

.back-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.nav h1 {
  color: white;
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
}

.main-content {
  padding: 2rem 0;
}

.chat-container {
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  height: 80vh;
}
</style>

