<template>
    <div class="find-match">
        <!-- Your Race / Commander -->
        <div class="sc2-panel race-panel" v-if="mode !== 'coop'">
            <div class="panel-header">
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"
                    fill="currentColor" class="header-icon">
                    <path
                        d="M762-96 645-212l-88 88-28-28q-23-23-23-57t23-57l169-169q23-23 57-23t57 23l28 28-88 88 116 117q12 12 12 28t-12 28l-50 50q-12 12-28 12t-28-12Zm118-628L426-270l5 4q23 23 23 57t-23 57l-28 28-88-88L198-96q-12 12-28 12t-28-12l-50-50q-12-12-12-28t12-28l116-117-88-88 28-28q23-23 57-23t57 23l4 5 454-454h160v160Z" />
                </svg>
                <span class="panel-title">你的种族</span>
                <span class="mmr-badge" v-if="mode !== 'coop'">
                    MMR: {{ userMmr }}
                    <button class="mmr-edit-btn" @click.stop="showMmrEdit ? (showMmrEdit = false) : openMmrEdit()" title="编辑MMR">
                        <svg xmlns="http://www.w3.org/2000/svg" height="14px" viewBox="0 -960 960 960" width="14px" fill="currentColor">
                            <path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"/>
                        </svg>
                    </button>
                </span>
            </div>
            <!-- Inline MMR editing panel -->
            <div class="mmr-edit-panel" v-if="showMmrEdit && mode !== 'coop'">
                <div class="mmr-edit-grid">
                    <div class="mmr-edit-field">
                        <label>人族</label>
                        <input type="number" v-model.number="editMmr.mmrTerran" class="mmr-edit-input" placeholder="0">
                    </div>
                    <div class="mmr-edit-field">
                        <label>虫族</label>
                        <input type="number" v-model.number="editMmr.mmrZerg" class="mmr-edit-input" placeholder="0">
                    </div>
                    <div class="mmr-edit-field">
                        <label>神族</label>
                        <input type="number" v-model.number="editMmr.mmrProtoss" class="mmr-edit-input" placeholder="0">
                    </div>
                    <div class="mmr-edit-field">
                        <label>随机</label>
                        <input type="number" v-model.number="editMmr.mmrRandom" class="mmr-edit-input" placeholder="0">
                    </div>
                    <div class="mmr-edit-field" v-if="mode === '2v2' || mode === '3v3' || mode === '4v4'">
                        <label>{{ mode }}</label>
                        <input type="number" v-model.number="editMmr.mmrTeam" class="mmr-edit-input" placeholder="0">
                    </div>
                </div>
                <div class="mmr-edit-actions">
                    <button class="mmr-save-btn" @click="saveMmr" :disabled="mmrSaving">{{ mmrSaving ? '保存中...' : '保存' }}</button>
                    <button class="mmr-cancel-btn" @click="showMmrEdit = false">取消</button>
                    <span class="mmr-save-msg" v-if="mmrSaveMsg">{{ mmrSaveMsg }}</span>
                </div>
            </div>
            
            <div class="race-grid" v-if="mode !== 'coop'">
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

        <!-- Opponent Race / Commander -->
        <div class="sc2-panel race-panel" style="margin-top: 20px;">
            <div class="panel-header">
                <span class="panel-title">{{ mode === 'coop' ? '指定队友指挥官 (选填)' : '匹配者种族' }}</span>
            </div>
            <div class="race-grid" v-if="mode !== 'coop'">
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
            <div class="commander-grid small" v-else>
                <div v-for="cmd in commanders" :key="cmd.id" class="commander-card small" 
                    :class="{ selected: opponentCommander === cmd.name }" @click="opponentCommander = (opponentCommander === cmd.name ? '' : cmd.name)">
                    <img :src="cmd.img" :alt="cmd.name" class="commander-portrait-img small">
                    <span class="commander-name">{{ cmd.name }}</span>
                </div>
                <div class="commander-card small" :class="{ selected: opponentCommander === '' }" @click="opponentCommander = ''">
                    <span class="commander-name">不限</span>
                </div>
            </div>

            <div v-if="mode === 'coop'" style="padding:12px 18px;">
                <label style="display:inline-block; width:84px; color:var(--sc2-text-dim)">最少等级</label>
                <input type="number" v-model.number="coopMinLevel" placeholder="0" style="width:120px; padding:8px; border-radius:6px; border:1px solid var(--sc2-border); background:var(--sc2-bg-dark); color:var(--sc2-text);">
                <span style="margin-left:12px; color:var(--sc2-text-dim); font-size:12px;">(筛选合作任务匹配玩家的最低等级)</span>
            </div>

        </div>

        <!-- MMR Range & Actions -->
        <div class="match-controls">
            <div class="match-options" v-if="mode !== 'coop' && mode !== '1v1'">
                <label class="checkbox-container">
                    <input type="checkbox" v-model="use1v1Mmr">
                    <span class="checkmark"></span>
                    <span class="label-text">使用1v1分数匹配</span>
                </label>
            </div>
            <div class="mmr-range" v-if="mode !== 'coop'">
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
            <div v-if="matchErrorMsg" class="match-error-msg">{{ matchErrorMsg }}</div>
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
                        <th>战网ID</th>
                        <th v-if="mode !== 'coop'">MMR</th>
                        <th>{{ mode === 'coop' ? '常用指挥官' : '种族' }}</th>
                        <th v-if="mode === 'coop'">等级</th>
                        <th>个人描述</th>
                        <th>QQ</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="p in matchResults" :key="p.id">
                        <td>{{ p.battleTag || '-' }}</td>
                        <td v-if="mode !== 'coop'"><span class="mmr-cell">{{ getDisplayMmr(p) }}</span></td>
                        <td>{{ mode === 'coop' ? (p.commander || '-') : (raceMap[p.race] || p.race || '-') }}</td>
                        <td v-if="mode === 'coop'"><span class="coop-level-badge" v-if="p.coopLevel">{{ p.coopLevel }}</span><span v-else>-</span></td>
                        <td class="desc-cell">{{ p.signature || '-' }}</td>
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
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { findMatches, updateProfile, saveUser } from '../api/api.js';

