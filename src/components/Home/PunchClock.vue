<template>
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

          <v-card-text>
            <v-card :color="isActive? '#015e69': '#363636'" class="py-5">
              <v-card-text>
                <v-row>
                  <v-col cols="12">
                    <Clock ref="clock" />
                    <v-expand-transition>
                      <Timer ref="timer" class="mt-4" v-if="isActive" :name="activePunch.project_name" :startTime="activePunch.punch_in_time" />
                    </v-expand-transition>
                  </v-col>
                  <v-col cols="12" v-if="isPageLoading" class="text-center">
                    <v-progress-circular
                      indeterminate
                      color="primary"
                    ></v-progress-circular>
                  </v-col>
                </v-row>
                <v-row v-if="!isPageLoading">
                  <v-col cols="12" v-if="!isActive">
                    <v-expand-transition>
                      <v-item-group
                        selected-class="bg-primary"
                        v-if="isSelectingProject"
                        v-model="selectedProject"
                        mandatory
                      >
                        <v-row dense>
                          <v-col cols="12" v-for="p in projects" :key="p.project_id">
                            <v-item v-slot="{ isSelected, selectedClass, toggle }" :value="p.project_id">
                              <v-card
                                :class="['d-flex align-center', selectedClass]"
                                dark
                                height="50"
                                @click="toggle"
                              >
                                <v-card-text>
                                  {{ p.project_name }}
                                  <v-icon v-if="isSelected">mdi-check</v-icon>
                                </v-card-text>
                              </v-card>
                            </v-item>
                          </v-col>
                        </v-row>
                      </v-item-group>
                    </v-expand-transition>
                    <v-btn
                      v-on:click="punchInProcess"
                      :color="isSelectingProject? 'green': 'primary'"
                      class="mx-auto mt-3"
                      width="100%"
                      :disabled="isLoading || (isSelectingProject && !selectedProject)"
                    >
                      <v-icon>mdi-clock-in</v-icon>
                      {{ isSelectingProject? '確認打卡': '我要打卡'}}
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
              近期打卡記錄
            </div>

            <v-timeline density="compact">
              <v-timeline-item
                v-for="punch in punchs"
                :key="punch.time"
                :dot-color="punch.color"
                size="x-small"
                width="100%"
              >
                <v-alert color="#3b3b3b">
                  <v-chip
                    class="mr-5 mb-1"
                    :color="punch.color"
                    label
                    small
                  >
                    {{ punch.text }}
                  </v-chip>
                  <strong>{{ punch.project_name }}</strong>
                  <div>{{ punch.time }}</div>
                </v-alert>
              </v-timeline-item>
            </v-timeline>
          </v-card-text>
        </v-card>
      </v-row>
    </v-container>
  </v-main>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from 'vue';
import { useRouter } from 'vue-router';
import { checkLogin } from '@/lib/auth';
import { userPunchIn, userPunchOut, getPunchs, getActivePunch } from '@/lib/punch';
import { getProjectList } from '@/lib/project';

import Clock from '@/components/Home/Clock.vue';
import Timer from '@/components/Home/Timer.vue';

const isPageLoading = ref(true);

const router = useRouter();

const punchs = ref([]);
const activePunch = ref(null);
const isActive = computed(() => {
  return activePunch.value !== null;
});

const projects = ref([]);
const isSelectingProject = ref(false);
const selectedProject = ref('');

const isLoading = ref(false);

const autoUpdatePunchTask = ref(null);

const clock = ref(null);
const timer = ref(null);
const updateClockTask = ref(null);

const punchIn = async () => {
  isLoading.value = true;
  const [result, t] = await userPunchIn(selectedProject.value);
  console.log(result, t);
  await updateAllPunchs();
  isLoading.value = false;
  isSelectingProject.value = false;
};

const punchInProcess = async () => {
  if (isSelectingProject.value) {
    punchIn();
    return;
  }

  isSelectingProject.value = true;
};

const punchOut = async () => {
  isLoading.value = true;
  const [result, t] = await userPunchOut();
  console.log(result, t);
  await updateAllPunchs();
  isLoading.value = false;
};

const updatePunchs = async () => {
  const [, p] = await getPunchs();
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

const updateAllPunchs = () => {
  return Promise.all([updateActivePunch(), updatePunchs()]);
};

const updateProjects = async () => {
  const [result, p] = await getProjectList();
  if (result) {
    projects.value = p;
  } else {
    projects.value = [];
  }
};

const updateClockTime = () => {
  if (clock.value) {
    clock.value.updateTime();
  }
  if (timer.value) {
    timer.value.updateTime();
  }
};

onMounted(async () => {
  const isLogin = await checkLogin();
  if (!isLogin) {
    router.push('login');
    return;
  }

  updateClockTask.value = setInterval(updateClockTime, 200);

  await updateAllPunchs();
  await updateProjects();

  isPageLoading.value = false;

  autoUpdatePunchTask.value = setInterval(async () => {
    await updateAllPunchs();
  }, 2500);
});

onBeforeUnmount(() => {
  if (autoUpdatePunchTask.value !== null) {
    clearInterval(autoUpdatePunchTask.value);
  }
  if (updateClockTask.value !== null) {
    clearInterval(updateClockTask.value);
  }
});
</script>
