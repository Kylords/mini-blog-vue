<template>
  <form class="comment-form" @submit.prevent="submitComment">
    <textarea
      v-model="body"
      placeholder="Write your comment..."
      required
    ></textarea>

    <button type="submit">{{ comment ? 'Update' : 'Comment' }}</button>
    <button v-if="comment" type="button" @click.stop="$emit('cancel')">Cancel</button>
  </form>
</template>

<script setup lang="ts">
  import { ref, defineProps, defineEmits } from 'vue';
  import { useMutation } from '@vue/apollo-composable';
  import { CREATE_COMMENT } from '@/graphql/mutations/create-comment';
  import { EDIT_COMMENT } from '@/graphql/mutations/edit-comment';
  import { useRoute } from 'vue-router';

  const route = useRoute();

  const props = defineProps<{ comment?: any }>();
  const emit = defineEmits(['comment-created', 'comment-edited', 'cancel']);

  const body = ref(props.comment?.body ?? '');

  const { mutate: createComment } = useMutation(CREATE_COMMENT);
  const { mutate: editComment } = useMutation(EDIT_COMMENT);

  const notyf = new Notyf();

  const postId = route.params.id;

  async function submitComment() {
    try {
      if (props.comment) {
        const { data } = await editComment({
          postId: postId,
          commentId: props.comment.id,
          body: body.value,
        });
        emit('comment-edited', data.editComment.comment);
      } else {
        const { data } = await createComment({
          postId: postId,
          body: body.value,
        });
        console.log('create', data.createComment)
        emit('comment-created', data.createComment.comment);
      }
    } catch (err: any) {
      console.error(err);
      notyf.error(err.message);
    }
  }
</script>

<style scoped>
.comment-form {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
}

.comment-form textarea {
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #ccc;
}
  
.comment-form button {
  align-self: flex-start;
  padding: 6px 12px;
  background-color: #38c172;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>