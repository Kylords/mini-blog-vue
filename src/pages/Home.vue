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
      @post-created="refetch"
    />

    <p v-if="loading">Loading...</p>
    <p v-if="error">Error: {{ error.message }}</p>

    <PostCard
      v-if="result"
      v-for="post in result.posts"
      :key="post.id"
      :post="post"
      :currentUser="currentUser"
      :editingPostId="editingPostId"
      @start-edit="startEditing"
      @delete-post="refetch"
    />
  </div>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue';
  import { useQuery } from '@vue/apollo-composable';
  import PostCard from '../components/PostCard.vue';
  import PostForm from '../components/PostForm.vue';
  import { POST_LIST } from '@/graphql/queries/post-list';

  const { result, loading, error, refetch } = useQuery(POST_LIST)

  const showForm = ref(false);

  const editingPostId = ref<number | null>(null);

  function startEditing(postId: number) {
    editingPostId.value = postId;
  }

  function addPost(newPost: any) {
    refetch();
    showForm.value = false;
  }

  defineProps<{ currentUser: any }>();

  function removePost(postId: number) {
    result.value.posts = result.value.posts.filter(p => p.id !== postId);
  }
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