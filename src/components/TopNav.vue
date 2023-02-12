<script setup lang="ts">
import { isAuthenticated, alertCreated } from "@/store";
import LoginButton from "./LoginButton.vue"
import LogoutButton from "./LogoutButton.vue"

</script>
<template>
    <nav class="flex items-center gap-4 justify-end py-1">
        <div class="p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400 flex-grow" 
            role="alert"
            v-if="alertCreated">
            <span class="font-medium">{{ alertCreated }}</span>
        </div>

        <LoginButton v-if="!isAuthenticated" />
        <LogoutButton v-if="isAuthenticated" />
    </nav>
</template>