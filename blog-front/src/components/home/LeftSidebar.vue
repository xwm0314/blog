<template>
  <aside class="left-sidebar" :class="{ 'edit-mode': isEditMode }">
    <div v-if="isEditMode" class="edit-badge">
      <el-icon><EditPen /></el-icon>
      <span>编辑模式</span>
    </div>

    <div class="sidebar-top">
      <div class="avatar-wrapper" :class="{ 'editable': isEditMode }" @click="handleAvatarClick">
        <el-avatar
          :size="130"
          :src="editingConfig.avatar || '/src/assets/images/default-avatar.png'"
          class="sidebar-avatar"
        />
        <div v-if="isEditMode" class="avatar-overlay">
          <el-icon><Camera /></el-icon>
          <span>替换</span>
        </div>
      </div>

      <div class="info-section">
        <div v-if="isEditMode && editingNickname" class="edit-input-wrapper">
          <el-input
            v-model="editingNickname"
            size="small"
            @blur="saveNickname"
            @keyup.enter="saveNickname"
            ref="nicknameInputRef"
            class="edit-input"
          />
        </div>
        <h2
          v-else
          class="nickname"
          :class="{ 'editable': isEditMode }"
          @click="handleNicknameClick"
        >{{ editingConfig.nickname }}</h2>

        <div v-if="isEditMode && editingBio !== null" class="edit-input-wrapper">
          <el-input
            v-model="editingBio"
            type="textarea"
            :rows="2"
            size="small"
            @blur="saveBio"
            ref="bioInputRef"
            class="edit-textarea"
          />
        </div>
        <p
          v-else
          class="bio"
          :class="{ 'editable': isEditMode }"
          @click="handleBioClick"
        >{{ editingConfig.bio || '这个人很懒，什么都没写...' }}</p>
      </div>
    </div>

    <div class="sidebar-divider"></div>

    <div class="sidebar-bottom">
      <div v-for="comp in sidebarComponents" :key="comp.id" class="custom-component" :class="{ 'comp-editing': isEditMode }">
        <div v-if="isEditMode" class="comp-actions">
          <el-button text type="danger" size="small" @click="removeComponent(comp.id)">
            <el-icon><Delete /></el-icon>
          </el-button>
        </div>

        <div v-if="comp.type === 'text'" class="comp-text">
          <template v-if="comp.title">
            <el-input
              v-if="isEditMode && editingCompTitleId === comp.id"
              v-model="editingCompTitle"
              size="small"
              :class="['comp-title-input', `comp-title-input-${comp.id}`]"
              @blur="saveCompTitle(comp)"
              @keyup.enter="saveCompTitle(comp)"
            />
            <h3 v-else class="comp-title" :class="{ 'editable': isEditMode }" @click="handleCompTitleClick(comp)">
              {{ comp.title }}
            </h3>
          </template>
          <p v-if="comp.text" class="comp-content">{{ comp.text }}</p>
        </div>

        <div v-else-if="comp.type === 'links'" class="comp-links">
          <template v-if="comp.title">
            <el-input
              v-if="isEditMode && editingCompTitleId === comp.id"
              v-model="editingCompTitle"
              size="small"
              :class="['comp-title-input', `comp-title-input-${comp.id}`]"
              @blur="saveCompTitle(comp)"
              @keyup.enter="saveCompTitle(comp)"
            />
            <h3 v-else class="comp-title" :class="{ 'editable': isEditMode }" @click="handleCompTitleClick(comp)">
              {{ comp.title }}
            </h3>
          </template>
          <ul v-if="comp.links && comp.links.length > 0" class="link-list">
            <li v-for="(link, index) in comp.links" :key="index" :class="{ 'editing': isEditMode }">
              <template v-if="isEditMode">
                <div class="link-edit-row">
                  <el-input v-model="link.name" size="small" placeholder="名称" class="link-input" @change="saveSidebarConfig" />
                  <el-input v-model="link.url" size="small" placeholder="链接" class="link-input" @change="saveSidebarConfig" />
                  <el-button text type="danger" size="small" @click="removeLink(comp.id, index)">
                    <el-icon><Delete /></el-icon>
                  </el-button>
                </div>
              </template>
              <template v-else>
                <a :href="link.url" target="_blank" class="link-item">
                  <el-icon><Link /></el-icon>
                  <span>{{ link.name }}</span>
                </a>
              </template>
            </li>
          </ul>
          <div v-if="isEditMode" class="add-link-btn" @click="addLink(comp.id)">
            <el-icon><Plus /></el-icon>
            <span>添加链接</span>
          </div>
        </div>

        <div v-else-if="comp.type === 'tags'" class="comp-tags">
          <template v-if="comp.title">
            <el-input
              v-if="isEditMode && editingCompTitleId === comp.id"
              v-model="editingCompTitle"
              size="small"
              :class="['comp-title-input', `comp-title-input-${comp.id}`]"
              @blur="saveCompTitle(comp)"
              @keyup.enter="saveCompTitle(comp)"
            />
            <h3 v-else class="comp-title" :class="{ 'editable': isEditMode }" @click="handleCompTitleClick(comp)">
              {{ comp.title }}
            </h3>
          </template>
          <div v-if="tagList.length > 0" class="tags-list">
            <span
              v-for="tag in tagList"
              :key="tag._id"
              class="tag-item"
              :style="{ background: tag.color ? tag.color + '20' : '', color: tag.color || '' }"
            >{{ tag.name }}</span>
          </div>
          <div v-else class="tags-empty">暂无标签</div>
        </div>

        <div v-else-if="comp.type === 'social'" class="comp-social" :class="`social-size-${comp.size || 'small'}`">
          <template v-if="comp.title">
            <div class="comp-title-row">
              <el-input
                v-if="isEditMode && editingCompTitleId === comp.id"
                v-model="editingCompTitle"
                size="small"
                :class="['comp-title-input', `comp-title-input-${comp.id}`]"
                @blur="saveCompTitle(comp)"
                @keyup.enter="saveCompTitle(comp)"
              />
              <h3 v-else class="comp-title" :class="{ 'editable': isEditMode }" @click="handleCompTitleClick(comp)">
                {{ comp.title }}
              </h3>
              <el-button
                v-if="isEditMode"
                text
                size="small"
                class="size-toggle-btn"
                @click="toggleSocialSize(comp)"
              >
                {{ comp.size === 'large' ? '小图' : '大图' }}
              </el-button>
            </div>
          </template>
          <div v-if="comp.items && comp.items.length > 0" class="social-list">
            <div
              v-for="(item, index) in comp.items"
              :key="index"
              class="social-card"
              :class="{ 'editing': isEditMode }"
            >
              <template v-if="isEditMode">
                <div class="social-edit-row">
                  <label class="social-avatar-edit">
                    <el-avatar :size="36" :src="item.avatar || ''" />
                    <div class="social-avatar-mask">
                      <el-icon :size="14"><Camera /></el-icon>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      class="social-avatar-file"
                      @change="(e) => handleSocialAvatarChange(e, comp.id, index)"
                    />
                  </label>
                  <div class="social-edit-fields">
                    <el-input v-model="item.name" size="small" placeholder="平台名称" @change="saveConfig" />
                    <el-input v-model="item.username" size="small" placeholder="昵称" @change="saveConfig" />
                    <el-input v-model="item.account" size="small" placeholder="账号/抖音号" @change="saveConfig" />
                  </div>
                  <el-button text type="danger" size="small" @click="removeSocialItem(comp.id, index)">
                    <el-icon><Delete /></el-icon>
                  </el-button>
                </div>
              </template>
              <template v-else>
                <div class="social-card-display">
                  <el-avatar :size="comp.size === 'large' ? 96 : 40" :src="item.avatar || ''" class="social-avatar" />
                  <div class="social-info">
                    <div class="social-name">{{ item.name }}</div>
                    <div class="social-username">{{ item.username }}</div>
                    <div v-if="item.account" class="social-account">{{ item.account }}</div>
                  </div>
                </div>
              </template>
            </div>
          </div>
          <div v-if="isEditMode" class="add-social-btn" @click="addSocialItem(comp.id)">
            <el-icon><Plus /></el-icon>
            <span>添加账号</span>
          </div>
        </div>

        <div v-else-if="comp.type === 'divider'" class="comp-divider"></div>
      </div>

      <div v-if="isEditMode" class="add-component-section">
        <el-dropdown trigger="click" @command="handleAddComponent">
          <div class="add-component-btn">
            <el-icon><Plus /></el-icon>
            <span>添加组件</span>
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="social">社交账号</el-dropdown-item>
              <el-dropdown-item command="links">友情链接</el-dropdown-item>
              <el-dropdown-item command="tags">标签列表</el-dropdown-item>
              <el-dropdown-item command="divider">分隔线</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>

    <AvatarCropper
      v-model:visible="showCropper"
      :initial-image="editingConfig.avatar"
      @confirm="handleCropConfirm"
    />
  </aside>
