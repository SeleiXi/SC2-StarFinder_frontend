<template>
    <div class="sc2-layout">
        <!-- Sidebar -->
        <aside class="sc2-sidebar" :class="{ collapsed: sidebarCollapsed }">
            <div class="sidebar-header">
                <div class="logo-area" v-show="!sidebarCollapsed">
                    <span class="logo-text">STAR</span><span class="logo-accent">FINDER</span>
                </div>
                <button class="toggle-btn" @click="toggleSidebar">
                    <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px"
                        fill="currentColor">
                        <path
                            d="M440-240 200-480l240-240 56 56-183 184 183 184-56 56Zm264 0L464-480l240-240 56 56-183 184 183 184-56 56Z" />
                    </svg>
                </button>
            </div>

            <nav class="sidebar-nav">
                <!-- 教学 -->
                <a href="#" class="nav-item" :class="{ active: currentId === 8 }" @click.prevent="switchPage(8)">
                    <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px"
                        fill="currentColor">
                        <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h360l280 280v360q0 33-23.5 56.5T760-120H200Zm0-80h560v-320H520v-240H200v560Zm80-80h400v-80H280v80Zm0-160h400v-80H280v80Zm0-160h240v-80H280v80Zm240-40v-160l160 160H520Z"/>
                    </svg>
                    <span class="nav-label">教学</span>
                </a>

                <!-- 约战 Dropdown -->
                <div class="nav-group">
                    <button class="nav-item" :class="{ active: currentId >= 2 && currentId <= 6 }"
                        @click="toggleSubMenu('match')">
                        <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px"
                            fill="currentColor">
                            <path
                                d="M762-96 645-212l-88 88-28-28q-23-23-23-57t23-57l169-169q23-23 57-23t57 23l28 28-88 88 116 117q12 12 12 28t-12 28l-50 50q-12 12-28 12t-28-12Zm118-628L426-270l5 4q23 23 23 57t-23 57l-28 28-88-88L198-96q-12 12-28 12t-28-12l-50-50q-12-12-12-28t12-28l116-117-88-88 28-28q23-23 57-23t57 23l4 5 454-454h160v160ZM334-583l24-23 23-24-23 24-24 23Zm-56 57L80-724v-160h160l198 198-57 56-174-174h-47v47l174 174-56 57Zm92 199 430-430v-47h-47L323-374l47 47Zm0 0-24-23-23-24 23 24 24 23Z" />
                        </svg>
                        <span class="nav-label">约战</span>
                        <svg class="chevron" :class="{ rotated: openMenus.match }" xmlns="http://www.w3.org/2000/svg"
                            height="16px" viewBox="0 -960 960 960" width="16px" fill="currentColor">
                            <path d="M480-344 240-584l56-56 184 184 184-184 56 56-240 240Z" />
                        </svg>
                    </button>
                    <transition name="submenu">
                        <ul class="sub-nav" v-show="openMenus.match && !sidebarCollapsed">
                            <li><a href="#" :class="{ active: currentId === 2 }" @click.prevent="switchPage(2)">1v1</a>
                            </li>
                            <li><a href="#" :class="{ active: currentId === 3 }" @click.prevent="switchPage(3)">2v2</a>
                            </li>
                            <li><a href="#" :class="{ active: currentId === 4 }" @click.prevent="switchPage(4)">3v3</a>
                            </li>
                            <li><a href="#" :class="{ active: currentId === 5 }" @click.prevent="switchPage(5)">4v4</a>
                            </li>
                            <li><a href="#" :class="{ active: currentId === 6 }" @click.prevent="switchPage(6)">合作任务</a>
                            </li>
                        </ul>
                    </transition>
                </div>

                <!-- 战队 -->
                <a href="#" class="nav-item" :class="{ active: currentId === 17 }" @click.prevent="switchPage(17)">
                    <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px"
                        fill="currentColor">
                        <path d="M0-240v-63q0-43 44-70t116-27q13 0 25 .5t23 2.5q-14 21-21 44t-7 48v65H0Zm240 0v-65q0-32 17.5-58.5T307-410q32-20 76.5-30t96.5-10q53 0 97.5 10t76.5 30q32 20 49 46.5t17 58.5v65H240Zm540 0v-65q0-26-6.5-49T754-397q11-2 22.5-2.5t23.5-.5q72 0 116 26.5t44 70.5v63H780Zm-480-80h360v-6q0-37-74.5-60.5T480-410q-77 0-151 23.5T254-326v6ZM160-440q-33 0-56.5-23.5T80-520q0-34 23.5-57t56.5-23q34 0 57 23t23 57q0 33-23 56.5T160-440Zm640 0q-33 0-56.5-23.5T720-520q0-34 23.5-57t56.5-23q34 0 57 23t23 57q0 33-23 56.5T800-440Zm-320-40q-50 0-85-35t-35-85q0-51 35-85.5t85-34.5q51 0 85.5 34.5T600-600q0 50-34.5 85T480-480Zm0-80q17 0 28.5-11.5T520-600q0-17-11.5-28.5T480-640q-17 0-28.5 11.5T440-600q0 17 11.5 28.5T480-560Zm1 240Zm-1-280Z"/>
                    </svg>
                    <span class="nav-label">战队</span>
                </a>

                <!-- 直播列表 -->
                <a href="#" class="nav-item" :class="{ active: currentId === 13 }" @click.prevent="switchPage(13)">
                    <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px"
                        fill="currentColor">
                        <path d="M320-200v-560l440 280-440 280Z" />
                    </svg>
                    <span class="nav-label">直播列表</span>
                </a>

                <!-- 挂人区 -->
                <a href="#" class="nav-item" :class="{ active: currentId === 16 }" @click.prevent="switchPage(16)">
                    <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px"
                        fill="currentColor">
                        <path d="M480-80q-140 0-240-100T140-420q0-100 49.5-184.5T326-738l-86-86 56-56 88 88q42-20 88-31t88-11q140 0 240 100t100 240q0 140-100 240T480-80Zm0-80q108 0 184-76t76-184q0-108-76-184T480-680q-108 0-184 76t-76 184q0 108 76 184t184 76Zm0-80q-75 0-127.5-52.5T300-420q0-75 52.5-127.5T480-600q75 0 127.5 52.5T660-420q0 75-52.5 127.5T480-240Zm0-80q42 0 71-29t29-71q0-42-29-71t-71-29q-42 0-71 29t-29 71q0 42 29 71t71 29Z"/>
                    </svg>
                    <span class="nav-label">挂人区</span>
                </a>

                <!-- 外挂图鉴 Dropdown -->
                <div class="nav-group">
                    <button class="nav-item" :class="{ active: currentId >= 10 && currentId <= 11 }"
                        @click="toggleSubMenu('cheat')">
                        <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px"
                            fill="currentColor">
                            <path
                                d="M400-400h160v-80H400v80Zm0-120h320v-80H400v80Zm0-120h320v-80H400v80Zm-80 400q-33 0-56.5-23.5T240-320v-480q0-33 23.5-56.5T320-880h480q33 0 56.5 23.5T880-800v480q0 33-23.5 56.5T800-240H320Zm0-80h480v-480H320v480ZM160-80q-33 0-56.5-23.5T80-160v-560h80v560h560v80H160Zm160-720v480-480Z" />
                        </svg>
                        <span class="nav-label">外挂图鉴</span>
                        <svg class="chevron" :class="{ rotated: openMenus.cheat }" xmlns="http://www.w3.org/2000/svg"
                            height="16px" viewBox="0 -960 960 960" width="16px" fill="currentColor">
                            <path d="M480-344 240-584l56-56 184 184 184-184 56 56-240 240Z" />
                        </svg>
                    </button>
                    <transition name="submenu">
                        <ul class="sub-nav" v-show="openMenus.cheat && !sidebarCollapsed">
                            <li><a href="#" :class="{ active: currentId === 10 }"
                                    @click.prevent="switchPage(10)">登记外挂</a></li>
                            <li><a href="#" :class="{ active: currentId === 11 }"
                                    @click.prevent="switchPage(11)">外挂图鉴</a></li>
                        </ul>
                    </transition>
                </div>

                <!-- 赛事宣传 -->
                <a href="#" class="nav-item" :class="{ active: currentId === 7 }" @click.prevent="switchPage(7)">
                    <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px"
                        fill="currentColor">
                        <path
                            d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm-40-82v-78q-33 0-56.5-23.5T360-320v-40L168-552q-3 18-5.5 36t-2.5 36q0 121 79.5 212T440-162Zm276-102q41-45 62.5-100.5T800-480q0-98-54.5-179T600-776v16q0 33-23.5 56.5T520-680h-80v80q0 17-11.5 28.5T400-560h-80v80h240q17 0 28.5 11.5T600-440v120h40q26 0 47 15.5t29 40.5Z" />
                    </svg>
                    <span class="nav-label">赛事宣传</span>
                </a>

                <!-- MMR 查询 -->
                <a href="#" class="nav-item" :class="{ active: currentId === 15 }" @click.prevent="switchPage(15)">
                    <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px"
                        fill="currentColor">
                        <path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z" />
                    </svg>
                    <span class="nav-label">MMR 查询</span>
                </a>

                <!-- 管理后台 (admin only) -->
                <a href="#" class="nav-item" :class="{ active: currentId === 99 }" @click.prevent="switchPage(99)"
                    v-if="isLogin && (currentUser?.role === 'admin' || currentUser?.role === 'super_admin')">
                    <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px"
                        fill="currentColor">
                        <path
                            d="M680-280q25 0 42.5-17.5T740-340q0-25-17.5-42.5T680-400q-25 0-42.5 17.5T620-340q0 25 17.5 42.5T680-280Zm0 120q31 0 57-14.5t42-39.5q-22-13-47-19.5t-52-6.5q-27 0-52 6.5T581-214q16 25 42 39.5t57 14.5ZM480-80q-139-35-229.5-159.5T160-516v-244l320-120 320 120v227q-19-8-39-12.5t-41-4.5q-78 0-134.5 55.5T530-360q0 54 28.5 100T620-194l-20 14-120 100Zm200 0q-83 0-141.5-58.5T480-280q0-83 58.5-141.5T680-480q83 0 141.5 58.5T880-280q0 83-58.5 141.5T680-80Z" />
                    </svg>
                    <span class="nav-label">管理后台</span>
                </a>
            </nav>
            <!-- Bottom user area -->
            <div class="sidebar-footer">
                <a href="#" class="nav-item user-item" v-if="isLogin" :class="{ active: currentId === 12 }"
                    @click.prevent="switchPage(12)">
                    <div class="avatar-mini" :style="avatarMiniStyle"></div>
                    <span class="nav-label">{{ currentUser?.battleTag || currentUser?.email || '个人信息' }}</span>
                </a>
                <button class="nav-item logout-btn" v-if="isLogin" @click="handleLogout"
                    style="margin-top: 10px; border: none; background: transparent; width: 100%; cursor: pointer;">
                    <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px"
                        fill="#ff4444">
                        <path
                            d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h280v80H200Zm440-160-56-58 102-102H360v-80h326L584-622l56-58 200 200-200 200Z" />
                    </svg>
                    <span class="nav-label" style="color: #ff4444;" v-show="!sidebarCollapsed">登出</span>
                </button>
                <a href="#" class="nav-item" v-else @click.prevent="jumpToLoginPage">
                    <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px"
                        fill="currentColor">
                        <path
                            d="M480-120v-80h280v-560H480v-80h280q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H480Zm-80-160-55-58 102-102H120v-80h327L345-622l55-58 200 200-200 200Z" />
                    </svg>
                    <span class="nav-label">登入</span>
                </a>
            </div>
        </aside>

        <!-- Main content -->
        <main class="sc2-main">
            <!-- Mobile menu toggle -->
            <button class="mobile-menu-btn" @click="toggleSidebar">
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"
                    fill="currentColor">
                    <path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z" />
                </svg>
            </button>
            <!-- Mobile overlay -->
            <div class="mobile-overlay" v-if="!sidebarCollapsed" @click="sidebarCollapsed = true"></div>
            <div class="main-content">
                <findMatch v-if="currentId >= 2 && currentId <= 5 && !profileEditMode"
                    :mode="`${currentId - 1}v${currentId - 1}`" :user="currentUser" @profileUpdated="onProfileUpdated"></findMatch>
                <findMatch v-if="currentId == 6 && !profileEditMode" mode="coop" :user="currentUser" @profileUpdated="onProfileUpdated"></findMatch>
                <matchInfo v-if="currentId == 7 && !profileEditMode" :user="currentUser"></matchInfo>
                <Profile v-if="currentId == 12 && !profileEditMode" @jumpToProfileEditPage="jumpToProfileEditPage"
                    :user="currentUser"></Profile>
                <ProfileEdit v-if="profileEditMode" :user="currentUser" @profileUpdated="onProfileUpdated">
                </ProfileEdit>
                <RecordCheater v-if="currentId == 10 && !profileEditMode" :user="currentUser"></RecordCheater>
                <CheaterList v-if="currentId == 11 && !profileEditMode"></CheaterList>
                <Tutorial v-if="currentId == 8 && !profileEditMode"></Tutorial>
                <StreamList v-if="currentId == 13 && !profileEditMode"></StreamList>
                <AIAssistant v-if="currentId == 14 && !profileEditMode"></AIAssistant>
                <FindMmr v-if="currentId == 15 && !profileEditMode"></FindMmr>
                <PublicReports v-if="currentId == 16 && !profileEditMode"></PublicReports>
                <ClanInfo v-if="currentId == 17 && !profileEditMode"></ClanInfo>
                <AdminPanel v-if="currentId == 99 && !profileEditMode" :user="currentUser"></AdminPanel>
            </div>
            <!-- Footer -->
            <footer class="site-footer">
                网站由 <a href="https://blog.seleixi.site/" target="_blank" rel="noopener">SeleiXi</a> 制作，可以给
                <a href="https://github.com/SeleiXi/SC2-StarFinder-Backend" target="_blank" rel="noopener">Github</a> 点个 Star~
            </footer>
        </main>
    </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';

