<template>
    <div class="login-form">
        <h2 class="form-title">登录</h2>
        <p class="form-subtitle">VERIFICATION CODE</p>
        <form @submit.prevent>
            <div class="code-row">
                <input type="text" class="wInputSmall" placeholder="手机号" required>
                <button class="send-code-btn">发送</button>
            </div>
            <input type="password" class="wInput" placeholder="验证码" required>
        </form>
        <wSubmitButton text="登 录" @click="userLogin"></wSubmitButton>
        <div class="form-links">
            <wTextButton text="账号密码登录" @click="sendMessage"></wTextButton>
            <wTextButton text="没有账号？马上注册" @click="registerMessage"></wTextButton>
        </div>
    </div>
</template>

<script setup>
import wSubmitButton from './widgets/wSubmitButton.vue';
import wTextButton from './widgets/wTextButton.vue';
import '../css/widgets.css';

const emit = defineEmits(['changeMode', 'jumpToRegisterPage', 'userLogin']);

function sendMessage() { emit('changeMode'); }
function registerMessage() { emit('jumpToRegisterPage'); }
function userLogin() { emit('userLogin'); }
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
