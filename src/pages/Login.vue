<template>
  <div class="form-container">
    <LoginForm v-if="activeTab === 'signin'" @login-success="emitLogin" />
    <RegisterForm v-else @login-success="emitLogin" />
  </div>
</template>

<script setup lang="ts">
  import { onMounted } from 'vue';
  import LoginForm from '../components/LoginForm.vue';
  import RegisterForm from '../components/RegisterForm.vue';
  import { useRouter } from 'vue-router';

  const router = useRouter()

  defineProps<{
    activeTab: 'signin' | 'register';
  }>();

  const emit = defineEmits(['login-success']);

  function emitLogin(user: any, token: string) {
    emit('login-success', user, token);
  }

  onMounted(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (storedUser && token) {
      router.push({ name: 'Home' });
    }
  });
</script>