<script setup lang="ts">
useHead({
    title: 'Create Permission',
})

definePageMeta({
    layout: 'manage',
    middleware: ['auth'],
})

const { $vform } = useNuxtApp()

const state = reactive({
    endpoint: '/v1/auth/permission',
    activeTab: 0,
    resource: {
        name: '',
        lists: ['create', 'read', 'update', 'delete'],
        selected: [],
    },
})

const UserscrudName = (item) => {
    return item.substr(0, 1).toUpperCase() + item.substr(1) + " " + state.resource.name.substr(0,1).toUpperCase() + state.resource.name.substr(1);
}

const UserscrudSlug = (item) => {
    return item.toLowerCase() + "-" + state.resource.name.toLowerCase();
}

const UserscrudDescription = (item) => {
    return "Allow a User to " + item.toUpperCase() + " a " + state.resource.name.substr(0,1).toUpperCase() + state.resource.name.substr(1);
}

const form = $vform({
    display_name: null,
    name: null,
    description: null,
})

const submitForm = async () => {
    if (state.activeTab) {
        // Create an array of Form instances for each data
        const forms = state.resource.selected.map(item => $vform({
            display_name: UserscrudName(item),
            name: UserscrudSlug(item),
            description: UserscrudDescription(item),
        }))

        // Send requests in parallel using Promise.all
        const responses = await Promise.all(
            forms.map(form => form.post(state.endpoint))
        )
        
        state.resource.name = ''
        state.resource.selected = []
    } else {
        const { data } = await form.post(state.endpoint)

        form.reset()
    }
}
</script>

<template>
    <nav class="level">
        <div class="level-left">
            <div class="level-item">
                <h1 class="title is-5">Create Permission</h1>
            </div>
        </div>
        <div class="level-right">
            <BButton
                icon-left="reply"
                type="is-light"
                tag="router-link"
                :to="{ name: 'manage-permissions' }">Back</BButton>
        </div>
    </nav>

    <hr>

    <form
        @submit.prevent="submitForm"
        @keydown="form.onKeydown($event)">

        <BTabs v-model="state.activeTab">
            <BTabItem label="Basic Permissions">
                <BField
                    label="Name (Human Readable)"
                    :type="{ 'is-danger': form.errors.has('display_name') }"
                    :message="{ [ form.errors.get('display_name') ] : form.errors.has('display_name') }">
                    <BInput
                        v-model="form.display_name"
                        placeholder="name permission"/>
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
            </BTabItem>
            <BTabItem label="CRUD Permissions">
                <div class="columns">
                    <div class="column">
                        <BField
                            label="Resources">
                            <BInput
                                v-model="state.resource.name"
                                placeholder="name permission"/>
                        </BField>
                        <BField
                            v-for="item in state.resource.lists" :key="item">
                            <BCheckbox
                                v-model="state.resource.selected"
                                :native-value="item"
                                :disabled="!state.resource.name">
                                {{ item }}
                            </BCheckbox>
                        </BField>

                    </div>
                    <div class="column">
                        <BTable :data="state.resource.selected">
                            <BTableColumn
                                label="Name (Human Readable)"
                                v-slot="props">
                                {{ UserscrudName(props.row) }}
                            </BTableColumn>

                            <BTableColumn
                                label="Slug (Can not be changed)"
                                v-slot="props">
                                {{ UserscrudSlug(props.row) }}
                            </BTableColumn>

                            <BTableColumn
                                label="Description"
                                v-slot="props">
                                {{ UserscrudDescription(props.row) }}
                            </BTableColumn>

                            <template #empty>
                                <EmptyNothing/>
                            </template>
                        </BTable>
                    </div>
                </div>
            </BTabItem>
        </BTabs>

        <BButton
            :loading="form.busy"
            native-type="submit"
            type="is-primary"
            expanded>
            Create new Permission
        </BButton>

    </form>
</template>