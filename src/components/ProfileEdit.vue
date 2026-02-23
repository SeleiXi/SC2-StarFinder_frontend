<template>
    <div class="profile-edit">
        <div class="edit-avatar-section">
            <div class="edit-avatar" @click="selectProfilePicture">
                <div class="avatar-mask">
                    <svg xmlns="http://www.w3.org/2000/svg" height="36px" viewBox="0 -960 960 960" width="36px"
                        fill="currentColor">
                        <path
                            d="M180-120q-24 0-42-18t-18-42v-600q0-24 18-42t42-18h405l-60 60H180v600h600v-348l60-60v408q0 24-18 42t-42 18H180Zm300-360ZM360-360v-170l382-382q9-9 20-13t22-4q11 0 22.32 4.5Q817.63-920 827-911l83 84q8.61 8.96 13.3 19.78 4.7 10.83 4.7 22.02 0 11.2-4.5 22.7T910-742L530-360H360Z" />
                    </svg>
                </div>
            </div>
        </div>

        <div class="sc2-panel edit-form-panel">
            <h2 class="panel-title">编辑资料</h2>
            <form class="edit-form" @submit.prevent="saveProfile">
                <div class="form-section">
                    <label>基本信息</label>
                    <input type="text" placeholder="QQ" class="wInput" v-model="form.qq">
                    <select class="wInput select-input" v-model="form.race">
                        <option value="" disabled>选择主种族</option>
                        <option value="T">人族 (Terran)</option>
                        <option value="Z">异虫 (Zerg)</option>
                        <option value="P">星灵 (Protoss)</option>
                        <option value="R">随机 (Random)</option>
                    </select>
                </div>

                <div class="form-section">
                    <label>合作模式常用指挥官</label>
                    <select class="wInput select-input" v-model="form.commander">
                        <option value="">未选择</option>
                        <option v-for="cmd in commanders" :key="cmd.id" :value="cmd.name">
                            {{ cmd.name }}
                        </option>
                    </select>
                    <label style="margin-top:12px;">合作模式等级 <span class="hint-text">(选填)</span></label>
                    <select class="wInput select-input" v-model="form.coopLevel">
                        <option value="">未填写</option>
                        <option value="精通1">精通1</option>
                        <option value="精通2">精通2</option>
                        <option value="精通3">精通3</option>
                        <option value="精通4">精通4</option>
                        <option value="精通5">精通5</option>
                        <option value="精通6">精通6</option>
                        <option value="精通7">精通7</option>
                        <option value="精通8">精通8</option>
                        <option value="精通9">精通9</option>
                        <option value="精通10">精通10</option>
                        <option value="精通11">精通11</option>
                        <option value="精通12">精通12</option>
                        <option value="精通13">精通13</option>
                        <option value="精通14">精通14</option>
                        <option value="精通15">精通15</option>
                        <option value="未精通">未精通</option>
                    </select>
                </div>

                <div class="form-section">
                    <label>战网 ID (只需要填写你想要被搜索到的那个服务器即可)</label>
                    <div class="tag-input-group">
                        <input type="text" placeholder="国服战网ID (如 XXX#1234)" class="wInput" v-model="form.battleTagCN">
                        <input type="text" placeholder="美服战网ID (如 XXX#1234)" class="wInput" v-model="form.battleTagUS">
                        <input type="text" placeholder="欧服战网ID (如 XXX#1234)" class="wInput" v-model="form.battleTagEU">
                        <input type="text" placeholder="韩服/台服战网ID (如 XXX#1234)" class="wInput" v-model="form.battleTagKR">
                    </div>
                </div>

                <div class="form-section">
                    <label>个人展示</label>
                    <input type="text" placeholder="直播链接" class="wInput" v-model="form.streamUrl">
                    <textarea placeholder="个人描述（可描述自己的战术风格、想要打的对抗等等，会在约战页面展示）" class="wInput textarea-input" v-model="form.signature" rows="4"></textarea>
                </div>

                <div class="form-section">
                    <label>MMR 信息 (可手动调整或同步)</label>
                    <div class="mmr-edit-grid">
                        <div class="mmr-item">
                            <span class="mmr-label">1v1 人族</span>
                            <input type="number" v-model.number="form.mmrTerran" class="wInput mmr-input">
                        </div>
                        <div class="mmr-item">
                            <span class="mmr-label">1v1 虫族</span>
                            <input type="number" v-model.number="form.mmrZerg" class="wInput mmr-input">
                        </div>
                        <div class="mmr-item">
                            <span class="mmr-label">1v1 神族</span>
                            <input type="number" v-model.number="form.mmrProtoss" class="wInput mmr-input">
                        </div>
                        <div class="mmr-item">
                            <span class="mmr-label">1v1 随机</span>
                            <input type="number" v-model.number="form.mmrRandom" class="wInput mmr-input">
                        </div>
                        <div class="mmr-item">
                            <span class="mmr-label">2v2 MMR</span>
                            <input type="number" v-model.number="form.mmr2v2" class="wInput mmr-input">
                        </div>
                        <div class="mmr-item">
                            <span class="mmr-label">3v3 MMR</span>
                            <input type="number" v-model.number="form.mmr3v3" class="wInput mmr-input">
                        </div>
                        <div class="mmr-item">
                            <span class="mmr-label">4v4 MMR</span>
                            <input type="number" v-model.number="form.mmr4v4" class="wInput mmr-input">
                        </div>
                    </div>
                    <span class="input-hint">MMR 会根据战网ID自动获取，你也可以手动进行微调。</span>
                </div>
            </form>
            <span v-if="errorMsg" class="error-msg">{{ errorMsg }}</span>
            <span v-if="successMsg" class="success-msg">{{ successMsg }}</span>
            <wSubmitButton text="保存修改" @click="saveProfile"></wSubmitButton>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import wSubmitButton from './widgets/wSubmitButton.vue';
