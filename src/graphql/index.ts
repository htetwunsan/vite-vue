import { GraphQLClient } from "graphql-request"

const gqlClient = new GraphQLClient(import.meta.env.VITE_GRAPHQL_URL, {
    headers: {
        "Authorization": "Bearer " + sessionStorage.getItem("access_token") ?? ""
    }
})

export default gqlClient