import findMatch from './components/FindMatch.vue';
import matchInfo from './components/MatchInfoPublicity.vue';
import Profile from './components/Profile.vue';
import ProfileEdit from './components/ProfileEdit.vue';
import RecordCheater from './components/RecordCheater.vue';
import CheaterList from './components/CheaterList.vue';
import Tutorial from './components/Tutorial.vue';
import StreamList from './components/StreamList.vue';
import AdminPanel from './components/AdminPanel.vue';
import AIAssistant from './components/AIAssistant.vue';
import FindMmr from './components/FindMmr.vue';
import PublicReports from './components/PublicReports.vue';
import ClanInfo from './components/ClanInfo.vue';
import { getStoredUser, clearUser } from './api/api.js';

const router = useRouter();
const route = useRoute();
const sidebarCollapsed = ref(false);
const profileEditMode = ref(false);
const isLogin = ref(false);
const currentUser = ref(null);
const currentId = ref(8);
const openMenus = reactive({ match: true, cheat: false });

// Map URL path to page ID
function pathToId(path) {
    if (!path || path === '/') return 8;
    if (path.startsWith('/match/')) {
        const mode = path.replace('/match/', '');
        const map = { '1v1': 2, '2v2': 3, '3v3': 4, '4v4': 5, 'coop': 6 };
        return map[mode] || 8;
    }
    const map = {
        '/events': 7, '/tutorial': 8, '/profile': 12, '/streams': 13,
        '/mmr': 15, '/public-reports': 16, '/clan': 17, '/admin': 99,
        '/cheater/report': 10, '/cheater/list': 11, '/cheater': 10
    };
    for (const [k, v] of Object.entries(map)) {
        if (path === k || path.startsWith(k + '/')) return v;
    }
    return 8;
}

