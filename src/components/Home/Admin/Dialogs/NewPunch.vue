<template>
  <v-dialog v-model="_dialog" class="mx-auto custom-dialog" justify="center">
    <v-card>
      <v-toolbar color="rgba(0, 0, 0, 0)" theme="dark">
        <template v-slot:prepend>
          <v-icon class="ml-2">mdi-pencil</v-icon>
        </template>

        <v-toolbar-title class="text-h6 font-weight-bold">
          新增打卡紀錄
        </v-toolbar-title>
      </v-toolbar>

      <v-card-text>
        <v-form ref="form" @submit.prevent >
          <v-row>
            <v-col cols="12" md="6">
              <v-select label="專案名稱" v-model="newItem.project_name" :items="project_names" :rules="[rules.required]" />
            </v-col>
            <v-col cols="12" md="6">
              <v-select label="人員名稱" v-model="newItem.user_name" :items="user_names" :rules="[rules.required]" />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field label="上班打卡時間" v-model="_punch_in_time_value" readonly></v-text-field>
              <VueDatePicker v-model="newItem.punch_in_time" enable-seconds inline auto-apply hide-offset-dates
                :clearable="false" dark :max-date="newItem.punch_out_time" :month-change-on-scroll="!isMobile" />
            </v-col>
            <v-col cols="12" md="6" v-if="newItem.punch_out_time">
              <v-text-field label="下班打卡時間" v-model="_punch_out_time_value" readonly></v-text-field>
              <VueDatePicker v-model="newItem.punch_out_time" enable-seconds inline auto-apply hide-offset-dates
                :clearable="false" dark :min-date="newItem.punch_in_time" :month-change-on-scroll="!isMobile" />
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="red-lighten-1" variant="text" @click="close">
          取消
        </v-btn>
        <v-btn color="blue-darken-1" variant="text" @click="save">
          儲存
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useDisplay } from 'vuetify';
import { formattedDate } from '@/lib/misc';
import { getProjectList } from '@/lib/project';
import { getAdminUserList } from '@/lib/user';

const isMobile = computed(() => {
  const { mobile } = useDisplay();
  return mobile.value;
});

const form = ref(null);
const rules = {
  required: (v) => !!v || '必填',
};

const props = defineProps(['dialog']);
const emit = defineEmits(['update:dialog', 'update:punch', 'newItem']);

const onOpen = () => {
  newItem.value = {
    user_name: "",
    punch_in_time: new Date(),
    punch_out_time: new Date(),
    project_name: "",
  };
};
const close = () => emit('update:dialog', false);
const save = async () => {

  const formValidate = await form.value.validate();
  const isValid = formValidate.valid;

  if (!isValid) {
    return;
  }

  const user_id = to_user_id(newItem.value.user_name);
  const punch_in_time = newItem.value.punch_in_time;
  const punch_out_time = newItem.value.punch_out_time;
  const project_id = to_project_id(newItem.value.project_name);
  const punch = {
    user_id,
    punch_in_time,
    punch_out_time,
    project_id,
  };
  emit('newItem', punch);
  emit('update:dialog', false);
};

const newItem = ref({
  user_name: "",
  punch_in_time: new Date(),
  punch_out_time: new Date(),
  project_name: "",
});

const user_names = computed(() => {
  return allUsers.value.map((user) => user.name);
});

const to_user_id = (user_name) => {
  const user = allUsers.value.find((user) => user.name === user_name);
  return user.user_id;
};

const project_names = computed(() => {
  return allProjects.value.map((project) => project.project_name);
});

const to_project_id = (project_name) => {
  const project = allProjects.value.find((project) => project.project_name === project_name);
  return project.project_id;
};

const _punch_in_time_value = computed({
  get() {
    return formattedDate(newItem.value.punch_in_time);
  },
  set(value) {
    newItem.value.punch_in_time = value;
  }
});

const _punch_out_time_value = computed({
  get() {
    return formattedDate(newItem.value.punch_out_time);
  },
  set(value) {
    newItem.value.punch_out_time = value;
  }
});

const _dialog = computed({
  get() {
    if (props.dialog)
      onOpen();
    return props.dialog;
  },
  set(value) {
    emit('update:dialog', value);
  }
});

const allProjects = ref([]);

const updateProjects = async () => {
  const [result, p] = await getProjectList();
  if (result) {
    allProjects.value = p;
  } else {
    allProjects.value = [];
  }
};

const allUsers = ref([]);

const updateUsers = async () => {
  const [result, u] = await getAdminUserList();
  if (result) {
    allUsers.value = u;
  } else {
    allUsers.value = [];
  }
};

onMounted(async () => {
  await updateProjects();
  await updateUsers();
});
</script>

<style scoped>
.custom-dialog {
  width: 75%;
}

@media screen and (max-width: 960px) {
  .custom-dialog {
    width: 100%;
  }
}
</style>
