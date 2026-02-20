<template>
    <div class="register-form">
        <h2 class="form-title">注册</h2>
        <p class="form-subtitle">CREATE YOUR ACCOUNT</p>
        <form @submit.prevent>
            <input type="text" v-model="form.name" class="wInput" placeholder="用户名" required>
            <input type="text" v-model="form.battleTag" class="wInput" placeholder="战网ID (如 Amaris#31262)">
            <input type="text" v-model="form.qq" class="wInput" placeholder="QQ号">
            <div class="inline-row">
                <input type="text" v-model="form.phoneNumber" class="wInputSmall" placeholder="手机号" required>
                <select v-model="form.region" class="region-select">
                    <option value="US">美服</option>
                    <option value="EU">欧服</option>
                    <option value="KR">韩服</option>
                    <option value="CN">国服</option>
                </select>
            </div>
            <input type="password" v-model="form.password" class="wInput" placeholder="密码" required>
            <input type="password" v-model="confirmPassword" class="wInput" placeholder="确认密码" required>
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
import { register, saveUser } from '../api/api.js';
import '../css/widgets.css';

const form = reactive({
    name: '', battleTag: '', qq: '', phoneNumber: '', password: '', region: 'US'
});
const confirmPassword = ref('');
const errorMsg = ref('');
const successMsg = ref('');

async function handleRegister() {
    errorMsg.value = '';
    successMsg.value = '';
    if (!form.phoneNumber || !form.password) {
        errorMsg.value = '请填写手机号和密码';
        return;
    }
    if (form.password !== confirmPassword.value) {
        errorMsg.value = '两次密码输入不一致';
        return;
    }
    try {
        const res = await register(form);
        if (res.data.code === 200) {
            saveUser(res.data.data);
            successMsg.value = '注册成功！即将跳转...';
            setTimeout(() => router.push({ name: 'homePage' }), 1000);
        } else {
            errorMsg.value = res.data.msg || '注册失败';
        }
    } catch (e) {
        errorMsg.value = '网络错误，请重试';
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
    align-items: flex-end;
    gap: 10px;
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
