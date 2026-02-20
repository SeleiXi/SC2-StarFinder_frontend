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
                <input type="text" placeholder="昵称" class="wInput" v-model="form.name">
                <input type="text" placeholder="战网ID（如 XXX#1234）" class="wInput" v-model="form.battleTag">
                <input type="text" placeholder="QQ" class="wInput" v-model="form.qq">
                <input type="number" placeholder="MMR" class="wInput" v-model.number="form.mmr">
                <select class="wInput select-input" v-model="form.race">
                    <option value="" disabled>选择种族</option>
                    <option value="T">人族 (Terran)</option>
                    <option value="Z">异虫 (Zerg)</option>
                    <option value="P">星灵 (Protoss)</option>
                    <option value="R">随机 (Random)</option>
                </select>
                <select class="wInput select-input" v-model="form.region">
                    <option value="" disabled>选择服务器</option>
                    <option value="CN">中国</option>
                    <option value="KR">韩国</option>
                    <option value="US">美服</option>
                    <option value="EU">欧服</option>
                </select>
                <input type="text" placeholder="直播链接" class="wInput" v-model="form.streamUrl">
                <input type="text" placeholder="个性签名" class="wInput" v-model="form.signature">
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
    name: '', battleTag: '', qq: '', race: '', region: '', streamUrl: '', signature: '', mmr: 0
});
const errorMsg = ref('');
const successMsg = ref('');

onMounted(() => {
    if (props.user) {
        form.value = {
            name: props.user.name || '',
            battleTag: props.user.battleTag || '',
            qq: props.user.qq || '',
            race: props.user.race || '',
            region: props.user.region || '',
            streamUrl: props.user.streamUrl || '',
            signature: props.user.signature || '',
            mmr: props.user.mmr || 0
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
</style>
