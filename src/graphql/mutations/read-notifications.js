import { gql } from '@apollo/client/core'

export const READ_NOTIFICATIONS = gql`
  mutation ReadNotifications($notificationIds: [ID!]) {
    readNotifications(input: { notificationIds: $notificationIds }) {
      user {
        id
        name
        email
        unreadNotificationsCount
      }
    }
  }
`