</template>

<script setup>
import { computed, ref, onMounted, nextTick, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useAppStore } from '@/stores/app'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Link, EditPen, Camera, Delete, Plus } from '@element-plus/icons-vue'
import { getTagList } from '@/api/tag'
import { updateSiteConfig } from '@/api/config'
import { uploadImage } from '@/api/upload'
import AvatarCropper from '@/components/common/AvatarCropper.vue'

const route = useRoute()
const appStore = useAppStore()
const siteConfig = appStore.siteConfig

const isEditMode = computed(() => route.query.edit === 'true')

const editingConfig = ref({ ...siteConfig })
watch(() => appStore.siteConfig, (val) => {
  editingConfig.value = { ...val }
}, { deep: true })

const sidebarComponents = computed(() => editingConfig.value.sidebarComponents || [])
const hasTagsComponent = computed(() => sidebarComponents.value.some(c => c.type === 'tags'))

const tagList = ref([])

const editingNickname = ref('')
const editingBio = ref(null)
const editingCompTitleId = ref('')
const editingCompTitle = ref('')
const nicknameInputRef = ref(null)
const bioInputRef = ref(null)
const showCropper = ref(false)

async function loadTags() {
  if (!hasTagsComponent.value) return
  try {
    const res = await getTagList()
    tagList.value = res.data?.list || []
  } catch (e) {
    console.error('加载标签列表失败:', e)
  }
}

