<template>
    <div class="ai-assistant sc2-panel">
        <div class="panel-header">
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor" class="header-icon">
                <path d="M480-120q-150 0-255-105T120-480q0-150 105-255t255-105q14 0 27.5 1t26.5 3l-48 48q-3-1-6.5-1t-6.5-1q-117 0-198.5 81.5T193-511q0 117 81.5 198.5T473-231q117 0 198.5-81.5T753-511q0-14-1.5-27.5T748-565l48-48q5 13 8.5 26.5T808-560q0 150-105 255T448-200Z"/>
            </svg>
            <span class="panel-title">AI 战略助手</span>
        </div>

        <div class="chat-container" ref="chatBox">
            <div v-for="(msg, idx) in messages" :key="idx" :class="['chat-msg', msg.role]">
                <div class="msg-content" v-html="renderMarkdown(msg.content)"></div>
            </div>
            <div v-if="loading" class="chat-msg ai loading">
                <div class="loading-dots">
                    <span>.</span><span>.</span><span>.</span>
                </div>
            </div>
        </div>

        <div class="input-area">
            <textarea v-model="userInput" @keydown.enter.prevent="sendMessage" placeholder="询问星际争霸2战术、单位克制或开局流程..." rows="3"></textarea>
            <button class="sc2-btn-action" :disabled="loading || !userInput.trim()" @click="sendMessage">
                发送
            </button>
        </div>
    </div>
</template>

<script setup>
import { ref, nextTick } from 'vue';
import api from '../api/api';
import { marked } from 'marked';
import DOMPurify from 'dompurify';

const userInput = ref('');
const loading = ref(false);
const chatBox = ref(null);
const messages = ref([
    { role: 'ai', content: '您好！我是您的星际争霸2 AI 战略顾问。有什么我可以帮您的？' }
]);

const renderMarkdown = (text) => {
    const rawHtml = marked.parse(String(text ?? ''), { mangle: false, headerIds: false });
    return DOMPurify.sanitize(rawHtml);
};

async function sendMessage() {
    if (!userInput.value.trim() || loading.value) return;

    const userPrompt = userInput.value;
    messages.value.push({ role: 'user', content: userPrompt });
    userInput.value = '';
    loading.value = true;

    await scrollToBottom();

    try {
        const response = await api.post('/ai/query', { prompt: userPrompt });
        if (response.data.code === 200 && response.data.data) {
            messages.value.push({ role: 'ai', content: response.data.data });
        } else {
            messages.value.push({ role: 'ai', content: '抱歉，服务目前不可用：' + (response.data.msg || '未知错误') });
        }
    } catch (e) {
        console.error('AI API Error:', e);
        messages.value.push({ role: 'ai', content: '由于无法连接到服务器：' + (e.message || '网络错误') });
    } finally {
        loading.value = false;
        await scrollToBottom();
    }
}

async function scrollToBottom() {
    await nextTick();
    if (chatBox.value) {
        chatBox.value.scrollTop = chatBox.value.scrollHeight;
    }
}
</script>

<style scoped>
.ai-assistant {
    max-width: 900px;
    margin: 0 auto;
    height: 700px;
    display: flex;
    flex-direction: column;
}

.chat-container {
    flex: 1;
    overflow-y: auto;
    padding: 20px;
    margin-bottom: 20px;
    background: rgba(0, 0, 0, 0.3);
    border-radius: 8px;
    border: 1px solid var(--sc2-border);
}

.chat-msg {
    margin-bottom: 15px;
    display: flex;
}

.chat-msg.user {
    justify-content: flex-end;
}

.msg-content {
    max-width: 80%;
    padding: 12px 18px;
    border-radius: 12px;
    font-size: 14px;
    line-height: 1.6;
}

.ai .msg-content {
    background: rgba(0, 180, 216, 0.1);
    color: var(--sc2-text-bright);
    border-left: 3px solid var(--sc2-accent);
}

.user .msg-content {
    background: var(--sc2-bg-light);
    color: var(--sc2-text-bright);
    border-right: 3px solid var(--sc2-accent);
}

.input-area {
    display: flex;
    gap: 12px;
}

textarea {
    flex: 1;
    background: var(--sc2-bg-dark);
    border: 1px solid var(--sc2-border);
    color: var(--sc2-text);
    padding: 12px;
    border-radius: 8px;
    resize: none;
    font-family: inherit;
}

textarea:focus {
    outline: none;
    border-color: var(--sc2-accent);
}

.loading-dots span {
    animation: blink 1.4s infinite reverse 0.2s;
}

@keyframes blink {
    0% { opacity: 0.2; }
    20% { opacity: 1; }
    100% { opacity: 0.2; }
}
</style>
