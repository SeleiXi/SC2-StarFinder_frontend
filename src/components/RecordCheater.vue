<template>
    <div class="record-cheater">
        <div class="sc2-panel">
            <h1 class="page-title">登记外挂</h1>
            <p class="page-subtitle">REPORT CHEATER</p>

            <form class="report-form" @submit.prevent>
                <div class="form-group">
                    <label class="form-label">战网ID</label>
                    <input class="sc2-input" type="text" placeholder="战网ID（XXX#1234）" v-model="battleTag">
                </div>

                <div class="form-group">
                    <label class="form-label">外挂类型</label>
                    <div class="cheat-options">
                        <div class="cheat-option" :class="{ checked: option1 }" @click="option1 = !option1">
                            <div class="checkbox" :class="{ active: option1 }">
                                <svg v-if="option1" xmlns="http://www.w3.org/2000/svg" height="16px"
                                    viewBox="0 -960 960 960" width="16px" fill="currentColor">
                                    <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z" />
                                </svg>
                            </div>
                            <span>开图 (Maphack)</span>
                        </div>
                        <div class="cheat-option" :class="{ checked: option2 }" @click="option2 = !option2">
                            <div class="checkbox" :class="{ active: option2 }">
                                <svg v-if="option2" xmlns="http://www.w3.org/2000/svg" height="16px"
                                    viewBox="0 -960 960 960" width="16px" fill="currentColor">
                                    <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z" />
                                </svg>
                            </div>
                            <span>建造列表 (Production Tab)</span>
                        </div>
                        <div class="cheat-option other-option">
                            <span class="other-label">其他：</span>
                            <input class="sc2-input inline-input" type="text" placeholder="请详细描述..."
                                v-model="otherDesc">
                        </div>
                    </div>
                </div>
            </form>

            <span v-if="errorMsg" class="error-msg">{{ errorMsg }}</span>
            <span v-if="successMsg" class="success-msg">{{ successMsg }}</span>

            <wSubmitButton text="提交举报" @click="submitReport"></wSubmitButton>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import wSubmitButton from './widgets/wSubmitButton.vue';
import { reportCheater } from '../api/api.js';

const props = defineProps({ user: Object });

const battleTag = ref('');
const option1 = ref(false);
const option2 = ref(false);
const otherDesc = ref('');
const successMsg = ref('');
const errorMsg = ref('');

async function submitReport() {
    successMsg.value = '';
    errorMsg.value = '';
    if (!battleTag.value) {
        errorMsg.value = '请输入战网ID';
        return;
    }
    const types = [];
    if (option1.value) types.push('开图');
    if (option2.value) types.push('建造列表');
    if (otherDesc.value) types.push(otherDesc.value);
    if (types.length === 0) {
        errorMsg.value = '请选择外挂类型';
        return;
    }
    try {
        const data = {
            battleTag: battleTag.value,
            cheatType: types.join(', '),
            description: types.join(', ')
        };
        const userId = props.user?.id || 0;
        const res = await reportCheater(data, userId);
        if (res.data.code === 200) {
            successMsg.value = '举报已提交，感谢您的反馈！';
            battleTag.value = '';
            option1.value = false;
            option2.value = false;
            otherDesc.value = '';
        } else {
            errorMsg.value = res.data.msg || '提交失败';
        }
    } catch (e) {
        errorMsg.value = '网络错误';
    }
}
</script>

<style scoped>
.record-cheater {
    max-width: 700px;
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
    margin-bottom: 32px;
}

.form-group {
    margin-bottom: 24px;
}

.form-label {
    display: block;
    font-family: 'Orbitron', sans-serif;
    font-size: 12px;
    color: var(--sc2-text-dim);
    letter-spacing: 1px;
    text-transform: uppercase;
    margin-bottom: 8px;
}

.sc2-input {
    width: 100%;
    max-width: 400px;
    padding: 12px 16px;
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

.sc2-input::placeholder {
    color: var(--sc2-text-dim);
}

.cheat-options {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.cheat-option {
    display: flex;
    align-items: center;
    gap: 10px;
    cursor: pointer;
    color: var(--sc2-text);
    font-size: 14px;
    transition: color 0.2s;
}

.cheat-option:hover {
    color: var(--sc2-accent);
}

.checkbox {
    width: 22px;
    height: 22px;
    border: 2px solid var(--sc2-border);
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
    flex-shrink: 0;
}

.checkbox.active {
    border-color: var(--sc2-accent);
    background: rgba(0, 180, 216, 0.15);
    color: var(--sc2-accent);
}

.other-option {
    cursor: default;
}

.other-label {
    flex-shrink: 0;
    color: var(--sc2-text);
}

.inline-input {
    max-width: 280px;
}

.error-msg {
    display: block;
    color: var(--sc2-danger);
    font-size: 13px;
    margin-top: 16px;
}

.success-msg {
    display: block;
    color: var(--sc2-success);
    font-size: 13px;
    margin-top: 16px;
}

@media (max-width: 768px) {
    .sc2-panel {
        padding: 20px;
    }

    .sc2-input,
    .inline-input {
        max-width: 100%;
    }

    .cheat-options {
        gap: 10px;
    }
}
</style>
