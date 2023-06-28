<template>
  <v-container
    class="mx-auto overflow-auto fluid"
  >
    <v-navigation-drawer
      v-model="showNav"
    >
      <v-list>
        <v-list-item
          :prepend-icon="isAdmin? 'mdi-shield-crown': 'mdi-account-circle'"
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
        :opened="openedPanel"
      >
        <v-list-item prepend-icon="mdi-timeline-check" title="打卡" value="punch"></v-list-item>
        <v-list-item prepend-icon="mdi-list-box-outline" title="統計" value="summary"></v-list-item>
        <v-list-item prepend-icon="mdi-account" title="個人資料" value="profile"></v-list-item>
        <v-list-group value="admin" v-if="isAdmin">
          <template v-slot:activator="{ props }">
            <v-list-item
              v-bind="props"
              prepend-icon="mdi-shield-crown-outline"
              title="管理員"
            ></v-list-item>
          </template>

          <v-list-item prepend-icon="mdi-account" title="帳戶管理" value="admin-user"></v-list-item>
          <v-list-item prepend-icon="mdi-timeline-check" title="打卡管理" value="admin-punch"></v-list-item>
          <v-list-item prepend-icon="mdi-briefcase" title="專案管理" value="admin-project"></v-list-item>
        </v-list-group>
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
    <Profile v-if="selectedComponent[0]=='profile'" v-on:userUpdated="updateUserInfo" />
    <Admin v-if="selectedComponent[0]=='admin'" />

    <AdminUser v-if="selectedComponent[0]=='admin-user'" />
    <AdminPunch v-if="selectedComponent[0]=='admin-punch'" />
    <AdminProject v-if="selectedComponent[0]=='admin-project'" />

  </v-container>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { userLogout, checkLogin, checkAdmin } from '@/lib/auth';
import { userInfo } from '@/lib/user';

import PunchClock from '@/components/Home/PunchClock.vue';
import Summary from '@/components/Home/Summary.vue';
import Profile from '@/components/Home/Profile.vue';
import Admin from '@/components/Home/Admin.vue';

import AdminUser from '@/components/Home/Admin/User.vue';
import AdminPunch from '@/components/Home/Admin/Punch.vue';
import AdminProject from '@/components/Home/Admin/Project.vue';

const router = useRouter();

const user = ref({
  name: "載入中",
});

const isAdmin = ref(false);

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

const openedPanel = computed(() => {
  return [selectedComponent.value[0].split('-')[0]];
});

const updateUserInfo = async () => {
  isAdmin.value = await checkAdmin();

  const [isSuccess, result] = await userInfo();
  if (isSuccess) {
    user.value = result;
  }
};

onMounted(async () => {
  const isLogin = await checkLogin();
  if (!isLogin) {
    router.push('login');
    return;
  }

  await updateUserInfo();
});
</script>

<style scpoed>
</style>
