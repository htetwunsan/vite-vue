import { gql } from "graphql-request"
import gqlClient from "."
import type { Employee } from "./query"

export function mutationEmployeeCreate(firstName: string, lastName: string, jobTitle: string) {
    return gqlClient.request<{ createEmployee: Pick<Employee, "id"> }>(gql`
        mutation EmployeeCreate($first_name: String!, $last_name: String!, $job_title: String!) {
            createEmployee(first_name: $first_name, last_name: $last_name, job_title: $job_title) {
                id
            }
        }
    `, {
        first_name: firstName, last_name: lastName, job_title: jobTitle
    })
}

export function mutationEmployeeUpdate(id: number, firstName: string, lastName: string, jobTitle: string) {
    return gqlClient.request<{ updateEmployee: Pick<Employee, "id" | "first_name" | "last_name" | "job_title"> }>(gql`
        mutation EmployeeUpdate($id: ID!, $first_name: String!, $last_name: String!, $job_title: String!) {
            updateEmployee(id: $id, first_name: $first_name, last_name: $last_name, job_title: $job_title) {
                id,
                first_name,
                last_name,
                job_title
            }
        }
    `, {
        id: id, first_name: firstName, last_name: lastName, job_title: jobTitle
    })
}

export function mutationEmployeeDelete(id: number) {
    return gqlClient.request<{ deleteEmployee: Pick<Employee, "id"> }>(gql`
        mutation DeleteEmployee($id: ID!) {
            deleteEmployee(id: $id) {
                id
            }
        }
    `, { id: id })
}