const router = useRouter();

const props = defineProps({
    mode: String,
    user: Object
});
const emit = defineEmits(['profileUpdated']);

const myRace = ref('T'); // default to Terran
const opponentRace = ref('');
const mmrRange = ref(1000);
const matchResults = ref([]);
const searched = ref(false);
const use1v1Mmr = ref(false);
const matchErrorMsg = ref('');
const coopMinLevel = ref(null);

const myCommander = ref('');
const opponentCommander = ref('');

function validateMatchRequirements() {
    if (!props.user) return '请先登录';
    
    // Check if user has at least one battle tag
    const hasBattleTag = props.user.battleTagCN || props.user.battleTagUS || 
                        props.user.battleTagEU || props.user.battleTagKR;
    if (!hasBattleTag) {
        return '请先在个人资料中填写至少一个战网ID';
    }
    
    // Check if user has corresponding MMR for the mode
    let hasMmr = false;
    if (props.mode === 'coop') {
        // Coop mode doesn't require MMR
        hasMmr = true;
    } else if (props.mode === '1v1' || use1v1Mmr.value) {
        hasMmr = props.user.mmrTerran || props.user.mmrZerg || 
                 props.user.mmrProtoss || props.user.mmrRandom || props.user.mmr;
    } else if (props.mode === '2v2') {
        hasMmr = props.user.mmr2v2 || props.user.mmr;
    } else if (props.mode === '3v3') {
        hasMmr = props.user.mmr3v3 || props.user.mmr;
    } else if (props.mode === '4v4') {
        hasMmr = props.user.mmr4v4 || props.user.mmr;
    }
    
    if (!hasMmr) {
        return `请先在个人资料中填写${props.mode}的MMR分数`;
    }
    
    return null;
}

// Initialize race and commander from user profile
onMounted(() => {
    if (props.user) {
        if (props.user.race && ['T', 'Z', 'P', 'R'].includes(props.user.race)) {
            myRace.value = props.user.race;
        }
        if (props.user.commander) {
            myCommander.value = props.user.commander;
        }
    }
});

