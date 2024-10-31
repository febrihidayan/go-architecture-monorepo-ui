<script setup lang="ts">
useHead({
    title: 'Forgot Password',
})

definePageMeta({
    layout: 'auth'
})

const { $vform, $buefy } = useNuxtApp()

const form = $vform({
    email: null,
})

const submitForm = async () => {
    await form.post('/v1/auth/password/email')
        .then(() => {
            $buefy.toast.open('Password reset email sent. Please check your inbox and spam folder.')
        })
}
</script>

<template>
    <div class="card">
        <div class="card-content">
            <h1 class="title">Forgot Password</h1>

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

                <BField>
                    <BButton
                        native-type="submit"
                        type="is-primary"
                        expanded>
                        Send Link Request
                    </BButton>
                </BField>
            </form>
        </div>
    </div>
</template>