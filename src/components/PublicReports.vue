<template>
    <div class="reports-page">
        <h1 class="page-title">挂人区</h1>
        <p class="page-subtitle">PLAYER REPORTS</p>
        <p class="page-desc">记录语言暴力、恶意行为等玩家，供社区参考。</p>

        <div class="action-row">
            <div class="search-box">
                <input v-model="searchQuery" class="search-input" placeholder="搜索游戏ID..." @keyup.enter="doSearch">
                <button class="search-btn" @click="doSearch">搜索</button>
                <button class="clear-btn" @click="clearSearch" v-if="searchQuery">清除</button>
            </div>
            <button class="add-btn" @click="requireLogin(() => showForm = true)">+ 新增记录</button>
        </div>

        <!-- Report Form -->
        <div v-if="showForm" class="form-panel sc2-panel">
            <h3>新增记录</h3>
            <input v-model="form.gameId" class="wInput" placeholder="游戏ID / 战网ID (必填)">
            <div class="form-row">
                <input type="number" v-model.number="form.mmrMin" class="wInput" placeholder="分数范围 - 最小">
                <input type="number" v-model.number="form.mmrMax" class="wInput" placeholder="分数范围 - 最大">
            </div>
            <textarea v-model="form.description" class="wInput textarea-input" placeholder="描述（行为描述，必填，最多2000字）" rows="4" maxlength="2000"></textarea>
            <div class="char-count">{{ form.description.length }} / 2000</div>
            
            <!-- Image Upload -->
            <div class="image-upload-section">
                <label class="upload-label">上传图片 (选填，支持jpg/png/gif/webp，最大5MB)</label>
                <div class="image-upload-area" @click="triggerImageInput">
                    <img v-if="form.imagePreview" :src="form.imagePreview" class="image-preview" />
                    <div v-else class="upload-placeholder">
                        <svg xmlns="http://www.w3.org/2000/svg" height="32px" viewBox="0 -960 960 960" width="32px" fill="currentColor"><path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm40-80h480L570-480 450-320l-90-120-120 160Zm-40 80v-560 560Z"/></svg>
                        <span>点击上传图片</span>
                    </div>
                    <button v-if="form.imagePreview" class="clear-image-btn" @click.stop="clearImage">✕</button>
                </div>
                <input ref="imageInputRef" type="file" accept="image/jpeg,image/png,image/gif,image/webp" style="display:none" @change="handleImageSelect">
                <span v-if="imageUploadMsg" class="msg error">{{ imageUploadMsg }}</span>
            </div>

            <div class="form-actions">
                <button class="btn-submit" @click="submitReport" :disabled="submitting">{{ submitting ? '提交中...' : '提交' }}</button>
                <button class="btn-cancel" @click="showForm = false; resetForm()">取消</button>
                <span class="msg success" v-if="successMsg">{{ successMsg }}</span>
                <span class="msg error" v-if="errorMsg">{{ errorMsg }}</span>
            </div>
        </div>

        <!-- Report List -->
        <div v-if="loading" class="loading-msg">加载中...</div>
        <div v-else-if="reports.length === 0" class="empty-msg">
            {{ searchQuery ? '未找到匹配的记录' : '暂无记录' }}
        </div>
        <div v-else class="report-list">
            <div v-for="r in reports" :key="r.id" class="report-card sc2-panel">
                <div class="report-header">
                    <span class="game-id">{{ r.gameId }}</span>
                    <span class="mmr-range" v-if="r.mmrMin || r.mmrMax">
                        MMR: {{ r.mmrMin || '?' }} ~ {{ r.mmrMax || '?' }}
                    </span>
                    <span class="report-date">{{ formatDate(r.createdAt) }}</span>
                </div>
                <p class="report-desc">{{ r.description }}</p>
                <div class="report-image" v-if="r.imageUrl">
                    <img :src="r.imageUrl" alt="举报截图" @click="openFullImage(r.imageUrl)" />
                </div>
                <div class="report-footer" v-if="isAdmin">
                    <button class="delete-btn" @click="deleteReport(r.id)">删除</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { getStoredUser, getPublicReports, createPublicReport } from '../api/api.js';
import axios from '../api/api.js';

const router = useRouter();
const currentUser = getStoredUser();
const isAdmin = computed(() => currentUser?.role === 'admin' || currentUser?.role === 'super_admin');

function requireLogin(callback) {
    if (!currentUser) {
        router.push({ name: 'loginPage' });
        return;
    }
    callback();
}

const reports = ref([]);
const loading = ref(false);
const searchQuery = ref('');
const showForm = ref(false);
const submitting = ref(false);
const successMsg = ref('');
const errorMsg = ref('');

