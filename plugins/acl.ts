import { useAuthStore } from '~/stores/auth'

export default defineNuxtPlugin((nuxtApp) => {
    // Helper function to update element visibility
    const updateVisibility = (el, authValues, requiredValues) => {
        if (Array.isArray(requiredValues)) {
            // Check if all required values exist in the authValues
            const hasAllValues = requiredValues.every((value) => authValues.includes(value))
            el.style.display = hasAllValues ? '' : 'none'
        } else {
            // If not an array, check for a single value
            el.style.display = authValues.includes(requiredValues) ? '' : 'none'
        }
    }

    // Directive for permissions
    nuxtApp.vueApp.directive('hasPermission', {
        mounted(el, binding) {
            // Pastikan ini hanya dijalankan di sisi klien
            if (process.client) {
                const authStore = useAuthStore()

                const checkPermissions = () => {
                    const requiredPermissions = binding.value
                    updateVisibility(el, authStore.permissions, requiredPermissions)
                }

                // Initial check when mounted
                checkPermissions()

                // Watch for permission changes in the store
                watch(
                    () => authStore.permissions,
                    checkPermissions
                )
            }
        },
    })

    // Directive for roles
    nuxtApp.vueApp.directive('hasRole', {
        mounted(el, binding) {
            // Pastikan ini hanya dijalankan di sisi klien
            if (process.client) {
                const authStore = useAuthStore()

                const checkRoles = () => {
                    const requiredRoles = binding.value
                    updateVisibility(el, authStore.roles, requiredRoles)
                }

                // Initial check when mounted
                checkRoles()

                // Watch for role changes in the store
                watch(
                    () => authStore.roles,
                    checkRoles
                )
            }
        },
    })

    // Directive for roles and permissions (ability)
    nuxtApp.vueApp.directive('hasAbility', {
        mounted(el, binding) {
            // Pastikan ini hanya dijalankan di sisi klien
            if (process.client) {
                const authStore = useAuthStore()

                const checkAbility = () => {
                    const [requiredRole, requiredPermission] = binding.value

                    const hasRole = authStore.roles.includes(requiredRole)
                    const hasPermission = authStore.permissions.includes(requiredPermission)

                    // Tampilkan elemen hanya jika memiliki role dan permission
                    el.style.display = hasRole && hasPermission ? '' : 'none'
                }

                // Initial check when mounted
                checkAbility()

                // Watch for role and permission changes in the store
                watch(
                    () => [authStore.roles, authStore.permissions],
                    checkAbility
                )
            }
        },
    })
})