// Map page ID to URL path
function idToPath(id) {
    const map = {
        2: '/match/1v1', 3: '/match/2v2', 4: '/match/3v3', 5: '/match/4v4', 6: '/match/coop',
        7: '/events', 8: '/tutorial', 10: '/cheater/report', 11: '/cheater/list',
        12: '/profile', 13: '/streams', 14: '/ai', 15: '/mmr', 16: '/public-reports', 17: '/clan', 99: '/admin'
    };
    return map[id] || '/';
}

onMounted(() => {
    const user = getStoredUser();
    if (user) {
        isLogin.value = true;
        currentUser.value = user;
    }
    if (window.innerWidth <= 768) {
        sidebarCollapsed.value = true;
    }
    // Initialize from current URL
    const id = pathToId(route.path);
    currentId.value = id;
    // Open relevant submenus
    if (id >= 2 && id <= 6) openMenus.match = true;
    if (id === 10 || id === 11) openMenus.cheat = true;
});

function toggleSubMenu(key) {
    openMenus[key] = !openMenus[key];
    if (sidebarCollapsed.value) {
        sidebarCollapsed.value = false;
    }
}

function toggleSidebar() {
    sidebarCollapsed.value = !sidebarCollapsed.value;
}

function switchPage(newId) {
    profileEditMode.value = false;
    currentId.value = newId;
    const path = idToPath(newId);
    if (route.path !== path) {
        router.push(path);
    }
    if (window.innerWidth <= 768) {
        sidebarCollapsed.value = true;
    }
}

