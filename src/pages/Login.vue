<template>
  <div class="form-container">
    <LoginForm v-if="activeTab === 'signin'" @login-success="emitLogin" />
    <RegisterForm v-else @login-success="emitLogin" />
  </div>
</template>

<script setup lang="ts">
  import LoginForm from '../components/LoginForm.vue';
  import RegisterForm from '../components/RegisterForm.vue';

  defineProps<{
    activeTab: 'signin' | 'register';
  }>();

  const emit = defineEmits(['login-success']);

  function emitLogin(user: any, token: string) {
    emit('login-success', user, token);
  }
</script>