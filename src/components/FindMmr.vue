<template>
    <div class="find-mmr sc2-panel">
        <h2 class="panel-title">MMR 分数查询</h2>
        <p class="panel-desc">输入战网ID查询各服实时MMR（如：playerName#1234）</p>

        <div class="search-box">
            <input type="text" v-model="battleTag" placeholder="玩家名称#数字代号" class="wInput" @keyup.enter="search">
            <button class="sc2-btn-action" @click="search" :disabled="loading">
                {{ loading ? '查询中...' : '查询' }}
            </button>
        </div>

        <div v-if="results" class="results-area">
            <div class="player-info">
                <h3>{{ battleTag }}</h3>
                <span class="region-info">CharacterId: {{ results.characterId }}</span>
            </div>

            <div class="mmr-grid">
                <div class="mmr-card" v-for="(val, key) in results.mmrs" :key="key">
                    <span class="mode">{{ key }}</span>
                    <span class="value">{{ val || 'N/A' }}</span>
                </div>
            </div>
        </div>

        <div v-if="errorMsg" class="error-msg">{{ errorMsg }}</div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';

const battleTag = ref('');
const loading = ref(false);
const results = ref(null);
const errorMsg = ref('');

async function search() {
    if (!battleTag.value.includes('#')) {
        errorMsg.value = '请输入完整的战网ID（包含#和数字）';
        return;
    }
    
    loading.value = true;
    errorMsg.value = '';
    results.value = null;

    try {
        const res = await axios.get('/api/sc2/full-mmr', { params: { battleTag: battleTag.value } });
        if (res.data.success) {
            results.value = res.data.data;
        } else {
            errorMsg.value = res.data.msg || '未找到该玩家数据';
        }
    } catch (e) {
        errorMsg.value = '请求失败，请检查网络或战网ID是否正确';
    } finally {
        loading.value = false;
    }
}
</script>

<style scoped>
.find-mmr {
    max-width: 800px;
    margin: 0 auto;
    padding: 30px;
}

.panel-title {
    font-size: 24px;
    color: var(--sc2-text-bright);
    margin-bottom: 8px;
}

.panel-desc {
    color: var(--sc2-text-dim);
    margin-bottom: 30px;
}

.search-box {
    display: flex;
    gap: 12px;
    margin-bottom: 40px;
}

.results-area {
    border-top: 1px solid var(--sc2-border);
    padding-top: 20px;
    animation: fadeIn 0.3s;
}

.player-info {
    margin-bottom: 24px;
}

.player-info h3 {
    color: var(--sc2-accent);
    margin-bottom: 4px;
}

.region-info {
    font-size: 12px;
    color: var(--sc2-text-dim);
}

.mmr-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 16px;
}

.mmr-card {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid var(--sc2-border);
    padding: 20px;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
}

.mmr-card .mode {
    font-size: 12px;
    color: var(--sc2-text-dim);
}

.mmr-card .value {
    font-size: 24px;
    font-weight: 700;
    color: var(--sc2-text-bright);
}

.error-msg {
    color: var(--sc2-danger);
    margin-top: 20px;
}

@keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
}
</style>
