<template>
  <div class="bg-gray-800 text-center space-y-4 bg-opacity-50 p-12 rounded-lg border border-gray-800 shadow">
    <p>
      Welcome to Jam!
    </p>

    <form class="flex flex-col space-y-4" @submit.prevent="handleSubmit">
      <input v-model="name" class="bg-gray-900 text-white px-4 py-2 rounded-lg shadow" placeholder="Your name">
      <button
        class="bg-gray-900 text-white px-4 py-2 rounded-lg shadow"
        type="submit"
      >
        Submit
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
const { setName } = useConnectionStore()

const emit = defineEmits(['setName'])

const name = ref('')

const handleSubmit = () => {
  setName(name.value)
  emit('setName', name.value)
}
</script>

<style scoped>

</style>
