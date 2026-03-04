<template>
  <div class="navbar">
    <div class="logo" @click="toHomePage">MiniBlog</div>

    <div v-if="!user" class="nav-buttons">
      <button
        :class="{ active: activeTab === 'signin' }"
        @click="$emit('update:activeTab', 'signin')"
      >
        Sign In
      </button>

      <button
        :class="{ active: activeTab === 'register' }"
        @click="$emit('update:activeTab', 'register')"
      >
        Register
      </button>
    </div>

    <div v-else ref="notificationRef">
      <button class="logout" @click="$emit('logout')">Logout</button>

        <div class="bell-wrapper" @click="toggleNotifications">
          <svg-icon
            type="mdi"
            :path="mdiBell"
            size="28"
            color="white"
          />

          <span v-if="notifCount > 0" class="badge">
            {{ notifCount }}
          </span>
        </div>

      <div v-if="showNotifications" class="notification-dropdown">
        <div v-if="notifications.length === 0" class="empty">
          No notifications
        </div>

        <div
          v-for="notif in notifications"
          :key="notif.id"
          class="notification-item"
          @click="goToNotification(notif)"
        >
          {{ notif.message }}
        </div>

        <button v-if="result?.notifications.pageInfo.hasNextPage" @click="loadMore">Show more</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { onMounted, onUnmounted, onBeforeUnmount, watch, ref, computed } from 'vue';
  import { useRouter } from 'vue-router';
  import { useQuery, useMutation } from '@vue/apollo-composable';
  import SvgIcon from '@jamescoyle/vue-icon';
  import { mdiBell } from '@mdi/js';
  import { NOTIFICATION_COUNT } from '@/graphql/subscriptions/notification-count';
  import { NOTIFICATION_LIST } from '@/graphql/queries/notification-list';
  import { READ_NOTIFICATIONS } from '@/graphql/mutations/read-notifications';
  import { GET_USER } from '@/graphql/queries/get-user';
  import { apolloClient } from '@/apollo/client';

  const router = useRouter();

  const props = defineProps<{
    activeTab?: 'signin' | 'register';
    user?: any | null;
  }>();

  const user = computed(() => userQuery.value?.user)

  const notifCount = ref(0)

  const emit = defineEmits(['update:activeTab', 'logout', 'update-notif-count']);

  function toHomePage() {
    router.push({ name: 'Home' });
  }

  const subscription = ref<any>(null);

  const showNotifications = ref(false)

  const notifications = ref<any[]>([])

  const { mutate: readNotifications } = useMutation(READ_NOTIFICATIONS);

  async function toggleNotifications() {
    showNotifications.value = !showNotifications.value

    const unreadIds = notifications.value.filter(n => !n.readAt).map(n => n.id)

    const { data } = await readNotifications({
      notificationIds: unreadIds,
    });

    notifCount.value = data.readNotifications.user.unreadNotificationsCount
  }

  const { result, loading, error, refetch, fetchMore } = useQuery(NOTIFICATION_LIST, () => ({
    first: 5,
    after: null,
  }))

  const { result: userQuery } = useQuery(GET_USER, () => ({
    userId: props?.user?.id
  }))

  function goToNotification(notif) {
    console.log('notif', notif)
    if (notif.notifiable.__typename === "Comment") {
      router.push({
        name: "Post-Detail",
        params: { id: notif.notifiable.post.id },
        query: { commentId: notif.notifiable.id }
      })
    }
  }

  async function loadMore() {
    if (!result.value?.notifications.pageInfo.hasNextPage) return;
  
    await fetchMore({
      variables: {
        first: 5,
        after: result.value.notifications.pageInfo.endCursor
      },
      updateQuery: (previousResult, { fetchMoreResult }) => {
        if (!fetchMoreResult) return previousResult;
  
        return {
          notifications: {
            __typename: previousResult.notifications.__typename,
            edges: [
              ...previousResult.notifications.edges,
              ...fetchMoreResult.notifications.edges
            ],
            pageInfo: fetchMoreResult.notifications.pageInfo
          }
        };
      }
    });

    const unreadIds = notifications.value.filter(n => !n.readAt).map(n => n.id)

    const { data } = await readNotifications({
      notificationIds: unreadIds,
    });

    notifCount.value = data.readNotifications.user.unreadNotificationsCount
  }

  watch(
    () => props.user,
    (newUser) => {
      if (!newUser) return;

      // Prevent duplicate subscriptions
      subscription.value?.unsubscribe();

      subscription.value = apolloClient.subscribe({
        query: NOTIFICATION_COUNT,
        variables: {
          userId: newUser.id,
        },
      }).subscribe({
        // next({ data }) {
        //   console.log('sub data', data);
        //   notifCount.value = data.unreadNotificationCount.unreadNotificationCount
        // },
        next({ data }) {
          console.log('sub data', data);
          const payload = data.unreadNotificationCount

          notifCount.value = payload.unreadNotificationCount

          if (payload.notification) {
            notifications.value.unshift(payload.notification)
            console.log("New comment:", payload.notification)
          }
        },
        error(err) {
          console.error('Subscription error:', err);
        },
      });
    },
    { immediate: true }
  );

  watch(result, (newResult) => {
    if (newResult?.notifications?.edges) {
      notifications.value = newResult.notifications.edges.map((edge: any) => edge.node)
    }
  })

  watch(
    () => userQuery.value?.user?.unreadNotificationsCount,
    (newVal) => {
      if (newVal !== undefined) {
        notifCount.value = newVal
      }
    },
    { immediate: true }
  )

  const notificationRef = ref<HTMLElement | null>(null)

  const handleClickOutside = (event: MouseEvent) => {
    if (!notificationRef.value) return

    if (!notificationRef.value.contains(event.target as Node)) {
      showNotifications.value = false
    }
  }

  onMounted(() => {
    document.addEventListener('click', handleClickOutside)
  })
  
  onBeforeUnmount(() => {
    document.removeEventListener('click', handleClickOutside)
  })
