<template>
  <div ref="el" :style="style" class="bg-yellow-500 px-2 text-zinc-800 fixed w-64 h-64 rounded-lg shadow">
    <div class="border-b border-yellow-900 border-opacity-20 py-1 flex items-center justify-between">
      <p class="font-bold">
        Sticky note
      </p>
      <button class="px-1" @click="removeItem(item)">
        X
      </button>
    </div>
    <div class="py-1">
      <p>
        {{ item.content }}
      </p>
    </div>
    <div class="text-zinc-700 absolute bottom-2 right-3 left-3">
      <div class="flex items-center justify-between w-full">
        <small>
          {{ item.id }}
        </small>
        <small>
          {{ Math.round(dx) }} x {{ Math.round(dy) }}
        </small>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDraggable } from '@vueuse/core'
import { Types, type TItem } from '@/types'

const props = defineProps<{
  item: TItem
}>()
const { sendItemChange, removeItem } = useConnectionStore()

const el = ref<HTMLElement | null>(null)

// `style` will be a helper computed for `left: ?px; top: ?px;`
const { x: dx, y: dy, style, isDragging } = useDraggable(el, {
  initialValue: { x: props.item.x, y: props.item.y }
})

watch([dx, dy], ([x, y]) => {
  sendItemChange({
    id: props.item.id,
    type: Types.Stickynote,
    content: props.item.content,
    x,
    y
  })
})

watch(props.item, (item: TItem) => {
  if (isDragging.value) { return }
  dx.value = item.x
  dy.value = item.y
}, { deep: true })
</script>

<style scoped>

</style>
