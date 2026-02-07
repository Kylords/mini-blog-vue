<template>
  <Navbar
    :activeTab="activeTab"
    :user="user"
    @update:activeTab="activeTab = $event"
    @logout="logout"
  />

  <Login
    v-if="!user"
    :activeTab="activeTab"
    @login-success="handleLogin"
  />

  <Home v-else :currentUser="user" />
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import Navbar from './components/Navbar.vue';
  import Login from './pages/Login.vue';
  import Home from './pages/Home.vue';

  const activeTab = ref<'signin' | 'register'>('signin');
  const user = ref(null);

  function handleLogin(loggedInUser: any, token: string) {
    user.value = loggedInUser;
    localStorage.setItem('user', JSON.stringify(loggedInUser));
    localStorage.setItem('token', token);
  }

  function logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    user.value = null;
  }

  
  onMounted(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (storedUser && token) {
      user.value = JSON.parse(storedUser);
    }
  });
</script>