watch(() => props.user, (newUser) => {
    if (newUser) {
        if (newUser.race && ['T', 'Z', 'P', 'R'].includes(newUser.race)) {
            myRace.value = newUser.race;
        }
        if (newUser.commander) {
            myCommander.value = newUser.commander;
        }
    }
});

// Inline MMR editing
const showMmrEdit = ref(false);
const mmrSaving = ref(false);
const mmrSaveMsg = ref('');
const editMmr = ref({
    mmrTerran: 0, mmrZerg: 0, mmrProtoss: 0, mmrRandom: 0, mmrTeam: 0
});

function openMmrEdit() {
    if (!props.user) return;
    editMmr.value = {
        mmrTerran: props.user.mmrTerran || 0,
        mmrZerg: props.user.mmrZerg || 0,
        mmrProtoss: props.user.mmrProtoss || 0,
        mmrRandom: props.user.mmrRandom || 0,
        mmrTeam: (props.mode === '2v2' ? props.user.mmr2v2 : props.mode === '3v3' ? props.user.mmr3v3 : props.user.mmr4v4) || 0
    };
    showMmrEdit.value = true;
}

async function saveMmr() {
    if (!props.user) return;
    mmrSaving.value = true;
    mmrSaveMsg.value = '';
    try {
        const payload = {
            mmrTerran: editMmr.value.mmrTerran,
            mmrZerg: editMmr.value.mmrZerg,
            mmrProtoss: editMmr.value.mmrProtoss,
            mmrRandom: editMmr.value.mmrRandom
        };
        if (props.mode === '2v2') payload.mmr2v2 = editMmr.value.mmrTeam;
        else if (props.mode === '3v3') payload.mmr3v3 = editMmr.value.mmrTeam;
        else if (props.mode === '4v4') payload.mmr4v4 = editMmr.value.mmrTeam;
        const res = await updateProfile(props.user.id, payload);
        const updatedUser = res.data.data;
        saveUser(updatedUser);
        emit('profileUpdated', updatedUser);
        mmrSaveMsg.value = '已保存 ✓';
        setTimeout(() => { mmrSaveMsg.value = ''; showMmrEdit.value = false; }, 1500);
    } catch (e) {
        mmrSaveMsg.value = '保存失败';
    } finally {
        mmrSaving.value = false;
    }
}

const raceMap = { T: '人族', Z: '异虫', P: '星灵', R: '随机' };

// webpack/Vue CLI: use require() instead of import.meta.url (Vite-only)
const cmdImg = (key) => require(`../assets/commanders/${key}.webp`);

const commanders = [
    { id: 1,  name: '雷诺',   img: cmdImg('raynor') },
    { id: 2,  name: '凯瑞甘', img: cmdImg('kerrigan') },
    { id: 3,  name: '阿塔尼斯', img: cmdImg('artanis') },
    { id: 4,  name: '斯旺',   img: cmdImg('swann') },
    { id: 5,  name: '扎加拉', img: cmdImg('zagara') },
    { id: 6,  name: '沃拉尊', img: cmdImg('vorazun') },
    { id: 7,  name: '卡拉克斯', img: cmdImg('karax') },
    { id: 8,  name: '阿巴瑟', img: cmdImg('abathur') },
    { id: 9,  name: '阿拉纳克', img: cmdImg('alarak') },
    { id: 10, name: '诺娃',   img: cmdImg('nova') },
    { id: 11, name: '斯托科夫', img: cmdImg('stukov') },
    { id: 12, name: '菲尼克斯', img: cmdImg('fenix') },
    { id: 13, name: '德哈卡', img: cmdImg('dehaka') },
    { id: 14, name: '霍纳与汉', img: cmdImg('hanhorner') },
    { id: 15, name: '泰凯斯', img: cmdImg('tychus') },
    { id: 16, name: '泽拉图', img: cmdImg('zeratul') },
    { id: 17, name: '斯台特曼', img: cmdImg('stetmann') },
    { id: 18, name: '蒙斯克', img: cmdImg('mengsk') },
];

