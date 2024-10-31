<script setup lang="ts">
useHead({
    title: 'Email Verification',
})

definePageMeta({
    layout: 'auth'
})
</script>

<template>
    <div class="card">
        <div class="card-content">
            <h1 class="title">Email Verification</h1>

            <form>
                <BField
                    label="Email Address">
                    <BInput
                        type="email"
                        icon="at"
                        placeholder="name@example.com"/>
                </BField>

                <BField>
                    <BButton
                        native-type="submit"
                        type="is-primary"
                        expanded>
                        Send Verification Link
                    </BButton>
                </BField>
            </form>
        </div>
    </div>
</template>