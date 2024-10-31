<script setup lang="ts">
useHead({
    title: 'Permissions',
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
        search: '',
        page: 1,
        per_page: 10,
    },
})

const fetchData = async () => {
    state.loading = true
    await $axios
        .get('/v1/auth/permissions', {
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
                <h1 class="title is-5">All Users</h1>
            </div>
        </div>
        <div class="level-right">
            <BButton
                v-has-permission="['create-permissions']"
                icon-left="plus"
                type="is-light"
                tag="router-link"
                :to="{ name: 'manage-permissions-create' }">
                Create
            </BButton>
        </div>
    </nav>

    <hr>

        <BField grouped group-multiline>
            <BField>
                <BInput
                    v-model="state.params.search"
                    type="search"
                    icon-pack="fas"
                    icon="search"
                    placeholder="Search..."/>
            </BField>

            <BSelect
                v-model="state.params.per_page"
                placeholder="Select Perpage">
                <option value="10">10 per page</option>
                <option value="20">20 per page</option>
                <option value="50">50 per page</option>
                <option value="100">100 per page</option>
                <option value="200">200 per page</option>
            </BSelect>

            <BField>
                <BButton
                    @click="fetchData"
                    icon-left="search"></BButton>
            </BField>
        </BField>

    <BTable
        :loading="state.loading"
        :data="state.data"
        hoverable

        paginated
        backend-pagination
        pagination-position="both"
        :total="state.meta.total"
        :per-page="state.meta.per_page"
        @page-change="onPageChange">

        <BTableColumn
            field="display_name"
            label="Display Name"
            sortable
            v-slot="props">
            {{ props.row.display_name }}
        </BTableColumn>

        <BTableColumn
            field="name"
            label="Name"
            sortable
            v-slot="props">
            {{ props.row.name }}
        </BTableColumn>

        <BTableColumn
            field="description"
            label="Description"
            sortable
            v-slot="props">
            {{ props.row.description }}
        </BTableColumn>

        <BTableColumn
            field="created_at"
            label="Created At"
            sortable
            v-slot="props">
            <BTag>{{ new Date(props.row.created_at).toLocaleDateString() }}</BTag>
        </BTableColumn>

        <BTableColumn
            field="updated_at"
            label="Updated At"
            sortable
            v-slot="props">
            <BTag>{{ new Date(props.row.updated_at).toLocaleDateString() }}</BTag>
        </BTableColumn>

        <template #bottom-left>
            <b>Total</b>: {{ state.meta.total }}
        </template>

        <template #empty v-if="!state.loading">
            <EmptyNothing />
        </template>
    </BTable>
</template>