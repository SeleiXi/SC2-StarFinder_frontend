<template>
    <div class="sc2-auth-bg">
        <div class="sc2-auth-container">
            <div class="auth-cover">
                <div class="cover-overlay"></div>
                <div class="cover-content">
                    <h1 class="cover-title">STARCRAFT II</h1>
                    <p class="cover-subtitle">JOIN THE BATTLE</p>
                </div>
            </div>
            <div class="auth-form-area">
                <Register />
            </div>
        </div>
    </div>
</template>

<script setup>
import Register from './components/Register.vue';
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
    min-height: 620px;
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
    padding: 20px 0;
}
/* Mobile layout: hide cover and stretch form to full width for easier input */
@media (max-width: 640px) {
    .sc2-auth-container {
        width: 100%;
        min-height: 100vh;
        flex-direction: column;
        align-items: stretch;
        height: auto;
    }
    .auth-cover {
        display: none;
    }
    .auth-form-area {
        width: 100%;
        padding: 24px;
        box-sizing: border-box;
        justify-content: flex-start;
    }
}
/* Hide the textual cover titles on small screens (mobile) per UI spec */
@media (max-width: 640px) {
    .cover-title,
    .cover-subtitle {
        display: none;
    }
}
</style>