import { updateProfile, saveUser } from '../api/api.js';
import '../css/widgets.css';

const props = defineProps({ user: Object });
const emit = defineEmits(['profileUpdated']);

const form = ref({
    battleTagCN: '',
    battleTagUS: '',
    battleTagEU: '',
    battleTagKR: '',
    qq: '',
    race: '',
    region: '',
    streamUrl: '',
    signature: '',
    commander: '',
    coopLevel: '',
    mmr: 0,
    mmrTerran: 0,
    mmrZerg: 0,
    mmrProtoss: 0,
    mmrRandom: 0,
    mmr2v2: 0,
    mmr3v3: 0,
    mmr4v4: 0
});
const errorMsg = ref('');
const successMsg = ref('');

const commanders = [
    { id: 1, name: '雷诺' }, { id: 2, name: '凯瑞甘' }, { id: 3, name: '阿塔尼斯' },
    { id: 4, name: '斯旺' }, { id: 5, name: '扎加拉' }, { id: 6, name: '沃拉尊' },
    { id: 7, name: '卡拉克斯' }, { id: 8, name: '阿巴瑟' }, { id: 9, name: '阿拉纳克' },
    { id: 10, name: '诺娃' }, { id: 11, name: '斯托科夫' }, { id: 12, name: '菲尼克斯' },
    { id: 13, name: '德哈卡' }, { id: 14, name: '霍纳与汉' }, { id: 15, name: '泰凯斯' },
    { id: 16, name: '泽拉图' }, { id: 17, name: '斯台特曼' }, { id: 18, name: '蒙斯克' }
];

onMounted(() => {
    if (props.user) {
        form.value = {
            battleTagCN: props.user.battleTagCN || '',
            battleTagUS: props.user.battleTagUS || '',
            battleTagEU: props.user.battleTagEU || '',
            battleTagKR: props.user.battleTagKR || '',
            qq: props.user.qq || '',
            race: props.user.race || '',
            commander: props.user.commander || '',
            coopLevel: props.user.coopLevel || '',
            region: props.user.region || '',
            streamUrl: props.user.streamUrl || '',
            signature: props.user.signature || '',
            mmr: props.user.mmr || 0,
            mmrTerran: props.user.mmrTerran || 0,
            mmrZerg: props.user.mmrZerg || 0,
            mmrProtoss: props.user.mmrProtoss || 0,
            mmrRandom: props.user.mmrRandom || 0,
            mmr2v2: props.user.mmr2v2 || 0,
            mmr3v3: props.user.mmr3v3 || 0,
            mmr4v4: props.user.mmr4v4 || 0
        };
    }
});