const userMmr = computed(() => {
    if (!props.user) return 0;
    if (use1v1Mmr.value || props.mode === '1v1') {
        const raceToMmr = { 
            T: props.user.mmrTerran, Z: props.user.mmrZerg, 
            P: props.user.mmrProtoss, R: props.user.mmrRandom 
        };
        const perRace = myRace.value ? raceToMmr[myRace.value] : null;
        // fallback to best available 1v1 MMR
        const best = Math.max(props.user.mmrTerran||0, props.user.mmrZerg||0, props.user.mmrProtoss||0, props.user.mmrRandom||0, props.user.mmr||0);
        return perRace || best || 0;
    }
    if (props.mode === '2v2') return props.user.mmr2v2 || 0;
    if (props.mode === '3v3') return props.user.mmr3v3 || 0;
    if (props.mode === '4v4') return props.user.mmr4v4 || 0;
    return props.user.mmr || 0;
});

function getDisplayMmr(p) {
    if (use1v1Mmr.value || props.mode === '1v1') {
        // Show per-race MMR for the selected opponent race
        const raceToMmr = { T: p.mmrTerran, Z: p.mmrZerg, P: p.mmrProtoss, R: p.mmrRandom };
        const perRace = opponentRace.value ? raceToMmr[opponentRace.value] : null;
        return perRace || p.mmr || 0;
    }
    if (props.mode === '2v2') return p.mmr2v2 || 0;
    if (props.mode === '3v3') return p.mmr3v3 || 0;
    if (props.mode === '4v4') return p.mmr4v4 || 0;
    return p.mmr || 0;
}

async function startMatch() {
    matchErrorMsg.value = '';
    
    const validationError = validateMatchRequirements();
    if (validationError) {
        matchErrorMsg.value = validationError;
        return;
    }
    
    searched.value = true;
    const mmr = userMmr.value || 0;
    try {
        if (props.mode === 'coop') {
            // Task 6: For coop, we match by commander name and optional min level
            const res = await findMatches(0, 9999, opponentCommander.value, 'coop', coopMinLevel.value);
            matchResults.value = res.data.filter(p => props.user && p.id !== props.user.id);
        } else {
            const queryMode = use1v1Mmr.value ? '1v1' : props.mode;
            const res = await findMatches(mmr, mmrRange.value, opponentRace.value, queryMode);
            matchResults.value = res.data.filter(p => props.user && p.id !== props.user.id);
        }
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

.commander-panel {
    margin-top: 24px;
}

.commander-summary {
    display: flex;
    align-items: center;
    gap: 10px;
    list-style: none;
    cursor: pointer;
    margin-bottom: 16px;
}

.commander-summary::-webkit-details-marker {
    display: none;
}

.summary-hint {
    font-size: 12px;
    color: var(--sc2-text-dim);
    border: 1px solid var(--sc2-border);
    border-radius: 10px;
    padding: 2px 8px;
}

.header-icon {
    color: var(--sc2-accent);
}

.match-options {
    margin-bottom: 15px;
    width: 100%;
}

.checkbox-container {
    display: flex;
    align-items: center;
    cursor: pointer;
    font-size: 14px;
    color: var(--sc2-text-bright);
    user-select: none;
    gap: 10px;
}

.checkbox-container input {
    display: none;
}

.checkmark {
    width: 18px;
    height: 18px;
    border: 1px solid var(--sc2-border);
    background: rgba(0, 0, 0, 0.3);
    border-radius: 4px;
    position: relative;
    transition: all 0.2s;
}

.checkbox-container:hover .checkmark {
    border-color: var(--sc2-accent);
}

.checkbox-container input:checked + .checkmark {
    background: var(--sc2-accent);
    border-color: var(--sc2-accent);
}

.checkbox-container input:checked + .checkmark::after {
    content: '✓';
    position: absolute;
    color: white;
    font-size: 14px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}

.commander-grid {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 12px;
}

.commander-card {
    background: rgba(13, 17, 23, 0.6);
    border: 1px solid var(--sc2-border);
    border-radius: 6px;
    padding: 10px 5px;
    display: flex;
    flex-direction: column;
    align-items: center;
    cursor: pointer;
    transition: all 0.2s;
}

.commander-card:hover {
    border-color: var(--sc2-accent);
    background: rgba(0, 180, 216, 0.1);
}

.commander-card.selected {
    background: linear-gradient(135deg, rgba(0, 180, 216, 0.2), rgba(0, 180, 216, 0.1));
    border-color: var(--sc2-accent);
    box-shadow: 0 0 15px rgba(0, 180, 216, 0.2);
}

.commander-portrait-placeholder {
    width: 40px;
    height: 40px;
    background: var(--sc2-bg-dark);
    border: 1px solid var(--sc2-border);
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    font-family: 'Orbitron', sans-serif;
    color: var(--sc2-accent);
    margin-bottom: 6px;
}

.commander-portrait-img {
    width: 52px;
    height: 52px;
    object-fit: cover;
    border-radius: 4px;
    border: 1px solid var(--sc2-border);
    margin-bottom: 6px;
    display: block;
}

.commander-portrait-img.small {
    width: 32px;
    height: 32px;
    margin-bottom: 3px;
}

.commander-name {
    font-size: 12px;
    color: var(--sc2-text-bright);
    white-space: nowrap;
}

.commander-card.small {
    padding: 6px 10px;
}

.commander-grid.small {
    grid-template-columns: repeat(6, 1fr);
    gap: 8px;
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
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 4px 10px;
    background: rgba(0, 180, 216, 0.1);
    border: 1px solid rgba(0, 180, 216, 0.25);
    border-radius: 20px;
    font-family: 'Share Tech Mono', monospace;
    font-size: 13px;
    color: var(--sc2-accent);
}

.mmr-edit-btn {
    background: none;
    border: none;
    color: var(--sc2-accent);
    cursor: pointer;
    padding: 2px;
    margin-left: 2px;
    opacity: 0.7;
    display: flex;
    align-items: center;
    transition: opacity 0.2s;
}
.mmr-edit-btn:hover { opacity: 1; }

.mmr-edit-panel {
    background: rgba(0, 0, 0, 0.3);
    border: 1px solid var(--sc2-border);
    border-radius: 8px;
    padding: 16px;
    margin-bottom: 16px;
    animation: fadeIn 0.2s ease;
}

@keyframes fadeIn { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: translateY(0); } }

.mmr-edit-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    margin-bottom: 12px;
}

