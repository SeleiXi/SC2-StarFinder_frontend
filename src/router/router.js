import { createRouter, createWebHistory } from 'vue-router';
import loginPage from '../loginPage.vue';
import homePage from '../homePage.vue';
import registerPage from '../registerPage.vue';

const routes = [
    { path: '/loginPage', name: 'loginPage', component: loginPage },
    { path: '/registerPage', name: 'registerPage', component: registerPage },
    {
        path: '/',
        name: 'homePage',
        component: homePage
    },
    { path: '/match/:mode', component: homePage },
    { path: '/events', component: homePage },
    { path: '/tutorial', component: homePage },
    { path: '/tutorial/:section', component: homePage },
    { path: '/streams', component: homePage },
    { path: '/mmr', component: homePage },
    { path: '/cheater', component: homePage },
    { path: '/cheater/:section', component: homePage },
    { path: '/profile', component: homePage },
    { path: '/public-reports', component: homePage },
    { path: '/clan', component: homePage },
    { path: '/admin', component: homePage },
    { path: '/:pathMatch(.*)*', component: homePage }
];

const router = createRouter({
    history: createWebHistory('/'),
    routes
});

export default router;
