<template>
    <div class="login-form">
        <h2 class="form-title">找回账号</h2>
        <p class="form-subtitle">RESET PASSWORD</p>
        <form @submit.prevent>
            <div class="code-row">
                <input type="email" class="wInputSmall" placeholder="注册邮箱" required v-model="email" autocomplete="email">
                <button type="button" class="send-code-btn" @click="handleSendCode" :disabled="countdown > 0">
                    {{ countdown > 0 ? `${countdown}s` : '发送' }}
                </button>
            </div>
            <input type="text" class="wInput" placeholder="验证码" required v-model="code" autocomplete="one-time-code">
            <input type="password" class="wInput" placeholder="新密码" required v-model="newPassword">
        </form>
        <wSubmitButton text="重 置 密 码" @click="handleReset" :loading="loading"></wSubmitButton>
        <div class="form-links">
            <wTextButton text="返回登录" @click="backToLogin"></wTextButton>
        </div>
    </div>
</template>

<script setup>
import { ref, onUnmounted } from 'vue';
import wSubmitButton from './widgets/wSubmitButton.vue';
import wTextButton from './widgets/wTextButton.vue';
import '../css/widgets.css';
import { sendEmailCode, resetPassword } from '../api/api';

const emit = defineEmits(['backToLogin']);

const email = ref('');
const code = ref('');
const newPassword = ref('');
const countdown = ref(0);
const loading = ref(false);

let timer = null;

onUnmounted(() => { if (timer) clearInterval(timer); });

async function handleSendCode() {
    if (!email.value) {
        alert('请输入邮箱');
        return;
    }
    // Start countdown immediately to prevent duplicate clicks
    countdown.value = 60;
    timer = setInterval(() => {
        countdown.value--;
        if (countdown.value <= 0) clearInterval(timer);
    }, 1000);
    try {
        await sendEmailCode(email.value.trim(), true);
        // Per UX: do not show success alert for verification-code send in password recovery.
    } catch (error) {
        // Reset countdown on failure
        clearInterval(timer);
        countdown.value = 0;
        alert(error.message || '发送失败');
    }
}

async function handleReset() {
    if (!email.value || !code.value || !newPassword.value) {
        alert('请完善信息');
        return;
    }
    loading.value = true;
    try {
        const res = await resetPassword(email.value, code.value, newPassword.value);
        if (res.data.code === 200 || res.data.code === 1) {
            alert('密码重置成功，请重新登录');
            emit('backToLogin');
        } else {
            alert(res.data.msg);
        }
    } catch (error) {
        alert(error.message || '操作失败');
    } finally {
        loading.value = false;
    }
}

function backToLogin() { emit('backToLogin'); }
</script>

<style scoped>
.login-form {
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
    letter-spacing: 2px;
    margin-bottom: 4px;
}

.form-subtitle {
    font-family: 'Orbitron', sans-serif;
    font-size: 10px;
    color: var(--sc2-text-dim);
    letter-spacing: 4px;
    margin-bottom: 32px;
}

form {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.code-row {
    display: flex;
    align-items: flex-end;
    gap: 10px;
}

.send-code-btn {
    padding: 10px 20px;
    margin-top: 16px;
    font-family: 'Rajdhani', sans-serif;
    font-size: 14px;
    font-weight: 600;
    color: white;
    background: var(--sc2-accent);
    border: none;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s;
}

.send-code-btn:hover {
    background: var(--sc2-accent-glow);
}

.form-links {
    margin-top: 24px;
}
</style>
