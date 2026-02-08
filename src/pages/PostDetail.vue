<template>
  <div class="container">
    <div v-if="loading" class="status">Loading...</div>
    <div v-else-if="error" class="status error">
      Failed to load post.
    </div>

    <div v-else-if="post" class="post-card">
      <div class="post-details">
        <h1 class="post-title">{{ post.title }}</h1>
        <p class="post-author">By {{ post.user.name }}</p>
        <p class="post-body">{{ post.body }}</p>
      </div>

      <div class="comments-section">
        <h2 class="comments-title">Comments</h2>

        <div
          v-if="post.visibleComments.length === 0"
          class="no-comments"
        >
          No comments yet.
        </div>

        <div
          v-for="comment in post.visibleComments"
          :key="comment.id"
          class="comment-card"
        >
          <!-- <div>
            <p class="comment-author">
              {{ comment.user.name }}
            </p>
            <p class="comment-body">
              {{ comment.body }}
            </p>
            <span class="comment-actions" v-if="currentUser?.id === comment.user.id">
              <button class="edit-btn" @click.stop="editComment(comment.id)">Edit</button>
              <button class="delete-btn" @click.stop="callDelete">Delete</button>
            </span>
          </div> -->

          <div v-if="editingCommentId !== comment.id">
            <p class="comment-author">
              {{ comment.user.name }}
            </p>
            <p class="comment-body">
              {{ comment.body }}
            </p>
            <span class="comment-actions" v-if="currentUser?.id === comment.user.id">
              <button class="edit-btn" @click.stop="editComment(comment.id)">Edit</button>
              <button class="delete-btn" @click.stop="callDelete(comment.id)">Delete</button>
            </span>
          </div>

          <div v-else>
            <CommentForm
              :comment="comment"
              @comment-edited="handleUpdated"
              @cancel="cancelEdit"
            />
          </div>
        </div>

        <div class="comment-card">
        <CommentForm
          @comment-created="refetch"
        />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useQuery, useMutation } from '@vue/apollo-composable';
  import { useRoute } from 'vue-router';
  import { ref, computed } from 'vue';
  import { POST_DETAIL } from '@/graphql/queries/post-detail';
  import { DELETE_COMMENT } from '@/graphql/mutations/delete-comment';
  import CommentForm from '../components/CommentForm.vue';

  defineProps<{ currentUser: any }>();

  const route = useRoute();
  const postId = route.params.id;

  const { result, loading, error, refetch } = useQuery(POST_DETAIL, {
    postId: postId,
  });

  const post = computed(() => result.value?.post);
  const editingCommentId = ref<number | null>(null);

  function handleCreate() {
    console.log('created')
  }

  function editComment(commentId: number) {
    console.log('comment id', editingCommentId !== commentId)
    editingCommentId.value = commentId
  }

  const { mutate: deleteComment } = useMutation(DELETE_COMMENT);

  const notyf = new Notyf();

  async function callDelete(commentId: number) {
    try {
      const { data } = await deleteComment({
        commentId: commentId,
      });
      await refetch();
    } catch (err: any) {
      console.error(err);
      notyf.error(err.message);
    }
  }

  function handleUpdated() {
    cancelEdit()
  }

  function cancelEdit() {
    editingCommentId.value = null
  }
</script>

<style scoped>
.container {
  max-width: 700px;
  margin: 40px auto;
  padding: 0 16px;
  font-family: Arial, sans-serif;
}

.status {
  text-align: center;
  padding: 40px;
  color: #666;
}

.status.error {
  color: #c0392b;
}

.post-card {
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.post-details {
  padding: 24px;
}

.post-title {
  font-size: 28px;
  margin-bottom: 8px;
}

.post-author {
  color: #777;
  margin-bottom: 20px;
  font-size: 14px;
}

.post-body {
  font-size: 16px;
  line-height: 1.6;
  margin-bottom: 0px;
}

.comments-section {
  padding: 0 24px 12px 24px;
  border-top: 1px solid #eee;
  background: #f5f5f5;
}

.comments-title {
  font-size: 20px;
  margin-bottom: 0;
}

.no-comments {
  color: #888;
  font-style: italic;
}

.comment-card {
  padding: 14px;
  margin-bottom: 12px;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  background: #fafafa;
}

.comment-author {
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 4px;
  margin-top: 0;
}

.comment-body {
  font-size: 12px;
  color: #333;
  margin-bottom: 12px;
}

.comment-actions button {
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  background-color: #f5f5f5;
  outline: none;
  font-size: 12px;
}

.comment-actions button:hover {
  background-color: #e8e8e8;
}

.edit-btn {
  color: #3490dc;
}

.delete-btn {
  color: #e3342f;
}
</style>