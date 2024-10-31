<script setup lang="ts">
import { useHead } from '@unhead/vue'

useHead({
    title: 'Dashboard',
})

definePageMeta({
    layout: 'manage',
    middleware: ['auth'],
})
</script>

<template>
    <article>
        <!-- example content -->
    </article>
</template>