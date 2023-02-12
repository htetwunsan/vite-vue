import gqlClient from "@/graphql"
import { queryMe, type User } from "@/graphql/query"
import { computed, ref, watch } from "vue"
import { useRouter } from "vue-router"


const accessToken = ref(sessionStorage.getItem("access_token") ?? "")
watch(accessToken, () => {
    sessionStorage.setItem("access_token", accessToken.value)
})

const isAuthenticated = computed(() => accessToken.value !== "")

const me = ref<User | null>(null)

async function login(access_token: string, refresh_token: string) {
    accessToken.value = access_token
    gqlClient.setHeader("Authorization", "Bearer " + accessToken.value)

    try {
        const data = await queryMe()
        me.value = data.me
        return "/employees"
    } catch (err) {
        return await logout()
    }
}

async function logout() {
    accessToken.value = ""
    gqlClient.setHeader("Authorization", "Bearer " + accessToken.value)
    me.value = null

    return "/"
}

const alertCreated = ref("")

function showCreated() {
    alertCreated.value = "Employee Created!"

    setTimeout(() => {
        alertCreated.value = ""
    }, 5000)
}

function showUpdated() {
    alertCreated.value = "Employee Updated!"

    setTimeout(() => {
        alertCreated.value = ""
    }, 5000)
}

function showDeleted() {
    alertCreated.value = "Employee Deleted!"

    setTimeout(() => {
        alertCreated.value = ""
    }, 5000)
}

function useHandleError() {
    const router = useRouter()
    return function (err: any) {
        const { category } = err.response.errors[0].extensions
        if (category === "authentication") {
            logout().then(route => router.replace(route))
            return
        }

        return category
    }

}

export { accessToken, isAuthenticated, login, logout, alertCreated, showCreated, showUpdated, showDeleted, useHandleError }