<template>
  <div class="admin-login">
    <div class="login-card">
      <h1 class="login-title">管理员登录</h1>
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="0"
        size="large"
        @submit.prevent="handleLogin"
      >
        <el-form-item prop="username">
          <el-input v-model="form.username" placeholder="用户名" :prefix-icon="User" />
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="form.password"
            type="password"
            placeholder="密码"
            :prefix-icon="Lock"
            show-password
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" native-type="submit" :loading="loading" class="login-btn">
            登录
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { User, Lock } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { login as loginApi } from '@/api/auth'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const formRef = ref(null)
const loading = ref(false)

const form = reactive({
  username: '',
  password: ''
})

const rules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
}

function handleLogin() {
  formRef.value?.validate(async (valid) => {
    if (!valid) return
    loading.value = true
    try {
      const res = await loginApi(form)
      userStore.login(res.data.token, res.data.admin)
      ElMessage.success('登录成功')
      const redirect = route.query.redirect || '/admin'
      router.push(redirect)
    } catch (e) {
      ElMessage.error(e.message || '登录失败')
    } finally {
      loading.value = false
    }
  })
}
</script>

<style lang="scss" scoped>
.admin-login {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: $color-bg;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -30%;
    right: -20%;
    width: 50%;
    height: 80%;
    background: radial-gradient(circle, rgba($pink-300, 0.12) 0%, transparent 70%);
    pointer-events: none;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -20%;
    left: -10%;
    width: 40%;
    height: 60%;
    background: radial-gradient(circle, rgba($pink-200, 0.1) 0%, transparent 70%);
    pointer-events: none;
  }
}

.login-card {
  position: relative;
  z-index: 1;
  width: 400px;
  padding: $spacing-2xl;
  background: $color-bg-card;
  border-radius: $radius-xl;
  box-shadow: $shadow-lg;
  border: 1px solid $warm-gray-200;
}

.login-title {
  text-align: center;
  font-size: $font-size-xl;
  font-weight: $font-weight-semibold;
  color: $pink-600;
  margin-bottom: $spacing-xl;
  letter-spacing: $tracking-tight;
}

.login-btn {
  width: 100%;
}
</style>
