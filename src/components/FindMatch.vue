<template>
    <div class="find-match">
        <!-- Your Race -->
        <div class="sc2-panel race-panel">
            <div class="panel-header">
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"
                    fill="currentColor" class="header-icon">
                    <path
                        d="M762-96 645-212l-88 88-28-28q-23-23-23-57t23-57l169-169q23-23 57-23t57 23l28 28-88 88 116 117q12 12 12 28t-12 28l-50 50q-12 12-28 12t-28-12Zm118-628L426-270l5 4q23 23 23 57t-23 57l-28 28-88-88L198-96q-12 12-28 12t-28-12l-50-50q-12-12-12-28t12-28l116-117-88-88 28-28q23-23 57-23t57 23l4 5 454-454h160v160Z" />
                </svg>
                <span class="panel-title">你的种族</span>
                <span class="mmr-badge" v-if="mode !== 'coop'">MMR: {{ userMmr }}</span>
            </div>
            <div class="race-grid">
                <div class="race-card" :class="{ selected: myRace === 'T', terran: myRace === 'T' }"
                    @click="myRace = 'T'">
                    <img src="../assets/icons/terran.png" alt="Terran">
                    <span class="race-name">人族</span>
                    <span class="race-name-en">TERRAN</span>
                </div>
                <div class="race-card" :class="{ selected: myRace === 'Z', zerg: myRace === 'Z' }"
                    @click="myRace = 'Z'">
                    <img src="../assets/icons/zerg.png" alt="Zerg">
                    <span class="race-name">异虫</span>
                    <span class="race-name-en">ZERG</span>
                </div>
                <div class="race-card" :class="{ selected: myRace === 'P', protoss: myRace === 'P' }"
                    @click="myRace = 'P'">
                    <img src="../assets/icons/protoss.png" alt="Protoss">
                    <span class="race-name">星灵</span>
                    <span class="race-name-en">PROTOSS</span>
                </div>
                <div class="race-card" :class="{ selected: myRace === 'R' }" @click="myRace = 'R'">
                    <img src="../assets/icons/random.png" alt="Random" class="random-icon">
                    <span class="race-name">随机</span>
                    <span class="race-name-en">RANDOM</span>
                </div>
            </div>
        </div>

        <!-- Opponent Race -->
        <div class="sc2-panel race-panel" style="margin-top: 20px;">
            <div class="panel-header">
                <span class="panel-title">匹配者种族</span>
            </div>
            <div class="race-grid">
                <div class="race-card small" :class="{ selected: opponentRace === 'T', terran: opponentRace === 'T' }"
                    @click="opponentRace = 'T'">
                    <img src="../assets/icons/terran.png" alt="Terran">
                    <span class="race-name">人族</span>
                </div>
                <div class="race-card small" :class="{ selected: opponentRace === 'Z', zerg: opponentRace === 'Z' }"
                    @click="opponentRace = 'Z'">
                    <img src="../assets/icons/zerg.png" alt="Zerg">
                    <span class="race-name">异虫</span>
                </div>
                <div class="race-card small" :class="{ selected: opponentRace === 'P', protoss: opponentRace === 'P' }"
                    @click="opponentRace = 'P'">
                    <img src="../assets/icons/protoss.png" alt="Protoss">
                    <span class="race-name">星灵</span>
                </div>
                <div class="race-card small" :class="{ selected: opponentRace === '' }" @click="opponentRace = ''">
                    <img src="../assets/icons/random.png" alt="Any" class="random-icon">
                    <span class="race-name">不限</span>
                </div>
            </div>
        </div>

        <!-- MMR Range & Actions -->
        <div class="match-controls">
            <div class="mmr-range">
                <span class="control-label">分差范围</span>
                <div class="range-input-wrap">
                    <input type="number" v-model.number="mmrRange" class="range-input" placeholder="100">
                    <span class="range-unit">分</span>
                </div>
            </div>
            <div class="action-area">
                <button class="sc2-btn-action" @click="startMatch">
                    <span>开始匹配</span>
                    <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px"
                        fill="currentColor">
                        <path d="m321-80-71-71 329-329-329-329 71-71 400 400L321-80Z" />
                    </svg>
                </button>
                <span class="mode-tag">{{ mode }}</span>
            </div>
        </div>

        <!-- Match Results -->
        <div v-if="matchResults.length > 0" class="sc2-panel results-panel">
            <div class="panel-header">
                <span class="panel-title">匹配结果</span>
                <span class="result-count">{{ matchResults.length }} 玩家</span>
            </div>
            <table class="sc2-table">
                <thead>
                    <tr>
                        <th>昵称</th>
                        <th>战网ID</th>
                        <th v-if="mode !== 'coop'">MMR</th>
                        <th>种族</th>
                        <th>QQ</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="p in matchResults" :key="p.id">
                        <td>{{ p.name }}</td>
                        <td>{{ p.battleTag || '-' }}</td>
                        <td v-if="mode !== 'coop'"><span class="mmr-cell">{{ getDisplayMmr(p) }}</span></td>
                        <td>{{ raceMap[p.race] || p.race || '-' }}</td>
                        <td>{{ p.qq || '-' }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div v-if="searched && matchResults.length === 0" class="sc2-panel results-panel">
            <p class="no-results">暂无匹配到的玩家，请尝试扩大分差范围</p>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { findMatches } from '../api/api.js';

const props = defineProps({
    mode: String,
    user: Object
});

const myRace = ref('');
const opponentRace = ref('');
const mmrRange = ref(100);
const matchResults = ref([]);
const searched = ref(false);

const raceMap = { T: '人族', Z: '异虫', P: '星灵', R: '随机' };

const userMmr = computed(() => {
    if (!props.user) return 0;
    if (props.mode === '2v2') return props.user.mmr2v2 || 0;
    if (props.mode === '3v3') return props.user.mmr3v3 || 0;
    if (props.mode === '4v4') return props.user.mmr4v4 || 0;
    return props.user.mmr || 0;
});

function getDisplayMmr(p) {
    if (props.mode === '2v2') return p.mmr2v2 || 0;
    if (props.mode === '3v3') return p.mmr3v3 || 0;
    if (props.mode === '4v4') return p.mmr4v4 || 0;
    return p.mmr || 0;
}

async function startMatch() {
    searched.value = true;
    const mmr = userMmr.value || 0;
    try {
        const res = await findMatches(mmr, mmrRange.value, opponentRace.value, props.mode);
        matchResults.value = res.data.filter(p => props.user && p.id !== props.user.id);
    } catch (e) {
        matchResults.value = [];
    }
}
</script>

<style scoped>
.find-match {
    max-width: 960px;
    margin: 0 auto;
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

.panel-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 20px;
}

.header-icon {
    color: var(--sc2-accent);
}

.panel-title {
    font-family: 'Orbitron', sans-serif;
    font-size: 18px;
    font-weight: 600;
    color: var(--sc2-text-bright);
    letter-spacing: 1px;
}

.mmr-badge {
    margin-left: auto;
    padding: 4px 14px;
    background: rgba(0, 180, 216, 0.1);
    border: 1px solid rgba(0, 180, 216, 0.25);
    border-radius: 20px;
    font-family: 'Share Tech Mono', monospace;
    font-size: 13px;
    color: var(--sc2-accent);
}

/* Race Grid */
.race-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 12px;
}

