<template>
    <div class="qq-group-page">
        <h1 class="page-title">Q群宣传</h1>
        <p class="page-subtitle">QQ GROUP PROMOTION</p>
        <p class="page-desc">在此发布或查找SC2相关的QQ群，找到志同道合的战友！</p>

        <!-- Submit Form -->
        <div class="form-panel sc2-panel" v-if="showForm">
            <h3>发布QQ群</h3>
            <input type="text" v-model="form.groupName" class="wInput" placeholder="群名称 (必填)" maxlength="100">
            <input type="text" v-model="form.groupNumber" class="wInput" placeholder="群号 (必填)" maxlength="50">
            <textarea v-model="form.description" class="wInput textarea-input" 
                placeholder="群简介 (可描述群的定位、活跃时段、主要活动等)" 
                rows="4" maxlength="2000"></textarea>
            <input type="text" v-model="form.contactInfo" class="wInput" placeholder="联系方式 (选填，如群主QQ等)" maxlength="100">            
            <div class="form-actions">
                <button class="btn-submit" @click="submitGroup" :disabled="submitting">
                    {{ submitting ? '提交中...' : '发布' }}
                </button>
                <button class="btn-cancel" @click="showForm = false">取消</button>
                <span class="msg success" v-if="successMsg">{{ successMsg }}</span>
                <span class="msg error" v-if="errorMsg">{{ errorMsg }}</span>
            </div>
        </div>
        <button v-if="!showForm" class="btn-add" @click="openForm">+ 发布QQ群</button>

        <!-- Group List -->
        <div class="group-list">
            <div v-if="groups.length === 0 && !loading" class="empty-hint">暂无QQ群信息，快来发布第一个吧！</div>
            <div v-for="g in groups" :key="g.id" class="group-card sc2-panel">
                <div class="group-header">
                    <span class="group-name">{{ g.groupName }}</span>
                    <span class="group-number-badge">群号: {{ g.groupNumber }}</span>
                </div>
                <p class="group-desc" v-if="g.description">{{ g.description }}</p>
                <div class="group-footer">
                    <span class="group-author">发布者: {{ g.authorTag || '匿名' }}</span>
                    <span class="group-contact" v-if="g.contactInfo">联系: {{ g.contactInfo }}</span>
                    <span class="group-date">{{ formatDate(g.createdAt) }}</span>
                    <button class="btn-delete-sm" v-if="currentUser && g.userId === currentUser.id" @click="removeGroup(g.id)">删除</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { getStoredUser, getQqGroups, createQqGroup, deleteQqGroup } from '../api/api.js';

const router = useRouter();
const currentUser = getStoredUser();
const groups = ref([]);
const loading = ref(false);
const showForm = ref(false);
const form = ref({ groupName: '', groupNumber: '', description: '', contactInfo: '' });
const submitting = ref(false);
const successMsg = ref('');
const errorMsg = ref('');

function openForm() {
    if (!currentUser) {
        router.push({ name: 'loginPage' });
        return;
    }
    showForm.value = true;
}

async function submitGroup() {
    errorMsg.value = '';
    successMsg.value = '';
    if (!currentUser) { router.push({ name: 'loginPage' }); return; }
    if (!form.value.groupName.trim()) { errorMsg.value = '请填写群名称'; return; }
    if (!form.value.groupNumber.trim()) { errorMsg.value = '请填写群号'; return; }

    submitting.value = true;
    try {
        const res = await createQqGroup(form.value);
        if (res.data.code === 200) {
            successMsg.value = '发布成功！';
            form.value = { groupName: '', groupNumber: '', description: '', contactInfo: '' };
            showForm.value = false;
            await loadGroups();
        } else {
            errorMsg.value = res.data.msg || '发布失败';
        }
    } catch (e) {
        errorMsg.value = e.response?.data?.msg || e.message || '发布失败';
    } finally {
        submitting.value = false;
    }
}

async function removeGroup(id) {
    if (!confirm('确认删除？')) return;
    try {
        await deleteQqGroup(id);
        await loadGroups();
    } catch (e) {
        alert('删除失败');
    }
}

async function loadGroups() {
    loading.value = true;
    try {
        const res = await getQqGroups();
        groups.value = res.data?.data || [];
    } catch (e) {
        groups.value = [];
    } finally {
        loading.value = false;
    }
}

