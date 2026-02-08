<template>
  <form @submit.prevent="handleRegister">
    <h2>Register</h2>

    <div>
      <label for="name">Name</label>
      <input type="text" id="name" v-model="registerForm.name" required />
    </div>

    <div>
      <label for="email">Email</label>
      <input type="email" id="email" v-model="registerForm.email" required />
    </div>

    <div>
      <label for="password">Password</label>
      <input type="password" id="password" v-model="registerForm.password" required />
    </div>

    <div>
      <label for="confirmPassword">Confirm Password</label>
      <input type="password" id="confirmPassword" v-model="registerForm.confirmPassword" required />
    </div>

    <button type="submit">Register</button>
  </form>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue';
import { useMutation } from '@vue/apollo-composable';
import { REGISTER_USER } from '../graphql/mutations/register';

const emit = defineEmits(['login-success']);

interface RegisterForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const notyf = new Notyf();

const registerForm = reactive<RegisterForm>({
  name: '',
  email: '',
  password: '',
  confirmPassword: ''
});

const errors = ref<string[]>([]);
const { mutate: register, loading } = useMutation(REGISTER_USER);

async function handleRegister() {
  errors.value = [];

  const response = await register({
    name: registerForm.name,
    email: registerForm.email,
    password: registerForm.password,
    passwordConfirmation: registerForm.confirmPassword
  });

  const data = response.data.createUser;

  console.log('data', response.data.createUser);

  if (data.errors.length) {
    errors.value = data.errors;
    const errorMessage = data.errors.join('\n');
    notyf.error(errorMessage);
  } else {
    localStorage.setItem('token', data.token);
    console.log('Registered user:', data.user);
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