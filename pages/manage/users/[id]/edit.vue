<script setup lang="ts">
import _ from 'lodash'
import { useRoute } from 'vue-router'

import { ToastProgrammatic as Toast } from 'buefy'




useHead({
    title: 'Edit User',
})

definePageMeta({
    layout: 'manage',
    middleware: ['auth'],
})

const route = useRoute()
const { $vform, $axios, $buefy } = useNuxtApp()

const state = reactive({
    endpoint: {
        current: `/v1/user/${route.params.id}`,
        role: '/v1/auth/acl/roles',
        permission: '/v1/auth/acl/permissions',
        acl_by_user: `/v1/auth/acl/user/${route.params.id}`,
    },
    allRoles: [],
    allPermissions: [],
    permissions: [],
    languages: [
        {
            code: 'id',
            name: 'Indonesian',
        },
        {
            code: 'en',
            name: 'English',
        },
    ],
})

const form = $vform({
    name: null,
    email: null,
    roles: [],
    permissions: [],
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

    $buefy.snackbar.open('asasasa')

    await form.put(state.endpoint.current)

    await $axios.put(state.endpoint.acl_by_user, {
        roles: form.roles,
        permissions: form.permissions,
    })

    navigateTo({
        name: 'manage-users',
    })
}

const fetchAcl = async () => {
    try {
        const [user, permission, role, aclByUser] = await Promise.all([
            $axios.get(state.endpoint.current),
            $axios.get(state.endpoint.permission),
            $axios.get(state.endpoint.role),
            $axios.get(state.endpoint.acl_by_user),
        ])

        // set form user
        form.name = user.data.data.name
        form.email = user.data.data.email

        state.allPermissions = permission.data.data
        state.allRoles = role.data.data

        const { permissions, roles } = aclByUser.data.data

        form.roles = roles?.map(item => item.id) || []
        state.permissions = mapPermissions(state.allPermissions, permissions)
    } catch (error) {
        console.error("Failed to fetch acl:", error)
    }
}

onMounted(() => {
    fetchAcl()
})

watch(() => state.permissions, (newPermissions) => {
    // Mendapatkan semua `id` dari `items` yang memiliki `is_same: true` setiap role setelah terjadi perubahan
    form.permissions = newPermissions.flatMap(role =>
        role.items
            .filter(item => item.is_same) // Filter berdasarkan is_same === true
            .map(item => item.id) // Ambil `name` (atau `id` jika ada)
    )

}, { deep: true })
</script>

<template>
    <nav class="level">
        <div class="level-left">
            <div class="level-item">
                <h1 class="title is-5">Edit User</h1>
            </div>
        </div>
        <div class="level-right">
            <BButton
                icon-left="reply"
                type="is-light"
                tag="router-link"
                :to="{ name: 'manage-users' }">Back</BButton>
        </div>
    </nav>

    <hr>

    <form
        @submit.prevent="submitForm"
        @keydown="form.onKeydown($event)">
        <div class="columns">
            <div class="column">
                <BField
                    label="Full Name"
                    :type="{ 'is-danger': form.errors.has('name') }"
                    :message="{ [ form.errors.get('name') ] : form.errors.has('name') }">
                    <BInput
                        v-model="form.name"
                        icon="user"
                        placeholder="your name"/>
                </BField>

                <BField
                    label="Email Address"
                    :type="{ 'is-danger': form.errors.has('email') }"
                    :message="{ [ form.errors.get('email') ] : form.errors.has('email') }">
                    <BInput
                        v-model="form.email"
                        type="email"
                        icon="at"
                        placeholder="name@example.com"/>
                </BField>

                <BField
                    label="Language"
                    :type="{ 'is-danger': form.errors.has('lang_code') }"
                    :message="{ [ form.errors.get('lang_code') ] : form.errors.has('lang_code') }">
                    <BSelect
                        placeholder="Select a language"
                        expanded
                        v-model="form.lang_code">
                        <option
                            v-for="(item, index) in state.languages"
                            :value="item.code"
                            :key="index">
                            {{ item.name }}
                        </option>
                    </BSelect>
                </BField>
            </div>
            <div class="column">
                <h2 class="subtitle is-5">Roles</h2>

                <div class="block">
                    <BCheckbox
                        v-for="(item, index) in state.allRoles"
                        :key="index"
                        v-model="form.roles"
                        :native-value="item.id">
                        {{ item.display_name }}
                    </BCheckbox>
                </div>

                <BButton
                    :loading="form.busy"
                    native-type="submit"
                    type="is-primary"
                    expanded>
                    Save Changes
                </BButton>
            </div>
        </div>

        <h2 class="subtitle is-5 mt-6">User Permissions</h2>
    
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
    </form>
    
</template>