function handleAvatarClick() {
  if (!isEditMode.value) return
  showCropper.value = true
}

async function handleCropConfirm(base64Image) {
  try {
    const blob = await fetch(base64Image).then(res => res.blob())
    const file = new File([blob], 'avatar.png', { type: 'image/png' })

    const formData = new FormData()
    formData.append('file', file)

    const res = await uploadImage(formData)
    if (res.data?.url) {
      editingConfig.value.avatar = res.data.url
      await saveConfig()
      ElMessage.success('头像更新成功')
    }
  } catch (err) {
    ElMessage.error('上传失败')
  }
  showCropper.value = false
}

function handleNicknameClick() {
  if (!isEditMode.value) return
  startEditNickname()
}

function startEditNickname() {
  editingNickname.value = editingConfig.value.nickname
  nextTick(() => {
    const input = nicknameInputRef.value?.$el?.querySelector('input')
    if (input) {
      input.focus()
      input.select()
    }
  })
}

async function saveNickname() {
  if (!editingNickname.value.trim()) {
    editingNickname.value = ''
    return
  }
  editingConfig.value.nickname = editingNickname.value.trim()
  editingNickname.value = ''
  await saveConfig()
}

function handleBioClick() {
  if (!isEditMode.value) return
  startEditBio()
}

