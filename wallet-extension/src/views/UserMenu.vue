<script setup lang="ts">
import { useRouter } from "vue-router";

const router = useRouter();

function handleDeleteWallet() {
  localStorage.removeItem("mnemonic");
  router.push({ path: "/" });
}

function handleUserHome() {
  router.push({ path: "/user" });
}
</script>

<template>
  <section class="start-page">
    <button @click="handleUserHome">Back to Home</button>
    <button @click="handleDeleteWallet">Delete Wallet</button>
  </section>
</template>

<style scoped></style>
