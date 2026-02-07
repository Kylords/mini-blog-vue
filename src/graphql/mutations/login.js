import { gql } from '@apollo/client/core'

export const LOGIN_USER = gql`
  mutation LoginUser($email: String!, $password: String!) {
    login(input: {email: $email, password: $password}) {
      user {
        id
        name
        email
      }
      token
      errors
    }
  }
`