function handleCompTitleClick(comp) {
  if (!isEditMode.value) return
  startEditCompTitle(comp)
}

function startEditBio() {
  editingBio.value = editingConfig.value.bio || ''
  nextTick(() => {
    const textarea = bioInputRef.value?.$el?.querySelector('textarea')
    if (textarea) {
      textarea.focus()
      textarea.select()
    }
  })
}

async function saveBio() {
  editingConfig.value.bio = editingBio.value?.trim() || ''
  editingBio.value = null
  await saveConfig()
}

function startEditCompTitle(comp) {
  editingCompTitleId.value = comp.id
  editingCompTitle.value = comp.title || ''
  nextTick(() => {
    const input = document.querySelector(`.comp-title-input-${comp.id} input`)
    if (input) {
      input.focus()
      input.select()
    }
  })
}

async function saveCompTitle(comp) {
  comp.title = editingCompTitle.value.trim()
  editingCompTitleId.value = ''
  editingCompTitle.value = ''
  await saveConfig()
}

function addLink(compId) {
  const comp = editingConfig.value.sidebarComponents?.find(c => c.id === compId)
  if (comp) {
    comp.links = [...(comp.links || []), { name: '新链接', url: 'https://' }]
    saveConfig()
  }
}

function removeLink(compId, index) {
  const comp = editingConfig.value.sidebarComponents?.find(c => c.id === compId)
  if (comp) {
    comp.links.splice(index, 1)
    saveConfig()
  }
}

function removeComponent(compId) {
  ElMessageBox.confirm('确定要删除这个组件吗？', '提示', {
    confirmButtonText: '删除',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    const list = editingConfig.value.sidebarComponents || []
    editingConfig.value.sidebarComponents = list.filter(c => c.id !== compId)
    saveConfig()
    ElMessage.success('已删除')
  }).catch(() => {})
}

function handleAddComponent(type) {
  const newComp = {
    id: Date.now().toString(),
    type,
    title: type === 'links' ? '友情链接' : type === 'tags' ? '标签' : type === 'social' ? '社交账号' : '',
    size: type === 'social' ? 'small' : undefined,
    links: type === 'links' ? [] : undefined,
    items: type === 'tags' ? [] : type === 'social' ? [] : undefined
  }
  editingConfig.value.sidebarComponents = [...(editingConfig.value.sidebarComponents || []), newComp]
  saveConfig()
}

function toggleSocialSize(comp) {
  comp.size = comp.size === 'large' ? 'small' : 'large'
  saveConfig()
}

function addSocialItem(compId) {
  const comp = editingConfig.value.sidebarComponents?.find(c => c.id === compId)
  if (comp) {
    comp.items = [...(comp.items || []), {
      name: '新平台',
      username: '@昵称',
      account: '账号',
      avatar: ''
    }]
    saveConfig()
  }
}

function removeSocialItem(compId, index) {
  const comp = editingConfig.value.sidebarComponents?.find(c => c.id === compId)
  if (comp && comp.items) {
    comp.items.splice(index, 1)
    saveConfig()
  }
}

async function handleSocialAvatarChange(e, compId, index) {
  const file = e.target.files[0]
  if (!file) return

  const formData = new FormData()
  formData.append('file', file)

  try {
    const res = await uploadImage(formData)
    if (res.data?.url) {
      const comp = editingConfig.value.sidebarComponents?.find(c => c.id === compId)
      if (comp && comp.items && comp.items[index]) {
        comp.items[index].avatar = res.data.url
        await saveConfig()
        ElMessage.success('头像更新成功')
      }
    }
  } catch (err) {
    ElMessage.error('上传失败')
  }
  e.target.value = ''
}

async function saveConfig() {
  try {
    await updateSiteConfig(editingConfig.value)
    appStore.setSiteConfig(editingConfig.value)
  } catch (e) {
    ElMessage.error('保存失败')
  }
}

onMounted(() => {
  loadTags()
})
</script>

