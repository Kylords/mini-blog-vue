import { gql } from '@apollo/client/core'

export const EDIT_POST = gql`
  mutation EditPost($postId: ID!, $title: String!, $body: String!) {
    editPost(input: {postId: $postId, title: $title, body: $body}) {
      post {
        id
        title
        body
      }
    }
  }
`