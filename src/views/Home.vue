<script setup>
import apis from '@/apis/auth';
import { useCookies } from "vue3-cookies";

const login = async () => {
  const { data } = await apis.userLogin({
    mail: "acl",
    password: "acl"
  });
  console.log(data);
  const session_id = data.session_id;

  const { cookies } = useCookies();

  cookies.set("session_id", session_id);
}
</script>

<template>
  <h1>THE PAGE</h1>
  <v-btn @click="login">Login</v-btn>
</template>