<style lang="scss" scoped>
.left-sidebar {
  width: 280px;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: $glass-bg;
  backdrop-filter: blur($glass-blur);
  -webkit-backdrop-filter: blur($glass-blur);
  border-right: 1px solid $glass-border;
  flex-shrink: 0;
  position: relative;
  z-index: 2;
  box-shadow: 
    4px 0 24px rgba($pink-400, 0.08),
    inset -1px 0 0 rgba(255, 255, 255, 0.6);

  &.edit-mode {
    .editable {
      cursor: pointer;
      transition: background-color $transition-fast;

      &:hover {
        background: rgba($pink-400, 0.1);
        border-radius: $radius-sm;
      }
    }
  }
}

.edit-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  background: $pink-500;
  color: #fff;
  font-size: 11px;
  border-radius: $radius-sm;
  z-index: 10;
}

.sidebar-top {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: $spacing-lg $spacing-md $spacing-md;
  text-align: center;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, transparent 0%, $pink-400 20%, $pink-500 50%, $pink-400 80%, transparent 100%);
    border-radius: 3px 3px 0 0;
  }
}

.avatar-wrapper {
  position: relative;
  margin-bottom: $spacing-sm;
  z-index: 1;

  &::before {
    content: '';
    position: absolute;
    top: -8px;
    left: -8px;
    right: -8px;
    bottom: -8px;
    border-radius: 50%;
    background: conic-gradient(
      from 0deg,
      $pink-300,
      $purple-pink-300,
      $rose-300,
      $pink-400,
      $purple-pink-400,
      $pink-300
    );
    z-index: -1;
    animation: rotate-glow 6s linear infinite;
    opacity: 0.7;
    filter: blur(2px);
  }

  &::after {
    content: '';
    position: absolute;
    top: -32px;
    left: -32px;
    right: -32px;
    bottom: -32px;
    border-radius: 50%;
    background: 
      radial-gradient(circle, rgba($pink-300, 0.4) 0%, rgba($purple-pink-300, 0.2) 40%, transparent 70%);
    z-index: -2;
    animation: breathe 4s ease-in-out infinite;
  }

  &.editable {
    cursor: pointer;

    &:hover .avatar-overlay {
      opacity: 1;
    }
  }
}

@keyframes rotate-glow {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes breathe {
  0%, 100% { opacity: 0.6; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.12); }
}

.avatar-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
  color: #fff;
  font-size: 11px;
  opacity: 0;
  transition: opacity $transition-fast;
  pointer-events: none;
}

