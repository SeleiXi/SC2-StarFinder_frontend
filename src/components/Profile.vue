<template>
    <div class="profile-page">
        <!-- Header Banner -->
        <div class="profile-banner">
            <div class="banner-bg"></div>
            <div class="banner-overlay"></div>
            <div class="profile-avatar-wrap">
                <div class="profile-avatar"></div>
                <div class="avatar-ring"></div>
            </div>
        </div>

        <!-- Info Card -->
        <div class="profile-card sc2-panel">
            <div class="card-header">
                <h1 class="profile-name">{{ user?.name || '未设置昵称' }}</h1>
                <button class="edit-btn" @click="jumpToProfileEditPage" title="编辑资料">
                    <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px"
                        fill="currentColor">
                        <path
                            d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h357l-80 80H200v560h560v-278l80-80v358q0 33-23.5 56.5T760-120H200Zm280-360ZM360-360v-170l367-367q12-12 27-18t30-6q16 0 30.5 6t26.5 18l56 57q11 12 17 26.5t6 29.5q0 15-5.5 29.5T897-728L530-360H360Z" />
                    </svg>
                </button>
            </div>
            <p class="profile-sig">"{{ user?.signature || '这个人很懒，什么都没写' }}"</p>

            <div class="info-grid">
                <div class="info-item">
                    <span class="info-label">战网ID</span>
                    <span class="info-value">{{ user?.battleTag || '未绑定' }}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">QQ</span>
                    <span class="info-value">{{ user?.qq || '未设置' }}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">MMR</span>
                    <span class="info-value mmr">{{ user?.mmr || 0 }}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">种族</span>
                    <span class="info-value">{{ raceMap[user?.race] || '未选择' }}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">服务器</span>
                    <span class="info-value">{{ user?.region || '未选择' }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
defineProps({ user: Object });
const raceMap = { T: '人族', Z: '异虫', P: '星灵', R: '随机' };
const emit = defineEmits(['jumpToProfileEditPage']);

function jumpToProfileEditPage() {
    emit('jumpToProfileEditPage');
}
</script>

<style scoped>
.profile-page {
    max-width: 800px;
    margin: 0 auto;
}

.profile-banner {
    position: relative;
    height: 220px;
    border-radius: 12px 12px 0 0;
    overflow: hidden;
}

.banner-bg {
    position: absolute;
    inset: 0;
    background: url("../assets/pics/login-cover.jpg") center/cover no-repeat;
}

.banner-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, rgba(8, 11, 18, 0.2) 0%, rgba(8, 11, 18, 0.9) 100%);
}

.profile-avatar-wrap {
    position: absolute;
    bottom: -50px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 2;
}

.profile-avatar {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    background-image: url('../assets/pics/profile-image.png');
    background-size: cover;
    border: 4px solid var(--sc2-bg-deep);
}

.avatar-ring {
    position: absolute;
    inset: -4px;
    border-radius: 50%;
    border: 2px solid var(--sc2-accent);
    animation: ring-pulse 3s infinite;
}

@keyframes ring-pulse {

    0%,
    100% {
        opacity: 0.6;
        box-shadow: 0 0 10px rgba(0, 180, 216, 0.2);
    }

    50% {
        opacity: 1;
        box-shadow: 0 0 20px rgba(0, 180, 216, 0.4);
    }
}

.sc2-panel {
    background: linear-gradient(135deg, var(--sc2-bg-panel), var(--sc2-bg-dark));
    border: 1px solid var(--sc2-border);
    border-radius: 0 0 12px 12px;
    padding: 24px;
    position: relative;
}

.profile-card {
    padding-top: 60px;
    text-align: center;
}

.card-header {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
}

.profile-name {
    font-family: 'Orbitron', sans-serif;
    font-size: 28px;
    font-weight: 700;
    color: var(--sc2-text-bright);
    letter-spacing: 1px;
}

.edit-btn {
    background: none;
    border: none;
    color: var(--sc2-text-dim);
    cursor: pointer;
    padding: 6px;
    border-radius: 6px;
    transition: all 0.2s;
}

.edit-btn:hover {
    color: var(--sc2-accent);
    background: rgba(0, 180, 216, 0.1);
}

.profile-sig {
    color: var(--sc2-text-dim);
    font-style: italic;
    margin: 12px 0 24px;
    font-size: 14px;
}

.info-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 16px;
    text-align: left;
}

.info-item {
    background: var(--sc2-bg-dark);
    border: 1px solid var(--sc2-border);
    border-radius: 8px;
    padding: 14px;
    transition: border-color 0.2s;
}

.info-item:hover {
    border-color: var(--sc2-border-glow);
}

.info-label {
    display: block;
    font-size: 11px;
    font-family: 'Orbitron', sans-serif;
    color: var(--sc2-text-dim);
    letter-spacing: 1px;
    text-transform: uppercase;
    margin-bottom: 4px;
}

.info-value {
    font-size: 16px;
    font-weight: 600;
    color: var(--sc2-text);
}

.info-value.mmr {
    font-family: 'Share Tech Mono', monospace;
    color: var(--sc2-gold);
}

@media (max-width: 768px) {
    .profile-banner {
        height: 160px;
    }

    .profile-avatar {
        width: 90px;
        height: 90px;
        margin-top: -45px;
    }

    .profile-card {
        padding: 60px 16px 20px;
    }

    .info-grid {
        gap: 8px;
    }

    .info-item {
        padding: 10px;
    }
}
</style>
