import { useAuth } from '~/composables/useAuth'

export default defineNuxtRouteMiddleware((to, from) => {
    const { isAuth } = useAuth()

    // Redirect ke homepage jika user sudah login
    if (isAuth.value) {
        return navigateTo({
            name: 'index',
        })
    }
})
