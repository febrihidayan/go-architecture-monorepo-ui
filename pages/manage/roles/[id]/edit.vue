<script setup lang="ts">
import _ from 'lodash'
import { useRoute } from 'vue-router'

useHead({
    title: 'Edit Role',
})

definePageMeta({
    layout: 'manage',
    middleware: ['auth'],
})

const route = useRoute()
const { $vform, $axios } = useNuxtApp()

const state = reactive({
    endpoint: {
        current: `/v1/auth/role/${route.params.id}`,
    },
    role: {},
    permissions: [],
})

const form = $vform({
    display_name: null,
    name: null,
    description: null,
})

const mapPermissions = (permissions, permissionsByRole) => {
    // Validasi jika permissions atau permissionsByRole null/undefined
    if (!permissions || !Array.isArray(permissions)) return [] // Jika permissions null, kembalikan array kosong
    if (!permissionsByRole || !Array.isArray(permissionsByRole)) permissionsByRole = [] // Jika permissionsByRole null, kembalikan array kosong

    return _(permissions)
        .groupBy((permission) => permission.name.split('-').pop()) // Mengelompokkan berdasarkan bagian terakhir dari nama
        .map((items, key) => ({
            name: key,
            items: items.map((item) => ({
                ...item,
                is_same: permissionsByRole.some(
                    (rolePermission) => rolePermission.name === item.name
                ), // Jika permissionsByRole null, is_same otomatis false
            })),
        }))
        .value() // Menghasilkan array dari objek yang sudah dikelompokkan dan dimodifikasi
}

const submitForm = async () => {
    const { data } = await form.put(state.endpoint.current)

    navigateTo({
        name: 'manage-roles-id',
    })
}

const fetchDetailById = async () => {
    const { data } = await $axios.get(state.endpoint.current)

    state.role = data.data
    form.display_name = data.data.display_name
    form.name = data.data.name
    form.description = data.data.description
}

const fetchPermissions = async () => {
    try {
        const [allPermissionsRes, rolePermissionsRes] = await Promise.all([
            $axios.get(`/v1/auth/acl/permissions`),
            $axios.get(`/v1/auth/acl/permission/role/${route.params.id}`),
        ])

        // Panggil fungsi mapPermissions untuk memetakan hasil
        state.permissions = mapPermissions(
            allPermissionsRes.data.data,
            rolePermissionsRes.data.data,
        )
    } catch (error) {
        console.error("Failed to fetch permissions:", error)
    }
}

onMounted(() => {
    fetchDetailById()
    fetchPermissions()
})

watch(() => state.permissions, _.debounce( async (newPermissions) => {

    // Mendapatkan semua `id` dari `items` yang memiliki `is_same: true` setiap role setelah terjadi perubahan
    const allItemIdsWithSameTrue = newPermissions.flatMap(role =>
    role.items
        .filter(item => item.is_same) // Filter berdasarkan is_same === true
        .map(item => item.id) // Ambil `name` (atau `id` jika ada)
    );

    const { data } = await $axios.put(`/v1/auth/acl/permission/role/${route.params.id}`, {
        permissions: allItemIdsWithSameTrue,
    })

}, 1000), { deep: true })
</script>

<template>
    <nav class="level">
        <div class="level-left">
            <div class="level-item">
                <h1 class="title is-5">Edit Role</h1>
            </div>
        </div>
        <div class="level-right">
            <div class="level-item">
                <BButton
                    v-has-permission="['read-roles']"
                    icon-left="eye"
                    type="is-light"
                    tag="router-link"
                    :to="{ name: 'manage-roles-id' }">Details</BButton>
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

    <form
        @submit.prevent="submitForm"
        @keydown="form.onKeydown($event)">

        <BField
            label="Name (Human Readable)"
            :type="{ 'is-danger': form.errors.has('display_name') }"
            :message="{ [ form.errors.get('display_name') ] : form.errors.has('display_name') }">
            <BInput
                v-model="form.display_name"
                placeholder="name ole"/>
        </BField>

        <BField
            label="Slug (Can not be changed)"
            :type="{ 'is-danger': form.errors.has('name') }"
            :message="{ [ form.errors.get('name') ] : form.errors.has('name') }">
            <BInput
                v-model="form.name"
                placeholder="slug-name"
                disabled/>
        </BField>

        <BField
            label="Description"
            :type="{ 'is-danger': form.errors.has('description') }"
            :message="{ [ form.errors.get('description') ] : form.errors.has('description') }">
            <BInput
                v-model="form.description"
                placeholder="description"/>
        </BField>

        <BButton
            :loading="form.busy"
            native-type="submit"
            type="is-primary"
            expanded>
            Save Changes
        </BButton>
    </form>

    <h2 class="subtitle is-5 mt-6">Role Permissions</h2>

    <div class="columns is-multiline is-mobile mt-2">
        <div
            class="column is-full-mobile is-half-desktop"
            v-for="(permission, index) in state.permissions" 
            :key="index">
                
            <BCollapse class="card" animation="slide">
                <template #trigger="props">
                    <div class="card-header" role="button">
                        <p class="card-header-title">{{
                            permission.name
                        }}</p>
                    <a class="card-header-icon">
                        <BIcon :icon="props.open ? 'caret-up' : 'caret-down'"/>
                    </a>
                    </div>
                </template>
                <div class="card-content">
                    <div class="content">
                        <template
                            v-for="(item, i) in permission.items"
                            :key="i"
                        >
                            <BField>
                                <BTooltip
                                    :label="item.description">
                                    <BCheckbox
                                        v-model="item.is_same">
                                        <BIcon 
                                            :variant="item.is_same ? 'success' : 'dark'"
                                            :icon="item.is_same ? 'lock-open' : 'lock'">
                                        </BIcon>
                                        <span>{{ item.name }}</span>
                                    </BCheckbox>
                                </BTooltip>
                            </BField>
                        </template>
                    </div>
                </div>
            </BCollapse>
        </div>
    </div>
    
</template>