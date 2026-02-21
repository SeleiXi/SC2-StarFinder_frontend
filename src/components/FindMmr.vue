<template>
    <div class="find-mmr sc2-panel">
        <h2 class="panel-title">MMR 分数查询</h2>
        <p class="panel-desc">输入战网ID查询各服实时MMR（如：playerName#1234）</p>

        <div class="search-box">
            <input type="text" v-model="battleTag" placeholder="玩家名称 (支持不带#数字)" class="wInput" @keyup.enter="search">
            <button class="sc2-btn-action" @click="search" :disabled="loading">
                {{ loading ? '查询中...' : '查询' }}
            </button>
        </div>

        <div v-if="results && results.length" class="results-container">
            <div v-for="(result, index) in results" :key="index" class="results-area sc2-panel-sub">
                <div class="player-header">
                    <div class="player-info">
                        <h3>{{ result.battleTag }}</h3>
                        <div class="player-meta">
                            <span class="meta-item">Region: {{ result.region }}</span>
                            <span class="meta-item">CharacterId: {{ result.characterId }}</span>
                        </div>
                    </div>
                </div>

                <div class="summary-stats">
                    <div class="stat-box">
                        <span class="label">Best All League</span>
                        <span class="value">{{ result.bestLeague }}</span>
                    </div>
                    <div class="stat-box">
                        <span class="label">Best All MMR</span>
                        <span class="value">{{ result.bestAllMmr || 'N/A' }}</span>
                    </div>
                    <div class="stat-box">
                        <span class="label">Total Games</span>
                        <span class="value">{{ result.totalGames }}</span>
                    </div>
                    <div class="stat-box">
                        <span class="label">Last 1v1 MMR</span>
                        <span class="value">{{ result.last1v1Mmr || 'N/A' }}</span>
                    </div>
                    <div class="stat-box">
                        <span class="label">Last 1v1 Games</span>
                        <span class="value">{{ result.last1v1Games }}</span>
                    </div>
                </div>

                <div class="mmr-sections">
                    <div class="section-group">
                        <h4>1v1 MMR (按种族)</h4>
                        <div class="mmr-grid">
                            <div class="mmr-card" v-for="item in result.mmrGroups['1v1']" :key="item.race">
                                <span class="mode">{{ formatRace(item.race) }}</span>
                                <span class="value">{{ item.rating }}</span>
                            </div>
                            <div v-if="!result.mmrGroups['1v1']?.length" class="no-data">无近期 1v1 数据</div>
                        </div>
                    </div>

                    <div class="section-group">
                        <h4>多人 MMR</h4>
                        <div class="mmr-grid">
                            <div class="mmr-card" v-for="mode in ['2v2', '3v3', '4v4']" :key="mode">
                                <span class="mode">{{ mode }}</span>
                                <span class="value">{{ result.mmrGroups[mode] || 'N/A' }}</span>
                            </div>
                        </div>
                    </div>
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
const results = ref([]);
const errorMsg = ref('');

function formatRace(race) {
    if (!race) return 'Unknown';
    const raceMap = {
        'TERRAN': '人族 (T)',
        'PROTOSS': '神族 (P)',
        'ZERG': '虫族 (Z)',
        'RANDOM': '随机 (R)'
    };
    return raceMap[race] || race;
}

async function search() {
    if (!battleTag.value) {
        errorMsg.value = '请输入玩家名称';
        return;
    }
    
    loading.value = true;
    errorMsg.value = '';
    results.value = [];

    try {
        const res = await axios.get('/api/sc2/full-mmr', { params: { battleTag: battleTag.value } });
        if (res.data.code === 200 || res.data.success) {
            results.value = res.data.data;
        } else {
            errorMsg.value = res.data.msg || '未找到该玩家数据';
        }
    } catch (e) {
        errorMsg.value = '请求失败，请检查网络或输入的名称';
    } finally {
        loading.value = false;
    }
}
</script>

<style scoped>
.find-mmr {
    max-width: 900px;
    margin: 0 auto;
    padding: 30px;
}

.results-container {
    display: flex;
    flex-direction: column;
    gap: 40px;
}

.sc2-panel-sub {
    background: rgba(0, 0, 0, 0.3);
    border: 1px solid var(--sc2-border);
    border-radius: 12px;
    padding: 25px;
}

.player-header {
    margin-bottom: 25px;
    padding-bottom: 15px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.player-meta {
    display: flex;
    gap: 20px;
    margin-top: 5px;
}

.meta-item {
    font-size: 13px;
    color: var(--sc2-text-dim);
}

.summary-stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    gap: 15px;
    margin-bottom: 30px;
    background: rgba(255, 255, 255, 0.03);
    padding: 15px;
    border-radius: 8px;
}

.stat-box {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.stat-box .label {
    font-size: 11px;
    color: var(--sc2-text-dim);
    text-transform: uppercase;
    letter-spacing: 1px;
}

.stat-box .value {
    font-size: 18px;
    color: var(--sc2-accent);
    font-weight: bold;
    margin-top: 4px;
}

.mmr-sections {
    display: flex;
    flex-direction: column;
    gap: 30px;
}

.section-group h4 {
    margin-bottom: 15px;
    color: var(--sc2-text-bright);
    border-left: 4px solid var(--sc2-accent);
    padding-left: 10px;
}

.mmr-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 16px;
}

.no-data {
    color: var(--sc2-text-dim);
    font-style: italic;
    font-size: 14px;
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
