<template>
  <el-container style="height: 100vh;">
    <el-aside v-if="$route.path !== '/login' && $route.path !== '/404'" width="220px">
      <!-- 侧边栏Logo区域 -->
      <div class="logo-box">
        <img :src="logoImg" alt="logo" class="logo">
        <span class="title">资产管理系统</span>
      </div>
      <el-menu router :default-active="$route.path" background-color="#304156" text-color="#fff">
        <el-menu-item index="/dashboard">
          <template #title><home-filled />仪表盘</template>
        </el-menu-item>
        <el-sub-menu index="asset">
          <template #title><box />资产管理</template>
          <el-menu-item index="/asset/list">资产列表</el-menu-item>
          <el-menu-item index="/asset/edit">新增资产</el-menu-item>
        </el-sub-menu>
        <el-menu-item index="/category/list">
          <template #title><folder />分类管理</template>
        </el-menu-item>
        <el-menu-item index="/user/profile">
          <template #title><user />个人中心</template>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header v-if="$route.path !== '/login' && $route.path !== '/404'" style="background:#fff;padding:0 20px;display:flex;justify-content:space-between;align-items:center;">
        <h3>校园资产管理后台</h3>
        <el-button @click="handleLogout" text>退出登录</el-button>
      </el-header>
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { useUserStore } from './stores/user'
import { useRouter } from 'vue-router'
// 导入logo图片
import logoImg from '@/assets/images/logo.png'
const userStore = useUserStore()
const router = useRouter()
const handleLogout = () => {
  userStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.logo-box {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #263445;
  gap: 8px;
}
.logo {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover; /* 方形白底图裁剪为圆形，贴合图案且不露白边 */
}
.title {
  color: #fff;
  font-size: 16px;
}
</style>
