<template>
  <v-window-item value="project" class="ma-2 mt-4" style="text-align: center">
    <v-row justify="center">
      <v-col cols="12" md="6">
        <VueDatePicker v-model="query.dates" dark range multi-calendars hide-offset-dates
          time-picker-inline auto-apply :start-date="query.dates[0]" focus-start-date :clearable="false"
          menu-class-name="dp-custom-menu" :month-change-on-scroll="!isMobile" />
      </v-col>
      <v-col cols="12" md="2">
        <v-btn color="primary" @click="queryReport" block>查詢</v-btn>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col cols="12" md="6">
        <v-select
          v-model="query.project"
          :items="project_names"
          label="專案"
          dense
          outlined
        ></v-select>
      </v-col>
    </v-row>
    <v-divider class="mt-4 mb-6" />
    <v-row justify="center" v-if="query.hasResult">
      <v-col cols="12" md="6">
        <v-btn block @click="downloadReport(query.resultCsv, query.project)" color="green">
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

import { getProjectReport } from '@/lib/report';
import { getProjectList } from '@/lib/project';
import { downloadReport } from '@/lib/misc';

import CsvTable from './CsvTable.vue';

const isMobile = computed(() => {
  const { mobile } = useDisplay();
  return mobile.value;
});

const query = ref({
  project: null,
  dates: [new Date(), new Date()],
  hasResult: false,
  resultCsv: null,
});

const queryReport = async () => {
  query.value.hasResult = false;

  const payload = {
    project: to_project_id(query.value.project),
    start: query.value.dates[0],
    end: query.value.dates[1],
  }
  const [status, r] = await getProjectReport(payload);
  if (!status)
    return;

  query.value.hasResult = true;
  query.value.resultCsv = r;
};

const projects = ref([]);

const project_names = computed(() => {
  return projects.value.map((project) => project.project_name);
});

const to_project_id = (project_name) => {
  const project = projects.value.find((project) => project.project_name === project_name);
  return project.project_id;
};

const updateProjects = async () => {
  const [result, p] = await getProjectList();
  if (result) {
    projects.value = p;
  } else {
    projects.value = [];
  }

  if (projects.value.length > 0) {
    query.value.project = projects.value[0].project_name;
  }
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
  await updateProjects();
});

</script>