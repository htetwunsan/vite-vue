<script setup lang="ts">
import { login } from "@/store"
import { useRouter } from "vue-router"

const state = sessionStorage.getItem("state")
const codeVerifier = sessionStorage.getItem("code_verifier")

const router = useRouter()

const query = new URLSearchParams(window.location.search)

if (state === null || codeVerifier === null || query.get("code") === null || query.get("state") !== state) {
    router.replace("/")
}

const formData = new FormData()
formData.set("grant_type", "authorization_code")
formData.set("client_id", import.meta.env.VITE_CLIENT_ID)
formData.set("redirect_uri", import.meta.env.VITE_REDIRECT_URI)
formData.set("code_verifier", codeVerifier!)
formData.set("code", query.get("code")!)

fetch(new URL(import.meta.env.VITE_TOKEN_URL), {
    method: "post",
    body: formData
}).then(res => res.json())
.then(data => {
    sessionStorage.removeItem("state")
    sessionStorage.removeItem("code_verifier")
    
    return login(data.access_token, data.refresh_token)
})
.then(route => router.replace(route))

</script>
<template>
    <h1>Authenticating</h1>
</template>