.mmr-edit-field {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.mmr-edit-field label {
    font-size: 11px;
    color: var(--sc2-text-dim);
    text-transform: uppercase;
    letter-spacing: 1px;
}

.mmr-edit-input {
    width: 80px;
    padding: 6px 8px;
    font-family: 'Share Tech Mono', monospace;
    font-size: 14px;
    color: var(--sc2-text-bright);
    background: var(--sc2-bg-dark);
    border: 1px solid var(--sc2-border);
    border-radius: 4px;
    text-align: center;
}
.mmr-edit-input:focus { border-color: var(--sc2-accent); outline: none; }

.mmr-edit-actions {
    display: flex;
    align-items: center;
    gap: 10px;
}

.mmr-save-btn {
    padding: 6px 18px;
    background: var(--sc2-accent);
    color: var(--sc2-bg-deep);
    border: none;
    border-radius: 4px;
    font-family: 'Orbitron', sans-serif;
    font-size: 12px;
    cursor: pointer;
    transition: opacity 0.2s;
}
.mmr-save-btn:disabled { opacity: 0.5; cursor: not-allowed; }

.mmr-cancel-btn {
    padding: 6px 14px;
    background: transparent;
    color: var(--sc2-text-dim);
    border: 1px solid var(--sc2-border);
    border-radius: 4px;
    font-size: 12px;
    cursor: pointer;
}
.mmr-cancel-btn:hover { border-color: var(--sc2-accent); color: var(--sc2-accent); }

.mmr-save-msg {
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

.coop-level-badge {
    padding: 2px 8px;
    background: rgba(0, 180, 216, 0.15);
    border: 1px solid rgba(0, 180, 216, 0.4);
    border-radius: 10px;
    font-size: 12px;
    color: var(--sc2-accent);
}

.desc-cell {
    max-width: 200px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 13px;
    color: var(--sc2-text-dim);
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

    .commander-grid {
        grid-template-columns: repeat(3, 1fr);
        gap: 10px;
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

    .commander-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 8px;
    }
}
</style>
