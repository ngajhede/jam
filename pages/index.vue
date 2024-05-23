<template>
  <div>Currenty logged in as: {{ user }}</div>
</template>

<script setup lang="ts">
const user = useUser();
</script>

<style scoped></style>
