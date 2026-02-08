<template>
  <form class="post-form">
    <input
      v-model="title"
      type="text"
      placeholder="Post title"
      required
    />

    <textarea
      v-model="body"
      placeholder="Write your post..."
      required
    ></textarea>

    <button type="submit" @click.stop="submitPost">{{ post ? 'Update' : 'Create' }}</button>
    <button type="button" @click.stop="$emit('cancel')">Cancel</button>
  </form>
</template>

<script setup lang="ts">
  import { ref, defineProps, defineEmits } from 'vue';
  import { useMutation } from '@vue/apollo-composable';
  import { CREATE_POST } from '@/graphql/mutations/create-post';
  import { EDIT_POST } from '@/graphql/mutations/edit-post';

  const props = defineProps<{ post?: any }>();
  const emit = defineEmits(['post-created', 'post-edited', 'cancel']);

  const title = ref(props.post?.title ?? '');
  const body = ref(props.post?.body ?? '');

  const { mutate: createPost } = useMutation(CREATE_POST);
  const { mutate: editPost } = useMutation(EDIT_POST);

  const notyf = new Notyf();

  async function submitPost() {
    try {
      if (props.post) {
        const { data } = await editPost({
          postId: props.post.id,
          title: title.value,
          body: body.value,
        });
        emit('post-edited', data.editPost.post);
      } else {
        const { data } = await createPost({
          title: title.value,
          body: body.value,
        });
        emit('post-created', data.createPost.post);
      }
    } catch (err: any) {
      console.error(err);
      notyf.error(err.message);
    }
  }
</script>

<style scoped>
.post-form {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
}
  
.post-form input,
.post-form textarea {
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #ccc;
}
  
.post-form button {
  align-self: flex-start;
  padding: 6px 12px;
  background-color: #38c172;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>