const form = ref({ gameId: '', mmrMin: null, mmrMax: null, description: '', imageUrl: '', imagePreview: '' });
const imageInputRef = ref(null);
const imageUploadMsg = ref('');

function resetForm() {
    form.value = { gameId: '', mmrMin: null, mmrMax: null, description: '', imageUrl: '', imagePreview: '' };
    successMsg.value = '';
    errorMsg.value = '';
    imageUploadMsg.value = '';
}

function triggerImageInput() { imageInputRef.value?.click(); }

function clearImage() {
    form.value.imageUrl = '';
    form.value.imagePreview = '';
    imageUploadMsg.value = '';
}

async function handleImageSelect(e) {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
        imageUploadMsg.value = '图片不能超过5MB';
        return;
    }
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
        imageUploadMsg.value = '只支持 jpg/png/gif/webp 格式';
        return;
    }
    imageUploadMsg.value = '上传中...';
    try {
        const formData = new FormData();
        formData.append('file', file);
        const res = await axios.post('/public-report/upload-image', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        if (res.data.code === 200) {
            form.value.imageUrl = res.data.data.url;
            form.value.imagePreview = res.data.data.url;
            imageUploadMsg.value = '';
        } else {
            imageUploadMsg.value = res.data.msg || '上传失败';
        }
    } catch (err) {
        imageUploadMsg.value = err.response?.data?.msg || '上传失败';
    }
    e.target.value = '';
}

function openFullImage(url) {
    window.open(url, '_blank');
}

async function loadReports(search) {
    loading.value = true;
    try {
        const params = search ? { search } : {};
        const res = await axios.get('/public-report/list', { params });
        reports.value = res.data?.data || [];
    } catch (e) { reports.value = []; }
    finally { loading.value = false; }
}

async function doSearch() {
    await loadReports(searchQuery.value);
}

async function clearSearch() {
    searchQuery.value = '';
    await loadReports('');
}

async function submitReport() {
    errorMsg.value = '';
    successMsg.value = '';
    
    if (!currentUser?.id) {
        router.push({ name: 'loginPage' });
        return;
    }
    
    if (!form.value.gameId.trim()) { errorMsg.value = '请填写游戏ID'; return; }
    if (!form.value.description.trim()) { errorMsg.value = '请填写描述'; return; }

    submitting.value = true;
    try {
        const res = await axios.post('/public-report', {
            gameId: form.value.gameId,
            description: form.value.description,
            mmrMin: form.value.mmrMin,
            mmrMax: form.value.mmrMax,
            imageUrl: form.value.imageUrl || null,
            userId: currentUser?.id
        });
        if (res.data.code === 200) {
            successMsg.value = '记录已提交！';
            showForm.value = false;
            resetForm();
            await loadReports('');
        } else {
            errorMsg.value = res.data.msg || '提交失败';
        }
    } catch (e) {
        errorMsg.value = e.response?.data?.msg || e.message || '提交失败，请稍后再试';
    } finally {
        submitting.value = false;
    }
}

async function deleteReport(id) {
    if (!confirm('确认删除此记录？')) return;
    try {
        await axios.delete(`/public-report/${id}`, { params: { adminId: currentUser?.id } });
        await loadReports(searchQuery.value);
    } catch (e) { alert('删除失败'); }
}

function formatDate(d) {
    if (!d) return '';
    return new Date(d).toLocaleDateString('zh-CN');
}

onMounted(() => loadReports(''));
</script>

<style scoped>
.reports-page { max-width: 900px; margin: 0 auto; }

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

.action-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    gap: 12px;
    flex-wrap: wrap;
}

.search-box {
    display: flex;
    gap: 8px;
    flex: 1;
    max-width: 500px;
}

.search-input {
    flex: 1;
    padding: 10px 14px;
    background: var(--sc2-bg-dark);
    border: 1px solid var(--sc2-border);
    border-radius: 6px;
    color: var(--sc2-text-bright);
    font-size: 14px;
}
.search-input:focus { border-color: var(--sc2-accent); outline: none; }

.search-btn {
    padding: 10px 20px;
    background: var(--sc2-accent);
    color: var(--sc2-bg-deep);
    border: none;
    border-radius: 6px;
    font-family: 'Orbitron', sans-serif;
    font-size: 12px;
    cursor: pointer;
}

.clear-btn {
    padding: 10px 16px;
    background: transparent;
    color: var(--sc2-text-dim);
    border: 1px solid var(--sc2-border);
    border-radius: 6px;
    font-size: 13px;
    cursor: pointer;
}

