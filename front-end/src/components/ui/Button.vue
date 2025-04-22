<script setup lang="ts">
import { CircleHelp, Play, SquareFunction } from "lucide-vue-next"

let props = defineProps<{
  method: string
  description: string
  function: () => void
  link: string
}>()
</script>

<template>
  <div class="container">
    <div class="top">
      <span class="method-name"
        ><SquareFunction :stroke-width="1.5" :size="18" />{{ props.method }}</span
      >
      <button class="test" @click="props.function">
        <Play :stroke-width="1.5" :size="18" />Test
      </button>
    </div>
    <div class="bottom">
      {{ props.description }}
      <a :href="props.link" target="_blank"><CircleHelp :size="13" /></a>
    </div>
  </div>
</template>

<style scoped>
.container {
  height: 105px;
  width: 100%;
  border: 1px solid rgba(100, 100, 100, 0.27);
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
}

.top {
  flex: 2;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(100, 100, 100, 0.27);
  padding: 0px 13px;
}

.bottom {
  font-size: small;
  flex: 1.3;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  column-gap: 6px;
  padding: 0px 13px;
}

.method-name {
  height: 33px;
  color: white;
  font-family: monospace;
  padding: 8px 14px;
  border-radius: 5px;
  background-color: #3f3636;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 6px;
}

.test {
  height: 33px;
  padding: 8px 14px;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 6px;
}
</style>
