<template>
    <div class="login-form">
        <h2 class="form-title">登录</h2>
        <p class="form-subtitle">WELCOME BACK, COMMANDER</p>
        <form @submit.prevent>
            <input type="text" v-model="phone" class="wInput" placeholder="手机号" required>
            <input type="password" v-model="password" class="wInput" placeholder="密码" required>
        </form>
        <span v-if="errorMsg" class="error-msg">{{ errorMsg }}</span>
        <wSubmitButton text="登 录" @click="userLogin"></wSubmitButton>
        <div class="form-links">
            <wTextButton text="验证码登录" @click="sendMessage"></wTextButton>
            <wTextButton text="没有账号？马上注册" @click="registerMessage"></wTextButton>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import wSubmitButton from './widgets/wSubmitButton.vue';
import wTextButton from './widgets/wTextButton.vue';
import { login, saveUser } from '../api/api.js';
import '../css/widgets.css';

const emit = defineEmits(['changeMode', 'jumpToRegisterPage', 'userLogin']);

const phone = ref('');
const password = ref('');
const errorMsg = ref('');

function sendMessage() { emit('changeMode'); }
function registerMessage() { emit('jumpToRegisterPage'); }

async function userLogin() {
    errorMsg.value = '';
    if (!phone.value || !password.value) {
        errorMsg.value = '请填写手机号和密码';
        return;
    }
    try {
        const res = await login({ phoneNumber: phone.value, password: password.value });
        if (res.data.code === 200) {
            saveUser(res.data.data);
            emit('userLogin');
        } else {
            errorMsg.value = res.data.msg || '登录失败';
        }
    } catch (e) {
        errorMsg.value = '网络错误，请重试';
    }
}
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

.error-msg {
    color: var(--sc2-danger);
    font-size: 13px;
    margin-top: 12px;
}

.form-links {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    margin-top: 24px;
}
</style>
