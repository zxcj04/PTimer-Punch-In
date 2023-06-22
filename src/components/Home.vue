<template>
  <v-container
    class="mx-auto overflow-auto"
  >
    <v-app-bar>
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

    <v-main>
      <v-container>
        <v-row justify="space-around">
          <v-card width="400">
            <v-toolbar
              color="rgba(0, 0, 0, 0)"
              theme="dark"
            >
              <template v-slot:prepend>
                <v-icon>mdi-timeline-check</v-icon>
              </template>

              <v-toolbar-title class="text-h6 font-weight-bold">
                打工人，打工魂，打工都是人上人
              </v-toolbar-title>
            </v-toolbar>

            <v-card-text v-if="isPageLoading" class="text-center">
              <v-progress-circular
                indeterminate
                color="primary"
              ></v-progress-circular>
            </v-card-text>

            <v-card-text v-if="!isPageLoading">
              <v-card :color="isActive? '#015e69': '#363636'" class="py-5">
                <v-card-text>
                  <v-row>
                    <v-col cols="12">
                      <Clock></Clock>
                    </v-col>

                    <v-col cols="12" v-if="!isActive">
                      <v-btn
                        v-on:click="punchIn"
                        color="success"
                        class="mx-auto"
                        width="100%"
                        :disabled="isLoading"
                      >
                        <v-icon>mdi-clock-in</v-icon>
                        我要打卡
                      </v-btn>
                    </v-col>

                    <v-col cols="12" v-else>
                      <v-btn
                        v-on:click="punchOut"
                        color="error"
                        class="mx-auto"
                        width="100%"
                        :disabled="isLoading"
                      >
                        <v-icon>mdi-clock-out</v-icon>
                        我要下班
                      </v-btn>
                    </v-col>

                    <v-expand-transition>
                      <v-col cols="12" v-if="isLoading">
                        <v-alert>
                          <v-progress-circular
                            indeterminate
                            color="gray"
                          ></v-progress-circular>
                          正在打卡...請稍候...
                        </v-alert>
                      </v-col>
                    </v-expand-transition>
                  </v-row>
                </v-card-text>
              </v-card>

              <div class="font-weight-bold ms-1 mb-2 mt-5">
                打卡記錄
              </div>

              <v-timeline density="compact" align="start">
                <v-timeline-item
                  v-for="punch in punchs"
                  :key="punch.time"
                  :dot-color="punch.color"
                  size="x-small"
                >
                  <div class="mb-4">
                    <div class="font-weight-normal">
                      <strong>{{ punch.text }}</strong>
                    </div>
                  </div>
                  <div class="mb-4">
                    <div class="font-weight-normal">
                      {{ punch.time }}
                    </div>
                  </div>
                </v-timeline-item>
              </v-timeline>
            </v-card-text>
          </v-card>
        </v-row>
      </v-container>
    </v-main>

  </v-container>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { userLogout, checkLogin } from '@/lib/auth';
import { userInfo } from '@/lib/user';
import { userPunchIn, userPunchOut, getPunchs, getActivePunch } from '@/lib/punch';
import Clock from '@/components/Clock.vue';

const isPageLoading = ref(true);

const router = useRouter();

const user = ref({
  name: "載入中",
});

const punchs = ref([]);
const activePunch = ref(null);
const isActive = computed(() => {
  return activePunch.value !== null;
});

const isLoading = ref(false);

const punchIn = async () => {
  isLoading.value = true;
  const [result, t] = await userPunchIn();
  console.log(result, t);
  await updateActivePunch();
  await updatePunchs();
  isLoading.value = false;
};

const punchOut = async () => {
  isLoading.value = true;
  const [result, t] = await userPunchOut();
  console.log(result, t);
  await updateActivePunch();
  await updatePunchs();
  isLoading.value = false;
};

const logout = async () => {
  await userLogout();
  router.push('login');
};

const updatePunchs = async () => {
  const [result, p] = await getPunchs();
  punchs.value = p;
};

const updateActivePunch = async () => {
  const [result, p] = await getActivePunch();
  if (result) {
    activePunch.value = p;
  } else {
    activePunch.value = null;
  }
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
  }

  await updateActivePunch();
  await updatePunchs();

  isPageLoading.value = false;
});
</script>

<style scpoed>
</style>