.race-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 20px 12px;
    background: var(--sc2-bg-dark);
    border: 2px solid var(--sc2-border);
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
}

.race-card::after {
    content: '';
    position: absolute;
    inset: 0;
    opacity: 0;
    transition: opacity 0.3s;
    border-radius: 8px;
}

.race-card:hover {
    border-color: var(--sc2-border-glow);
    transform: translateY(-2px);
}

.race-card.selected {
    border-color: var(--sc2-accent);
    box-shadow: 0 0 20px rgba(0, 180, 216, 0.15);
}

.race-card.selected.terran {
    border-color: var(--sc2-terran);
    box-shadow: 0 0 20px rgba(224, 112, 32, 0.2);
}

.race-card.selected.zerg {
    border-color: var(--sc2-zerg);
    box-shadow: 0 0 20px rgba(176, 48, 192, 0.2);
}

.race-card.selected.protoss {
    border-color: var(--sc2-protoss);
    box-shadow: 0 0 20px rgba(48, 160, 224, 0.2);
}

.race-card img {
    width: 80px;
    height: auto;
    margin-bottom: 10px;
    transition: transform 0.3s;
}

.race-card:hover img {
    transform: scale(1.08);
}

.race-card.small img {
    width: 56px;
}

.race-card.small {
    padding: 14px 10px;
}

