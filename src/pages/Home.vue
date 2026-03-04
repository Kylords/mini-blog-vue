<template>
  <div class="home-container">
    <div class="sidebar">
      <v-combobox
        v-model="selectedUser"
        :items="users"
        item-title="name"
        item-value="id"
        label="Select user"
        dense
      />
    </div>

    <div class="main-content">
      <!-- Header -->
      <div class="main-header">
        <h2>All Posts</h2>
        <button @click="showForm = !showForm">
          {{ showForm ? 'Cancel' : 'Create Post' }}
        </button>
      </div>

      <PostForm
        v-if="showForm"
        @post-created="addPost"
        @cancel="showForm = false"
      />

      <p v-if="loading">Loading...</p>
      <p v-if="error">Error: {{ error.message }}</p>

      <PostCard
        v-for="post in postList"
        :key="post.id"
        :post="post"
        :currentUser="currentUser"
        :editingPostId="editingPostId"
        @start-edit="startEditing"
        @delete-post="removePost"
      />

      <button
        v-if="result?.posts.pageInfo.hasNextPage"
        @click="loadMore"
      >
        Show More
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, watch, onMounted, onUnmounted, computed } from 'vue';
  import { useQuery } from '@vue/apollo-composable';
  import PostCard from '../components/PostCard.vue';
  import PostForm from '../components/PostForm.vue';
  import { POST_LIST } from '@/graphql/queries/post-list';
  import { USER_LIST } from '@/graphql/queries/user-list';
  import { POST_CREATED } from '@/graphql/subscriptions/post-created';
  import { apolloClient } from '@/apollo/client';

  defineProps<{ currentUser: any }>();

  const selectedUser = ref(null);

  const users = computed(() => {
    const allOption = { id: null, name: 'All Users' }
  
    if (!userList.value?.searchUsers?.edges) {
      return [allOption]
    }
  
    const fetchedUsers = userList.value.searchUsers.edges.map(edge => edge.node)
  
    return [allOption, ...fetchedUsers]
  })

  const postList = ref<any[]>([])

  const { result, loading, error, refetch, fetchMore } = useQuery(POST_LIST, () => ({
    first: 10,
    after: null,
    userId: selectedUser.value?.id || null
  }))

  const {
    result: userList,
    loading: userLoading,
    error: userError,
    fetchMore: userFetchMore
  } = useQuery(USER_LIST, {
    first: 10,
    after: null,
    query: ''
  });

  const showForm = ref(false);
  const editingPostId = ref<number | null>(null);

  let subscription: any = null;

  function startEditing(postId: number) {
    editingPostId.value = postId;
  }

  function removePost(postId: number) {
    postList.value = postList.value.filter(post => post.id !== postId);
  }

  function addPost(newPost: any) {
    showForm.value = false;
  }

  function showFormButon() {
    console.log('user', error)
  }

  async function loadMore() {
    if (!result.value?.posts.pageInfo.hasNextPage) return;
  
    await fetchMore({
      variables: {
        first: 10,
        after: result.value.posts.pageInfo.endCursor
      },
      updateQuery: (previousResult, { fetchMoreResult }) => {
        if (!fetchMoreResult) return previousResult;
  
        return {
          posts: {
            __typename: previousResult.posts.__typename,
            edges: [
              ...previousResult.posts.edges,
              ...fetchMoreResult.posts.edges
            ],
            pageInfo: fetchMoreResult.posts.pageInfo
          }
        };
      }
    });
  }

  onMounted(() => {
    subscription = apolloClient.subscribe({
      query: POST_CREATED,
    }).subscribe({
      next({ data }) {
        if (data?.postCreated?.post) {
          postList.value.unshift(data.postCreated.post);
        }
      },
      error(err) {
        console.error('Subscription error:', err);
      },
    });
  });

  onUnmounted(() => {
    if (subscription) {
      subscription.unsubscribe();
    }
  });

  watch(
    result,
    (newResult) => {
      if (newResult?.posts?.edges) {
        postList.value = newResult.posts.edges.map(edge => edge.node)
      }
    },
    { immediate: true }
  )
</script>

<style scoped>
.home-container {
  display: flex;
  gap: 40px;
}

.sidebar {
  width: 200px;
}

/* Main content */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 1000px;
  margin: 20px auto;
}

.main-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
  justify-content: space-between;
  width: 80%;
}

button {
  padding: 6px 12px;
  border-radius: 4px;
  background-color: #3490dc;
  color: white;
  border: none;
  cursor: pointer;
}
</style>