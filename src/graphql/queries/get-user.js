import { gql } from '@apollo/client/core'

export const GET_USER = gql`
  query GetUser($userId: ID!) {
    user(userId: $userId) {
      id
      name
      email
      unreadNotificationsCount
    }
  }
`