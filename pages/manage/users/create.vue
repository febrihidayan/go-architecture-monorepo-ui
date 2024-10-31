<script setup lang="ts">
useHead({
    title: 'Create User',
})

definePageMeta({
    layout: 'manage',
    middleware: ['auth'],
})

const { $vform } = useNuxtApp()

const form = $vform({
    name: null,
    email: null,
    password: null,
})

const submitForm = async () => {
    const { data } = await form.post('/v1/user')

    navigateTo({
        name: 'manage-users',
    })
}
</script>

<template>
    <nav class="level">
        <div class="level-left">
            <div class="level-item">
                <h1 class="title is-5">Create User</h1>
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

        <BButton
            :loading="form.busy"
            native-type="submit"
            type="is-primary"
            expanded>
            Create new User
        </BButton>

    </form>
</template>