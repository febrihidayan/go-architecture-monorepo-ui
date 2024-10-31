import { defineStore } from 'pinia'
import { useCookie } from '#app' // Nuxt useCookie

// Define interface for user profile
interface UserProfile {
    id: string
    name: string
    email: string
    avatar: string
    lang_code: string
}

interface AuthState {
    token: string | null
    userProfile: UserProfile | null
    roles: string[]
    permissions: string[]
}

export const useAuthStore = defineStore('auth', {
    state: (): AuthState => ({
        token: null,
        userProfile: null,
        roles: [],
        permissions: [],
    }),

    actions: {
        setToken(token: string) {
            this.token = token

            // Set token in cookie
            const tokenCookie = useCookie<string>('token')
            tokenCookie.value = token
        },
        
        setRoles(roles: string[]) {
            this.roles = roles
        },
        
        setPermissions(permissions: string[]) {
            this.permissions = permissions
        },
        
        setProfile(data: any) {
            // Mapping data dari response API ke UserProfile interface
            const profile: UserProfile = {
                id: data.id,
                name: data.name,
                email: data.email,
                avatar: data.avatar,
                lang_code: data.lang_code,
            }

            this.userProfile = profile
        },

        async fetchProfile() {
            if (this.token) {
                try {
                    const { $axios } = useNuxtApp()
                    const { data } = await $axios.get('/v1/user/profile')

                    this.setProfile(data.data)
                } catch (error) {
                    console.error('Error fetching profile:', error)
                }
            }
        },

        clearCookie() {
            this.token = null
            this.userProfile = null
            this.roles = []
            this.permissions = []

            // Remove token from cookie
            const tokenCookie = useCookie<string>('token')
            tokenCookie.value = null
        },

        logout() {
            this.clearCookie()

            navigateTo({
                name: 'index',
            })
        },
    },

    getters: {
        isAuth: (state: AuthState) => !!state.token,
    },
})
