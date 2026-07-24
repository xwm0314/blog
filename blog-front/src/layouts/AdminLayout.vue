<template>
  <div class="admin-layout">
    <el-aside :width="isCollapse ? '64px' : '240px'" class="admin-sidebar">
      <div class="sidebar-header">
        <span v-show="!isCollapse" class="sidebar-title">后台管理</span>
      </div>
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :router="true"
        background-color="#221f1e"
        text-color="rgba(255,255,255,0.7)"
        active-text-color="#eaa6b8"
      >
        <el-menu-item index="/admin">
          <el-icon><DataAnalysis /></el-icon>
          <span>仪表盘</span>
        </el-menu-item>
        <el-menu-item index="/admin/articles">
          <el-icon><Document /></el-icon>
          <span>文章管理</span>
        </el-menu-item>
        <el-menu-item index="/admin/tags">
          <el-icon><PriceTag /></el-icon>
          <span>标签管理</span>
        </el-menu-item>
        <el-menu-item index="/admin/dynamics">
          <el-icon><Message /></el-icon>
          <span>动态管理</span>
        </el-menu-item>
        <el-menu-item index="/admin/config">
          <el-icon><Setting /></el-icon>
          <span>站点配置</span>
        </el-menu-item>
      </el-menu>
      <div class="sidebar-footer">
        <div class="preview-btn" @click="handlePreview">
          <el-icon><View /></el-icon>
          <span v-show="!isCollapse">预览前台</span>
        </div>
      </div>
    </el-aside>

    <el-container>
      <el-header class="admin-header">
        <div class="header-left">
          <el-button @click="isCollapse = !isCollapse" text>
            <el-icon><Fold /></el-icon>
          </el-button>
        </div>
        <div class="header-right">
          <el-dropdown @command="handleCommand">
            <span class="user-info">
              {{ userStore.userInfo?.username || '管理员' }}
              <el-icon><ArrowDown /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="logout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>

      <el-main class="admin-main">
        <router-view />
      </el-main>
    </el-container>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const isCollapse = ref(false)

const activeMenu = computed(() => route.path)

function handleCommand(command) {
  if (command === 'logout') {
    userStore.logout()
    router.push('/admin/login')
  }
}

function handlePreview() {
  window.open('/?edit=true', '_blank')
}
</script>

<style lang="scss" scoped>
.admin-layout {
  display: flex;
  min-height: 100vh;
}

.admin-sidebar {
  background-color: $warm-gray-900;
  transition: width 0.3s ease;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: 100vh;
  
  .el-menu {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    border-right: none;
  }
}

.sidebar-footer {
  padding: 12px;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  flex-shrink: 0;
}

.preview-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  height: 50px;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.2s ease;
  font-size: 14px;

  &:hover {
    background-color: rgba(255, 255, 255, 0.08);
    color: #eaa6b8;
  }

  .el-icon {
    font-size: 18px;
  }
}

.sidebar-header {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 16px;
  font-weight: $font-weight-semibold;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.admin-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: $color-bg-card;
  border-bottom: 1px solid $warm-gray-200;
  padding: 0 20px;
  height: 60px;
}

.header-left,
.header-right {
  display: flex;
  align-items: center;
}

.user-info {
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  color: $color-text;
  font-size: 14px;
}

.admin-main {
  background: $color-bg;
  min-height: calc(100vh - 60px);
}
</style>
