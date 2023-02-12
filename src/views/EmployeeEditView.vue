<script setup lang="ts">
import { mutationEmployeeUpdate } from "@/graphql/mutation"
import {queryEmployee} from "@/graphql/query"
import { useHandleError, showUpdated } from "@/store"
import { ref, onMounted } from "vue"
import { useRoute, useRouter } from "vue-router"

    const handleError = useHandleError()
    const router = useRouter()
    const {params} = useRoute()

    let id = 0

    if (typeof params.id === "string") {
        id = parseInt(params.id)
    }

    const loading = ref(false)

    const firstName = ref("")
    const lastName = ref("")
    const jobTitle = ref("")

    const errors = ref({
        firstName: "",
        lastName: "",
        jobTitle: ""
    })

    onMounted(() => {
        queryEmployee(id)
            .then(data => {
                if (data.employee === null) {
                    router.replace("/employees")
                    return
                }

                firstName.value = data.employee.first_name
                lastName.value = data.employee.last_name
                jobTitle.value = data.employee.job_title
            })
            .catch(handleError)
    })

    function update() {
        loading.value = true
        mutationEmployeeUpdate(id, firstName.value, lastName.value, jobTitle.value)
            .then(data => {
                showUpdated()
                router.replace("/employees")
            })
            .catch(err => {
                loading.value = false
                const category = handleError(err)
                if (category === "validation") {
                    const {validation} = err.response.errors[0].extensions
                    errors.value = {
                        firstName: validation.first_name?.join(", ") ?? "",
                        lastName: validation.last_name?.join(", ") ?? "",
                        jobTitle: validation.job_title?.join(", ") ?? ""
                    }
                    return
                }
            })
    }
</script>
<template>
    <div class="flex items-center justify-between gap-2">
        <h1 class="text-lg font-bold py-4">Edit Employee</h1>
    </div>


    <form @submit.prevent="update">
        <div class="mb-6">
            <label for="first-name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">First Name</label>
            <input id="first-name" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required
                v-model="firstName">
            <p class="mt-2 text-sm text-red-600 dark:text-red-500" v-if="errors.firstName"><span class="font-medium">{{ errors.firstName }}</span></p>

        </div>
        <div class="mb-6">
            <label for="last-name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Last Name</label>
            <input id="last-name" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required
                v-model="lastName">
            <p class="mt-2 text-sm text-red-600 dark:text-red-500" v-if="errors.lastName"><span class="font-medium">{{ errors.lastName }}</span></p>
        </div>
        <div class="mb-6">
            <label for="job-title" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Job Title</label>
            <input id="job-title" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required
                v-model="jobTitle">
            <p class="mt-2 text-sm text-red-600 dark:text-red-500" v-if="errors.jobTitle"><span class="font-medium">{{ errors.jobTitle }}</span></p>
        </div>
        <button type="submit" class="relative inline-flex items-center justify-center p-0.5 mb-2 mr-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800"
            :disabled="loading">
            <span class="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                Update
            </span>
        </button>
    </form>

</template>