.add-btn {
    padding: 10px 20px;
    background: rgba(255, 80, 80, 0.1);
    color: #ff5050;
    border: 1px solid rgba(255, 80, 80, 0.4);
    border-radius: 6px;
    font-family: 'Rajdhani', sans-serif;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
}
.add-btn:hover { background: rgba(255, 80, 80, 0.2); }

.sc2-panel {
    background: linear-gradient(135deg, var(--sc2-bg-panel), var(--sc2-bg-dark));
    border: 1px solid var(--sc2-border);
    border-radius: 12px;
    padding: 20px;
    position: relative;
    overflow: hidden;
}

.form-panel { margin-bottom: 20px; }
.form-panel h3 { color: var(--sc2-text-bright); margin-bottom: 16px; font-size: 16px; }

.wInput {
    width: 100%;
    padding: 10px 14px;
    background: var(--sc2-bg-dark);
    border: 1px solid var(--sc2-border);
    border-radius: 6px;
    color: var(--sc2-text-bright);
    font-size: 14px;
    font-family: inherit;
    margin-bottom: 10px;
    box-sizing: border-box;
    transition: border-color 0.2s;
}
.wInput:focus { border-color: var(--sc2-accent); outline: none; }
.textarea-input { resize: vertical; min-height: 80px; }

.char-count {
    font-size: 12px;
    color: var(--sc2-text-dim);
    text-align: right;
    margin-top: -6px;
    margin-bottom: 10px;
}

.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }

.form-actions {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
}

.btn-submit {
    padding: 8px 24px;
    background: var(--sc2-accent);
    color: var(--sc2-bg-deep);
    border: none;
    border-radius: 6px;
    font-family: 'Orbitron', sans-serif;
    font-size: 12px;
    cursor: pointer;
}
.btn-submit:disabled { opacity: 0.5; cursor: not-allowed; }

.btn-cancel {
    padding: 8px 16px;
    background: transparent;
    color: var(--sc2-text-dim);
    border: 1px solid var(--sc2-border);
    border-radius: 6px;
    font-size: 13px;
    cursor: pointer;
}

.msg { font-size: 13px; }
.msg.success { color: #00c864; }
.msg.error { color: #ff5050; }

.report-list { display: flex; flex-direction: column; gap: 12px; }

.report-header {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 10px;
    flex-wrap: wrap;
}

.game-id {
    font-family: 'Share Tech Mono', monospace;
    font-size: 16px;
    font-weight: 700;
    color: #ff5050;
}

.mmr-range {
    font-size: 12px;
    padding: 2px 10px;
    background: rgba(255, 160, 0, 0.1);
    border: 1px solid rgba(255, 160, 0, 0.3);
    border-radius: 10px;
    color: #ffa000;
}

.report-date {
    margin-left: auto;
    font-size: 12px;
    color: var(--sc2-text-dim);
}

.report-desc {
    color: var(--sc2-text);
    font-size: 14px;
    line-height: 1.6;
    white-space: pre-wrap;
}

.report-footer { margin-top: 10px; }

.delete-btn {
    padding: 4px 12px;
    background: rgba(255, 80, 80, 0.1);
    color: #ff5050;
    border: 1px solid rgba(255, 80, 80, 0.3);
    border-radius: 4px;
    font-size: 12px;
    cursor: pointer;
}

.loading-msg, .empty-msg {
    text-align: center;
    padding: 40px;
    color: var(--sc2-text-dim);
    font-size: 14px;
}

/* Image Upload Styles */
.image-upload-section { margin-bottom: 12px; }
.upload-label { display: block; font-size: 13px; color: var(--sc2-text-dim); margin-bottom: 6px; }
.image-upload-area {
    position: relative;
    border: 2px dashed var(--sc2-border);
    border-radius: 8px;
    padding: 16px;
    text-align: center;
    cursor: pointer;
    transition: border-color 0.2s;
    min-height: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
}
.image-upload-area:hover { border-color: var(--sc2-accent); }
.upload-placeholder { display: flex; flex-direction: column; align-items: center; gap: 6px; color: var(--sc2-text-dim); font-size: 13px; }
.image-preview { max-width: 100%; max-height: 200px; border-radius: 6px; object-fit: contain; }
.clear-image-btn {
    position: absolute; top: 4px; right: 4px; width: 24px; height: 24px; border-radius: 50%;
    background: rgba(255,80,80,0.9); color: #fff; border: none; cursor: pointer; font-size: 12px;
    display: flex; align-items: center; justify-content: center;
}

/* Report Image */
.report-image { margin-top: 10px; }
.report-image img { max-width: 100%; max-height: 400px; border-radius: 8px; cursor: pointer; object-fit: contain; transition: opacity 0.2s; }
.report-image img:hover { opacity: 0.85; }
</style>
