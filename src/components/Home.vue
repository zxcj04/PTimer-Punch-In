<template>
  <v-container
    class="mx-auto overflow-auto"
  >
    <v-navigation-drawer
      v-model="showNav"
    >
      <v-list>
        <v-list-item
          :prepend-avatar="user.avatar"
          :title="user.name"
        ></v-list-item>
      </v-list>
      <v-divider />
      <v-list
        v-model:selected="selectedComponent"
        nav
        @click:select="onClickNav"
        color="primary"
        mandatory
      >
        <v-list-item prepend-icon="mdi-timeline-check" title="打卡" value="punch"></v-list-item>
        <v-list-item prepend-icon="mdi-list-box-outline" title="統計" value="summary"></v-list-item>
        <v-list-item prepend-icon="mdi-account" title="個人資料" value="profile"></v-list-item>
        <v-list-item prepend-icon="mdi-shield-crown-outline" title="管理員" value="admin"></v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar>
      <template v-slot:prepend>
        <v-btn v-on:click="showNav = !showNav" icon="$menu" />
      </template>

      <v-toolbar-title class="text-h6 text-md-h6">
        <span class="font-weight-bold">工讀生打卡系統</span>
      </v-toolbar-title>

      <template v-slot:append>
        <v-btn
          v-on:click="logout"
        >
          <v-icon>mdi-logout</v-icon>
          登出
        </v-btn>
      </template>
    </v-app-bar>

    <PunchClock v-if="selectedComponent[0]=='punch'" />
    <Summary v-if="selectedComponent[0]=='summary'" />
    <Profile v-if="selectedComponent[0]=='profile'" />
    <Admin v-if="selectedComponent[0]=='admin'" />

  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { userLogout, checkLogin } from '@/lib/auth';
import { userInfo } from '@/lib/user';

import PunchClock from '@/components/Home/PunchClock.vue';
import Summary from '@/components/Home/Summary.vue';
import Profile from '@/components/Home/Profile.vue';
import Admin from '@/components/Home/Admin.vue';

const router = useRouter();

const user = ref({
  name: "載入中",
  avatar: "https://randomuser.me/api/portraits/men/78.jpg"
});

const selectedComponent = ref(["punch"]);
const showNav = ref(false);

const logout = async () => {
  await userLogout();
  router.push('login');
};

const onClickNav = (e) => {
  const value = e.value;
  selectedComponent.value = [value];
  showNav.value = false;
};

onMounted(async () => {
  const isLogin = await checkLogin();
  if (!isLogin) {
    router.push('login');
    return;
  }

  const [isSuccess, result] = await userInfo();
  if (isSuccess) {
    user.value = result;
    user.value.avatar = "https://randomuser.me/api/portraits/men/78.jpg";
  }
});
</script>

<style scpoed>
</style>