</script>

<style>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: stretch;
  height: 60px;
  background-color: #2563EB;
  padding: 0 16px;

  .logo {
    color: white;
    font-weight: bold;
    display: flex;
    align-items: center;
  }

  .logo:hover {
    cursor: pointer;
    background-color: #3B82F6;
  }

  .nav-buttons {
    display: flex;
  }

  .nav-buttons button {
    padding: 0 20px;
    border: none;
    cursor: pointer;
    background-color: #2563EB;
    color: white;
    height: 100%;
    font-weight: 500;
    border-radius: 0;
    transition: background-color 0.2s;
    outline: none;
  }

  .nav-buttons button.active {
    background-color: white;
    color: #2563EB;
  }

  .logout {
    padding: 0 20px;
    border: none;
    cursor: pointer;
    background-color: #1D4ED8;
    color: white;
    height: 100%;
    font-weight: 500;
    transition: background-color 0.2s, transform 0.1s;
  }
  
  .logout:hover {
    background-color: #1E40AF;
  }
}

.bell-wrapper {
  position: relative;
  display: inline-block;
  cursor: pointer;
}

.badge {
  position: absolute;
  top: -6px;
  right: -6px;

  background: red;
  color: white;

  font-size: 12px;
  font-weight: bold;

  min-width: 18px;
  height: 18px;
  padding: 0 5px;

  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.notification-dropdown {
  position: absolute;
  top: 40px;
  right: 0;
  width: 250px;
  max-height: 400px;
  background: white;
  color: black;
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  padding: 10px 0;
  z-index: 1000;
  overflow-y: auto;
}

.notification-dropdown::-webkit-scrollbar {
  width: 6px;
}

.notification-dropdown::-webkit-scrollbar-track {
  background: transparent;
}

.notification-dropdown::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.3);
  border-radius: 10px;
}

.notification-item {
  padding: 10px 15px;
  cursor: pointer;
}

.notification-item:hover {
  background: #f5f5f5;
}

.empty {
  padding: 10px 15px;
  color: gray;
}

</style>