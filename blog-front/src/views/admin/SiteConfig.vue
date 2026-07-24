<template>
  <div class="site-config-page">
    <h2 class="page-title">站点配置</h2>

    <el-tabs v-model="activeTab" class="config-tabs">
      <el-tab-pane label="基本信息" name="basic">
        <el-form :model="form" label-width="100px" style="max-width: 600px">
          <el-form-item label="昵称">
            <el-input v-model="form.nickname" placeholder="个人昵称" />
          </el-form-item>
          <el-form-item label="Slogan">
            <el-input v-model="form.slogan" placeholder="网站标语" />
          </el-form-item>
          <el-form-item label="头像">
            <el-upload
              action="/api/upload"
              :headers="{ Authorization: 'Bearer ' + getToken() }"
              list-type="picture-card"
              :on-success="handleAvatarSuccess"
              :limit="1"
              :show-file-list="false"
            >
              <img v-if="form.avatar" :src="form.avatar" class="avatar-preview" />
              <el-icon v-else><Plus /></el-icon>
            </el-upload>
          </el-form-item>
          <el-form-item label="个人简介">
            <el-input v-model="form.bio" type="textarea" :rows="4" placeholder="简要介绍自己" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="saveBasic">保存配置</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>

      <el-tab-pane label="左侧栏组件" name="sidebar">
        <div class="component-editor">
          <div class="available-components">
            <h3 class="section-title">可选组件</h3>
            <div class="component-library">
              <div
                v-for="comp in availableComponents"
                :key="comp.type"
                class="library-item"
                :class="{ added: isComponentAdded(comp.type) }"
                @click="addComponent(comp)"
              >
                <div class="item-icon">
                  <el-icon v-if="comp.type === 'text'" :size="24"><Document /></el-icon>
                  <el-icon v-else-if="comp.type === 'links'" :size="24"><Link /></el-icon>
                  <el-icon v-else-if="comp.type === 'tags'" :size="24"><PriceTag /></el-icon>
                  <el-icon v-else :size="24"><Minus /></el-icon>
                </div>
                <div class="item-info">
                  <span class="item-name">{{ comp.name }}</span>
                  <span class="item-desc">{{ comp.description }}</span>
                </div>
                <el-icon class="add-icon" v-if="!isComponentAdded(comp.type)"><Plus /></el-icon>
                <el-icon class="check-icon" v-else><Check /></el-icon>
              </div>
            </div>
          </div>

          <div class="selected-components">
            <h3 class="section-title">已选组件</h3>
            <div v-if="form.sidebarComponents.length === 0" class="empty-state">
              <el-icon size="48" color="#ccc"><Grid /></el-icon>
              <p>从左侧选择组件添加</p>
            </div>
            <div v-else class="component-list">
              <div v-for="(comp, index) in form.sidebarComponents" :key="comp.id" class="component-item">
                <div class="component-header">
                  <span class="component-name">{{ getComponentName(comp.type) }}</span>
                  <div class="component-actions">
                    <el-button size="small" @click="moveUp(index)" :disabled="index === 0">
                      <el-icon><ArrowUp /></el-icon>
                    </el-button>
                    <el-button size="small" @click="moveDown(index)" :disabled="index === form.sidebarComponents.length - 1">
                      <el-icon><ArrowDown /></el-icon>
                    </el-button>
                    <el-button size="small" type="warning" @click="editComponent(comp)">
                      <el-icon><EditPen /></el-icon>
                    </el-button>
                    <el-button size="small" type="danger" @click="deleteComponent(index)">
                      <el-icon><Delete /></el-icon>
                    </el-button>
                  </div>
                </div>
                <div class="component-content">
                  <p v-if="comp.title" class="comp-title">{{ comp.title }}</p>
                  <p v-if="comp.text" class="comp-text">{{ comp.text }}</p>
                  <div v-if="comp.links && comp.links.length > 0" class="comp-links">
                    <div v-for="(link, i) in comp.links" :key="i" class="link-item">
                      {{ link.name }} - {{ link.url }}
                    </div>
                  </div>
                  <div v-if="comp.items && comp.items.length > 0" class="comp-tags">
                    <span v-for="(item, i) in comp.items" :key="i" class="tag-chip">{{ item }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>

    <el-dialog v-model="showEditModal" :title="'编辑 ' + getComponentName(editingComp?.type)" width="500px">
      <el-form :model="componentForm" label-width="80px">
        <el-form-item label="标题">
          <el-input v-model="componentForm.title" placeholder="组件标题" />
        </el-form-item>
        <el-form-item label="内容" v-if="editingComp?.type === 'text'">
          <el-input v-model="componentForm.text" type="textarea" :rows="3" placeholder="文本内容" />
        </el-form-item>
        <el-form-item label="链接" v-if="editingComp?.type === 'links'">
          <div v-for="(link, index) in componentForm.links" :key="index" class="link-row">
            <el-input v-model="link.name" placeholder="链接名称" style="width: 45%" />
            <el-input v-model="link.url" placeholder="链接地址" style="width: 45%" />
            <el-button size="small" type="danger" @click="removeLink(index)" style="width: 10%">
              <el-icon><Delete /></el-icon>
            </el-button>
          </div>
          <el-button type="text" size="small" @click="addLink">+ 添加链接</el-button>
        </el-form-item>
        <el-form-item label="标签" v-if="editingComp?.type === 'tags'">
          <el-alert
            type="info"
            :closable="false"
            title="标签列表将自动获取"
            description="所有已创建的标签会自动显示在此组件中，无需手动添加。"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showEditModal = false">取消</el-button>
        <el-button type="primary" @click="saveEdit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getToken } from '@/utils/auth'
import { getSiteConfig, updateSiteConfig } from '@/api/config'

const activeTab = ref('basic')
const showEditModal = ref(false)
const editingComp = ref(null)
const tagsInput = ref('')

const form = reactive({
  nickname: '',
  slogan: '',
  avatar: '',
  bio: '',
  sidebarComponents: []
})

const componentForm = reactive({
  id: '',
  type: '',
  title: '',
  text: '',
  links: [],
  items: []
})

const availableComponents = [
  { type: 'text', name: '文本区块', description: '展示一段文本内容' },
  { type: 'links', name: '链接列表', description: '添加多个外部链接' },
  { type: 'tags', name: '标签列表', description: '展示一组标签' },
  { type: 'divider', name: '分隔线', description: '视觉分隔' }
]

function getComponentName(type) {
  const comp = availableComponents.find(c => c.type === type)
  return comp ? comp.name : type
}

function isComponentAdded(type) {
  return form.sidebarComponents.some(c => c.type === type)
}

onMounted(async () => {
  await loadConfig()
})

async function loadConfig() {
  try {
    const res = await getSiteConfig()
    const config = res.data.config || {}
    form.nickname = config.nickname || ''
    form.slogan = config.slogan || ''
    form.avatar = config.avatar || ''
    form.bio = config.bio || ''
    form.sidebarComponents = config.sidebarComponents || []
  } catch (e) {
    console.error('获取配置失败:', e)
  }
}

function handleAvatarSuccess(res) {
  if (res.code === 0) {
    form.avatar = res.data?.url || ''
    ElMessage.success('头像上传成功')
  } else {
    ElMessage.error(res.message || '上传失败')
  }
}

async function saveBasic() {
  try {
    await updateSiteConfig({
      nickname: form.nickname,
      slogan: form.slogan,
      avatar: form.avatar,
      bio: form.bio
    })
    ElMessage.success('配置已保存')
  } catch (e) {
    ElMessage.error('保存失败')
  }
}

function addComponent(comp) {
  if (isComponentAdded(comp.type)) {
    ElMessage.warning('该组件已添加')
    return
  }

  const newComp = {
    id: Date.now().toString(),
    type: comp.type,
    title: '',
    text: '',
    links: [],
    items: []
  }

  if (comp.type === 'text') {
    newComp.title = '文本区块'
    newComp.text = '请编辑内容'
  } else if (comp.type === 'links') {
    newComp.title = '友情链接'
    newComp.links = [{ name: '', url: '' }]
  } else if (comp.type === 'tags') {
    newComp.title = '标签'
  }

  form.sidebarComponents.push(newComp)
  saveComponents()
}

function editComponent(comp) {
  editingComp.value = comp
  componentForm.id = comp.id
  componentForm.type = comp.type
  componentForm.title = comp.title || ''
  componentForm.text = comp.text || ''
  componentForm.links = comp.links ? [...comp.links] : []
  componentForm.items = comp.items ? [...comp.items] : []
  tagsInput.value = componentForm.items.join(', ')
  showEditModal.value = true
}

function addLink() {
  componentForm.links.push({ name: '', url: '' })
}

function removeLink(index) {
  componentForm.links.splice(index, 1)
}

function parseTags() {
  if (tagsInput.value) {
    componentForm.items = tagsInput.value.split(/[,，]/).map(t => t.trim()).filter(t => t)
  }
}

function removeTag(index) {
  componentForm.items.splice(index, 1)
  tagsInput.value = componentForm.items.join(', ')
}

async function saveEdit() {
  const index = form.sidebarComponents.findIndex(c => c.id === componentForm.id)
  if (index !== -1) {
    form.sidebarComponents[index] = { ...componentForm }
    await saveComponents()
    ElMessage.success('修改成功')
    showEditModal.value = false
  }
}

async function deleteComponent(index) {
  ElMessage.confirm('确认删除该组件？', '提示', { type: 'warning' }).then(async () => {
    form.sidebarComponents.splice(index, 1)
    await saveComponents()
    ElMessage.success('删除成功')
  }).catch(() => {})
}

function moveUp(index) {
  if (index > 0) {
    const temp = form.sidebarComponents[index]
    form.sidebarComponents[index] = form.sidebarComponents[index - 1]
    form.sidebarComponents[index - 1] = temp
    saveComponents()
  }
}

function moveDown(index) {
  if (index < form.sidebarComponents.length - 1) {
    const temp = form.sidebarComponents[index]
    form.sidebarComponents[index] = form.sidebarComponents[index + 1]
    form.sidebarComponents[index + 1] = temp
    saveComponents()
  }
}

async function saveComponents() {
  try {
    await updateSiteConfig({ sidebarComponents: form.sidebarComponents })
  } catch (e) {
    console.error('保存组件失败:', e)
  }
}
</script>

<style lang="scss" scoped>
.site-config-page {
  padding: $spacing-lg;
}

.page-title {
  font-size: $font-size-xl;
  color: $color-text;
  margin-bottom: $spacing-lg;
}

.config-tabs {
  max-width: 900px;
}

.avatar-preview {
  width: 148px;
  height: 148px;
  object-fit: cover;
  border-radius: $radius-md;
}

.component-editor {
  display: flex;
  gap: $spacing-xl;
  margin-top: $spacing-md;
}

.available-components {
  flex: 1;
  background: $color-bg;
  border-radius: $radius-lg;
  padding: $spacing-md;
}

.selected-components {
  flex: 1;
  background: $color-bg;
  border-radius: $radius-lg;
  padding: $spacing-md;
}

.section-title {
  font-size: $font-size-base;
  font-weight: 600;
  color: $color-text;
  margin-bottom: $spacing-md;
  padding-bottom: $spacing-sm;
  border-bottom: 1px solid $color-border;
}

.component-library {
  display: flex;
  flex-direction: column;
  gap: $spacing-sm;
}

.library-item {
  display: flex;
  align-items: center;
  gap: $spacing-md;
  padding: $spacing-md;
  background: $color-white;
  border-radius: $radius-md;
  cursor: pointer;
  transition: all $transition-fast;
  border: 2px solid transparent;

  &:hover {
    border-color: $pink-200;
    background: $pink-50;
  }

  &.added {
    border-color: $pink-400;
    background: $pink-50;
  }
}

.item-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: $pink-100;
  border-radius: $radius-md;
  color: $pink-600;
}

