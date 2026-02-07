import { gql } from '@apollo/client/core'

export const REGISTER_USER = gql`
  mutation RegisterUser($name: String!, $email: String!, $password: String!, $passwordConfirmation: String!) {
    createUser(input: { name: $name, email: $email, password: $password, passwordConfirmation: $passwordConfirmation }) {
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