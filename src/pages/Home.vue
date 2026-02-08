<template>
  <div class="home">
    <div class="home-header">
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
  </div>
</template>

<script setup lang="ts">
  import { ref, watch, onMounted, onUnmounted } from 'vue';
  import { useQuery } from '@vue/apollo-composable';
  import PostCard from '../components/PostCard.vue';
  import PostForm from '../components/PostForm.vue';
  import { POST_LIST } from '@/graphql/queries/post-list';
  import { POST_CREATED } from '@/graphql/subscriptions/post-created';
  import { apolloClient } from '@/apollo/client';

  const postList = ref<any[]>([]);
  const { result, loading, error } = useQuery(POST_LIST);

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

  defineProps<{ currentUser: any }>();

  watch(
    result,
    (newResult) => {
      if (newResult?.posts) {
        postList.value = [...newResult.posts];
      }
    },
    { immediate: true }
  );

  onMounted(() => {
    console.log('mount', postList)
    subscription = apolloClient.subscribe({
      query: POST_CREATED,
    }).subscribe({
      next({ data }) {
        console.log('sub data', data);
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
</script>

<style scoped>
.home {
  max-width: 700px;
  margin: 20px auto;
}

.home-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
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