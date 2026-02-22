<template>
    <div class="tutorial-page">
        <h1 class="page-title">教学视频</h1>
        <p class="page-subtitle">SC2 TUTORIALS</p>

        <div class="cat-tabs">
            <button :class="{ active: currentCat === '' }" @click="loadTutorials('')">全部</button>
            <button :class="{ active: currentCat === '入门' }" @click="loadTutorials('入门')">入门</button>
            <button :class="{ active: currentCat === '进阶' }" @click="loadTutorials('进阶')">进阶</button>
            <button :class="{ active: currentCat === '高级' }" @click="loadTutorials('高级')">高级</button>
        </div>

        <div v-if="tutorials.length > 0" class="tutorial-list">
            <div v-for="t in tutorials" :key="t.id" class="tutorial-card sc2-panel">
                <div class="card-title">
                    {{ t.title }}
                    <small v-if="t.author" class="card-author">by {{ t.author }}</small>
                </div>
                <!-- <iframe :src="t.url" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true"
                    class="tutorial-iframe"></iframe> -->
                <div class="video-link-area">
                    <a :href="t.url" target="_blank" class="sc2-btn-secondary">
                        <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px"
                            fill="currentColor">
                            <path d="M320-200v-560l440 280-440 280Z" />
                        </svg>
                        <span>立即观看视频</span>
                    </a>
                </div>
                <p v-if="t.description" class="card-desc">{{ t.description }}</p>
            </div>
        </div>
        <p v-else class="empty-msg">暂无视频</p>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getTutorials } from '../api/api.js';

const tutorials = ref([]);
const currentCat = ref('');

async function loadTutorials(cat) {
    currentCat.value = cat;
    try {
        const res = await getTutorials(cat || undefined);
        const data = res.data;
        tutorials.value = Array.isArray(data) ? data : (data?.data || []);
    } catch (e) {
        tutorials.value = [];
    }
}

onMounted(() => loadTutorials(''));
</script>

<style scoped>
.tutorial-page {
    max-width: 1000px;
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

.cat-tabs {
    display: flex;
    gap: 8px;
    margin-bottom: 24px;
}

.cat-tabs button {
    padding: 8px 20px;
    font-family: 'Rajdhani', sans-serif;
    font-size: 14px;
    font-weight: 600;
    color: var(--sc2-text);
    background: transparent;
    border: 1px solid var(--sc2-border);
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s;
}

.cat-tabs button:hover,
.cat-tabs button.active {
    background: var(--sc2-accent);
    color: var(--sc2-bg-deep);
    border-color: var(--sc2-accent);
    box-shadow: 0 0 8px rgba(0, 180, 216, 0.2);
}

.tutorial-list {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.sc2-panel {
    background: linear-gradient(135deg, var(--sc2-bg-panel), var(--sc2-bg-dark));
    border: 1px solid var(--sc2-border);
    border-radius: 12px;
    padding: 24px;
    position: relative;
    overflow: hidden;
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

.card-title {
    font-size: 18px;
    font-weight: 600;
    color: var(--sc2-text-bright);
    margin-bottom: 16px;
}

.card-author {
    font-size: 13px;
    color: var(--sc2-text-dim);
    font-weight: 400;
}

.video-link-area {
    margin: 10px 0;
}

.sc2-btn-secondary {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 10px 20px;
    border: 1px solid var(--sc2-border);
    border-radius: 6px;
    background: rgba(0, 180, 216, 0.05);
    color: var(--sc2-accent);
    text-decoration: none;
    font-family: 'Rajdhani', sans-serif;
    font-size: 14px;
    font-weight: 600;
    transition: all 0.2s;
}

.sc2-btn-secondary:hover {
    background: var(--sc2-accent);
    color: var(--sc2-bg-deep);
    border-color: var(--sc2-accent);
    box-shadow: 0 0 15px rgba(0, 180, 216, 0.3);
}

.card-desc {
    margin-top: 12px;
    color: var(--sc2-text-dim);
    font-size: 14px;
}

.empty-msg {
    color: var(--sc2-text-dim);
    text-align: center;
    padding: 60px;
    font-size: 16px;
}

@media (max-width: 768px) {
    .cat-tabs {
        flex-wrap: wrap;
    }

    .tutorial-card {
        padding: 16px;
    }
}

@media (max-width: 480px) {
    .tutorial-iframe {
        height: 200px;
    }
}
</style>
