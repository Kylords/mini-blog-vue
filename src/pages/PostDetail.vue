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
          v-for="comment in comments"
          :id="`comment-${comment.id}`"
          :key="comment.id"
          class="comment-card"
        >
          <div v-if="editingCommentId !== comment.id">
            <p class="comment-author">
              {{ comment.user.name }}
            </p>
            <p class="comment-body">
              {{ comment.body }}
            </p>
            <span class="comment-actions" v-if="currentUser?.id === comment.user.id">
              <button class="edit-btn" @click.stop="editComment(comment.id)">Edit</button>
              <button class="delete-btn" @click.stop="requestDelete(comment.id)">Delete</button>
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

        <p
          v-if="post.visibleComments.pageInfo.hasNextPage"
          class="show-more"
          @click="loadMoreComments"
        >
          Show More Comments
        </p>

        <div class="comment-card">
        <CommentForm
          @comment-created="refetch"
        />
        </div>
      </div>
    </div>

    <ConfirmModal
      :visible="showDeleteModal"
      title="Delete Comment"
      message="Are you sure you want to delete this comment?"
      @confirm="confirmDelete"
      @cancel="cancelDelete"
    />
  </div>
</template>

<script setup lang="ts">
  import { useQuery, useMutation } from '@vue/apollo-composable';
  import { useRoute } from 'vue-router';
  import { ref, computed, watch, nextTick } from 'vue';
  import { POST_DETAIL } from '@/graphql/queries/post-detail';
  import { GET_COMMENT } from '@/graphql/queries/get-comment';
  import { DELETE_COMMENT } from '@/graphql/mutations/delete-comment';
  import CommentForm from '../components/CommentForm.vue';
  import ConfirmModal from '../components/ConfirmModal.vue';

  const showDeleteModal = ref(false);

  const commentIncrement = 10;

  defineProps<{ currentUser: any }>();

  const route = useRoute();
  const postId = route.params.id;
  const commentId = computed(() => route.query.commentId as string | null)

  const injectedComment = computed(() =>
    specificComment.value?.comment
  )

  const comments = computed(() => {
    const edges = post.value?.visibleComments?.edges || []
    const base = edges.map(e => e.node)

    const comment = injectedComment.value

    if (!comment) return base

    const exists = base.some(c => c.id === comment.id)

    if (exists) return base

    return [...base, comment]
  })

  const { result, loading, error, refetch, fetchMore } = useQuery(
    POST_DETAIL,
    () => ({
      postId: route.params.id,
      first: 10,
      after: null
    })
  )

  const { result: specificComment } = useQuery(
    GET_COMMENT,
    () => ({ commentId: commentId.value }),
    { enabled: computed(() => !!commentId.value) }
  )

  const post = computed(() => result.value?.post);
  const editingCommentId = ref<number | null>(null);


  function editComment(commentId: number) {
    editingCommentId.value = commentId
  }

  const { mutate: deleteComment } = useMutation(DELETE_COMMENT);

  const commentIdToDelete = ref<number | null>(null);

  function requestDelete(commentId: number) {
    showDeleteModal.value = true;
    commentIdToDelete.value = commentId
    console.log('request', commentIdToDelete.value)
  }

  async function confirmDelete() {
    showDeleteModal.value = false;
    await callDelete();
  }

  function cancelDelete() {
    showDeleteModal.value = false;
    commentIdToDelete.value = null;
  }

  const notyf = new Notyf();

  async function callDelete() {
    try {
      const { data } = await deleteComment({
        commentId: commentIdToDelete.value,
      });
      await refetch();
    } catch (err: any) {
      console.error(err);
      notyf.error(err.message);
    }

    commentIdToDelete.value = null;
  }

  function handleUpdated() {
    cancelEdit()
  }

  function cancelEdit() {
    editingCommentId.value = null
  }

  const hasScrolledToInjected = ref(false)

  async function loadMoreComments() {
    if (!post.value.visibleComments.pageInfo.hasNextPage) return;

    await fetchMore({
      variables: {
        first: commentIncrement,
        after: post.value.visibleComments.pageInfo.endCursor
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        return {
          post: {
            ...prev.post,
            visibleComments: {
              __typename: prev.post.visibleComments.__typename,
              edges: [
                ...prev.post.visibleComments.edges,
                ...fetchMoreResult.post.visibleComments.edges
              ],
              pageInfo: fetchMoreResult.post.visibleComments.pageInfo
            }
          }
        };
      }
    });
  }

  watch(
    [injectedComment, post],
    async ([comment, postData]) => {
      console.log('post', post.value)
      if (hasScrolledToInjected.value) return
      if (!comment) return
      if (!postData?.visibleComments?.edges?.length) return

      await nextTick()

      const el = document.getElementById(`comment-${comment.id}`)
      if (!el) return

      el.scrollIntoView({
        behavior: "smooth",
        block: "center"
      })

      hasScrolledToInjected.value = true
    }
  )

  watch(
    () => route.params.id,
    () => {
      hasScrolledToInjected.value = false
      refetch()
    },
    { immediate: true }
  )
</script>

<style scoped>
.container {
  width: 50%;
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

.show-more {
  color: #3490dc;
  text-decoration: underline;
  cursor: pointer;
  transition: color 0.2s;
}

.show-more:hover {
  color: #1d4ed8;
}
</style>