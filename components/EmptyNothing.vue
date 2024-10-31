<script setup lang="ts">
const message = 'Nothing here.'
</script>

<template>
    <section class="section" style="padding: 3rem 1.5rem;">
        <div class="content has-text-grey has-text-centered">
            <p>
                <BIcon
                    icon="frown"
                    size="is-large">
                </BIcon>
            </p>
            <p>{{ message }}</p>

            <slot />
        </div>
    </section>
</template>
