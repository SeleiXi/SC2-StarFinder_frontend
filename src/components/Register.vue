<template>
    <div class="register-form">
        <h2 class="form-title">注册</h2>
        <p class="form-subtitle">CREATE YOUR ACCOUNT</p>
        <form @submit.prevent>
            <input type="email" v-model="form.email" class="wInput" placeholder="电子邮箱" required>
            
            <div class="code-row">
                <input type="text" v-model="form.emailCode" class="wInput" placeholder="邮箱验证码" required style="margin-top: 0; flex: 1;">
                <button type="button" class="send-code-btn" @click="handleSendCode" :disabled="countdown > 0" style="margin-top: 0;">
                    {{ countdown > 0 ? `${countdown}s` : '发送验证码' }}
                </button>
            </div>

            <div class="inline-row">
                <input type="text" v-model="form.battleTag" class="wInput" placeholder="战网ID (选填，如 Amaris#31262)" style="flex: 2; margin-top: 0;">
                <select v-model="form.region" class="region-select" style="flex: 1.1; margin-top: 0;">
                    <option value="US">美服</option>
                    <option value="EU">欧服</option>
                    <option value="KR">韩服</option>
                    <option value="CN">国服</option>
                </select>
            </div>

            <input type="text" v-model="form.qq" class="wInput" placeholder="QQ号 (选填)">
            <input type="password" v-model="form.password" class="wInput" placeholder="密码 (至少8位)" required>
        </form>
        <span v-if="errorMsg" class="error-msg">{{ errorMsg }}</span>
        <span v-if="successMsg" class="success-msg">{{ successMsg }}</span>
        <wSubmitButton text="创建账号" @click="handleRegister"></wSubmitButton>
        <wTextButton text="已有账号？即刻登录" @click="jumpToLoginPage" style="margin-top: 20px;"></wTextButton>
    </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import router from '@/router/router';
import wSubmitButton from './widgets/wSubmitButton.vue';
import wTextButton from './widgets/wTextButton.vue';
import { register, saveUser, sendEmailCode } from '../api/api.js';
import '../css/widgets.css';

const form = reactive({
    battleTag: '', email: '', emailCode: '', qq: '', password: '', region: 'CN'
});
const errorMsg = ref('');
const successMsg = ref('');
const countdown = ref(0);
let timer = null;

async function handleSendCode() {
    if (!form.email) {
        errorMsg.value = '请先输入邮箱';
        return;
    }
    
    // Start countdown immediately (Task 1)
    errorMsg.value = '';
    successMsg.value = '请求中...';
    countdown.value = 60;
    timer = setInterval(() => {
        countdown.value--;
        if (countdown.value <= 0) {
            clearInterval(timer);
            successMsg.value = '';
        }
    }, 1000);

    try {
        await sendEmailCode(form.email.trim());
        successMsg.value = '验证码已发送到邮箱';
    } catch (e) {
        // Reset if failed
        clearInterval(timer);
        countdown.value = 0;
        successMsg.value = '';
        errorMsg.value = e.response?.data?.msg || '发送失败，请重试';
    }
}

async function handleRegister() {
    errorMsg.value = '';
    successMsg.value = '';
    if (!form.email || !form.password || !form.emailCode) {
        errorMsg.value = '请完善注册信息';
        return;
    }
    
    // Password strength check: at least 8 chars
    if (form.password.length < 8) {
        errorMsg.value = '密码太弱：需至少8位';
        return;
    }

    try {
        // Use spread to ensure we send current values (Task 2)
        const res = await register({ ...form, email: form.email.trim() });
        if (res.data.code === 200) {
            saveUser(res.data.data);
            successMsg.value = '注册成功！即将跳转...';
            setTimeout(() => router.push({ name: 'homePage' }), 1000);
        } else {
            errorMsg.value = res.data.msg || '注册失败';
        }
    } catch (e) {
        errorMsg.value = e.response?.data?.msg || '网络错误，请重试';
    }
}

function jumpToLoginPage() {
    router.push({ name: 'loginPage' });
}
</script>

<style scoped>
.register-form {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    padding: 0 40px;
}

.form-title {
    font-family: 'Orbitron', sans-serif;
    font-size: 28px;
    font-weight: 700;
    color: var(--sc2-text-bright);
    letter-spacing: 3px;
    margin-bottom: 4px;
}

.form-subtitle {
    font-family: 'Orbitron', sans-serif;
    font-size: 10px;
    color: var(--sc2-text-dim);
    letter-spacing: 4px;
    margin-bottom: 20px;
}

form {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.inline-row {
    display: flex;
    align-items: center;
    gap: 10px;
    width: 100%;
    max-width: 360px;
    margin-top: 16px;
}

.code-row {
    display: flex;
    align-items: center;
    gap: 10px;
    width: 100%;
    max-width: 360px;
    margin-top: 16px;
}

.send-code-btn {
    padding: 0 15px;
    background: var(--sc2-primary);
    border: none;
    color: white;
    cursor: pointer;
    font-family: 'Orbitron', sans-serif;
    font-size: 11px;
    white-space: nowrap;
    height: 48px;
    flex-shrink: 0;
}

.send-code-btn:disabled {
    background: #333;
    color: #666;
    cursor: not-allowed;
}

.region-select {
    height: 48px;
    background: rgba(0, 0, 0, 0.5);
    border: 1px solid var(--sc2-border);
    color: var(--sc2-text-bright);
    padding: 0 10px;
    font-size: 14px;
    border-radius: 4px;
}

.error-msg {
    color: var(--sc2-danger);
    font-size: 13px;
    margin: 8px 0;
}

.success-msg {
    color: #00ff00;
    font-size: 13px;
    margin: 8px 0;
}

.region-select {
    margin-top: 16px;
    padding: 10px 14px;
    font-family: 'Rajdhani', sans-serif;
    font-size: 14px;
    color: var(--sc2-text);
    background: var(--sc2-bg-dark);
    border: 1px solid var(--sc2-border);
    border-radius: 6px;
    cursor: pointer;
    transition: border-color 0.2s;
}

.region-select:focus {
    border-color: var(--sc2-accent);
    outline: none;
}

.error-msg {
    color: var(--sc2-danger);
    font-size: 13px;
    margin-top: 10px;
}

.success-msg {
    color: var(--sc2-success);
    font-size: 13px;
    margin-top: 10px;
}
</style>
