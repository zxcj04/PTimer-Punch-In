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
          打卡記錄 - 管理員
        </v-toolbar-title>

        <template v-slot:append>
          <v-icon class="mr-2" @click="init">mdi-restart</v-icon>
        </template>
      </v-toolbar>

      <v-card-text>
        <v-form v-model="query.valid">
          <v-row justify="center" style="text-align: center">
            <v-col cols="12" md="2">
              <v-autocomplete
                v-model="query.user_name"
                :items="userNames"
                label="員工"
                density="compact"
                variant="underlined"
                :hint="query.user_name? '': '留空以顯示全部'"
                persistent-hint
                clearable
                menu-icon=""
              />
            </v-col>
            <v-col cols="12" md="6">
              <VueDatePicker v-model="query.dates" dark range multi-calendars hide-offset-dates
                time-picker-inline auto-apply :start-date="query.dates[0]" focus-start-date :clearable="false"
                menu-class-name="dp-custom-menu" />
            </v-col>
            <v-col cols="12" md="2">
              <v-btn color="primary" @click="queryPunches" block>查詢</v-btn>
            </v-col>
          </v-row>
          <v-row justify="center">
            <v-expand-transition>
              <v-col cols="12" md="10" v-if="query.hasResult">
                <v-alert type="success" title="查詢區間工作時數" :text="query.result" />
              </v-col>
            </v-expand-transition>
          </v-row>
        </v-form>
      </v-card-text>

      <div class="custom-table-container">
        <v-data-table v-model:items-per-page="itemsPerPage" :headers="headers" :items="punchs" item-value="name"
          class="elevation-1 custom-table" :loading="isLoadingPunchs" loading-text="載入打卡紀錄中..." fixed-header hover
          style="min-height: 50vh;">
          <template v-slot:top>
          </template>
          <template v-slot:item.user_name="{ item }">
            <v-chip
              color="primary"
              label
              small
              variant="outlined"
            >
              <v-icon start icon="mdi-account-circle-outline"></v-icon>
              {{ item.raw.user_name }}
            </v-chip>
          </template>
          <template v-slot:item.punch_in_time="{ item }">
            {{ formattedDate(item.raw.punch_in_time) }}
          </template>
          <template v-slot:item.punch_out_time="{ item }">
            {{ item.raw.punch_out_time ? formattedDate(item.raw.punch_out_time) : '尚未打卡下班' }}
          </template>
          <template v-slot:item.note="{ item }">
            <v-chip
              color="red"
              label
              small
              variant="outlined"
              v-if="item.raw.is_delete"
            >
              <v-icon start icon="mdi-close-circle-outline"></v-icon>
              已刪除
            </v-chip>
          </template>
          <template v-slot:item.actions="{ item }">
            <div>
              <v-icon size="small" @click="openEditDialog(item.raw)">
                mdi-pencil
              </v-icon>
              <v-icon v-if="!item.raw.is_delete" size="small" @click="deleteItem(item.raw)" :color="isDeleteItemConfirm == item.raw.punch_id ? 'red' : ''">
                {{ isDeleteItemConfirm == item.raw.punch_id ? 'mdi-check-bold' : 'mdi-delete' }}
              </v-icon>
              <v-icon v-else size="small" @click="recoverItem(item.raw)" :color="isDeleteItemConfirm == item.raw.punch_id ? 'red' : ''">
                {{ isDeleteItemConfirm == item.raw.punch_id ? 'mdi-check-bold' : 'mdi-restore' }}
              </v-icon>
              <v-tooltip location="bottom" text="因為搜尋區間不完整，所以此筆紀錄的工作時數只計算了搜尋區間內的部分。">
                <template v-slot:activator="{ props }">
                  <v-icon v-bind="props" v-if="showCutWorkingHourAlert(item.raw)">mdi-alert</v-icon>
                </template>
              </v-tooltip>
            </div>
          </template>
          <template v-slot:no-data>
            <div class="text-center">
              <v-icon>mdi-alert-circle-outline</v-icon>
              此區間內無打卡紀錄
            </div>
          </template>
        </v-data-table>
      </div>
    </v-card>

    <EditPunch v-model:dialog="editProps.openDialog" v-model:punch="editProps.punch" v-on:editItem="editItem" :projects="projects"></EditPunch>
  </v-main>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router';
import { checkLogin, checkAdmin, userLogout } from '@/lib/auth';
import { getAdminUserList } from '@/lib/user';
import { getAdminAllPunchs, getAdminAllPunchsByDates, updatePunch, adminRecoverPunch, deletePunch } from '@/lib/punch';
import { getProjectList } from '@/lib/project';
import { formattedDate } from '@/lib/misc';

import EditPunch from '@/components/Home/EditPunch.vue';

const router = useRouter();

const itemsPerPage = ref(10);

const headers = [
  { title: '員工姓名', align: 'center', key: 'user_name' },
  { title: '專案名稱', align: 'end', key: 'project_name' },
  { title: '上班打卡時間', align: 'end', key: 'punch_in_time' },
  { title: '下班打卡時間', align: 'end', key: 'punch_out_time' },
  { title: '工作時數', align: 'end', key: 'working_hours' },
  { title: '備註', align: 'center', key: 'note', sortable: false },
  { title: '操作', key: 'actions', sortable: false },
];

