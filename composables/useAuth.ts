import { useAuthStore } from '~/stores/auth'

export const useAuth = () => {
    const authStore = useAuthStore()

    // Load token from cookie on initialization
    const tokenCookie = useCookie<string>('token')
    if (tokenCookie.value && !authStore.token) {
        authStore.setToken(tokenCookie.value)
        const config = useRuntimeConfig()

        // Gunakan useFetch untuk SSR dan CSR
        Promise.all([
            useFetch(config.public.API_BASE_URL + '/v1/user/profile', {
                onRequest({ options }) {
                    options.headers = {
                        ...options.headers,
                        Authorization: `Bearer ${authStore.token}`
                    }
                }
            }),
            useFetch(config.public.API_BASE_URL + '/v1/auth/acl/access', {
                onRequest({ options }) {
                    options.headers = {
                        ...options.headers,
                        Authorization: `Bearer ${authStore.token}`
                    }
                }
            })
        ]).then(([profileResponse, aclResponse]) => {
            // Set data profil dari response pertama
            authStore.setProfile(profileResponse.data.value.data)

            // Misalnya Anda ingin menyimpan ACL response dalam authStore juga
            const { roles, permissions } = aclResponse.data.value.data
            authStore.setRoles(roles)
            authStore.setPermissions(permissions)

            // Atau lakukan tindakan lain sesuai kebutuhan Anda
        }).catch((error) => {
            // Tangani error jika salah satu atau kedua request gagal
            console.error('Error fetching data:', error)
        })
    }

    return {
        authStore,
        isAuth: computed(() => authStore.isAuth),
        userProfile: computed(() => authStore.userProfile),
        logout: authStore.logout,
        fetchProfile: authStore.fetchProfile,
    }
}