.sidebar-avatar {
  border: 4px solid rgba(255, 255, 255, 0.9);
  box-shadow: 
    0 0 0 3px rgba($pink-300, 0.5),
    0 0 20px rgba($pink-400, 0.3),
    0 8px 24px rgba($pink-500, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
  position: relative;
  z-index: 1;
  backdrop-filter: blur(4px);
}

.edit-input-wrapper {
  margin-bottom: $spacing-sm;
  width: 100%;
}

.edit-input {
  width: 100%;
  text-align: center;
}

.edit-textarea {
  width: 100%;
  text-align: center;
}

.info-section {
  margin-bottom: $spacing-sm;
  width: 100%;
}

.nickname {
  font-size: $font-size-lg;
  font-weight: $font-weight-bold;
  color: $pink-600;
  letter-spacing: 1px;
  margin-bottom: $spacing-xs;
  background: linear-gradient(135deg, $pink-600 0%, #e91e63 50%, $pink-500 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 0 20px rgba($pink-400, 0.2);
}

.bio {
  font-size: $font-size-xs;
  color: $color-text-secondary;
  line-height: 1.5;
}

.sidebar-divider {
  margin: 0 $spacing-md;
  height: 1px;
  background: linear-gradient(90deg, transparent 0%, rgba($pink-300, 0.5) 30%, $pink-400 50%, rgba($pink-300, 0.5) 70%, transparent 100%);
  flex-shrink: 0;
}

.sidebar-bottom {
  flex: 1;
  padding: $spacing-md;
  overflow-y: auto;
}

.custom-component {
  margin-bottom: $spacing-lg;
  position: relative;
  opacity: 0;
  transform: translateY(20px);
  animation: comp-fade-in 0.6s ease forwards;

  @for $i from 1 through 10 {
    &:nth-child(#{$i}) {
      animation-delay: #{$i * 0.08}s;
    }
  }

  &:hover {
    .comp-text,
    .comp-links,
    .comp-tags,
    .comp-social,
    .comp-divider-content {
      box-shadow: $shadow-md;
      transform: translateY(-2px);
    }
  }

  &.comp-editing {
    padding-top: 24px;
  }
}

@keyframes comp-fade-in {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.comp-actions {
  position: absolute;
  top: 0;
  right: 0;
  z-index: 2;
}

.comp-title-input {
  margin-bottom: $spacing-sm;
  width: 100%;
}

.comp-title {
  font-size: $font-size-sm;
  font-weight: $font-weight-semibold;
  color: $color-text;
  margin-bottom: $spacing-sm;
  padding-left: $spacing-xs;
  border-left: 3px solid transparent;
  border-image: linear-gradient(to bottom, $pink-400, $pink-600) 1;

  &.editable {
    cursor: pointer;
    transition: background-color $transition-fast;

    &:hover {
      background: rgba($pink-400, 0.06);
      border-radius: $radius-sm;
    }
  }
}

.comp-text {
  transition: all $transition-normal;

  .comp-content {
    font-size: $font-size-sm;
    color: $color-text-secondary;
    line-height: 1.6;
  }
}

.comp-links {
  transition: all $transition-normal;

  .link-list {
    list-style: none;
    padding: 0;
    margin: 0;

    li {
      &.editing {
        margin-bottom: $spacing-sm;
      }
    }
  }

  .link-edit-row {
    display: flex;
    flex-direction: column;
    gap: 4px;

    .link-input {
      width: 100%;
    }
  }

  .link-item {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: $font-size-sm;
    color: $color-text-secondary;
    text-decoration: none;
    padding: 6px 0;
    transition: color $transition-fast;

    &:hover {
      color: $pink-500;
    }
  }

  .add-link-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    padding: 8px;
    margin-top: $spacing-sm;
    font-size: $font-size-xs;
    color: $pink-500;
    border: 1px dashed $pink-300;
    border-radius: $radius-md;
    cursor: pointer;
    transition: all $transition-fast;

    &:hover {
      background: $pink-50;
      border-color: $pink-400;
    }
  }
}

.add-component-section {
  margin-top: $spacing-lg;
  padding-top: $spacing-md;
  border-top: 1px dashed $color-border;

  .add-component-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 10px;
    font-size: $font-size-sm;
    color: $pink-500;
    border: 1px dashed $pink-300;
    border-radius: $radius-md;
    cursor: pointer;
    transition: all $transition-fast;

    &:hover {
      background: $pink-50;
      border-color: $pink-400;
    }
  }
}

.comp-tags {
  transition: all $transition-normal;

  .tags-list {
    display: flex;
    flex-wrap: wrap;
    gap: $spacing-xs;
  }

  .tag-item {
    padding: 4px 12px;
    background: $gradient-pink-purple-soft;
    color: #fff;
    border-radius: 999px;
    font-size: $font-size-xs;
    font-weight: $font-weight-medium;
    transition: all $transition-fast;
    box-shadow: 
      0 2px 8px rgba($pink-400, 0.2),
      0 1px 3px rgba($purple-pink-400, 0.15);
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);

    &:hover {
      transform: translateY(-2px) scale(1.05);
      box-shadow: 
        0 4px 12px rgba($pink-400, 0.3),
        0 2px 6px rgba($purple-pink-400, 0.25),
        0 0 16px rgba($pink-300, 0.3);
    }
  }

  .tags-empty {
    font-size: $font-size-xs;
    color: $color-text-secondary;
    text-align: center;
    padding: $spacing-sm 0;
  }
}

