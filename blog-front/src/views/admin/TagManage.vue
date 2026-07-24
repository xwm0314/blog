<template>
  <div class="tag-manage-page">
    <div class="page-header">
      <h2 class="page-title">标签管理</h2>
      <el-button type="primary" @click="addTag">
        <el-icon><Plus /></el-icon>新建标签
      </el-button>
    </div>
    <el-table :data="tags" stripe style="width: 100%">
      <el-table-column prop="name" label="标签名" />
      <el-table-column prop="color" label="颜色" width="100">
        <template #default="{ row }">
          <span class="color-dot" :style="{ backgroundColor: row.color }"></span>
        </template>
      </el-table-column>
      <el-table-column prop="description" label="描述" min-width="200" />
      <el-table-column prop="createdAt" label="创建时间" width="180" />
      <el-table-column label="操作" width="150">
        <template #default="{ row }">
          <el-button size="small" @click="editTag(row)">编辑</el-button>
          <el-button size="small" type="danger" @click="deleteTag(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="showAddDialog" :title="isEdit ? '编辑标签' : '新建标签'" width="400px">
      <el-form :model="tagForm" label-width="80px">
        <el-form-item label="标签名">
          <el-input v-model="tagForm.name" placeholder="请输入标签名" />
        </el-form-item>
        <el-form-item label="颜色">
          <el-color-picker v-model="tagForm.color" show-alpha />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="tagForm.description" type="textarea" :rows="2" placeholder="标签描述" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showAddDialog = false">取消</el-button>
        <el-button type="primary" @click="saveTag">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getTagList, createTag, updateTag, deleteTag as deleteTagApi } from '@/api/tag'

const tags = ref([])
const showAddDialog = ref(false)
const isEdit = ref(false)
const editId = ref('')
const tagForm = ref({
  name: '',
  color: '#d4839a',
  description: ''
})

async function loadTags() {
  try {
    const res = await getTagList()
    tags.value = res.data.list || []
  } catch (e) {
    console.error('获取标签列表失败', e)
  }
}

onMounted(() => {
  loadTags()
})

function addTag() {
  isEdit.value = false
  editId.value = ''
  tagForm.value = {
    name: '',
    color: '#d4839a',
    description: ''
  }
  showAddDialog.value = true
}

function editTag(row) {
  isEdit.value = true
  editId.value = row._id
  tagForm.value = {
    name: row.name,
    color: row.color,
    description: row.description
  }
  showAddDialog.value = true
}

async function saveTag() {
  try {
    if (isEdit.value) {
      await updateTag(editId.value, tagForm.value)
      ElMessage.success('标签更新成功')
    } else {
      await createTag(tagForm.value)
      ElMessage.success('标签创建成功')
    }
    showAddDialog.value = false
    loadTags()
  } catch (e) {
    ElMessage.error(isEdit.value ? '更新失败' : '创建失败')
  }
}

async function deleteTag(row) {
  try {
    await ElMessageBox.confirm('确认删除该标签？', '提示', { type: 'warning' })
    await deleteTagApi(row._id)
    ElMessage.success('删除成功')
    loadTags()
  } catch (err) {
    if (err !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}
</script>

<style lang="scss" scoped>
.tag-manage-page {
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

.color-dot {
  display: inline-block;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 1px solid rgba(0,0,0,0.1);
}
</style>