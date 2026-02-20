<template>
    <div class="cheater-list">
        <div class="sc2-panel">
            <h1 class="page-title">外挂图鉴</h1>
            <p class="page-subtitle">CHEATER DATABASE</p>

            <div class="search-bar">
                <input type="text" v-model="searchTag" placeholder="搜索战网ID..." class="sc2-input search-input"
                    @keyup.enter="doSearch">
                <button class="sc2-btn" @click="doSearch">搜索</button>
                <button class="sc2-btn outline" @click="loadAll">全部</button>
            </div>

            <table v-if="cheaters.length > 0" class="sc2-table">
                <thead>
                    <tr>
                        <th>战网ID</th>
                        <th>MMR</th>
                        <th>种族</th>
                        <th>外挂类型</th>
                        <th>描述</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="c in cheaters" :key="c.id">
                        <td class="battletag-cell">{{ c.battleTag }}</td>
                        <td><span class="mmr-val">{{ c.mmr || '-' }}</span></td>
                        <td>{{ raceMap[c.race] || c.race || '-' }}</td>
                        <td><span class="cheat-badge">{{ c.cheatType }}</span></td>
                        <td>{{ c.description || '-' }}</td>
                    </tr>
                </tbody>
            </table>
            <p v-else class="empty-msg">暂无记录</p>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getCheaterList, searchCheaters } from '../api/api.js';

const cheaters = ref([]);
const searchTag = ref('');
const raceMap = { T: '人族', Z: '异虫', P: '星灵', R: '随机' };

async function loadAll() {
    searchTag.value = '';
    try {
        const res = await getCheaterList();
        const data = res.data;
        cheaters.value = Array.isArray(data) ? data : (data?.data || []);
    } catch (e) {
        cheaters.value = [];
    }
}

async function doSearch() {
    if (!searchTag.value) { loadAll(); return; }
    try {
        const res = await searchCheaters(searchTag.value);
        const data = res.data;
        cheaters.value = Array.isArray(data) ? data : (data?.data || []);
    } catch (e) {
        cheaters.value = [];
    }
}

onMounted(loadAll);
</script>

<style scoped>
.cheater-list {
    max-width: 1000px;
    margin: 0 auto;
}

.sc2-panel {
    background: linear-gradient(135deg, var(--sc2-bg-panel), var(--sc2-bg-dark));
    border: 1px solid var(--sc2-border);
    border-radius: 12px;
    padding: 40px;
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
    background: linear-gradient(90deg, transparent, var(--sc2-danger), transparent);
    opacity: 0.7;
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

.search-bar {
    display: flex;
    gap: 10px;
    align-items: center;
    margin-bottom: 24px;
}

.sc2-input {
    padding: 10px 16px;
    font-family: 'Rajdhani', sans-serif;
    font-size: 15px;
    color: var(--sc2-text);
    background: var(--sc2-bg-dark);
    border: 1px solid var(--sc2-border);
    border-radius: 6px;
    transition: all 0.2s;
}

.sc2-input:focus {
    border-color: var(--sc2-accent);
    outline: none;
    box-shadow: 0 0 0 2px rgba(0, 180, 216, 0.15);
}

.search-input {
    width: 300px;
}

.sc2-btn {
    padding: 10px 20px;
    font-family: 'Rajdhani', sans-serif;
    font-size: 14px;
    font-weight: 600;
    color: var(--sc2-bg-deep);
    background: var(--sc2-accent);
    border: none;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s;
}

.sc2-btn:hover {
    box-shadow: 0 0 12px rgba(0, 180, 216, 0.3);
}

.sc2-btn.outline {
    background: transparent;
    color: var(--sc2-text);
    border: 1px solid var(--sc2-border);
}

.sc2-btn.outline:hover {
    border-color: var(--sc2-accent);
    color: var(--sc2-accent);
}

.sc2-table {
    width: 100%;
    border-collapse: collapse;
}

.sc2-table th {
    padding: 12px 16px;
    text-align: left;
    font-family: 'Orbitron', sans-serif;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 1px;
    text-transform: uppercase;
    color: var(--sc2-accent);
    border-bottom: 1px solid var(--sc2-border);
    background: rgba(0, 180, 216, 0.05);
}

.sc2-table td {
    padding: 12px 16px;
    font-size: 14px;
    color: var(--sc2-text);
    border-bottom: 1px solid rgba(30, 45, 74, 0.5);
}

.sc2-table tbody tr {
    transition: background 0.2s;
}

.sc2-table tbody tr:hover {
    background: rgba(0, 180, 216, 0.04);
}

.battletag-cell {
    font-weight: 600;
    color: var(--sc2-text-bright);
}

.mmr-val {
    font-family: 'Share Tech Mono', monospace;
    color: var(--sc2-gold);
}

.cheat-badge {
    display: inline-block;
    padding: 2px 10px;
    background: rgba(255, 68, 68, 0.12);
    color: var(--sc2-danger);
    border: 1px solid rgba(255, 68, 68, 0.25);
    border-radius: 4px;
    font-size: 12px;
    font-weight: 600;
}

.empty-msg {
    color: var(--sc2-text-dim);
    text-align: center;
    padding: 40px;
    font-size: 16px;
}

@media (max-width: 768px) {
    .sc2-panel {
        padding: 16px;
    }

    .search-bar {
        flex-direction: column;
    }

    .search-input {
        width: 100%;
    }

    .sc2-table {
        font-size: 12px;
    }

    .sc2-table th,
    .sc2-table td {
        padding: 8px 6px;
    }
}
</style>
