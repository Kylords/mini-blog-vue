import { gql } from '@apollo/client/core'

export const CREATE_POST = gql`
  mutation CreatePost($title: String!, $body: String!) {
    createPost(input: {title: $title, body: $body}) {
      post {
        id
        title
        body
      }
    }
  }
`