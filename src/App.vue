<template>
    <div id="app">
        <RouterView></RouterView>
    </div>
</template>

<script setup>
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&family=Rajdhani:wght@300;400;500;600;700&family=Share+Tech+Mono&display=swap');

:root {
    /* SC2 Dark Palette */
    --sc2-bg-deep: #080b12;
    --sc2-bg-dark: #0d1117;
    --sc2-bg-panel: #131926;
    --sc2-bg-hover: #1a2236;
    --sc2-border: #1e2d4a;
    --sc2-border-glow: #2a4a7a;
    --sc2-text: #c8d6e5;
    --sc2-text-bright: #e8f0fe;
    --sc2-text-dim: #6b7d99;
    --sc2-accent: #00b4d8;
    --sc2-accent-glow: #0096c7;
    --sc2-terran: #e07020;
    --sc2-zerg: #b030c0;
    --sc2-protoss: #30a0e0;
    --sc2-gold: #ffd700;
    --sc2-danger: #ff4444;
    --sc2-success: #00cc66;
    --sc2-sidebar-w: 250px;

    /* Legacy compat */
    --base-clr: var(--sc2-bg-dark);
    --line-clr: var(--sc2-border);
    --hover-clr: var(--sc2-bg-hover);
    --text-clr: var(--sc2-text);
    --accent-clr: var(--sc2-accent);
    --secondary-text-clr: var(--sc2-text-dim);
}

*,
*::before,
*::after {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body,
html,
#app {
    margin: 0;
    padding: 0;
    height: 100%;
    width: 100%;
    font-family: 'Rajdhani', 'Segoe UI', sans-serif;
    background-color: var(--sc2-bg-deep);
    color: var(--sc2-text);
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
}

/* SC2-style scrollbar */
::-webkit-scrollbar {
    width: 6px;
}

::-webkit-scrollbar-track {
    background: var(--sc2-bg-deep);
}

::-webkit-scrollbar-thumb {
    background: var(--sc2-border);
    border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
    background: var(--sc2-accent);
}

/* SC2 Selection highlight */
::selection {
    background: var(--sc2-accent);
    color: var(--sc2-bg-deep);
}

/* Utility class for glowing text */
.glow-text {
    text-shadow: 0 0 10px var(--sc2-accent), 0 0 20px rgba(0, 180, 216, 0.3);
}
</style>