.random-icon {
    width: 70px !important;
}

.race-card.small .random-icon {
    width: 50px !important;
}

.race-name {
    font-size: 15px;
    font-weight: 600;
    color: var(--sc2-text);
}

.race-name-en {
    font-family: 'Orbitron', sans-serif;
    font-size: 10px;
    color: var(--sc2-text-dim);
    letter-spacing: 2px;
    margin-top: 2px;
}

/* Match Controls */
.match-controls {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 24px;
    gap: 20px;
    flex-wrap: wrap;
}

.mmr-range {
    display: flex;
    align-items: center;
    gap: 12px;
}

.control-label {
    font-size: 16px;
    color: var(--sc2-text);
    font-weight: 500;
}

.range-input-wrap {
    display: flex;
    align-items: center;
    gap: 6px;
}

.range-input {
    width: 80px;
    padding: 8px 12px;
    text-align: center;
    font-size: 16px;
    font-family: 'Share Tech Mono', monospace;
    color: var(--sc2-text-bright);
    background: var(--sc2-bg-dark);
    border: 1px solid var(--sc2-border);
    border-radius: 6px;
    transition: border-color 0.2s;
}

.range-input:focus {
    border-color: var(--sc2-accent);
    outline: none;
    box-shadow: 0 0 0 2px rgba(0, 180, 216, 0.15);
}

.range-unit {
    color: var(--sc2-text-dim);
    font-size: 14px;
}

.action-area {
    display: flex;
    align-items: center;
    gap: 16px;
}

.sc2-btn-action {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 14px 32px;
    background: transparent;
    border: 2px solid var(--sc2-accent);
    color: var(--sc2-accent);
    font-family: 'Orbitron', sans-serif;
    font-size: 14px;
    font-weight: 600;
    letter-spacing: 2px;
    cursor: pointer;
    transition: all 0.3s ease;
    border-radius: 4px;
    position: relative;
    overflow: hidden;
}

.sc2-btn-action::before {
    content: '';
    position: absolute;
    inset: 0;
    background: var(--sc2-accent);
    opacity: 0;
    transition: opacity 0.3s;
    z-index: 0;
}

.sc2-btn-action:hover::before {
    opacity: 1;
}

.sc2-btn-action:hover {
    color: var(--sc2-bg-deep);
    box-shadow: 0 0 20px rgba(0, 180, 216, 0.3);
}

.sc2-btn-action span,
.sc2-btn-action svg {
    position: relative;
    z-index: 1;
}

.mode-tag {
    font-family: 'Orbitron', sans-serif;
    font-size: 22px;
    font-weight: 700;
    color: var(--sc2-text-bright);
    letter-spacing: 2px;
}

/* Results Table */
.results-panel {
    margin-top: 24px;
}

.result-count {
    margin-left: auto;
    font-size: 13px;
    color: var(--sc2-text-dim);
    font-family: 'Share Tech Mono', monospace;
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

.mmr-cell {
    font-family: 'Share Tech Mono', monospace;
    color: var(--sc2-gold);
}

.no-results {
    color: var(--sc2-text-dim);
    text-align: center;
    padding: 20px;
}

@media (max-width: 768px) {
    .race-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 8px;
    }

    .race-card {
        padding: 12px;
    }

    .race-card img {
        width: 56px;
    }

    .race-grid.small .race-card img {
        width: 40px;
    }

    .sc2-panel {
        padding: 16px;
    }

    .match-controls {
        flex-direction: column;
        gap: 12px;
    }

    .sc2-table {
        font-size: 13px;
    }

    .sc2-table th,
    .sc2-table td {
        padding: 8px 6px;
    }

    .mode-tag {
        font-size: 18px;
    }
}

@media (max-width: 480px) {
    .race-grid {
        grid-template-columns: 1fr 1fr;
        gap: 6px;
    }

    .race-card span {
        font-size: 11px;
    }
}
</style>
