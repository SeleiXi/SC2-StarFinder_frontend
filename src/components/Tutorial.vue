<template>
    <div class="tutorial-page">
        <h1 class="page-title">教学视频</h1>
        <p class="page-subtitle">SC2 TUTORIALS</p>

        <div class="top-bar">
            <div class="cat-tabs">
                <button :class="{ active: currentCat === '' }" @click="loadTutorials('')">全部</button>
                <button :class="{ active: currentCat === '入门' }" @click="loadTutorials('入门')">入门</button>
                <button :class="{ active: currentCat === '进阶' }" @click="loadTutorials('进阶')">进阶</button>
                <button :class="{ active: currentCat === '高级' }" @click="loadTutorials('高级')">高级</button>
            </div>
            <button v-if="isLoggedIn" class="publish-btn" @click="showPublishDialog = true">
                <svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 -960 960 960" width="18px" fill="currentColor"><path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"/></svg>
                发布教程
            </button>
        </div>

        <!-- Publish Dialog -->
        <div v-if="showPublishDialog" class="dialog-overlay" @click.self="showPublishDialog = false">
            <div class="dialog-box sc2-panel">
                <h3 class="dialog-title">发布教程视频</h3>
                <div class="dialog-form">
                    <label>标题 *</label>
                    <input v-model="form.title" class="wInput" placeholder="请输入教程标题" />
                    <label>视频链接 *</label>
                    <input v-model="form.url" class="wInput" placeholder="粘贴视频 URL" />
                    <label>分类</label>
                    <select v-model="form.category" class="wInput wSelect">
                        <option value="入门">入门</option>
                        <option value="进阶">进阶</option>
                        <option value="高级">高级</option>
                    </select>
                    <label>简介</label>
                    <textarea v-model="form.description" class="wInput" placeholder="这个视频讲了什么？" rows="3" style="resize:vertical"></textarea>
                    <label>署名</label>
                    <input v-model="form.author" class="wInput" placeholder="会是你的 BattleTag，也可修改" />
                </div>
                <span v-if="publishError" class="error-msg">{{ publishError }}</span>
                <div class="dialog-actions">
                    <button class="sc2-btn-primary" @click="submitTutorial" :disabled="publishing">
                        {{ publishing ? '提交中...' : '确认发布' }}
                    </button>
                    <button class="sc2-btn-cancel" @click="showPublishDialog = false">取消</button>
                </div>
            </div>
        </div>

        <div v-if="tutorials.length > 0" class="tutorial-list">
            <div v-for="t in tutorials" :key="t.id" class="tutorial-card sc2-panel">
                <div class="card-header-row">
                    <div class="card-title">
                        {{ t.title }}
                        <small v-if="t.author" class="card-author">by {{ t.author }}</small>
                    </div>
                    <div class="video-link-area">
                        <a :href="t.url" target="_blank" class="sc2-btn-secondary">
                            <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px"
                                fill="currentColor">
                                <path d="M320-200v-560l440 280-440 280Z" />
                            </svg>
                            <span>立即观看视频</span>
                        </a>
                    </div>
                </div>
                <p v-if="t.description" class="card-desc">{{ t.description }}</p>
            </div>
        </div>
        <p v-else class="empty-msg">暂无视频</p>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { getTutorials, createTutorial, getStoredUser } from '../api/api.js';

const tutorials = ref([]);
const currentCat = ref('');
const showPublishDialog = ref(false);
const publishing = ref(false);
const publishError = ref('');

const storedUser = getStoredUser();
const isLoggedIn = computed(() => !!storedUser);

const form = ref({
    title: '',
    url: '',
    category: '入门',
    description: '',
    author: storedUser?.battleTag || storedUser?.email || ''
});

async function loadTutorials(cat) {
    currentCat.value = cat;
    try {
        const res = await getTutorials(cat || undefined);
        const data = res.data;
        tutorials.value = Array.isArray(data) ? data : (data?.data || []);
    } catch (e) {
        tutorials.value = [];
    }
}

async function submitTutorial() {
    publishError.value = '';
    if (!form.value.title.trim()) { publishError.value = '标题不能为空'; return; }
    if (!form.value.url.trim()) { publishError.value = '视频链接不能为空'; return; }
    publishing.value = true;
    try {
        const res = await createTutorial({ ...form.value });
        if (res.data.code === 200) {
            showPublishDialog.value = false;
            form.value = { title: '', url: '', category: '入门', description: '', author: storedUser?.battleTag || storedUser?.email || '' };
            await loadTutorials(currentCat.value);
        } else {
            publishError.value = res.data.msg || '发布失败';
        }
    } catch (e) {
        publishError.value = e.message || '发布失败';
    } finally {
        publishing.value = false;
    }
}

onMounted(() => loadTutorials(''));
</script>

