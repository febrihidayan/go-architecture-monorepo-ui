<script setup lang="ts">
import { useAuth } from '~/composables/useAuth'

useHead({
    title: 'Login',
})

definePageMeta({
    layout: 'auth',
    middleware: ['guest'],
})

const { $vform } = useNuxtApp()
const { authStore } = useAuth()

const form = $vform({
    email: null,
    password: null,
})

const submitForm = async () => {
    const { data } = await form.post('/v1/auth/login')

    authStore.setToken(data.access_token)

    await authStore.fetchProfile()

    navigateTo({
        name: 'index',
    })
}
</script>

<template>
    <div class="card">
        <div class="card-content">
            <h1 class="title">Login</h1>

            <form
                @submit.prevent="submitForm"
                @keydown="form.onKeydown($event)">
                <BField
                    label="Email Address"
                    :type="{ 'is-danger': form.errors.has('email') }">
                    <BInput
                        v-model="form.email"
                        type="email"
                        icon="at"
                        placeholder="name@example.com"/>
                    <template #message>
                        <div v-html="form.errors.get('email')"></div>
                    </template>
                </BField>

                <BField
                    label="Password"
                    :type="{ 'is-danger': form.errors.has('password') }"
                    :message="{ [ form.errors.get('password') ] : form.errors.has('password') }">
                    <BInput
                        v-model="form.password"
                        type="password"
                        icon="lock"
                        password-reveal
                        placeholder="********"/>
                </BField>

                <BField>
                    <NuxtLink :to="{ name: 'auth-password-send' }">Forgot password?</NuxtLink>
                </BField>

                <BField>
                    <BCheckbox>Remember me!</BCheckbox>
                </BField>

                <BField>
                    <BButton
                        :loading="form.busy"
                        native-type="submit"
                        type="is-primary"
                        expanded>
                        Login
                    </BButton>
                </BField>
            </form>
        </div>
    </div>
</template>