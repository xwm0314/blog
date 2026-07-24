<template>
  <div class="article-manage-page">
    <div class="page-header">
      <h2 class="page-title">文章管理</h2>
      <el-button type="primary" @click="$router.push('/admin/articles/create')">
        <el-icon><Plus /></el-icon>新建文章
      </el-button>
    </div>
    <el-table :data="articles" stripe style="width: 100%">
      <el-table-column prop="title" label="标题" min-width="200" />
      <el-table-column prop="category" label="分类" width="100" />
      <el-table-column prop="tags" label="标签" min-width="120">
        <template #default="{ row }">
          <el-tag v-for="tag in row.tags" :key="tag" size="small">{{ tag }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="views" label="浏览量" width="100" />
      <el-table-column prop="status" label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="row.status === 'published' ? 'success' : 'info'" size="small">
            {{ row.status === 'published' ? '已发布' : '草稿' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createdAt" label="创建时间" width="180" />
      <el-table-column label="操作" width="200">
        <template #default="{ row }">
          <el-button size="small" @click="editArticle(row)">编辑</el-button>
          <el-button size="small" type="danger" @click="deleteArticle(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { getAllArticles, deleteArticle as deleteArticleApi } from '@/api/article'

const router = useRouter()
const articles = ref([])

onMounted(async () => {
  try {
    const res = await getAllArticles({ page: 1, pageSize: 999 })
    articles.value = res.data.articles || res.data.list || []
  } catch (e) {
    console.error('获取文章列表失败:', e)
  }
})

function editArticle(row) {
  router.push(`/admin/articles/${row._id}/edit`)
}

async function deleteArticle(row) {
  try {
    await ElMessageBox.confirm('确认删除该文章？', '提示', { type: 'warning' })
    await deleteArticleApi(row._id)
    ElMessage.success('删除成功')
    articles.value = articles.value.filter(a => a._id !== row._id)
  } catch (e) {
    if (e !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}
</script>

<style lang="scss" scoped>
.article-manage-page {
  padding: $spacing-lg;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: $spacing-lg;
}

.page-title {
  font-size: $font-size-xl;
  color: $color-text;
}
</style>
