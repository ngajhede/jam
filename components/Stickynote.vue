<template>
  <div ref="el" :style="[style]" class=" bg-yellow-500 text-zinc-800 fixed rounded-lg shadow">
    <div :style="whStyle" class="flex flex-col p-2 min-h-[10px] resize overflow-hidden">
      <div ref="handle" class="border-b border-yellow-900 border-opacity-20 flex items-center justify-between cursor-pointer">
        <p class="font-bold">
          Sticky note
        </p>
        <button class="px-1" @click="removeItem(item)">
          X
        </button>
      </div>
      <textarea v-model="content" class="note resize-none bg-transparent focus:outline-none grow p-2" />
      <div class="text-zinc-700">
        <div class="flex items-center justify-between w-full">
          <small>
            {{ item.id }}
          </small>
          <small>
            {{ Math.round(item.width) }} x {{ Math.round(item.height) }}
          </small>
          <small>
            {{ Math.round(dx) }} x {{ Math.round(dy) }}
          </small>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDraggable, useElementSize } from '@vueuse/core'

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
      y: props.item.y,
      width: props.item.width,
      height: props.item.height
    })
  }
})

// `style` will be a helper computed for `left: ?px; top: ?px;`
const { x: dx, y: dy, style, isDragging } = useDraggable(el, {
  initialValue: { x: props.item.x, y: props.item.y },
  handle
})

const { width: dw, height: dh } = useElementSize(el)
const whStyle = computed(() => ({
  width: `${props.item.width}px`,
  height: `${props.item.height}px`
}))

const position = computed({
  get () {
    return { x: dx.value, y: dy.value }
  },
  set (value) {
    if (!isDragging.value) { return }
    const { x, y } = value
    sendItemChange({
      id: props.item.id,
      type: Types.Stickynote,
      content: content.value,
      x,
      y,
      width: props.item.width,
      height: props.item.height
    })
  }
})

const size = computed({
  get () {
    return { width: props.item.width, height: props.item.height }
  },
  set (value) {
    const { width, height } = value
    sendItemChange({
      id: props.item.id,
      type: Types.Stickynote,
      content: content.value,
      x: props.item.x,
      y: props.item.y,
      width,
      height
    })
  }
})

watch([dx, dy], ([x, y]) => {
  position.value = { x, y }
})

watch([dw, dh], ([width, height]) => {
  size.value = { width, height }
})

watchEffect(() => {
  if (isDragging.value) { return }
  dx.value = props.item.x
  dy.value = props.item.y
})
</script>

<style lang="scss" scoped>
.note::-webkit-scrollbar {
  width: 10px;
}

.note::-webkit-scrollbar-track {
  @apply bg-yellow-600;
}

.note::-webkit-scrollbar-thumb {
  @apply bg-yellow-500 outline-yellow-900;
}
</style>
