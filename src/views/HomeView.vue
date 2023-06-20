<script setup>
import { userLogout } from "@/lib/auth";

const logout = async () => {
  await userLogout();
  location.reload();
};
</script>

<template>
  <h1>THE PAGE</h1>
  <v-btn @click="logout">Logout</v-btn>
</template>