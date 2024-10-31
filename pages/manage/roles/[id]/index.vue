<script setup lang="ts">
import { useRoute } from 'vue-router'

useHead({
    title: 'Details Role',
})

definePageMeta({
    layout: 'manage',
    middleware: ['auth'],
})

const route = useRoute()
const { $axios } = useNuxtApp()

const state = reactive({
    role: {},
    permissions: [],
})

const fetchDetailById = async () => {
    const { data } = await $axios.get(`/v1/auth/role/${route.params.id}`)

    state.role = data.data
}

const fetchAllPermissionsByRole = async () => {
    const { data } = await $axios.get(`/v1/auth/acl/permission/role/${route.params.id}`)

    state.permissions = data.data
}

onMounted(() => {
    fetchDetailById()
    fetchAllPermissionsByRole()
})
</script>

<template>
    <nav class="level">
        <div class="level-left">
            <div class="level-item">
                <h1 class="title is-5">Details Role: {{ state.role.display_name }}</h1>
            </div>
        </div>
        <div class="level-right">
            <div class="level-item">
                <BButton
                    v-has-permission="['update-roles']"
                    icon-left="edit"
                    type="is-light"
                    tag="router-link"
                    :to="{ name: 'manage-roles-id-edit' }">Edit</BButton>
            </div>
            <div class="level-item">
                <BButton
                    v-has-permission="['read-roles']"
                    icon-left="reply"
                    type="is-light"
                    tag="router-link"
                    :to="{ name: 'manage-roles' }">Back</BButton>
            </div>
        </div>
    </nav>

    <hr>

    <div class="columns">
        <div class="column">

            <div class="box">
                <div class="media">
                    <div class="media-content">
                        <div class="content">

                            <h2 class="title">Permissions</h2>

                            <ul>
                                <li v-for="(r, index) in state.permissions" :key="index">{{r.display_name}}<em class="ml-2">{{r.description}}</em> </li>
                            </ul>

                        </div>
                    </div>
                </div>
            </div>

        </div>
    </div>

</template>