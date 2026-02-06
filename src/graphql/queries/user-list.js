import { gql } from '@apollo/client/core'

export const USER_LIST = gql`
  query UserList {
    users {
      id
      name
      email
    }
  }
`