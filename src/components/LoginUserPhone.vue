<template>
    <div class="login-form">
        <h2 class="form-title">登录</h2>
        <p class="form-subtitle">VERIFICATION CODE</p>
        <form @submit.prevent>
            <div class="code-row">
                <input type="email" class="wInputSmall" placeholder="电子邮箱" required v-model="email">
                <button type="button" class="send-code-btn" @click="handleSendCode" :disabled="countdown > 0">
                    {{ countdown > 0 ? `${countdown}s` : '发送' }}
                </button>
            </div>
            <input type="text" class="wInput" placeholder="验证码" required v-model="code">
        </form>
        <wSubmitButton text="登 录" @click="handleLogin" :loading="loading"></wSubmitButton>
        <div class="form-links">
            <wTextButton text="账号密码登录" @click="sendMessage"></wTextButton>
            <wTextButton text="没有账号？马上注册" @click="registerMessage"></wTextButton>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import wSubmitButton from './widgets/wSubmitButton.vue';
import wTextButton from './widgets/wTextButton.vue';
import '../css/widgets.css';
import { sendEmailCode, loginByCode } from '../api/api';

const emit = defineEmits(['changeMode', 'jumpToRegisterPage', 'userLogin']);

const email = ref('');
const code = ref('');
const countdown = ref(0);
const loading = ref(false);

let timer = null;

async function handleSendCode() {
    if (!email.value) {
        alert('请输入邮箱');
        return;
    }
    try {
        await sendEmailCode(email.value);
        alert('验证码已发送到邮箱，请查收');
        countdown.value = 60;
        timer = setInterval(() => {
            countdown.value--;
            if (countdown.value <= 0) {
                clearInterval(timer);
            }
        }, 1000);
    } catch (error) {
        alert(error.response?.data?.msg || '发送失败');
    }
}

async function handleLogin() {
    if (!email.value || !code.value) {
        alert('请完善信息');
        return;
    }
    loading.value = true;
    try {
        const res = await loginByCode(email.value, code.value);
        if (res.data.code === 200) {
            localStorage.setItem('user', JSON.stringify(res.data.data));
            emit('userLogin');
        } else {
            alert(res.data.msg);
        }
    } catch (error) {
        alert(error.response?.data?.msg || '登录失败');
    } finally {
        loading.value = false;
    }
}

function sendMessage() { emit('changeMode'); }
function registerMessage() { emit('jumpToRegisterPage'); }
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
    font-size: 32px;
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
    box-shadow: 0 0 12px rgba(0, 180, 216, 0.3);
}

.form-links {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    margin-top: 24px;
}
</style>
