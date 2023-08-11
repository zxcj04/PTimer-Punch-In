<template>
  <v-window-item value="user" class="ma-2 mt-4" style="text-align: center">
    <v-row justify="center">
      <v-col cols="12" md="2">
        <v-autocomplete
          v-model="query.user_name"
          :items="userNames"
          label="姓名"
          density="compact"
          variant="underlined"
          clearable
          hide-details
        />
      </v-col>
      <v-col cols="12" md="6">
        <VueDatePicker v-model="query.dates" dark range multi-calendars hide-offset-dates
          time-picker-inline auto-apply :start-date="query.dates[0]" focus-start-date :clearable="false"
          menu-class-name="dp-custom-menu" :month-change-on-scroll="!isMobile" />
      </v-col>
      <v-col cols="12" md="2">
        <v-btn color="primary" @click="queryReport" block>查詢</v-btn>
      </v-col>
    </v-row>
    <v-divider class="mt-4 mb-6" />
    <v-row justify="center" v-if="query.hasResult">
      <v-col cols="12" md="6">
        <v-btn block @click="downloadReport(query.resultCsv, query.user_name)" color="green">
          <v-icon>mdi-file-excel</v-icon>
          匯出
        </v-btn>
      </v-col>
    </v-row>
    <v-row justify="center" v-if="query.hasResult">
      <CsvTable :targetCsv="query.resultCsv"/>
    </v-row>
  </v-window-item>
</template>

<script setup>
import {ref, onMounted, computed} from 'vue';
import { useDisplay } from 'vuetify';

import { getAdminUserList } from '@/lib/user';
import { getUserReport } from '@/lib/report';
import { downloadReport } from '@/lib/misc';

import CsvTable from './CsvTable.vue';

const isMobile = computed(() => {
  const { mobile } = useDisplay();
  return mobile.value;
});

const query = ref({
  user_name: null,
  dates: [new Date(), new Date()],
  hasResult: false,
  resultCsv: null,
});

const queryReport = async () => {
  if (!query.value.user_name) {

    return;
  }

  query.value.hasResult = false;

  const payload = {
    user: toUserId(query.value.user_name),
    start: query.value.dates[0],
    end: query.value.dates[1],
  }
  const [status, r] = await getUserReport(payload);
  if (!status)
    return;

  query.value.hasResult = true;
  query.value.resultCsv = r;
};

const users = ref([]);

const updateUsers = async () => {
  const [result, u] = await getAdminUserList();
  if (!result)
    return;

  users.value = u;

  if (users.value.length > 0) {
    query.value.user_name = users.value[0].name;
  }
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

const initQuery = () => {
  const now = new Date();

  const firstDayOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  firstDayOfThisMonth.setDate(firstDayOfThisMonth.getDate() - 1);

  const lastMonth = new Date(now.getFullYear(), now.getMonth(), 1); // 獲取當前月的第一天
  lastMonth.setDate(0); // 設定日期為上個月的最後一天

  const startDate = new Date(lastMonth.getFullYear(), lastMonth.getMonth(), 1, 0, 0, 0, 0); // 設定時、分、秒和毫秒為 0;
  const endDate = new Date(firstDayOfThisMonth.getFullYear(), firstDayOfThisMonth.getMonth(), firstDayOfThisMonth.getDate(), 0, 0, 0, 0);

  startDate.setHours(0, 0, 0, 0);
  endDate.setHours(23, 59, 59, 0);

  query.value.user_name = null;
  query.value.dates = [startDate, endDate];
};

onMounted(async () => {
  initQuery();
  await updateUsers();
});

</script>