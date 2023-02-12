<script setup lang="ts">
import {generateRandomString, generateCodeChallenge} from "@/utils"

async function authorize() {
    const state = generateRandomString(40)
    const codeVerifier = generateRandomString(128)
    const codeChallenge = await generateCodeChallenge(codeVerifier)

    const url = new URL(import.meta.env.VITE_AUTHORIZE_URL)
    url.searchParams.set("client_id", import.meta.env.VITE_CLIENT_ID)
    url.searchParams.set("redirect_uri", import.meta.env.VITE_REDIRECT_URI)
    url.searchParams.set("response_type", "code")
    url.searchParams.set("scope", "")
    url.searchParams.set("state", state)
    url.searchParams.set("code_challenge", codeChallenge)
    url.searchParams.set("code_challenge_method", "S256")

    sessionStorage.setItem("state", state)
    sessionStorage.setItem("code_verifier", codeVerifier)

    window.location.href = url.toString()
}

</script>
<template>
    <button class="relative inline-flex items-center justify-center p-0.5 mb-2 mr-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800"
            @click="authorize">
        <span class="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
            Continue with Laravel Passport
        </span>
    </button>
</template>