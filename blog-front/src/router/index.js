import { createRouter, createWebHistory } from 'vue-router'
import { getToken, removeToken, isTokenValidated, setTokenValidated } from '@/utils/auth'
import { getAdminInfo } from '@/api/auth'
import { useUserStore } from '@/stores/user'

// 路由配置
const routes = [
  // ======== 前台免登录页面 ========
  {
    path: '/',
    component: () => import('@/layouts/GuestLayout.vue'),
    children: [
      {
        path: '',
        name: 'Home',
        component: () => import('@/views/guest/Home.vue'),
        meta: { title: '首页' }
      },
      {
        path: 'articles',
        name: 'ArticleList',
        component: () => import('@/views/guest/ArticleList.vue'),
        meta: { title: '文章列表' }
      },
      {
        path: 'articles/:id',
        name: 'ArticleDetail',
        component: () => import('@/views/guest/ArticleDetail.vue'),
        meta: { title: '文章详情' }
      },
      {
        path: 'dynamics/:id',
        name: 'DynamicDetail',
        component: () => import('@/views/guest/DynamicDetail.vue'),
        meta: { title: '动态详情' }
      },
      {
        path: 'timeline',
        name: 'Timeline',
        component: () => import('@/views/guest/Timeline.vue'),
        meta: { title: '成长时间线' }
      }
    ]
  },

  // ======== 管理员后台 ========
  {
    path: '/admin',
    component: () => import('@/layouts/AdminLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'Dashboard',
        component: () => import('@/views/admin/Dashboard.vue'),
        meta: { title: '后台首页' }
      },
      {
        path: 'articles',
        name: 'ArticleManage',
        component: () => import('@/views/admin/ArticleManage.vue'),
        meta: { title: '文章管理' }
      },
      {
        path: 'articles/create',
        name: 'ArticleCreate',
        component: () => import('@/views/admin/ArticleEdit.vue'),
        meta: { title: '新建文章' }
      },
      {
        path: 'articles/:id/edit',
        name: 'ArticleEdit',
        component: () => import('@/views/admin/ArticleEdit.vue'),
        meta: { title: '编辑文章' }
      },
      {
        path: 'tags',
        name: 'TagManage',
        component: () => import('@/views/admin/TagManage.vue'),
        meta: { title: '标签管理' }
      },
      {
        path: 'dynamics',
        name: 'DynamicManage',
        component: () => import('@/views/admin/DynamicManage.vue'),
        meta: { title: '动态管理' }
      },
      {
        path: 'dynamics/create',
        name: 'DynamicCreate',
        component: () => import('@/views/admin/DynamicCreate.vue'),
        meta: { title: '发布动态' }
      },
      {
        path: 'config',
        name: 'SiteConfig',
        component: () => import('@/views/admin/SiteConfig.vue'),
        meta: { title: '站点配置' }
      }
    ]
  },

  // ======== 管理员登录（独立布局） ========
  {
    path: '/admin/login',
    name: 'AdminLogin',
    component: () => import('@/views/admin/Login.vue'),
    meta: { title: '管理员登录' }
  },

  // ======== 404 ========
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

// 路由守卫 — JWT 鉴权 + 编辑模式参数保留
router.beforeEach(async (to, from, next) => {
  const token = getToken()

  // 设置页面标题
  document.title = to.meta.title
    ? `${to.meta.title} - ${import.meta.env.VITE_APP_TITLE}`
    : import.meta.env.VITE_APP_TITLE

  // 如果访问需要登录的后台页面
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // 没有 token，直接跳登录页
    if (!token) {
      next({ name: 'AdminLogin', query: { redirect: to.fullPath } })
      return
    }

    // 有 token，但还没验证过有效性，去后端验证
    if (!isTokenValidated()) {
      try {
        const res = await getAdminInfo()
        const userStore = useUserStore()
        userStore.setUserInfo(res.data.admin)
        setTokenValidated(true)
        next()
      } catch (e) {
        // token 无效，清除并跳登录页
        removeToken()
        next({ name: 'AdminLogin', query: { redirect: to.fullPath } })
      }
      return
    }
  }

  // 已登录用户访问登录页，直接跳转后台首页
  if (to.name === 'AdminLogin' && token) {
    next({ name: 'Dashboard' })
    return
  }

  // 编辑模式持久化：URL 中有 edit=true 时存到 sessionStorage
  if (to.query.edit === 'true') {
    sessionStorage.setItem('editMode', 'true')
  }

  // 编辑模式：如果 sessionStorage 中有编辑模式标记，且目标页是前台页面，自动带上 edit 参数
  const isEditMode = sessionStorage.getItem('editMode') === 'true'
  const isGuestPage = to.path.startsWith('/') && !to.path.startsWith('/admin')
  if (isEditMode && !to.query.edit && isGuestPage) {
    next({ ...to, query: { ...to.query, edit: 'true' } })
    return
  }

  next()
})

export default router
