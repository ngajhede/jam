<template>
  <DialogRoot :open="isOpen" @update:open="onOpenUpdate">
    <DialogPortal>
      <DialogOverlay class="bg-blackA9 data-[state=open]:animate-overlayShow fixed inset-0 z-30" />
      <DialogContent class="data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[450px] space-y-3 translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none z-[100]">
        <header class="flex justify-between items-center pb-3">
          <DialogTitle>Note</DialogTitle>
          <DialogClose aria-label="Close" class="outline-none cursor-pointer hover:text-gray-500 transition-colors duration-200 ease-in-out">
            <X class="w-5 h-5" />
          </DialogClose>
        </header>
        <form @submit.prevent="onAddElement" class="space-y-3">
          <textarea ref="textarea" id="content" v-model="content" class="w-full h-72 bg-gray-50 rounded-md border p-3 resize-none" placeholder="Enter your note here"></textarea>
          <div class="flex justify-end space-x-3">
            <DialogClose as-child>
              <button type="button" class="px-2 py-1 bg-gray-100 hover:bg-gray-200 transition duration-75 ease-linear rounded-md">Cancel</button>
            </DialogClose>
            <button type="submit" class="px-2 py-1 bg-yellow-300 hover:bg-yellow-400 transition duration-75 ease-linear rounded-md">Add note</button>
          </div>
        </form>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>

<script setup lang="ts">
import { DialogClose, DialogContent, DialogDescription, DialogOverlay, DialogPortal, DialogRoot, DialogTitle, DialogTrigger } from "radix-vue";
import { X } from "lucide-vue-next";

const isOpen = defineModel<boolean>("isOpen");

const content = ref();
const textarea = ref<HTMLTextAreaElement | null>(null);

const emit = defineEmits(["close", "add-element"]);

watch(isOpen, (value) => {
  if (value) {
    nextTick(() => {
      textarea.value?.focus();
    });
  }
});

const onOpenUpdate = (value: boolean) => {
  if (!value) {
    emit("close");
  }
};

const onAddElement = () => {
  emit("add-element", {
    position: {
      x: Math.floor(Math.random() * 500),
      y: Math.floor(Math.random() * 500),
    },
    size: { width: 200, height: 200 },
    content: content.value,
  });
  emit("close");
  content.value = "";
};
</script>

<style scoped></style>
