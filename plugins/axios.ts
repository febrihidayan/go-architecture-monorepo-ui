import { defineNuxtPlugin } from '#app'
import { useAuthStore } from '~/stores/auth'
import axios from 'axios'
import Form from 'vform'

export default defineNuxtPlugin((nuxtApp) => {
    // Create an axios instance with the default configuration
    const config = useRuntimeConfig()
    const authStore = useAuthStore()

    const axiosInstance = axios.create({
        baseURL: config.public.API_BASE_URL, // Replace with your API URL
        headers: {
            'Content-Type': 'application/json',
        },
    })

    // Interceptor to add token to header
    axiosInstance.interceptors.request.use(config => {
        if (authStore.token) {
            config.headers.Authorization = `Bearer ${authStore.token}`
        }

        return config
    }, error => {
        return Promise.reject(error)
    })

    // Add interceptor for response error
    axiosInstance.interceptors.response.use(
        response => response,
        error => {
            // Check if there is an error response
            if (error.response) {
                const { status, data } = error.response
                // If status is 422, retrieve the 'errors' field from error_bad_request or current data
                if (status === 422) {
                    // Parsing json from error_bad_request
                    const body = data.error_bad_request ? JSON.parse(data.error_bad_request.http_body) : data

                    // Set errors in the form instance
                    if (nuxtApp.$vformInstance) {
                        nuxtApp.$vformInstance.errors.set(body.errors)
                    }

                    return Promise.reject(body.errors) // Reject with errors object
                }
                else if (status === 401) {
                    authStore.clearCookie()

                    return navigateTo({
                        name: 'auth-login',
                    })
                }
                else if (status === 400) {
                    if (data.code == 400) {
                        data.errors.forEach((msg) => {
                            nuxtApp.$buefy.toast.open(msg)
                        })
                    }
                }
            }
            return Promise.reject(error) // Restore other errors without modification
        }
    )

    // axios instance for vForm
    Form.axios = axiosInstance

     // Provide a vform instance globally
    nuxtApp.provide('vform', (fields = {}, errors = {}) => {
        // Note: using reactive from Vue to create a reactive vform instance
        const form = reactive(new Form(fields))
        
        // If errors are provided during initialization, set them
        form.errors.set(errors)

        // Store the instance globally
        nuxtApp.$vformInstance = form

        return form
    })

    // Provide axios instance
    nuxtApp.provide('axios', axiosInstance)
})
