<script setup lang="ts">
useHead({
    title: 'Create Role',
})

definePageMeta({
    layout: 'manage',
    // middleware: ['auth'],
})

const { $vform } = useNuxtApp()

const form = $vform({
    display_name: null,
    name: null,
    description: null,
})

const submitForm = async () => {
    const { data } = await form.post('/v1/auth/role')

    navigateTo({
        name: 'manage-roles',
    })
}
</script>

<template>
    <nav class="level">
        <div class="level-left">
            <div class="level-item">
                <h1 class="title is-5">Create Role</h1>
            </div>
        </div>
        <div class="level-right">
            <BButton
                v-has-permission="['read-roles']"
                icon-left="reply"
                type="is-light"
                tag="router-link"
                :to="{ name: 'manage-roles' }">Back</BButton>
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
                placeholder="slug-name"/>
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
            Create new Role
        </BButton>

    </form>
</template>