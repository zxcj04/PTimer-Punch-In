<!-- eslint-disable vue/valid-v-slot -->
<template>
  <v-main>
    <v-card>
      <v-toolbar
        color="rgba(0, 0, 0, 0)"
        theme="dark"
      >
        <template v-slot:prepend>
          <v-icon class="ml-2">mdi-list-box-outline</v-icon>
        </template>

        <v-toolbar-title class="text-h6 font-weight-bold">
          報表匯出 - 管理員
        </v-toolbar-title>
      </v-toolbar>

      <v-tabs
        v-model="tab"
        bg-color="primary"
      >
        <v-tab value="all">總報表</v-tab>
        <v-tab value="project">特定專案</v-tab>
        <v-tab value="user">特定工讀生</v-tab>
      </v-tabs>

      <v-window v-model="tab">
        <SubAll :style="windowHeight" />
        <SubProject :style="windowHeight" />
        <SubUser :style="windowHeight" />
      </v-window>
    </v-card>
  </v-main>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useDisplay } from 'vuetify';
import { useRouter } from 'vue-router';
import { checkLogin, checkAdmin, userLogout } from '@/lib/auth';

import SubAll from './ReportSub/All.vue';
import SubProject from './ReportSub/Project.vue';
import SubUser from './ReportSub/User.vue';

const isMobile = computed(() => {
  const { mobile } = useDisplay();
  return mobile.value;
});

const windowHeight = computed(() => {
  return isMobile.value? {'min-height': '100vh'}: {'min-height': '75vh'};
});

const router = useRouter();

const tab = ref('one');

const init = async () => {
  const isLogin = await checkLogin();
  if (!isLogin) {
    router.push('login');
    return;
  }

  const isAdmin = await checkAdmin();
  if (!isAdmin) {
    await userLogout();
    router.push('login');
    return;
  }
};

onMounted(init);
</script>

<style scoped>
.v-card-text {
  padding: 0;
}
</style>
