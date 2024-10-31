import { useAuth } from '~/composables/useAuth'

export default defineNuxtRouteMiddleware(async (to, from) => {
    const { authStore, isAuth } = useAuth()

    // Cek apakah token ada di cookie, tapi belum di-store
    if (!authStore.token) {
        const tokenCookie = useCookie<string>('token')
        if (tokenCookie.value) {
            authStore.setToken(tokenCookie.value)
            await authStore.fetchProfile()
        }
    }

    // Redirect jika belum login
    if (!isAuth.value) {
        authStore.clearCookie()

        return navigateTo({
            name: 'auth-login',
        })
    }
})
