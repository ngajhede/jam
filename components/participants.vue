<template>
  <div v-if="peers && peers.length" class="flex space-x-3 align z-10" ref="parent">
    <AvatarRoot v-for="peer in peers" :key="peer" class="shadow-xl bg-blackA3 inline-flex h-12 w-12 select-none items-center justify-center overflow-hidden rounded-full align-middle">
      <TooltipProvider>
        <TooltipRoot>
          <TooltipTrigger>
            <AvatarImage class="h-full w-full rounded-[inherit] object-cover" :src="`https://avatars.githubusercontent.com/${peer}`" :alt="peer" />
            <AvatarFallback class="text-grass11 leading-1 flex h-full w-full items-center justify-center bg-white text-[15px] font-medium" :delay-ms="600">
              {{ peer }}
            </AvatarFallback>
          </TooltipTrigger>
          <TooltipPortal>
            <TooltipContent side="bottom" class="data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade text-grass11 select-none rounded-[4px] bg-white px-[15px] py-[10px] text-[15px] leading-none shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] will-change-[transform,opacity]" :side-offset="5">
              {{ peer }}
              <TooltipArrow class="fill-white" :width="8" />
            </TooltipContent>
          </TooltipPortal>
        </TooltipRoot>
      </TooltipProvider>
    </AvatarRoot>
  </div>
</template>

<script setup lang="ts">
import { AvatarFallback, AvatarImage, AvatarRoot } from "radix-vue";
import { TooltipArrow, TooltipContent, TooltipPortal, TooltipProvider, TooltipRoot, TooltipTrigger } from "radix-vue";

import { useAutoAnimate } from "@formkit/auto-animate/vue";

const [parent] = useAutoAnimate();

const props = defineProps<{
  peers: string[] | undefined;
}>();
</script>

<style scoped></style>