.comp-social {
  transition: all $transition-normal;

  .comp-title-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: $spacing-sm;
  }

  .size-toggle-btn {
    font-size: $font-size-xs;
    color: $pink-500;
  }

  .social-list {
    display: flex;
    flex-direction: column;
    gap: $spacing-sm;
  }

  .social-card {
    &.editing {
      margin-bottom: $spacing-sm;
    }
  }

  .social-card-display {
    display: flex;
    align-items: center;
    gap: $spacing-md;
    padding: $spacing-md;
    border-radius: $radius-lg;
    background: rgba(255, 255, 255, 0.5);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    border: 1px solid rgba(255, 255, 255, 0.6);
    box-shadow: $glass-shadow-sm;
    transition: all $transition-normal;

    &:hover {
      transform: translateY(-3px);
      box-shadow: $glass-shadow-md;
      border-color: rgba(255, 255, 255, 0.8);
    }
  }

  .social-avatar {
    flex-shrink: 0;
    box-shadow: 0 2px 8px rgba($pink-400, 0.2);
  }

  .social-info {
    flex: 1;
    min-width: 0;
  }

  .social-name {
    font-size: $font-size-base;
    font-weight: $font-weight-semibold;
    color: $color-text;
    margin-bottom: 2px;
  }

  .social-username {
    font-size: $font-size-sm;
    color: $color-text-secondary;
    margin-bottom: 2px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .social-account {
    font-size: $font-size-xs;
    color: $pink-500;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &.social-size-large {
    .social-list {
      gap: $spacing-md;
    }

    .social-card-display {
      flex-direction: column;
      align-items: center;
      text-align: center;
      padding: $spacing-lg $spacing-md;
      gap: 0;
      background: rgba(255, 255, 255, 0.4);
    }

    .social-avatar {
      border: 4px solid rgba(255, 255, 255, 0.8);
      margin-bottom: $spacing-md;
      box-shadow: 
        0 0 0 3px rgba($pink-300, 0.4),
        0 4px 16px rgba($pink-400, 0.25),
        0 0 30px rgba($pink-300, 0.2);
    }

    .social-info {
      width: 100%;
    }

    .social-name {
      font-size: $font-size-xl;
      font-weight: $font-weight-bold;
      background: $gradient-pink-purple;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      letter-spacing: 2px;
      margin-bottom: $spacing-sm;
    }

    .social-username {
      font-size: $font-size-sm;
      color: $color-text-secondary;
      margin-bottom: 4px;
    }

    .social-account {
      font-size: $font-size-sm;
      color: $pink-500;
    }
  }

  .social-edit-row {
    display: flex;
    gap: $spacing-sm;
    align-items: flex-start;
    padding: $spacing-sm;
    background: rgba($pink-500, 0.03);
    border-radius: $radius-md;
  }

  .social-avatar-edit {
    position: relative;
    cursor: pointer;
    flex-shrink: 0;

    &:hover .social-avatar-mask {
      opacity: 1;
    }
  }

  .social-avatar-mask {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.5);
    border-radius: 50%;
    color: #fff;
    opacity: 0;
    transition: opacity $transition-fast;
  }

  .social-avatar-file {
    display: none;
  }

  .social-edit-fields {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 4px;

    .el-input {
      width: 100%;
    }
  }

  .add-social-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    padding: 8px;
    margin-top: $spacing-sm;
    font-size: $font-size-xs;
    color: $pink-500;
    border: 1px dashed $pink-300;
    border-radius: $radius-md;
    cursor: pointer;
    transition: all $transition-fast;

    &:hover {
      background: $pink-50;
      border-color: $pink-400;
    }
  }
}

.comp-divider {
  height: 1px;
  background: $warm-gray-200;
  margin: $spacing-md 0;
}
</style>