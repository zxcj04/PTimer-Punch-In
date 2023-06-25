<!-- eslint-disable vue/valid-v-slot -->
<template>
  <v-main class="overflow-x-auto">
    <v-data-table v-model:items-per-page="itemsPerPage" :headers="headers" :items="punchs" item-value="name"
      class="elevation-1" :loading="isLoadingPunchs" loading-text="載入打卡紀錄中..." fixed-header hover :width="100">
      <template v-slot:item.punch_in_time="{ item }">
        {{ formattedDate(item.raw.punch_in_time) }}
      </template>
      <template v-slot:item.punch_out_time="{ item }">
        {{ item.raw.punch_out_time ? formattedDate(item.raw.punch_out_time) : '尚未打卡下班' }}
      </template>
      <template v-slot:item.actions="{ item }">
        <div v-if="item.raw.editable">
          <v-icon size="small" class="me-2" @click="editItem(item.raw)">
            mdi-pencil
          </v-icon>
          <v-icon size="small" @click="deleteItem(item.raw)" :color="isDeleteItemConfirm ? 'red' : ''">
            {{ isDeleteItemConfirm ? 'mdi-check-bold' : 'mdi-delete' }}
          </v-icon>
        </div>
      </template>
    </v-data-table>
  </v-main>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router';
import { checkLogin } from '@/lib/auth';
import { getPunchs } from '@/lib/punch';

const router = useRouter();

const itemsPerPage = ref(10);

const headers = [
  { title: '專案名稱', align: 'end', key: 'project_name' },
  { title: '上班打卡時間', align: 'end', key: 'punch_in_time' },
  { title: '下班打卡時間', align: 'end', key: 'punch_out_time' },
  { title: '工作時數', align: 'end', key: 'working_hours' },
  { title: '操作', key: 'actions', sortable: false },
];

const editItem = async (item) => {
  console.log(item);

  await updatePunchs();
};

const isDeleteItemConfirm = ref(false);
const deleteItem = async (item) => {
  if (!isDeleteItemConfirm.value) {
    isDeleteItemConfirm.value = true;
    return;
  }

  console.log(item);
  isDeleteItemConfirm.value = false;

  await updatePunchs();
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

const updatePunchs = async () => {
  isLoadingPunchs.value = true;
  const [, p] = await getPunchs();
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

const formattedDate = (date) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const min = date.getMinutes();
  const sec = date.getSeconds();

  return `${year}/${month}/${day} ${hour}:${min}:${sec}`;
};

onMounted(async () => {
  const isLogin = await checkLogin();
  if (!isLogin) {
    router.push('login');
    return;
  }

  await updatePunchs();
  isLoadingPunchs.value = false;
});
</script>
