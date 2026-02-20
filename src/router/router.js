import { createRouter, createWebHistory } from 'vue-router';
import loginPage from '../loginPage.vue';
import homePage from '../homePage.vue';
import registerPage from '../registerPage.vue';

const routes = [
    {
        path: '/',
        name: 'homePage',
        component: homePage
    },
    {
        path: '/loginPage',
        name: 'loginPage',
        component: loginPage
    },
    {
        path: '/registerPage',
        name: 'registerPage',
        component: registerPage
    }
];

const router = createRouter({
    history: createWebHistory('/'),
    routes
});

export default router;
