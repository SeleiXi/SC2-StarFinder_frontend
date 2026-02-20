<template>
    <div class="sc2-auth-bg">
        <div class="sc2-auth-container">
            <div class="auth-cover">
                <div class="cover-overlay"></div>
                <div class="cover-content">
                    <h1 class="cover-title">STARCRAFT II</h1>
                    <p class="cover-subtitle">STAR FINDER</p>
                </div>
            </div>
            <div class="auth-form-area">
                <transition name="slide-fade" mode="out-in">
                    <component :is="currentComponent" @changeMode="changeMode" @jumpToRegisterPage="jumpToRegisterPage"
                        @userLogin="userLogin"></component>
                </transition>
            </div>
        </div>
    </div>
</template>

<script setup>
import { shallowRef } from 'vue';
import { useRouter } from 'vue-router';

import LoginUserName from './components/LoginUserName.vue';
import LoginUserPhone from './components/LoginUserPhone.vue';

const router = useRouter();
const currentComponent = shallowRef(LoginUserName);

function changeMode() {
    currentComponent.value = currentComponent.value === LoginUserName ? LoginUserPhone : LoginUserName;
}

function jumpToRegisterPage() {
    router.push({ name: 'registerPage' });
}

function userLogin() {
    router.push({ name: 'homePage' });
}
</script>

<style scoped>
.sc2-auth-bg {
    min-height: 100vh;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background:
        radial-gradient(ellipse at 30% 40%, rgba(0, 180, 216, 0.08) 0%, transparent 50%),
        radial-gradient(ellipse at 70% 60%, rgba(42, 74, 122, 0.1) 0%, transparent 40%),
        var(--sc2-bg-deep);
}

.sc2-auth-container {
    display: flex;
    width: 900px;
    height: 560px;
    border-radius: 16px;
    overflow: hidden;
    border: 1px solid var(--sc2-border);
    box-shadow:
        0 0 40px rgba(0, 0, 0, 0.5),
        0 0 80px rgba(0, 180, 216, 0.05);
}

.auth-cover {
    position: relative;
    width: 45%;
    background: url("./assets/pics/login-cover.jpg") center/cover no-repeat;
}

.cover-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(8, 11, 18, 0.7), rgba(0, 180, 216, 0.15));
}

.cover-content {
    position: absolute;
    bottom: 40px;
    left: 30px;
    z-index: 1;
}

.cover-title {
    font-family: 'Orbitron', sans-serif;
    font-size: 24px;
    font-weight: 800;
    color: var(--sc2-text-bright);
    letter-spacing: 3px;
    text-shadow: 0 0 20px rgba(0, 180, 216, 0.5);
}

.cover-subtitle {
    font-family: 'Orbitron', sans-serif;
    font-size: 13px;
    color: var(--sc2-accent);
    letter-spacing: 6px;
    margin-top: 8px;
}

.auth-form-area {
    flex: 1;
    background: var(--sc2-bg-panel);
    display: flex;
    align-items: center;
    justify-content: center;
}

/* Transitions */
.slide-fade-enter-active {
    transition: transform 0.25s ease-out, opacity 0.15s ease-in 0.1s;
}

.slide-fade-leave-active {
    transition: transform 0.25s ease-in, opacity 0.1s ease-out;
}

.slide-fade-enter-from {
    opacity: 0;
    transform: translateX(40px);
}

.slide-fade-leave-to {
    opacity: 0;
    transform: translateX(-40px);
}
</style>
