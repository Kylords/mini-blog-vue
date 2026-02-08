<template>
  <div class="overlay" v-if="visible">
    <div class="modal">
      <h3>{{ title }}</h3>
      <p>{{ message }}</p>

      <div class="actions">
        <button class="cancel" @click.stop="$emit('cancel')">
          Cancel
        </button>
        <button class="confirm" @click.stop="$emit('confirm')">
          Delete
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  defineProps<{
    visible: boolean;
    title?: string;
    message?: string;
  }>();

  defineEmits(['confirm', 'cancel']);
</script>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}

.modal {
  background: white;
  padding: 24px;
  border-radius: 10px;
  width: 320px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}

.modal h3 {
  margin: 0 0 10px;
}

.modal p {
  margin-bottom: 20px;
  color: #555;
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.cancel {
  background: #e5e7eb;
  border: none;
  padding: 6px 14px;
  border-radius: 6px;
  cursor: pointer;
}

.confirm {
  background: #ef4444;
  color: white;
  border: none;
  padding: 6px 14px;
  border-radius: 6px;
  cursor: pointer;
}
</style>