<template>
  <div>
    <h1>Room {{ id }}</h1>
    <WebSocket :room-id="computedId" />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ["protected"],
});

const route = useRoute();

const id = route.params.id;
const computedId = computed(() => {
  if (typeof id === "string") {
    return id;
  } else {
    return id[0];
  }
});
</script>

<style scoped></style>
