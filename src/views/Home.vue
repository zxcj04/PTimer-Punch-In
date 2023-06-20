<script setup>
import apis from '@/apis/auth';

const login = async () => {
  const { data } = await apis.userLogin();
  console.log(data)
}
</script>

<template>
  <h1>THE PAGE</h1>
  <v-btn @click="login">Login</v-btn>
</template>