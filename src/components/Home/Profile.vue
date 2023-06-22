<template>
  <v-main>
    Profile
  </v-main>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { checkLogin } from '@/lib/auth';

const router = useRouter();

onMounted(async () => {
  const isLogin = await checkLogin();
  if (!isLogin) {
    router.push('login');
    return;
  }
});
</script>