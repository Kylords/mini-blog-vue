<template>
  <div class="post-card" @click="openPost(post.id)">
    <div v-if="editingPostId !== post.id">
      <div class="post-user">{{ post.user.name }}</div>
      <h3>{{ post.title }}</h3>
      <p>{{ post.body }}</p>
      <div class="post-footer">
        {{ post.commentCount }} comments
        <span v-if="isOwner">
          <button class="edit-btn" @click.stop="editPost">Edit</button>
          <button class="delete-btn" @click.stop="requestDelete">Delete</button>
        </span>
      </div>
    </div>

    <div v-else>
      <PostForm
        :post="post"
        @post-edited="handleUpdated"
        @cancel="cancelEdit"
        @click.stop
      />
    </div>

    <ConfirmModal
      :visible="showDeleteModal"
      title="Delete Post"
      message="Are you sure you want to delete this post?"
      @confirm="confirmDelete"
      @cancel="showDeleteModal = false"
    />
  </div>
</template>

<script setup lang="ts">
  import { defineProps, defineEmits, computed, ref } from 'vue';
  import PostForm from './PostForm.vue';
  import { useMutation } from '@vue/apollo-composable';
  import { DELETE_POST } from '@/graphql/mutations/delete-post';
  import { useRouter } from 'vue-router';
  import ConfirmModal from './ConfirmModal.vue';

  const showDeleteModal = ref(false);

  const router = useRouter();

  const { mutate: deletePost } = useMutation(DELETE_POST);

  const props = defineProps<{
    post: {
      id: number;
      title: string;
      body: string;
      user: { id: number; name: string };
      commentsCount: number;
    };
    currentUser: { id: number };
    editingPostId: string | null;
  }>();

  const emit = defineEmits(['start-edit', 'update-post', 'delete-post']);

  const isOwner = computed(() => props.currentUser?.id === props.post.user.id);

  function editPost() {
    emit('start-edit', props.post.id);
  }

  function cancelEdit() {
    emit('start-edit', null);
  }

  function requestDelete() {
    showDeleteModal.value = true;
  }

  async function confirmDelete() {
    showDeleteModal.value = false;
    await callDelete();
  }

  const notyf = new Notyf();

  async function callDelete() {
    try {
      const { data } = await deletePost({
        postId: props.post.id,
      });
      emit('delete-post', data.deletePost.post);
      
    } catch (err: any) {
      console.error(err);
      notyf.error(err.message);
    }
  }

  function handleUpdated(updatedPost: any) {
    cancelEdit()
  }

  function openPost(postId: number) {
    router.push({ name: 'Post-Detail', params: { id: postId } });
  }
</script>

<style scoped>
.post-card {
  border: 1px solid #ddd;
  padding: 16px;
  margin-bottom: 12px;
  border-radius: 8px;
  cursor: pointer;
}

.post-user {
  font-weight: bold;
  margin-bottom: 4px;
}

.post-title {
  margin: 6px 0;
}

.post-footer {
  color: gray;
  font-size: 14px;
}

.post-actions {
  display: flex;
  gap: 8px;
  margin-top: 8px;
}

.post-actions button {
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  background-color: #f5f5f5;
  outline: none;
}

.post-actions button:hover {
  background-color: #e8e8e8;
}

.edit-btn {
  color: #3490dc;
}

.delete-btn {
  color: #e3342f;
}
</style>