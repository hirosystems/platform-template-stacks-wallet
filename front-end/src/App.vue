<script setup lang="ts">
import { Router, WalletMinimal } from "lucide-vue-next"
import { onBeforeMount, onMounted, onUnmounted, provide, ref } from "vue"
import { isConnected } from "@stacks/connect"
import Instructions from "./components/Instructions.vue"
import ConnectMethods from "./components/ConnectMethods.vue"

let isWalletConnected = ref(false)
let checkStacksWalletInterval: number | null = null
let isStacksWalletInjected = ref(false)
let checkDevnetConnectionInterval: number | null = null
let isDevnetConnected = ref(false)

provide("isWalletConnected", isWalletConnected)

const handleDevnetConnectionStatus = async () => {
  const PLATFORM_DEVNET_STACKS_NETWORK_API_URL = `https://api.platform.hiro.so/v1/ext/${
    import.meta.env.VITE_PLATFORM_HIRO_API_KEY
  }/stacks-blockchain-api`
  const LOCAL_DEVNET_STACKS_NETWORK_API_URL = "http://localhost:3999"

  let urlToFetch =
    import.meta.env.VITE_STACKS_NETWORK === "platformdevnet"
      ? PLATFORM_DEVNET_STACKS_NETWORK_API_URL
      : LOCAL_DEVNET_STACKS_NETWORK_API_URL

  try {
    let result = await fetch(`${urlToFetch}/extended`)
    let devnetInfo = await result.json()

    if (devnetInfo.status === "ready") {
      isDevnetConnected.value = true
    }
  } catch (error) {
    isDevnetConnected.value = false
    console.log(
      "[App] Error fetching devnet status. Verify if your local or Platform hosted devnet is running.",
      error
    )
  }
}

onBeforeMount(async () => {
  checkStacksWalletInterval = window.setInterval(() => {
    // @ts-ignore
    if (window.StacksWallet.isStacksWallet) {
      isStacksWalletInjected.value = true
      clearInterval(checkStacksWalletInterval!)
      checkStacksWalletInterval = null

      if (isConnected()) {
        isWalletConnected.value = true
      } else {
        isWalletConnected.value = false
      }
    }
  }, 100)

  await handleDevnetConnectionStatus()
  checkDevnetConnectionInterval = window.setInterval(handleDevnetConnectionStatus, 30000)
})

const handleMessageFromContentScript = (event: MessageEvent) => {
  console.log("[App] Received message from wallet extension script:", event.data)
}

onMounted(() => {
  window.addEventListener("message", handleMessageFromContentScript)
})

onUnmounted(() => {
  window.removeEventListener("message", handleMessageFromContentScript)

  clearInterval(checkDevnetConnectionInterval!)
})
</script>

<template>
  <small
    ><Router :size="13" /> Devnet Status:
    <span :style="{ color: '#C2EBC4' }">{{
      isDevnetConnected ? "Connected" : "Disconnected"
    }}</span></small
  >

  <small
    ><WalletMinimal :size="13" /> Stacks Wallet Extension:
    <span :style="{ color: '#C2EBC4' }">{{
      isStacksWalletInjected ? "Enabled" : "Disabled"
    }}</span></small
  >
  <div class="main-container">
    <h2>Wallet <> App Template</h2>
    <template v-if="!isStacksWalletInjected || !isDevnetConnected">
      <Instructions />
    </template>

    <template v-else>
      <ConnectMethods />
    </template>
  </div>
</template>

<style scoped>
.main-container {
  width: 400px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  row-gap: 10px;
  margin: 10px 0px;
}
</style>
