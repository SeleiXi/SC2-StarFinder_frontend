<template>
    <div class="sc2-btn-text" ref="btnRef" @click="$emit('click')">{{ text }}</div>
</template>

<script setup>
import { onMounted, ref } from 'vue';

const btnRef = ref(null);

const props = defineProps({
    text: { type: String, required: true },
    fontSize: { type: String, default: undefined }
});

const emit = defineEmits(['click']);

onMounted(() => {
    if (props.fontSize && btnRef.value) {
        btnRef.value.style.fontSize = props.fontSize;
    }
});
</script>

<style scoped>
.sc2-btn-text {
    font-family: 'Rajdhani', sans-serif;
    font-size: 14px;
    color: var(--sc2-accent);
    cursor: pointer;
    transition: all 0.2s ease;
    letter-spacing: 0.5px;
}

.sc2-btn-text:hover {
    color: var(--sc2-text-bright);
    text-shadow: 0 0 8px rgba(0, 180, 216, 0.4);
}
</style>
