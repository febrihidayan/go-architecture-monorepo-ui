<template>
    <TheNavbar/>

    <aside
        class="is-placed-left is-trans-left">
        <BMenu
            class="mx-4 my-4">
            <BMenuList
                label="General">
                <BMenuItem
                    label="Dashboard"
                    tag="router-link"
                    :to="{ name: 'manage-dashboard' }"/>
            </BMenuList>
            <BMenuList
                label="Administrator">
                <BMenuItem
                    v-has-permission="['read-permissions']"
                    label="Permissions"
                    tag="router-link"
                    :to="{ name: 'manage-permissions' }"/>
                <BMenuItem
                    v-has-permission="['read-roles']"
                    label="Roles"
                    tag="router-link"
                    :to="{ name: 'manage-roles' }"/>
                <BMenuItem
                    v-has-permission="['read-users']"
                    label="Users"
                    tag="router-link"
                    :to="{ name: 'manage-users' }"/>
            </BMenuList>
        </BMenu>
    </aside>

    <section class="management-area is-trans-left">
        <div class="section">
            <NuxtPage />
        </div>
    </section>
</template>

<style lang="scss">
.is-trans-left {
    transition: left 0.3s ease-in-out;
}

.management-area {
    position: absolute;
    top: 4rem;
    right: 0;
    left: 18rem;

    @media screen and (max-width: 1023px) {
        position: relative;
        left: 0;
    }

    .section {
        padding: .5rem 1.5rem;
    }

}
.is-placed-left {
    position: fixed;
    top: 3.4rem;
    left: 0;
    bottom: 0;
    width: 18rem;
    background-color: white;
    overflow-y: scroll;
    z-index: 10;

    @media screen and (max-width: 1023px) {
        left: -18rem;
        box-shadow: 2px 0 1px 0px whitesmoke;
    }

    &.is-active {
        left: -18rem;
        @media screen and (max-width: 1023px) {
            left: 0;
        }

        +.management-area {
            left: 0;
        }

    }
}
</style>