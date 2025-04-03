<script setup lang="ts">
import { RouterView } from "vue-router";
import { onBeforeMount, ref } from "vue";
import Confirmation from "./components/Confirmation.vue";
import type { JsonRpcRequest } from "@/utils/types";

let payload = ref<JsonRpcRequest>();
let tabId = ref<string>("");

// Checking if popup was opened from a webpage with a payload, or via the extension icon.
// The `tabId` and `payload` are passed as query params from the openPopupConfirmation function of background.js.
onBeforeMount(() => {
  const capturedSearchParams = new URLSearchParams(document.location.search);

  if (capturedSearchParams.size > 0) {
    let tabIdString = capturedSearchParams.get("tabId") || "0";
    let payloadObject = JSON.parse(decodeURIComponent(capturedSearchParams.get("payload") || ""));

    payload.value = payloadObject;
    tabId.value = tabIdString;
  }
});
</script>

<template>
  <!-- if payload is present in the search params, show the Confirmation component -->
  <div v-if="payload">
    <Confirmation :payload="payload" :tabId="tabId" />
  </div>
  <!-- else the RouterView component will handle the viewing of the normal wallet extension views -->
  <div style="height: 100%" v-else>
    <RouterView />
  </div>
</template>

<style scoped></style>
