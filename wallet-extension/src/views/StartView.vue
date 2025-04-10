<script setup lang="ts">
import { onBeforeMount, ref } from "vue";
import { randomSeedPhrase } from "@stacks/wallet-sdk";
import { useRouter } from "vue-router";

let router = useRouter();
let mnemonic = ref("");

// generate random mnemonic seed phrase
const handleGenerateSecret = async () => {
  const seedPhrase = randomSeedPhrase();
  console.log(seedPhrase);

  mnemonic.value = seedPhrase;
};

const handleAcceptSecret = () => {
  // IMPORTANT: adhere to best practices when encrypting and storing the mnemonic seed phrase

  // save secret to local storage
  // WARNING: this is not secure and should not be used in production
  localStorage.setItem("mnemonic", mnemonic.value);

  // navigate to user accounts page
  router.push({ path: "/user" });
};

const handleImportMnemonic = () => {
  const seedPhrase = prompt("Enter your mnemonic seed phrase");
  if (seedPhrase) {
    mnemonic.value = seedPhrase;
    console.log(mnemonic.value);
  }
};

onBeforeMount(() => {
  // check if user already has a mnemonic stored
  const mnemonic = localStorage.getItem("mnemonic");

  // if user has a mnemonic, navigate to user accounts page
  if (mnemonic) {
    router.push({ path: "/user" });
  }
});
</script>

<template>
  <section class="start-page">
    <div class="page-top">
      <img src="/laser-eyes-lil-guy-dark.png" width="100px" alt="laser-logo" />
      <h1>Stacks Wallet</h1>
      <div>Your Bitcoin experience, secured.</div>
    </div>

    <div class="page-bottom">
      <div class="mnemonic-container">
        <span class="mnemonic">{{ mnemonic }}</span>
        <button @click="handleGenerateSecret">Random Mnemonic</button>
        <button @click="handleImportMnemonic">Import Mnemonic</button>
        <button v-if="mnemonic" @click="handleAcceptSecret">Create Wallet</button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.mnemonic {
  font-size: 1.1rem;
  font-family: monospace;
  word-wrap: break-word;
  text-align: justify;
}

.mnemonic-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  row-gap: 13px;
}

h1 {
  font-weight: 900;
}
</style>
