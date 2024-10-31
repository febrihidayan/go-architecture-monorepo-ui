import Buefy from 'buefy'
import 'buefy/dist/buefy.css'
import { SnackbarProgrammatic, ToastProgrammatic, DialogProgrammatic } from 'buefy'

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.use(Buefy, {
        defaultIconPack: 'fas',
        defaultSnackbarPosition: 'is-top-right',
        // defaultToastPosition: 'is-top-right',
    })


    // Gabungkan semua API programatik ke dalam satu objek $buefy
    const $buefy = {
        snackbar: {
            open: (...args) => new SnackbarProgrammatic().open(...args),
        },
        toast: {
            open: (...args) => new ToastProgrammatic().open(...args),
        },
        dialog: {
            confirm: (...args) => new DialogProgrammatic().confirm(...args),
        },
    }

    // Menyediakan objek $buefy secara global
    nuxtApp.provide('buefy', $buefy)
})