function jumpToProfileEditPage() {
    profileEditMode.value = true;
}

function onProfileUpdated(user) {
    currentUser.value = user;
    profileEditMode.value = false;
}

function jumpToLoginPage() {
    router.push({ name: 'loginPage' });
}

function handleLogout() {
    clearUser();
    router.push({ name: 'loginPage' });
}

function getCommanderUrl(filename) {
    return require(`./assets/commanders/${filename}.webp`);
}

const avatarMiniStyle = computed(() => ({
    backgroundImage: `url(${getCommanderUrl(currentUser.value?.profilePic || 'raynor')})`
}));
</script>

<style scoped>
.sc2-layout {
    min-height: 100vh;
    display: grid;
    grid-template-columns: auto 1fr;
    background-color: var(--sc2-bg-deep);
}

/* ===== SIDEBAR ===== */
.sc2-sidebar {
    width: 240px;
    height: 100vh;
    position: sticky;
    top: 0;
    display: flex;
    flex-direction: column;
    background: linear-gradient(180deg, var(--sc2-bg-panel) 0%, var(--sc2-bg-dark) 100%);
    border-right: 1px solid var(--sc2-border);
    transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    overflow: hidden;
    z-index: 100;
}

.sc2-sidebar.collapsed {
    width: 60px;
}

