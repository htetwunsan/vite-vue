import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import CallbackView from "@/views/CallbackView.vue"
import EmployeesView from "@/views/EmployeesView.vue"
import EmployeeCreateView from "@/views/EmployeeCreateView.vue"
import EmployeeEditView from "@/views/EmployeeEditView.vue"
import { isAuthenticated } from "@/store"

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: HomeView
        },
        {
            path: "/oauth/callback",
            name: "oauth-callback",
            component: CallbackView
        },
        {
            path: "/employees",
            name: "employees",
            component: EmployeesView,
            beforeEnter: (to, from) => {
                if (!isAuthenticated.value) {
                    return { name: "home" }
                }
            }
        },
        {
            path: "/employees/create",
            name: "employees-create",
            component: EmployeeCreateView,
            beforeEnter: (to, from) => {
                if (!isAuthenticated.value) {
                    return { name: "home" }
                }
            }
        },
        {
            path: "/employees/edit/:id",
            name: "employees-edit",
            component: EmployeeEditView,
            beforeEnter: (to, from) => {
                if (!isAuthenticated.value) {
                    return { name: "home" }
                }
            }
        },
    ]
})

export default router
