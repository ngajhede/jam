<template>
  <div ref="el" :style="style" class="bg-yellow-500 px-2 text-zinc-800 fixed w-64 rounded-lg shadow">
    <div ref="handle" class="border-b border-yellow-900 border-opacity-20 py-1 flex items-center justify-between cursor-pointer">
      <p class="font-bold">
        Sticky note
      </p>
      <button class="px-1" @click="removeItem(item)">
        X
      </button>
    </div>
    <div class="py-1">
      <textarea v-model="content" class="w-full h-32 resize-none bg-transparent focus:outline-none" />
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
const handle = ref<HTMLElement | null>(null)

const content = computed({
  get () {
    return props.item.content
  },
  set (value) {
    sendItemChange({
      id: props.item.id,
      type: Types.Stickynote,
      content: value,
      x: props.item.x,
      y: props.item.y
    })
  }
})

// `style` will be a helper computed for `left: ?px; top: ?px;`
const { x: dx, y: dy, style, isDragging } = useDraggable(el, {
  initialValue: { x: props.item.x, y: props.item.y },
  handle
})

const position = computed({
  get () {
    return { x: dx.value, y: dy.value }
  },
  set (value) {
    const { x, y } = value
    sendItemChange({
      id: props.item.id,
      type: Types.Stickynote,
      content: content.value,
      x,
      y
    })
  }
})

watch([dx, dy], ([x, y], [oldX, oldY]) => {
  position.value = { x, y }
})

watchEffect(() => {
  dx.value = props.item.x
  dy.value = props.item.y
})
</script>

<style scoped>

</style>
