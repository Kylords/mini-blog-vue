<template>
  <form @submit.prevent="handleLogin">
    <h2>Login</h2>

    <div>
      <label for="email">Email</label>
      <input type="email" id="email" v-model="loginForm.email" required />
    </div>

    <div>
      <label for="password">Password</label>
      <input type="password" id="password" v-model="loginForm.password" required />
    </div>

    <button type="submit">Login</button>
  </form>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue';
import { useMutation } from '@vue/apollo-composable';
import { LOGIN_USER } from '../graphql/mutations/login';

interface LoginForm {
  email: string;
  password: string;
}

const notyf = new Notyf();

const errors = ref<string[]>([]);
const { mutate: login, loading } = useMutation(LOGIN_USER);

const loginForm = reactive<LoginForm>({
  email: '',
  password: ''
});

const emit = defineEmits(['login-success']);

async function handleLogin() {
  errors.value = [];

  const response = await login({
    email: loginForm.email,
    password: loginForm.password
  });

  const data = response.data.login;

  console.log('data', response.data.login);

  if (data.errors.length) {
    errors.value = data.errors;
    const errorMessage = data.errors.join('\n');
    notyf.error(errorMessage);
  } else {
    localStorage.setItem('token', data.token);
    console.log('Logged in user:', data.user);

    emit('login-success', data.user, data.token);
  }
}
</script>

<style scoped>

form { max-width: 300px; margin: auto; }
div { margin-bottom: 10px; }
label { display: block; margin-bottom: 4px; }
input { width: 100%; padding: 6px; }
button { padding: 8px 16px; }
</style>