async function saveProfile() {
    errorMsg.value = '';
    successMsg.value = '';
    if (!props.user?.id) {
        errorMsg.value = '请先登录';
        return;
    }
    try {
        const res = await updateProfile(props.user.id, form.value);
        if (res.data.code === 200) {
            const updatedUser = res.data.data;
            saveUser(updatedUser);
            successMsg.value = '保存成功！';
            emit('profileUpdated', updatedUser);
        } else {
            errorMsg.value = res.data.msg || '保存失败';
        }
    } catch (e) {
        errorMsg.value = '网络错误，请稍后再试';
    }
}

function selectProfilePicture() { /* placeholder */ }
</script>

<style scoped>
.profile-edit {
    max-width: 600px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.edit-avatar-section {
    margin-bottom: 24px;
}

.edit-avatar {
    width: 140px;
    height: 140px;
    border-radius: 50%;
    background-image: url('../assets/pics/profile-image.png');
    background-size: cover;
    cursor: pointer;
    position: relative;
    border: 3px solid var(--sc2-border);
    transition: border-color 0.3s;
}

.edit-avatar:hover {
    border-color: var(--sc2-accent);
}

.avatar-mask {
    position: absolute;
    inset: 0;
    border-radius: 50%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.3s;
    color: var(--sc2-text-bright);
}

.edit-avatar:hover .avatar-mask {
    opacity: 1;
}

.form-section {
    margin-bottom: 25px;
    text-align: left;
}

.form-section label {
    display: block;
    font-size: 14px;
    color: var(--sc2-accent);
    margin-bottom: 10px;
    font-weight: bold;
    text-transform: uppercase;
}

.hint-text {
    font-size: 12px;
    color: var(--sc2-text-dim);
    text-transform: none;
    font-weight: normal;
}

.tag-input-group {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
}

.textarea-input {
    min-height: 80px;
    resize: vertical;
}

.mmr-edit-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 15px;
    background: rgba(0, 0, 0, 0.2);
    padding: 20px;
    border-radius: 8px;
    border: 1px solid var(--sc2-border);
}

.mmr-item {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.mmr-label {
    font-family: 'Orbitron', sans-serif;
    font-size: 12px;
    color: var(--sc2-accent);
}

.mmr-input {
    margin-top: 0 !important;
    padding: 8px 12px !important;
    max-width: 100% !important;
}

.input-hint {
    display: block;
    font-size: 12px;
    color: var(--sc2-text-dim);
    margin-top: 8px;
    font-style: italic;
}

.sc2-panel {
    background: linear-gradient(135deg, var(--sc2-bg-panel), var(--sc2-bg-dark));
    border: 1px solid var(--sc2-border);
    border-radius: 12px;
    padding: 32px;
    position: relative;
    overflow: hidden;
    width: 100%;
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

.panel-title {
    font-family: 'Orbitron', sans-serif;
    font-size: 20px;
    font-weight: 600;
    color: var(--sc2-text-bright);
    letter-spacing: 1px;
    margin-bottom: 20px;
    text-align: center;
}

.edit-form {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.select-input {
    cursor: pointer;
}

.error-msg {
    display: block;
    text-align: center;
    color: var(--sc2-danger);
    font-size: 13px;
    margin-top: 10px;
}

.success-msg {
    display: block;
    text-align: center;
    color: var(--sc2-success);
    font-size: 13px;
    margin-top: 10px;
}

.input-with-hint {
    display: flex;
    flex-direction: column;
    width: 100%;
}

.input-hint {
    font-size: 12px;
    color: var(--sc2-accent);
    margin-bottom: 20px;
}

.wInput:disabled {
    background: rgba(255, 255, 255, 0.05);
    cursor: not-allowed;
    border-style: dashed;
}
</style>
