<script setup lang="ts">
import gql from 'graphql-tag'
import { useQuery } from '@vue/apollo-composable';
import { USER_LIST } from '@/graphql/queries/user-list'

// const GET_USERS = gql`
//   query {
//     users {
//       id
//       name
//       email
//     }
//   }
// `

const { result, loading, error } = useQuery(USER_LIST)
</script>

<template>
  <div>
    <h1>Home</h1>

    <p v-if="loading">Loading...</p>
    <p v-if="error">Error: {{ error.message }}</p>

    <ul v-if="result">
      <li v-for="user in result.users" :key="user.id">
        {{ user.name }} ({{ user.email }})
      </li>
    </ul>
  </div>
</template>