.sc2-sidebar.collapsed .nav-label {
    display: none;
}

.sc2-sidebar.collapsed .chevron {
    display: none;
}

.sidebar-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 12px;
    border-bottom: 1px solid var(--sc2-border);
    min-height: 56px;
}

.logo-area {
    display: flex;
    gap: 4px;
    white-space: nowrap;
}

.logo-text {
    font-family: 'Orbitron', sans-serif;
    font-size: 16px;
    font-weight: 700;
    letter-spacing: 2px;
    color: var(--sc2-text-bright);
}

.logo-accent {
    font-family: 'Orbitron', sans-serif;
    font-size: 16px;
    font-weight: 700;
    letter-spacing: 2px;
    color: var(--sc2-accent);
    text-shadow: 0 0 12px rgba(0, 180, 216, 0.4);
}

.toggle-btn {
    background: none;
    border: none;
    color: var(--sc2-text-dim);
    cursor: pointer;
    padding: 8px;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
    flex-shrink: 0;
}

.toggle-btn:hover {
    background: var(--sc2-bg-hover);
    color: var(--sc2-accent);
}

.collapsed .toggle-btn svg {
    transform: rotate(180deg);
}

/* ===== NAV ===== */
.sidebar-nav {
    flex: 1;
    padding: 8px;
    overflow-y: auto;
    overflow-x: hidden;
}

.nav-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 12px;
    border-radius: 8px;
    color: var(--sc2-text);
    text-decoration: none;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    white-space: nowrap;
    border: 1px solid transparent;
    background: none;
    width: 100%;
    font-family: inherit;
}

