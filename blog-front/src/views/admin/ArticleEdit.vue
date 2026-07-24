<template>
  <div class="article-edit-page">
    <h2 class="page-title">{{ isEdit ? '编辑文章' : '新建文章' }}</h2>
    <el-form :model="form" label-width="80px">
      <el-form-item label="标题">
        <el-input v-model="form.title" placeholder="请输入文章标题" />
      </el-form-item>
      <el-form-item label="分类">
        <el-select v-model="form.category" placeholder="选择分类" style="width: 200px">
          <el-option label="随笔" value="随笔" />
          <el-option label="学习" value="学习" />
          <el-option label="技术" value="技术" />
          <el-option label="生活" value="生活" />
          <el-option label="其他" value="其他" />
        </el-select>
      </el-form-item>
      <el-form-item label="标签">
        <el-select
          v-model="form.tags"
          multiple
          filterable
          allow-create
          default-first-option
          placeholder="选择或输入标签"
          style="width: 100%"
        >
          <el-option v-for="tag in tagOptions" :key="tag._id" :label="tag.name" :value="tag._id" />
        </el-select>
      </el-form-item>
      <el-form-item label="状态">
        <el-radio-group v-model="form.status">
          <el-radio value="draft">草稿</el-radio>
          <el-radio value="published">发布</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="置顶">
        <el-switch v-model="form.isTop" />
      </el-form-item>
      <el-form-item label="摘要">
        <el-input v-model="form.excerpt" type="textarea" :rows="3" placeholder="文章摘要（可选）" />
      </el-form-item>
      <el-form-item label="内容">
        <!-- TODO: 接入 Markdown 编辑器 -->
        <el-input v-model="form.content" type="textarea" :rows="20" placeholder="文章内容（Markdown 格式）" />
      </el-form-item>
      <el-form-item label="封面图">
        <el-upload
          action="/api/upload"
          :headers="{ Authorization: 'Bearer ' + getToken() }"
          list-type="picture-card"
          :on-success="handleUploadSuccess"
          :limit="1"
          :show-file-list="false"
        >
          <img v-if="form.cover" :src="form.cover" class="cover-preview" />
          <el-icon v-else><Plus /></el-icon>
        </el-upload>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="saveArticle">保存</el-button>
        <el-button @click="$router.back()">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { getTagList } from '@/api/tag'
import { createArticle, updateArticle, getArticleDetail, getAllArticles } from '@/api/article'
import { getToken } from '@/utils/auth'

const route = useRoute()
const router = useRouter()

const isEdit = computed(() => !!route.params.id)
const tagOptions = ref([])

const form = ref({
  title: '',
  tags: [],
  category: '其他',
  status: 'draft',
  excerpt: '',
  content: '',
  cover: '',
  isTop: false
})

async function loadTags() {
  try {
    const res = await getTagList()
    tagOptions.value = res.data?.list || []
  } catch (e) {
    console.error('加载标签列表失败:', e)
  }
}

async function loadArticle() {
  if (!isEdit.value) return
  try {
    const res = await getAllArticles({ page: 1, limit: 100 })
    const list = res.data?.list || []
    const article = list.find(a => a._id === route.params.id)
    if (article) {
      form.value = {
        title: article.title || '',
        tags: article.tags || [],
        category: article.category || '其他',
        status: article.status || 'draft',
        excerpt: article.excerpt || '',
        content: article.content || '',
        cover: article.cover || '',
        isTop: article.isTop || false
      }
    }
  } catch (e) {
    console.error('加载文章失败:', e)
  }
}

onMounted(async () => {
  await loadTags()
  if (isEdit.value) {
    await loadArticle()
  }
})

function handleUploadSuccess(res) {
  form.value.cover = res.data?.url || ''
}

async function saveArticle() {
  if (!form.value.title.trim()) {
    ElMessage.warning('请输入文章标题')
    return
  }
  try {
    if (isEdit.value) {
      await updateArticle(route.params.id, form.value)
      ElMessage.success('更新成功')
    } else {
      await createArticle(form.value)
      ElMessage.success('创建成功')
    }
    router.push('/admin/articles')
  } catch (e) {
    ElMessage.error('保存失败')
  }
}
</script>

<style lang="scss" scoped>
.article-edit-page {
  padding: $spacing-lg;
  max-width: 900px;
}

.page-title {
  font-size: $font-size-xl;
  color: $color-text;
  margin-bottom: $spacing-lg;
}

.cover-preview {
  width: 148px;
  height: 148px;
  object-fit: cover;
  border-radius: $radius-md;
}
</style>
