<script setup lang="ts">
useHead({
    title: 'Register',
})

definePageMeta({
    layout: 'auth',
    middleware: ['guest'],
})

const { $vform } = useNuxtApp()

const form = $vform({
    email: null,
    password: null,
})

const submitForm = async () => {
    await form.post('/v1/auth/register')

    navigateTo({
        name: 'auth-login',
    })
}
</script>

<template>
    <div class="card">
        <div class="card-content">
            <h1 class="title">Register</h1>

            <form
                @submit.prevent="submitForm"
                @keydown="form.onKeydown($event)">
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

                <BField
                    label="Confirm Password"
                    :type="{ 'is-danger': form.errors.has('confirm_password') }"
                    :message="{ [ form.errors.get('confirm_password') ] : form.errors.has('confirm_password') }">
                    <BInput
                        v-model="form.confirm_password"
                        type="password"
                        icon="lock"
                        password-reveal
                        placeholder="********"/>
                </BField>

                <BField>
                    <BButton
                        :loading="form.busy"
                        native-type="submit"
                        type="is-primary"
                        expanded>
                        Register
                    </BButton>
                </BField>
            </form>
        </div>
    </div>
</template>