.nav-item:hover {
    background: var(--sc2-bg-hover);
    border-color: var(--sc2-border);
}

.nav-item.active {
    color: var(--sc2-accent);
    background: rgba(0, 180, 216, 0.08);
    border-color: rgba(0, 180, 216, 0.2);
}

.nav-item.active svg {
    color: var(--sc2-accent);
}

.nav-item svg {
    flex-shrink: 0;
    transition: color 0.2s;
}

.nav-label {
    flex: 1;
    text-align: left;
}

.chevron {
    transition: transform 0.3s;
    flex-shrink: 0;
}

.chevron.rotated {
    transform: rotate(180deg);
}

/* Sub nav */
.sub-nav {
    list-style: none;
    padding: 4px 0 4px 20px;
    overflow: hidden;
}

.sub-nav a {
    display: block;
    padding: 6px 16px;
    color: var(--sc2-text-dim);
    text-decoration: none;
    font-size: 13px;
    border-radius: 6px;
    transition: all 0.2s;
    border-left: 2px solid transparent;
}

.sub-nav a:hover {
    color: var(--sc2-text);
    background: var(--sc2-bg-hover);
}

.sub-nav a.active {
    color: var(--sc2-accent);
    border-left-color: var(--sc2-accent);
    background: rgba(0, 180, 216, 0.06);
}

/* Submenu transitions */
.submenu-enter-active,
.submenu-leave-active {
    transition: all 0.3s ease;
    max-height: 300px;
}

.submenu-enter-from,
.submenu-leave-to {
    opacity: 0;
    max-height: 0;
}

/* ===== Footer ===== */
.sidebar-footer {
    padding: 8px;
    border-top: 1px solid var(--sc2-border);
}

.avatar-mini {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background-size: cover;
    background-position: center;
    border: 2px solid var(--sc2-accent);
    flex-shrink: 0;
}

/* ===== MAIN ===== */
.sc2-main {
    min-height: 100vh;
    background:
        linear-gradient(rgba(8, 11, 18, 0.85), rgba(8, 11, 18, 0.85)),
        url("./assets/pics/main-bg.jpg") center/cover no-repeat fixed;
    position: relative;
}

.mobile-menu-btn {
    display: none;
    position: fixed;
    top: 50%;
    left: 10px;
    transform: translateY(-50%);
    z-index: 999;
    background: var(--sc2-bg-panel);
    border: 1px solid var(--sc2-border);
    color: var(--sc2-accent);
    border-radius: 8px;
    padding: 8px;
    cursor: pointer;
}

.mobile-overlay {
    display: none;
}

.main-content {
    padding: 32px;
    max-width: 1200px;
    margin: 0 auto;
}

.site-footer {
    text-align: center;
    padding: 20px 32px;
    font-size: 13px;
    color: var(--sc2-text-dim);
    border-top: 1px solid var(--sc2-border);
    margin-top: 40px;
}

.site-footer a {
    color: var(--sc2-accent);
    text-decoration: none;
    transition: opacity 0.2s;
}

.site-footer a:hover {
    opacity: 0.8;
    text-decoration: underline;
}

/* ===== MOBILE RESPONSIVE ===== */
@media (max-width: 768px) {
    .sc2-layout {
        grid-template-columns: 1fr;
    }

    .sc2-sidebar {
        position: fixed;
        left: 0;
        top: 0;
        height: 100vh;
        z-index: 1000;
        transform: translateX(-100%);
        transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        width: 250px;
    }

    .sc2-sidebar:not(.collapsed) {
        transform: translateX(0);
    }

    .sc2-sidebar.collapsed {
        width: 250px;
        transform: translateX(-100%);
    }

    /* Ensure nav labels don't overflow in mobile sidebar */
    .sc2-sidebar .nav-label {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .mobile-menu-btn {
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .mobile-overlay {
        display: block;
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.5);
        z-index: 999;
    }

    .sc2-main {
        min-height: 100vh;
    }

    .main-content {
        padding: 60px 16px 16px;
    }
}

@media (max-width: 480px) {
    .main-content {
        padding: 10px;
    }
}
</style>
