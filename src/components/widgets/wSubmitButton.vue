<template>
    <div class="sc2-btn-submit" ref="btnRef" :class="{disabled: disabled || loading}" @click="onClick">
        <span class="btn-text">{{ text }}</span>
        <div class="btn-shine"></div>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';

const btnRef = ref(null);

const props = defineProps({
    text: { type: String, required: true },
    fontSize: { type: String, default: undefined },
    width: { type: String, default: undefined },
    disabled: { type: Boolean, default: false },
    loading: { type: Boolean, default: false }
});

function onClick() {
    if (props.disabled || props.loading) return;
    // Emit click only when enabled
    emitClick();
}

const emit = defineEmits(['click']);

onMounted(() => {
    if (props.fontSize && btnRef.value) {
        btnRef.value.style.fontSize = props.fontSize;
    }
    if (props.width && btnRef.value) {
        btnRef.value.style.width = props.width;
    }
});

function emitClick() {
    // Use nextTick emit to avoid sync re-entrancy
    emit('click');
}
</script>

<style scoped>
.sc2-btn-submit {
    position: relative;
    margin-top: 24px;
    width: 100%;
    max-width: 360px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, var(--sc2-accent), var(--sc2-accent-glow));
    border: none;
    border-radius: 8px;
    cursor: pointer;
    overflow: hidden;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(0, 180, 216, 0.2);
}

.sc2-btn-submit:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 25px rgba(0, 180, 216, 0.35);
}

.sc2-btn-submit:active {
    transform: translateY(0);
}

.btn-text {
    font-family: 'Rajdhani', sans-serif;
    font-size: 15px;
    font-weight: 600;
    color: white;
    letter-spacing: 1px;
    text-transform: uppercase;
    z-index: 1;
}

.btn-shine {
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.15), transparent);
    transition: left 0.5s ease;
}

.sc2-btn-submit:hover .btn-shine {
    left: 100%;
}
</style>