function formatDate(d) {
    if (!d) return '';
    return new Date(d).toLocaleDateString('zh-CN');
}

onMounted(() => {
    loadGroups();
});
</script>

<style scoped>
.qq-group-page { max-width: 800px; margin: 0 auto; }

.page-title {
    font-family: 'Orbitron', sans-serif;
    font-size: 28px;
    font-weight: 700;
    color: var(--sc2-text-bright);
    letter-spacing: 1px;
}

.page-subtitle {
    font-family: 'Orbitron', sans-serif;
    font-size: 10px;
    color: var(--sc2-text-dim);
    letter-spacing: 4px;
    margin-bottom: 8px;
}

.page-desc {
    font-size: 14px;
    color: var(--sc2-text-dim);
    margin-bottom: 24px;
}

.form-panel { margin-bottom: 20px; }
.form-panel h3 { color: var(--sc2-text-bright); font-size: 16px; margin-bottom: 12px; }

.wInput {
    width: 100%;
    padding: 10px 14px;
    background: rgba(0,0,0,0.25);
    border: 1px solid var(--sc2-border);
    border-radius: 6px;
    color: var(--sc2-text);
    font-size: 14px;
    margin-top: 8px;
    box-sizing: border-box;
}
.wInput:focus { border-color: var(--sc2-accent); outline: none; }
.textarea-input { resize: vertical; min-height: 80px; font-family: inherit; }

.form-actions { display: flex; align-items: center; gap: 10px; margin-top: 12px; flex-wrap: wrap; }

.btn-submit {
    padding: 8px 24px;
    background: var(--sc2-accent);
    color: var(--sc2-bg-deep);
    border: none;
    border-radius: 6px;
    font-family: 'Orbitron', sans-serif;
    font-size: 12px;
    cursor: pointer;
    font-weight: 700;
}
.btn-submit:disabled { opacity: 0.5; cursor: not-allowed; }

.btn-cancel {
    padding: 8px 24px;
    background: var(--sc2-bg-panel);
    color: var(--sc2-text-dim);
    border: 1px solid var(--sc2-border);
    border-radius: 6px;
    cursor: pointer;
    font-size: 12px;
}

.btn-add {
    padding: 10px 24px;
    background: rgba(0, 180, 216, 0.1);
    color: var(--sc2-accent);
    border: 1px solid rgba(0, 180, 216, 0.3);
    border-radius: 8px;
    cursor: pointer;
    font-weight: 600;
    font-size: 14px;
    margin-bottom: 20px;
    transition: all 0.2s;
}
.btn-add:hover { background: rgba(0, 180, 216, 0.2); }

.msg { font-size: 13px; }
.msg.success { color: #00c864; }
.msg.error { color: #ff5050; }

.group-list { display: flex; flex-direction: column; gap: 12px; }

.empty-hint {
    text-align: center;
    color: var(--sc2-text-dim);
    padding: 40px;
    font-size: 14px;
}

.group-card { padding: 18px; }

.group-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
    flex-wrap: wrap;
    gap: 8px;
}

.group-name {
    font-size: 16px;
    font-weight: 600;
    color: var(--sc2-text-bright);
}

.group-number-badge {
    font-size: 13px;
    padding: 3px 12px;
    background: rgba(0, 180, 216, 0.12);
    color: var(--sc2-accent);
    border: 1px solid rgba(0, 180, 216, 0.3);
    border-radius: 12px;
    font-weight: 600;
    user-select: all;
}

.group-desc {
    color: var(--sc2-text);
    font-size: 14px;
    line-height: 1.6;
    white-space: pre-wrap;
    margin-bottom: 10px;
}

.group-footer {
    display: flex;
    align-items: center;
    gap: 16px;
    font-size: 12px;
    color: var(--sc2-text-dim);
    flex-wrap: wrap;
}

.group-author { color: var(--sc2-accent); }
.group-contact { color: var(--sc2-text); }

.btn-delete-sm {
    padding: 2px 12px;
    background: rgba(255, 60, 60, 0.15);
    color: #ff3c3c;
    border: 1px solid rgba(255, 60, 60, 0.3);
    border-radius: 4px;
    cursor: pointer;
    font-size: 11px;
}
.btn-delete-sm:hover { background: rgba(255, 60, 60, 0.25); }
</style>