const query = ref({
  user_name: null,
  dates: [new Date(), new Date()],
  hasResult: false,
  result: null,
  resultDates: [new Date(), new Date()],
});

const initQuery = () => {
  const startDate = new Date();
  const endDate = new Date();

  startDate.setHours(0, 0, 0, 0);
  endDate.setHours(23, 59, 59, 0);

  query.value.user_name = null;
  query.value.dates = [startDate, endDate];
};

const queryPunches = async () => {
  query.value.hasResult = false;

  await updatePunchs(query.value.user_name, query.value.dates);

  const startDate = query.value.dates[0];
  const endDate = query.value.dates[1];

  let totalWorkingHours = 0;
  totalWorkingHours = punchs.value.reduce((acc, cur) => {
    if (cur.working_timer && !cur.is_delete)
      acc += cur.working_timer;
    return acc;
  }, 0);
  totalWorkingHours = toHoursAndMinutes(totalWorkingHours);

  query.value.hasResult = punchs.value.length > 0;
  const namePrefix = query.value.user_name ? `${query.value.user_name} 在 ` : '所有人在 ';
  query.value.result = `${namePrefix}${formattedDate(startDate)} 到 ${formattedDate(endDate)} 共工作了 ${totalWorkingHours.h} 小時, ${totalWorkingHours.m} 分鐘, ${totalWorkingHours.s} 秒`;
  query.value.resultDates = [startDate, endDate];
};

const showCutWorkingHourAlert = (item) => {
  if (!query.value.hasResult)
    return false;

  let ret = false;
  if (item.punch_in_time < query.value.resultDates[0])
    ret = true;
  if (item.punch_out_time && item.punch_out_time > query.value.resultDates[1])
    ret = true;
  return ret;
};

const editProps = ref({
  openDialog: false,
  punch: null,
});

const editItem = async (punch_id, punch) => {
  await updatePunch(punch_id, punch);

  await updatePunchs();
};

const openEditDialog = async (item) => {
  editProps.value.openDialog = true;
  editProps.value.punch = item;
};

const isDeleteItemConfirm = ref(null);
const deleteItem = async (item) => {
  if (isDeleteItemConfirm.value != item.punch_id) {
    isDeleteItemConfirm.value = item.punch_id;
    return;
  }

  await deletePunch(item.punch_id);

  isDeleteItemConfirm.value = null;

  await updatePunchs();
};
const recoverItem = async (item) => {
  if (isDeleteItemConfirm.value != item.punch_id) {
    isDeleteItemConfirm.value = item.punch_id;
    return;
  }

  await adminRecoverPunch(item.punch_id);

  isDeleteItemConfirm.value = null;

  await updatePunchs();
};

const users = ref([]);

const updateUsers = async () => {
  const [result, u] = await getAdminUserList();
  if (!result)
    return;

  users.value = u;
};

const userNames = computed(() => {
  return users.value.map((u) => {
    return u.name;
  });
});

const toUserId = (name) => {
  const user = users.value.find((u) => {
    return u.name == name;
  });
  if (!user)
    return null;
  return user.user_id;
};

const punchs = ref([]);
const isLoadingPunchs = ref(true);

const toHoursAndMinutes = (totalSeconds) => {
  const totalMinutes = Math.floor(totalSeconds / 60);

  let sec = totalSeconds % 60;
  let hr = Math.floor(totalMinutes / 60);
  let min = totalMinutes % 60;

  hr = (hr < 10) ? "0" + hr : hr;
  min = (min < 10) ? "0" + min : min;
  sec = (sec < 10) ? "0" + sec : sec;

  return { h: hr, m: min, s: sec };
}

const projects = ref([]);

const updateProjects = async () => {
  const [result, p] = await getProjectList();
  if (result) {
    projects.value = p;
  } else {
    projects.value = [];
  }
};

const updatePunchs = async (user_name = null, dates = null) => {
  if (query.value.hasResult) {
    user_name = query.value.user_name;
    dates = query.value.dates;
  }
  isLoadingPunchs.value = true;
  let p;
  if (user_name === null && dates === null) {
    const [, tmp] = await getAdminAllPunchs();
    p = tmp;
  } else {
    const user_id = toUserId(query.value.user_name);
    const [, tmp] = await getAdminAllPunchsByDates({
      user_id: user_id,
      start: dates[0],
      end: dates[1],
    });
    p = tmp;
  }
  punchs.value = p.map((punch) => {
    punch.punch_in_time = new Date(punch.punch_in_time);
    if (punch.punch_out_time) {
      punch.punch_out_time = new Date(punch.punch_out_time);
      const timer = toHoursAndMinutes(punch.working_timer);
      punch.working_hours = `${timer.h}小時 ${timer.m}分鐘 ${timer.s}秒`;
    }
    return punch;
  });

  isLoadingPunchs.value = false;
};

const init = async () => {
  isLoadingPunchs.value = true;
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

  isDeleteItemConfirm.value = null;

  initQuery();
  query.value.hasResult = false;

  await updatePunchs();
  await updateProjects();
  await updateUsers();
  isLoadingPunchs.value = false;
};

onMounted(init);
</script>

<style scoped>
.custom-table-container {
  overflow-x: scroll;
}

.custom-table {
  min-width: 1100px;
}
</style>
