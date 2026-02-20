<template>
    <div class="match-info-page">
        <div v-if="!showForm">
            <h1 class="page-title">赛事宣传</h1>
            <p class="page-subtitle">TOURNAMENT EVENTS</p>

            <div v-if="events.length > 0" class="events-list">
                <div class="event-card sc2-panel" v-for="ev in events" :key="ev.id" @click="toggleEvent(ev.id)"
                    :class="{ expanded: expandedId === ev.id }">
                    <h2 class="event-title">{{ ev.title }}</h2>
                    <p class="event-desc">{{ ev.description }}</p>
                    <transition name="detail-fade">
                        <div v-show="expandedId === ev.id" class="event-details">
                            <div v-if="ev.rules" class="detail-row">
                                <span class="detail-label">规则</span>
                                <span>{{ ev.rules }}</span>
                            </div>
                            <div v-if="ev.rewards" class="detail-row">
                                <span class="detail-label">奖励</span>
                                <span class="reward-text">{{ ev.rewards }}</span>
                            </div>
                            <div v-if="ev.region" class="detail-row">
                                <span class="detail-label">服务器</span>
                                <span>{{ ev.region }}</span>
                            </div>
                            <div v-if="ev.startTime" class="detail-row">
                                <span class="detail-label">时间</span>
                                <span>{{ ev.startTime }}</span>
                            </div>
                            <div v-if="ev.groupLink" class="detail-row">
                                <span class="detail-label">群组</span>
                                <a :href="ev.groupLink" target="_blank" class="event-link">{{ ev.groupLink }}</a>
                            </div>
                        </div>
                    </transition>
                    <div class="card-footer">
                        <a v-if="ev.contactLink" :href="ev.contactLink" target="_blank" class="event-link" @click.stop>
                            联系链接
                        </a>
                        <span class="expand-hint">{{ expandedId === ev.id ? '收起' : '点击展开' }}</span>
                    </div>
                </div>
            </div>
            <div v-else class="sc2-panel empty-panel">
                <h2 class="event-title">暂无赛事</h2>
                <p class="event-desc">目前没有公开的赛事信息。</p>
            </div>
        </div>

        <!-- Submit Form -->
        <div v-if="showForm" class="sc2-panel form-panel">
            <h2 class="page-title">提交赛事</h2>
            <p class="page-subtitle">SUBMIT EVENT</p>
            <form class="event-form" @submit.prevent="submitEvent">
                <input type="text" v-model="form.title" placeholder="赛事名称" class="sc2-input">
                <textarea v-model="form.description" placeholder="赛事描述..." class="sc2-input textarea"
                    rows="4"></textarea>
                <input type="text" v-model="form.rules" placeholder="赛事规则" class="sc2-input">
                <input type="text" v-model="form.rewards" placeholder="奖励" class="sc2-input">
                <input type="text" v-model="form.contactLink" placeholder="联系链接" class="sc2-input">
                <input type="text" v-model="form.groupLink" placeholder="群组链接" class="sc2-input">
                <select v-model="form.region" class="sc2-input">
                    <option value="">选择服务器</option>
                    <option value="CN">中国</option>
                    <option value="KR">韩国</option>
                    <option value="US">美服</option>
                    <option value="EU">欧服</option>
                </select>
                <input type="text" v-model="form.startTime" placeholder="开始时间（如 2024-06-01 14:00）" class="sc2-input">
                <span v-if="errorMsg" class="error-msg">{{ errorMsg }}</span>
                <span v-if="successMsg" class="success-msg">{{ successMsg }}</span>
            </form>
        </div>

        <!-- Footer Action -->
        <div class="footer-action">
            <button class="sc2-btn-action" @click="toggleForm">
                <span>{{ showForm ? '提交赛事' : '提交我的赛事' }}</span>
                <svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 -960 960 960" width="18px"
                    fill="currentColor">
                    <path d="m321-80-71-71 329-329-329-329 71-71 400 400L321-80Z" />
                </svg>
            </button>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getEvents, createEvent } from '../api/api.js';

const props = defineProps({ user: Object });

const events = ref([]);
const showForm = ref(false);
const errorMsg = ref('');
const successMsg = ref('');
const expandedId = ref(null);

const form = ref({
    title: '', description: '', rules: '', rewards: '',
    contactLink: '', groupLink: '', region: '', startTime: ''
});

async function loadEvents() {
    try {
        const res = await getEvents();
        const data = res.data;
        events.value = Array.isArray(data) ? data : (data?.data || []);
    } catch (e) {
        events.value = [];
    }
}

