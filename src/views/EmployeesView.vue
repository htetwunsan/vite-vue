<script setup lang="ts">
import { mutationEmployeeDelete } from "@/graphql/mutation"
import { queryEmployees, type Employee, type PaginatorInfo } from "@/graphql/query"
import { showDeleted, useHandleError } from "@/store"
import { onMounted, ref } from "vue"
import { RouterLink } from "vue-router"

const handleError = useHandleError()
const loading = ref(true)
const q = ref("")
const employees = ref<Employee[]>([])
const paginator = ref<PaginatorInfo | null>(null)

function loadEmployees(page = 1) {
    loading.value = true
    return queryEmployees(page, q.value).then(data => {
        loading.value = false
        employees.value =  data.employees.data
        paginator.value = data.employees.paginatorInfo
    }).catch(handleError)
} 

onMounted(() => {
    loadEmployees()
})

function next() {
    loadEmployees(paginator.value!.currentPage + 1)
}

function prev() {
    loadEmployees(paginator.value!.currentPage - 1)
}

function search() {
    loadEmployees(1)
}

function destroy(id: number) {
    mutationEmployeeDelete(id)
        .then(data => {
            showDeleted()
            loadEmployees(paginator.value!.currentPage)
        })
        .catch(handleError)
}

</script>
<template>
    <div class="flex items-center justify-between gap-2">
        <h1 class="text-lg font-bold py-4">Employees</h1>

        <form class="flex-grow" @submit.prevent="search">
            <label for="search" class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
            <div class="relative">
                <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg aria-hidden="true" class="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                </div>
                <input type="search" id="search" class="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                    placeholder="Search"
                    v-model="q">
                <button type="submit" class="text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    :disabled="loading">Search</button>
            </div>
        </form>

        <RouterLink class="relative inline-flex items-center justify-center p-0.5 mb-2 mr-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800"
            to="/employees/create">
            <span class="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                Create
            </span>
        </RouterLink>
    </div>

    <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                    <th scope="col" class="px-6 py-3">
                        First Name
                    </th>
                    <th scope="col" class="px-6 py-3">
                        Last Name
                    </th>
                    <th scope="col" class="px-6 py-3">
                        Job Title
                    </th>
                    <th scope="col" class="px-6 py-3">
                        Created At
                    </th>
                    <th scope="col" class="px-6 py-3">
                        Updated At
                    </th>
                    <th scope="col" class="px-6 py-3">
                        Action
                    </th>
                </tr>
            </thead>
            <tbody v-if="!loading">
                <tr class="bg-white border-b dark:bg-gray-900 dark:border-gray-700" 
                    v-for="employee in employees" :key="employee.id">
                    <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                        {{ employee.first_name }}
                    </th>
                    <td class="px-6 py-4">
                        {{ employee.last_name }}
                    </td>
                    <td class="px-6 py-4">
                        {{ employee.job_title }}
                    </td>
                    <td class="px-6 py-4">
                        {{ employee.created_at }}
                    </td>
                    <td class="px-6 py-4">
                        {{ employee.updated_at }}
                    </td> 
                    <td class="px-6 py-4 flex items-center gap-1">
                        <RouterLink :to="'/employees/edit/' + employee.id" class="font-medium text-blue-600 dark:text-blue-500 hover:underline">Edit</RouterLink>

                        <button class="font-medium text-red-600 dark:text-red-500 hover:underline"
                            @click="destroy(employee.id)">Delete</button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>


    <div class="flex flex-col items-center" v-if="paginator">
          <!-- Help text -->
    <span class="text-sm text-gray-700 dark:text-gray-400">
        CurrentPage <span class="font-semibold text-black">{{ paginator.currentPage }}</span>,
        PerPage <span class="font-semibold text-black">{{ paginator.perPage }}</span>, 
        Total <span class="font-semibold text-black">{{ paginator.total }}</span> Entries
    </span>
        <div class="inline-flex mt-2 xs:mt-0">
            <!-- Buttons -->
            <button class="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-gray-800 rounded-l hover:bg-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white disabled:cursor-not-allowed"
                    :disabled="paginator.currentPage === 1 || loading"
                    @click="prev">
                <svg aria-hidden="true" class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z" clip-rule="evenodd"></path></svg>
                Prev
            </button>
            <button class="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-gray-800 border-0 border-l border-gray-700 rounded-r hover:bg-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white disabled:cursor-not-allowed"
                    :disabled="!paginator.hasMorePages || loading"
                    @click="next">
                Next
                <svg aria-hidden="true" class="w-5 h-5 ml-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
            </button>
        </div>
    </div>
</template>