<style scoped>
.tutorial-page {
    max-width: 1000px;
    margin: 0 auto;
}

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
    margin-bottom: 24px;
}

.cat-tabs {
    display: flex;
    gap: 8px;
    margin-bottom: 24px;
}

.cat-tabs button {
    padding: 8px 20px;
    font-family: 'Rajdhani', sans-serif;
    font-size: 14px;
    font-weight: 600;
    color: var(--sc2-text);
    background: transparent;
    border: 1px solid var(--sc2-border);
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s;
}

.cat-tabs button:hover,
.cat-tabs button.active {
    background: var(--sc2-accent);
    color: var(--sc2-bg-deep);
    border-color: var(--sc2-accent);
    box-shadow: 0 0 8px rgba(0, 180, 216, 0.2);
}

.tutorial-list {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.sc2-panel {
    background: linear-gradient(135deg, var(--sc2-bg-panel), var(--sc2-bg-dark));
    border: 1px solid var(--sc2-border);
    border-radius: 12px;
    padding: 24px;
    position: relative;
    overflow: hidden;
}

.sc2-panel::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent, var(--sc2-accent), transparent);
    opacity: 0.5;
}

.card-header-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
}

.card-title {
    font-size: 18px;
    font-weight: 600;
    color: var(--sc2-text-bright);
}

.card-author {
    font-size: 13px;
    color: var(--sc2-text-dim);
    font-weight: 400;
    margin-left: 8px;
}

.video-link-area {
    margin: 0;
}

.sc2-btn-secondary {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 10px 20px;
    border: 1px solid var(--sc2-border);
    border-radius: 6px;
    background: rgba(0, 180, 216, 0.05);
    color: var(--sc2-accent);
    text-decoration: none;
    font-family: 'Rajdhani', sans-serif;
    font-size: 14px;
    font-weight: 600;
    transition: all 0.2s;
}

.sc2-btn-secondary:hover {
    background: var(--sc2-accent);
    color: var(--sc2-bg-deep);
    border-color: var(--sc2-accent);
    box-shadow: 0 0 15px rgba(0, 180, 216, 0.3);
}

.card-desc {
    margin-top: 12px;
    color: var(--sc2-text-dim);
    font-size: 14px;
}

.empty-msg {
    color: var(--sc2-text-dim);
    text-align: center;
    padding: 60px;
    font-size: 16px;
}

@media (max-width: 768px) {
    .cat-tabs {
        flex-wrap: wrap;
    }

    .tutorial-card {
        padding: 16px;
    }
}

@media (max-width: 480px) {
    .tutorial-iframe {
        height: 200px;
    }
}

.top-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
    flex-wrap: wrap;
    gap: 12px;
}

.top-bar .cat-tabs {
    margin-bottom: 0;
}

.publish-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 8px 18px;
    background: rgba(0,180,216,0.1);
    border: 1px solid var(--sc2-accent);
    border-radius: 6px;
    color: var(--sc2-accent);
    font-family: 'Rajdhani', sans-serif;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
}

.publish-btn:hover {
    background: var(--sc2-accent);
    color: var(--sc2-bg-deep);
    box-shadow: 0 0 12px rgba(0,180,216,0.3);
}

.dialog-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: 20px;
    box-sizing: border-box;
}

.dialog-box {
    width: 100%;
    max-width: 520px;
    padding: 32px;
}

.dialog-title {
    font-family: 'Orbitron', sans-serif;
    font-size: 18px;
    color: var(--sc2-accent);
    margin-bottom: 20px;
}

.dialog-form {
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin-bottom: 16px;
}

.dialog-form label {
    font-size: 12px;
    color: var(--sc2-text-dim);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-top: 8px;
}

.wSelect {
    cursor: pointer;
    background: var(--sc2-bg-dark);
    color: var(--sc2-text);
    border: 1px solid var(--sc2-border);
    border-radius: 8px;
    padding: 12px 16px;
    font-size: 14px;
    width: 100%;
}

.dialog-actions {
    display: flex;
    gap: 10px;
    justify-content: flex-end;
    margin-top: 8px;
}

.sc2-btn-primary {
    padding: 10px 24px;
    background: var(--sc2-accent);
    color: var(--sc2-bg-deep);
    border: none;
    border-radius: 6px;
    font-family: 'Rajdhani', sans-serif;
    font-size: 14px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.2s;
}

.sc2-btn-primary:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.sc2-btn-cancel {
    padding: 10px 20px;
    background: transparent;
    color: var(--sc2-text-dim);
    border: 1px solid var(--sc2-border);
    border-radius: 6px;
    font-family: 'Rajdhani', sans-serif;
    font-size: 14px;
    cursor: pointer;
}

.error-msg {
    display: block;
    color: var(--sc2-danger, #ff4444);
    font-size: 13px;
    margin-bottom: 8px;
}
</style>
