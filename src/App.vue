<script setup lang="ts">
import TopNav from "./components/TopNav.vue";
</script>

<template>
    <main class="flex flex-col items-stretch">
        <TopNav />
        <div class="p-4">
            <RouterView />
        </div>
    </main>
</template>