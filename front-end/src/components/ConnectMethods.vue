<script setup lang="ts">
import { inject, type Ref } from "vue"
import { connect, disconnect, getLocalStorage, isConnected, request } from "@stacks/connect"
import Button from "./ui/Button.vue"

let isWalletConnected = inject("isWalletConnected") as Ref<boolean>

async function handleSignMessage() {
  // OPTIONAL: directly call the provider:
  // const response = await window.StacksWallet.request("stx_signMessage", {
  //   message: "Stacks Wallet rocks!"
  // })

  const response = await request("stx_signMessage", {
    message: "Stacks Wallet rocks!"
  })
}

async function handleConnect() {
  const authRequest = await connect({
    enableLocalStorage: true
  })

  if (authRequest) {
    isWalletConnected.value = true
  }
}

function handleGetLocalStorage() {
  const response = getLocalStorage()

  if (response) {
    console.log(response)
  } else {
    console.log("No wallet data found in local storage.")
  }
}

function handleIsConnected() {
  const response = isConnected()
  console.log(response)
}

async function handleCallContract() {
  const response = await request("stx_callContract", {
    // default contract address from devnet
    contract: "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.counter",
    functionName: "increment",
    functionArgs: [],
    network: "devnet"
  })
}

function handleDisconnect() {
  disconnect()
  isWalletConnected.value = false
}

function handleConsoleLog() {
  console.log("Available WBIP Providers:")
  // @ts-ignore
  console.log(window.wbip_providers!)
}

let methodsArray = [
  {
    name: "isConnected",
    description: "Checks if wallet is connected to app",
    function: handleIsConnected,
    link: "https://docs.hiro.so/stacks/connect/guides/authenticate-users#manage-authentication-state"
  },
  {
    name: "getLocalStorage",
    description: "Retrieves accounts stored in local storage",
    function: handleGetLocalStorage,
    link: "https://docs.hiro.so/stacks/connect/guides/authenticate-users#access-user-data"
  },
  {
    name: "stx_signMessage",
    description: "Signs a message with wallet account's private key",
    function: handleSignMessage,
    link: "https://docs.hiro.so/stacks/connect/guides/sign-messages#sign-messages"
  },
  {
    name: "stx_callContract",
    description: "Calls `.counter` contract's `increment` function",
    function: handleCallContract,
    link: "https://docs.hiro.so/stacks/connect/guides/broadcast-transactions#sign-and-broadcast-transactions"
  },
  {
    name: "disconnect",
    description: "Disconnects wallet from app",
    function: handleDisconnect,
    link: "https://docs.hiro.so/stacks/connect/guides/authenticate-users#manage-authentication-state"
  }
]
</script>

<template>
  <template v-if="!isWalletConnected">
    <p>
      - Awesome! the Stacks wallet extension is enabled and has registered its
      <code
        ><a
          href="https://github.com/hirosystems/connect#wallet-implementation-guide"
          target="_blank"
          class="inline-link"
          >`StacksWallet`</a
        ></code
      >
      object provider to the global <code>`window`</code> object of this page.
    </p>
    <p>
      - Click <span class="inline-link" @click="handleConsoleLog">here</span> and check the
      browser console to see Stacks Wallet as an available
      <a href="https://wbips.netlify.app/" target="_blank" class="inline-link">WBIP Provider</a
      >.
    </p>
    <p>
      - Click the Stacks Wallet extension icon in the browser toolbar to open the extension
      popup and create a new wallet or import an existing 24 mnemonic word seed phrase. Best if
      you import one of the pre-funded wallets provided in the <code>Devnet.toml</code> file of
      your Clarinet project directory.
    </p>
    <p>
      - Go ahead and click 'connect' below to see Stacks Wallet appear as an option in the
      @stacks/connect modal UI.
    </p>
    <br />
    <button @click="handleConnect" v-if="!isWalletConnected">connect</button>
  </template>
  <template v-else>
    <p>
      - Your Stacks Wallet extension is now connected with this app. Go ahead and interact with
      it using the below @stacks/connect methods.
    </p>
    <p>
      - Be sure to have deployed your contracts to the Platform
      <a
        href="https://docs.hiro.so/stacks/platform/guides/devnet"
        target="_blank"
        class="inline-link"
        >hosted</a
      >
      devnet in order to interact with <code>`stx_callContract`</code>.
    </p>
    <p>- Open up browser console to see responses.</p>
    <br />
    <Button
      v-for="(method, index) in methodsArray"
      :method="method.name"
      :description="method.description"
      :function="method.function"
      :link="method.link"
      :key="index"
    />
  </template>
</template>

<style scoped></style>
