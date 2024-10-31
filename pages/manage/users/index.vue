<script setup lang="ts">
useHead({
    title: 'Users',
})

definePageMeta({
    layout: 'manage',
    middleware: ['auth'],
})

const { $axios, $buefy } = useNuxtApp()

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
        .get('/v1/users', {
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

const deleteByID = (record) => {
    $buefy.dialog.confirm({
        title: 'Deleting account',
        message: `Are you sure you want to delete your <b>${record.name}</b> account? This action cannot be undone.`,
        confirmText: 'Delete Account',
        type: 'is-danger',
        hasIcon: true,
        onConfirm: () => {
            record.isDelete = true
            $axios.delete(`/v1/user/${record.id}`)
                .then(({ data }) => {
                    $buefy.toast.open('Account deleted successfully.')

                    fetchData()
                })
                .finally(() => {
                    record.isDelete = false
                })
        }
    })
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
                icon-left="plus"
                type="is-light"
                tag="router-link"
                :to="{ name: 'manage-users-create' }">Create</BButton>
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
            field="name"
            label="Full Name"
            sortable
            v-slot="props">
            {{ props.row.name }}
        </BTableColumn>

        <BTableColumn
            field="email"
            label="Email Address"
            sortable
            v-slot="props">
            {{ props.row.email }}
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

        <BTableColumn
            label="Action"
            v-slot="props">
            <div class="buttons">
                <BButton
                    tag="router-link"
                    :to="{
                        name: 'manage-users-id-edit',
                        params: {
                            id: props.row.id,
                        },
                    }"
                    size="is-small"
                    icon-left="edit"/>
                <BButton
                    size="is-small"
                    icon-left="trash"
                    :loading="props.row.isDelete"
                    @click="deleteByID(props.row)"/>
            </div>
        </BTableColumn>

        <template #bottom-left>
            <b>Total</b>: {{ state.meta.total }}
        </template>

        <template #empty v-if="!state.loading">
            <EmptyNothing />
        </template>
    </BTable>
</template>