<template>
    <div class="feedback-page">
        <h1 class="page-title">BUG及其他反馈</h1>
        <p class="page-subtitle">BUG & FEEDBACK</p>
        <p class="page-desc">如果您发现任何BUG或有其他建议和反馈，请在此提交，管理员会尽快处理。</p>

        <!-- Submit Form -->
        <div class="form-panel sc2-panel">
            <h3>提交反馈</h3>
            <textarea v-model="form.content" class="wInput textarea-input" 
                placeholder="请详细描述您遇到的BUG或反馈内容 (最多5000字)" 
                rows="6" maxlength="5000"></textarea>
            <div class="char-count">{{ form.content.length }} / 5000</div>
            <div class="form-actions">
                <button class="btn-submit" @click="submitFeedback" :disabled="submitting">
                    {{ submitting ? '提交中...' : '提交反馈' }}
                </button>
                <span class="msg success" v-if="successMsg">{{ successMsg }}</span>
                <span class="msg error" v-if="errorMsg">{{ errorMsg }}</span>
            </div>
        </div>

        <!-- My Feedbacks -->
        <div class="my-feedbacks" v-if="myFeedbacks.length > 0">
            <h3 class="section-title">我的反馈记录</h3>
            <div v-for="f in myFeedbacks" :key="f.id" class="feedback-card sc2-panel">
                <div class="feedback-header">
                    <span class="status-badge" :class="f.status">
                        {{ statusMap[f.status] || f.status }}
                    </span>
                    <span class="feedback-date">{{ formatDate(f.createdAt) }}</span>
                </div>
                <p class="feedback-content">{{ f.content }}</p>
                <div class="admin-reply" v-if="f.adminReply">
                    <span class="reply-label">管理员回复：</span>
                    <p>{{ f.adminReply }}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { getStoredUser, createFeedback, getMyFeedbacks } from '../api/api.js';

const router = useRouter();
const currentUser = getStoredUser();

const form = ref({ content: '' });
const submitting = ref(false);
const successMsg = ref('');
const errorMsg = ref('');
const myFeedbacks = ref([]);

const statusMap = {
    pending: '待处理',
    processing: '处理中',
    resolved: '已解决',
    rejected: '已关闭'
};

async function submitFeedback() {
    errorMsg.value = '';
    successMsg.value = '';

    if (!currentUser) {
        router.push({ name: 'loginPage' });
        return;
    }

    if (!form.value.content.trim()) {
        errorMsg.value = '请填写反馈内容';
        return;
    }

    submitting.value = true;
    try {
        const res = await createFeedback({ content: form.value.content });
        if (res.data.code === 200) {
            successMsg.value = '反馈已提交，感谢您的反馈！';
            form.value.content = '';
            await loadMyFeedbacks();
        } else {
            errorMsg.value = res.data.msg || '提交失败';
        }
    } catch (e) {
        errorMsg.value = e.response?.data?.msg || e.message || '提交失败，请稍后再试';
    } finally {
        submitting.value = false;
    }
}

async function loadMyFeedbacks() {
    if (!currentUser) return;
    try {
        const res = await getMyFeedbacks();
        myFeedbacks.value = res.data?.data || [];
    } catch (e) {
        myFeedbacks.value = [];
    }
}

function formatDate(d) {
    if (!d) return '';
    return new Date(d).toLocaleDateString('zh-CN');
}

onMounted(() => {
    loadMyFeedbacks();
});
</script>

<style scoped>
.feedback-page { max-width: 800px; margin: 0 auto; }

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

.form-panel { margin-bottom: 30px; }
.form-panel h3 {
    color: var(--sc2-text-bright);
    font-size: 16px;
    margin-bottom: 12px;
}

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
.textarea-input { resize: vertical; min-height: 120px; font-family: inherit; }

.char-count {
    font-size: 12px;
    color: var(--sc2-text-dim);
    text-align: right;
    margin-top: -2px;
    margin-bottom: 10px;
}

.form-actions { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }

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

.msg { font-size: 13px; }
.msg.success { color: #00c864; }
.msg.error { color: #ff5050; }

.section-title {
    color: var(--sc2-text-bright);
    font-size: 18px;
    margin-bottom: 16px;
}

.my-feedbacks { display: flex; flex-direction: column; gap: 12px; }

.feedback-card { padding: 16px; }

.feedback-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
}

.status-badge {
    display: inline-block;
    padding: 2px 10px;
    border-radius: 10px;
    font-size: 12px;
    font-weight: 600;
}
.status-badge.pending { background: rgba(255, 160, 0, 0.15); color: #ffa000; border: 1px solid rgba(255, 160, 0, 0.3); }
.status-badge.processing { background: rgba(0, 180, 216, 0.15); color: var(--sc2-accent); border: 1px solid rgba(0, 180, 216, 0.3); }
.status-badge.resolved { background: rgba(0, 200, 100, 0.15); color: #00c864; border: 1px solid rgba(0, 200, 100, 0.3); }
.status-badge.rejected { background: rgba(255, 80, 80, 0.15); color: #ff5050; border: 1px solid rgba(255, 80, 80, 0.3); }

.feedback-date { font-size: 12px; color: var(--sc2-text-dim); }

.feedback-content {
    color: var(--sc2-text);
    font-size: 14px;
    line-height: 1.6;
    white-space: pre-wrap;
}

.admin-reply {
    margin-top: 12px;
    padding: 10px;
    background: rgba(0, 180, 216, 0.05);
    border-left: 3px solid var(--sc2-accent);
    border-radius: 0 6px 6px 0;
}
.reply-label { font-size: 12px; color: var(--sc2-accent); font-weight: 600; }
.admin-reply p { color: var(--sc2-text); font-size: 13px; line-height: 1.5; margin-top: 4px; }
</style>