.item-info {
  flex: 1;
}

.item-name {
  display: block;
  font-size: $font-size-base;
  font-weight: 600;
  color: $color-text;
}

.item-desc {
  display: block;
  font-size: $font-size-xs;
  color: $color-text-secondary;
  margin-top: 2px;
}

.add-icon {
  color: $pink-500;
  font-size: 20px;
}

.check-icon {
  color: #67c23a;
  font-size: 20px;
}

.empty-state {
  text-align: center;
  padding: $spacing-2xl;
  color: $color-text-secondary;

  p {
    margin-top: $spacing-sm;
  }
}

.component-list {
  display: flex;
  flex-direction: column;
  gap: $spacing-md;
}

.component-item {
  background: $color-white;
  padding: $spacing-md;
  border-radius: $radius-lg;
  box-shadow: $shadow-sm;
}

.component-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: $spacing-sm;
  padding-bottom: $spacing-sm;
  border-bottom: 1px solid $color-border;
}

.component-name {
  font-size: $font-size-sm;
  color: $pink-500;
  font-weight: 600;
}

.component-content {
  padding: 0 $spacing-sm;
}

.comp-title {
  font-size: $font-size-base;
  font-weight: 600;
  color: $color-text;
  margin-bottom: $spacing-xs;
}

.comp-text {
  font-size: $font-size-sm;
  color: $color-text-secondary;
  line-height: 1.6;
}

.comp-links {
  display: flex;
  flex-direction: column;
  gap: $spacing-xs;
}

.link-item {
  font-size: $font-size-sm;
  color: $color-text-secondary;
}

.comp-tags {
  display: flex;
  flex-wrap: wrap;
  gap: $spacing-xs;
}

.tag-chip {
  padding: 4px 10px;
  background: $pink-50;
  color: $pink-600;
  border-radius: $radius-md;
  font-size: $font-size-sm;
}

.link-row {
  display: flex;
  gap: $spacing-xs;
  margin-bottom: $spacing-xs;
}

.tags-preview {
  display: flex;
  flex-wrap: wrap;
  gap: $spacing-xs;
  margin-top: $spacing-sm;
}

.tag-item {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  background: $pink-50;
  color: $pink-600;
  border-radius: $radius-md;
  font-size: $font-size-sm;
}

.tag-close {
  cursor: pointer;
}
</style>