async function submitEvent() {
    errorMsg.value = '';
    successMsg.value = '';
    if (!form.value.title) {
        errorMsg.value = '请输入赛事名称';
        return;
    }
    try {
        const userId = props.user?.id || 0;
        const res = await createEvent(form.value, userId);
        if (res.data.code === 200) {
            successMsg.value = '赛事已提交，等待审核';
            form.value = { title: '', description: '', rules: '', rewards: '', contactLink: '', groupLink: '', region: '', startTime: '' };
            showForm.value = false;
            loadEvents();
        } else {
            errorMsg.value = res.data.msg || '提交失败';
        }
    } catch (e) {
        errorMsg.value = '网络错误';
    }
}

function toggleForm() {
    if (showForm.value) {
        submitEvent();
    } else {
        showForm.value = true;
    }
}

function toggleEvent(id) {
    expandedId.value = expandedId.value === id ? null : id;
}

onMounted(loadEvents);
</script>

<style scoped>
.match-info-page {
    max-width: 900px;
    margin: 0 auto;
    padding-bottom: 100px;
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

.events-list {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.sc2-panel {
    background: linear-gradient(135deg, var(--sc2-bg-panel), var(--sc2-bg-dark));
    border: 1px solid var(--sc2-border);
    border-radius: 12px;
    padding: 28px;
    position: relative;
    overflow: hidden;
    transition: border-color 0.3s;
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

.event-card:hover {
    border-color: var(--sc2-border-glow);
    cursor: pointer;
}

.event-card.expanded {
    border-color: var(--sc2-accent);
    box-shadow: 0 0 20px rgba(0, 180, 216, 0.1);
}

.card-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 8px;
}

.expand-hint {
    font-size: 12px;
    color: var(--sc2-text-dim);
    font-style: italic;
}

.detail-fade-enter-active,
.detail-fade-leave-active {
    transition: all 0.3s ease;
    max-height: 300px;
    overflow: hidden;
}

.detail-fade-enter-from,
.detail-fade-leave-to {
    opacity: 0;
    max-height: 0;
}

.event-title {
    font-family: 'Orbitron', sans-serif;
    font-size: 20px;
    font-weight: 600;
    color: var(--sc2-text-bright);
    margin-bottom: 10px;
}

.event-desc {
    color: var(--sc2-text);
    font-size: 14px;
    line-height: 1.6;
    margin-bottom: 16px;
}

.event-details {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-bottom: 16px;
}

.detail-row {
    display: flex;
    gap: 12px;
    font-size: 13px;
}

.detail-label {
    color: var(--sc2-text-dim);
    min-width: 60px;
    font-weight: 600;
}

.reward-text {
    color: var(--sc2-gold);
}

.event-link {
    display: inline-block;
    color: var(--sc2-accent);
    text-decoration: none;
    font-size: 14px;
    transition: color 0.2s;
}

.event-link:hover {
    color: var(--sc2-text-bright);
    text-shadow: 0 0 8px rgba(0, 180, 216, 0.3);
}

/* Form */
.event-form {
    display: flex;
    flex-direction: column;
    gap: 14px;
    margin-top: 16px;
}

.sc2-input {
    width: 100%;
    max-width: 500px;
    padding: 12px 16px;
    font-family: 'Rajdhani', sans-serif;
    font-size: 15px;
    color: var(--sc2-text);
    background: var(--sc2-bg-dark);
    border: 1px solid var(--sc2-border);
    border-radius: 6px;
    transition: all 0.2s;
}

.sc2-input:focus {
    border-color: var(--sc2-accent);
    outline: none;
    box-shadow: 0 0 0 2px rgba(0, 180, 216, 0.15);
}

.sc2-input.textarea {
    resize: vertical;
    min-height: 80px;
}

.error-msg {
    color: var(--sc2-danger);
    font-size: 13px;
}

.success-msg {
    color: var(--sc2-success);
    font-size: 13px;
}

/* Footer */
.footer-action {
    position: fixed;
    bottom: 30px;
    right: 40px;
    z-index: 50;
}

.sc2-btn-action {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 16px 32px;
    background: transparent;
    border: 2px solid var(--sc2-accent);
    color: var(--sc2-accent);
    font-family: 'Orbitron', sans-serif;
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 1px;
    cursor: pointer;
    transition: all 0.3s ease;
    border-radius: 6px;
    backdrop-filter: blur(8px);
    background: rgba(8, 11, 18, 0.8);
}

.sc2-btn-action:hover {
    background: var(--sc2-accent);
    color: var(--sc2-bg-deep);
    box-shadow: 0 0 20px rgba(0, 180, 216, 0.3);
}

.empty-panel {
    text-align: center;
    padding: 60px;
}

@media (max-width: 768px) {
    .sc2-panel {
        padding: 16px;
    }

    .footer-action {
        right: 16px;
        bottom: 16px;
    }

    .sc2-btn-action {
        padding: 12px 20px;
        font-size: 13px;
    }
}
</style>
