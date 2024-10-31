<script setup lang="ts">
useHead({
    title: 'Change Password',
})

definePageMeta({
    layout: 'auth'
})

</script>

<template>
    <div class="card">
        <div class="card-content">
            <h1 class="title">Change Password</h1>

            <form>
                <BField
                    label="Password">
                    <BInput
                        type="password"
                        icon="lock"
                        password-reveal
                        placeholder="********"/>
                </BField>

                <BField
                    label="Confirm Password">
                    <BInput
                        type="password"
                        icon="lock"
                        password-reveal
                        placeholder="********"/>
                </BField>

                <BField>
                    <BButton
                        native-type="submit"
                        type="is-primary"
                        expanded>
                        Reset Your Password
                    </BButton>
                </BField>
            </form>
        </div>
    </div>
</template>