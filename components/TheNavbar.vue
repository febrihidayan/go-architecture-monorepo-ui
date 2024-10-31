<script setup lang="ts">
import { useAuth } from '~/composables/useAuth'
const { isAuth, logout, userProfile } = useAuth()
</script>

<template>
    <nav class="navbar is-top">
        <div class="container">
            <div class="navbar-brand">
                <NuxtLink
                    :to="{ name: 'index' }"
                    class="navbar-item">
                    Arch UI
                </NuxtLink>
    
                <a role="button" class="navbar-burger" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                </a>
            </div>
            <div class="navbar-menu">
                <div class="navbar-end">
                    <template v-if="!isAuth">
                        <NuxtLink
                            :to="{ name: 'auth-login' }"
                            class="navbar-item">
                            Login
                        </NuxtLink>
                        <NuxtLink
                            :to="{ name: 'auth-register' }"
                            class="navbar-item">
                            Register
                        </NuxtLink>
                    </template>
                    <div v-else class="navbar-item has-dropdown is-hoverable">
                        <a h class="navbar-link">{{ userProfile?.name }}</a>
                        <div class="navbar-dropdown is-boxed">
                            <NuxtLink
                                v-has-permission="['read-profile']"
                                :to="{ name: 'profile' }"
                                class="navbar-item">
                                Profile
                            </NuxtLink>
                            <NuxtLink
                                v-has-role="['superadministrator']"
                                :to="{ name: 'manage-dashboard' }"
                                class="navbar-item">
                                Manage
                            </NuxtLink>
                            <hr class="navbar-divider">
                            <a
                                @click="logout"
                                class="navbar-item">Log Out</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </nav>
</template>