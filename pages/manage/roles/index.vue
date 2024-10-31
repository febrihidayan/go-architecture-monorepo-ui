<script setup lang="ts">
useHead({
    title: 'Roles',
})

definePageMeta({
    layout: 'manage',
    middleware: ['auth'],
})

const { $axios } = useNuxtApp()

const state = reactive({
    loading: false,
    data: [],
    meta: {
        total: 0,
        page: 1,
        per_page: 10,
    },
    params: {
        page: 1,
        per_page: 10,
    },
})

const fetchData = async () => {
    state.loading = true
    await $axios
        .get('/v1/auth/roles', {
            params: state.params,
        })
        .then(({ data }) => {
            state.data = data.data || []
            state.meta = data.meta || state.data
        })
        .finally(() => {
            state.loading = false
        })
}

const onPageChange = (page) => {
    state.params.page = page
    
    fetchData()
}

onMounted(() => {
    fetchData()
})
</script>

<template>
    <nav class="level">
        <div class="level-left">
            <div class="level-item">
                <h1 class="title is-5">All Roles</h1>
            </div>
        </div>
        <div class="level-right">
            <BButton
                v-has-permission="['create-roles']"
                icon-left="plus"
                type="is-light"
                tag="router-link"
                :to="{ name: 'manage-roles-create' }">Create</BButton>
        </div>
    </nav>

    <hr>

    <div class="columns is-multiline">
        <div
            class="column is-one-quarter"
            v-for="(role, index) in state.data"
            :key="index">
            <div class="box">

                <div class="media">
                    <div class="media-content">

                        <div class="content">
                            <h3 class="title">{{ role.display_name }}</h3>
                            <h4 class="subtitle"><em>{{ role.name }}</em></h4>
                            <p>{{ role.description }}</p>
                        </div>

                        <div class="columns is-mobile">
                            <div class="column is-one-half">
                                <BButton
                                    type="is-primary"
                                    expanded
                                    tag="router-link"
                                    :to="{ name: 'manage-roles-id', params: { id: role.id } }">
                                    Details
                                </BButton>
                            </div>
                            <div class="column is-one-half">
                                <BButton
                                    type="is-light"
                                    expanded
                                    tag="router-link"
                                    :to="{ name: 'manage-roles-id-edit', params: { id: role.id } }">
                                    Edit
                                </BButton>
                            </div>
                        </div>

                    </div>
                </div>

            </div>
        </div>
    </div>
</template>