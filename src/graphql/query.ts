import { gql } from "graphql-request"
import gqlClient from "."

export type User = {
    id: number,
    name: string,
    email: string,
    email_verified_at: string
    created_at: string
    updated_at: string
}

export function queryMe() {
    return gqlClient.request<{ me: User }>(gql`
        query Me {
            me {
                id,
                name,
                email,
                email_verified_at,
                created_at,
                updated_at
            }
        }
    `)
}

export type PaginatorInfo = {
    count: number
    currentPage: number
    firstItem: number
    hasMorePages: boolean
    lastItem: number
    lastPage: number
    perPage: number
    total: number
}

export type Employee = {
    id: number
    first_name: string
    last_name: string
    job_title: string
    created_at: string
    updated_at: string
}

export function queryEmployees(page = 1, jobTitle = "") {
    return gqlClient.request<{ employees: { data: Employee[], paginatorInfo: PaginatorInfo } }>(gql`
        query Employees($page: Int!, $first: Int!, $job_title: String) {
            employees(page: $page, first: $first, job_title: $job_title) {
                data {
                    id,
                    first_name,
                    last_name,
                    job_title,
                    created_at,
                    updated_at
                },
                paginatorInfo {
                    count,
                    currentPage,
                    firstItem,
                    hasMorePages,
                    lastItem,
                    lastPage,
                    perPage,
                    total
                }
            }
        },
    `,
        {
            page: page, first: 5, job_title: "%" + jobTitle + "%"
        }
    )
}

export function queryEmployee(id: number) {
    return gqlClient.request<{ employee: Employee | null }>(gql`
        query Employee($id: ID!) {
            employee(id: $id) {
                id,
                first_name,
                last_name,
                job_title,
                created_at,
                updated_at
            }
        }
    `, {
        id: id
    })
}