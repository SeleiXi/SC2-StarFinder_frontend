<template>
    <div class="stream-page">
        <h1 class="page-title">直播列表</h1>
        <p class="page-subtitle">SC2 LIVE STREAMS</p>

        <div v-if="loading" class="loading-msg">
            <div class="loader"></div>
            <span>加载中...</span>
        </div>

        <p v-else-if="streams.length === 0" class="empty-msg">暂无正在直播的主播</p>

        <div v-else class="stream-grid">
            <div class="stream-card sc2-panel" v-for="(s, i) in streams" :key="i">
                <div class="card-top">
                    <span class="streamer-name">{{ s.userName || s.proNickname || 'Unknown' }}</span>
                    <span class="live-dot">
                        <span class="dot"></span>
                        LIVE
                    </span>
                </div>
                <div class="card-info">
                    <div v-if="s.proTeam" class="info-row">
                        <span class="label">战队</span>
                        <span>{{ s.proTeam }}</span>
                    </div>
                    <div v-if="s.rating" class="info-row">
                        <span class="label">MMR</span>
                        <span class="mmr-val">{{ s.rating }}</span>
                    </div>
                    <div v-if="s.race" class="info-row">
                        <span class="label">种族</span>
                        <span>{{ raceMap[s.race] || s.race }}</span>
                    </div>
                    <div v-if="s.service" class="info-row">
                        <span class="label">平台</span>
                        <span>{{ s.service }}</span>
                    </div>
                </div>
                <a v-if="s.url || s.streamUrl" :href="s.url || s.streamUrl" target="_blank" class="watch-btn">
                    观看直播
                </a>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getSC2Streams } from '../api/api.js';

const streams = ref([]);
const loading = ref(true);
const raceMap = { TERRAN: '人族', ZERG: '异虫', PROTOSS: '星灵', RANDOM: '随机' };

async function loadStreams() {
    loading.value = true;
    try {
        const res = await getSC2Streams();
        const data = res.data;
        streams.value = Array.isArray(data) ? data : (data.data || []);
    } catch (e) {
        streams.value = [];
    }
    loading.value = false;
}

onMounted(loadStreams);
</script>

<style scoped>
.stream-page {
    max-width: 1100px;
    margin: 0 auto;
}

.page-title {
    font-family: 'Orbitron', sans-serif;
    font-size: 28px;
    font-weight: 700;
    color: var(--sc2-text-bright);
    letter-spacing: 1px;
}

.page-subtitle {
    font-family: 'Orbitron', sans-serif;
    font-size: 10px;
    color: var(--sc2-text-dim);
    letter-spacing: 4px;
    margin-bottom: 24px;
}

.loading-msg {
    display: flex;
    align-items: center;
    gap: 12px;
    color: var(--sc2-text-dim);
    padding: 40px;
}

.loader {
    width: 20px;
    height: 20px;
    border: 2px solid var(--sc2-border);
    border-top-color: var(--sc2-accent);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

.empty-msg {
    color: var(--sc2-text-dim);
    padding: 60px;
    text-align: center;
    font-size: 16px;
}

.stream-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 20px;
}

.sc2-panel {
    background: linear-gradient(135deg, var(--sc2-bg-panel), var(--sc2-bg-dark));
    border: 1px solid var(--sc2-border);
    border-radius: 12px;
    padding: 24px;
    position: relative;
    overflow: hidden;
    transition: all 0.3s ease;
}

.sc2-panel::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent, var(--sc2-accent), transparent);
    opacity: 0.5;
}

.stream-card:hover {
    border-color: var(--sc2-border-glow);
    transform: translateY(-3px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3);
}

.card-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
}

.streamer-name {
    font-size: 18px;
    font-weight: 700;
    color: var(--sc2-text-bright);
}

.live-dot {
    display: flex;
    align-items: center;
    gap: 6px;
    font-family: 'Orbitron', sans-serif;
    font-size: 10px;
    font-weight: 700;
    color: var(--sc2-danger);
    letter-spacing: 1px;
}

.dot {
    width: 8px;
    height: 8px;
    background: var(--sc2-danger);
    border-radius: 50%;
    animation: dot-pulse 1.5s infinite;
}

@keyframes dot-pulse {

    0%,
    100% {
        opacity: 1;
        box-shadow: 0 0 4px var(--sc2-danger);
    }

    50% {
        opacity: 0.5;
        box-shadow: 0 0 8px var(--sc2-danger);
    }
}

.card-info {
    margin-bottom: 16px;
}

.info-row {
    display: flex;
    justify-content: space-between;
    padding: 6px 0;
    font-size: 13px;
    border-bottom: 1px solid rgba(30, 45, 74, 0.3);
}

.label {
    color: var(--sc2-text-dim);
}

.mmr-val {
    font-family: 'Share Tech Mono', monospace;
    color: var(--sc2-gold);
}

.watch-btn {
    display: block;
    text-align: center;
    padding: 10px;
    border: 1px solid var(--sc2-accent);
    color: var(--sc2-accent);
    text-decoration: none;
    font-family: 'Rajdhani', sans-serif;
    font-size: 14px;
    font-weight: 600;
    border-radius: 6px;
    transition: all 0.2s;
}

.watch-btn:hover {
    background: var(--sc2-accent);
    color: white;
    box-shadow: 0 0 12px rgba(0, 180, 216, 0.3);
}

@media (max-width: 768px) {
    .stream-grid {
        grid-template-columns: 1fr;
        gap: 12px;
    }

    .stream-card {
        padding: 16px;
    }
}
</style>
