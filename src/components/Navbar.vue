<template>
  <div class="navbar">
    <div class="logo" @click="toHomePage">MiniBlog</div>

    <div v-if="!user" class="nav-buttons">
      <button
        :class="{ active: activeTab === 'signin' }"
        @click="$emit('update:activeTab', 'signin')"
      >
        Sign In
      </button>

      <button
        :class="{ active: activeTab === 'register' }"
        @click="$emit('update:activeTab', 'register')"
      >
        Register
      </button>
    </div>

    <div v-else>
      <button class="logout" @click="$emit('logout')">Logout</button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useRouter } from 'vue-router';

  const router = useRouter();

  defineProps<{
    activeTab?: 'signin' | 'register';
    user?: any | null;
  }>();

  defineEmits(['update:activeTab', 'logout']);

  function toHomePage() {
    router.push({ name: 'Home' });
  }
</script>

<style>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: stretch;
  height: 60px;
  background-color: #2563EB;
  padding: 0 16px;

  .logo {
    color: white;
    font-weight: bold;
    display: flex;
    align-items: center;
  }

  .logo:hover {
    cursor: pointer;
    background-color: #3B82F6;
  }

  .nav-buttons {
    display: flex;
  }

  .nav-buttons button {
    padding: 0 20px;
    border: none;
    cursor: pointer;
    background-color: #2563EB;
    color: white;
    height: 100%;
    font-weight: 500;
    border-radius: 0;
    transition: background-color 0.2s;
    outline: none;
  }

  .nav-buttons button.active {
    background-color: white;
    color: #2563EB;
  }

  .logout {
    padding: 0 20px;
    border: none;
    cursor: pointer;
    background-color: #1D4ED8;
    color: white;
    height: 100%;
    font-weight: 500;
    transition: background-color 0.2s, transform 0.1s;
  }
  
  .logout:hover {
    background-color: #1E40AF;
  }
}

</style>