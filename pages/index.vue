<template>
  <div>Currenty logged in as: {{ user }}</div>
  <button @click="logout">Logout</button>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ["protected"],
});

const { user, logout } = useAuth();
</script>

<style scoped></style>
