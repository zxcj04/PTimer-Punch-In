<template>
  <v-dialog v-model="_dialog" class="mx-auto custom-dialog" justify="center" persistent>
    <v-card>
      <v-toolbar color="rgba(0, 0, 0, 0)" theme="dark">
        <template v-slot:prepend>
          <v-icon class="ml-2">mdi-pencil</v-icon>
        </template>

        <v-toolbar-title class="text-h6 font-weight-bold">
          編輯使用者
        </v-toolbar-title>
      </v-toolbar>

      <v-card-text>
        <v-row>
          <v-col cols="12" md="3" sm="6">
            <v-text-field label="姓名" v-model="editedItem.name"></v-text-field>
          </v-col>
          <v-col cols="12" md="3" sm="6">
            <v-text-field label="電子信箱" v-model="editedItem.mail" disabled></v-text-field>
          </v-col>
          <v-col cols="12" md="3" sm="6">
            <v-text-field label="電話" v-model="editedItem.telephone"></v-text-field>
          </v-col>
          <v-col cols="12" md="3" sm="6">
            <v-text-field label="Telegram" v-model="editedItem.telegram"></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <v-select
              v-model="selectedProjectNames"
              label="可用專案"
              :items="project_names"
              multiple
            >
              <template v-slot:prepend-item>
                <v-list-item
                  title="Select All"
                  @click="toggleSelectAll"
                >
                  <template v-slot:prepend>
                    <v-checkbox-btn
                      :color="isSelectSome ? 'primary' : undefined"
                      :indeterminate="isSelectSome && !isSelectAll"
                      :model-value="isSelectAll"
                    ></v-checkbox-btn>
                  </template>
                </v-list-item>

                <v-divider class="mt-2"></v-divider>
              </template>
            </v-select>
          </v-col>
        </v-row>
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
import { getProjectList } from '@/lib/project';

const props = defineProps(['dialog', 'user', 'projects']);
const emit = defineEmits(['update:dialog', 'update:user', 'editItem']);

const selectedProjectNames = ref([]);
const isSelectAll = computed(() => selectedProjectNames.value.length === project_names.value.length);
const isSelectSome = computed(() => selectedProjectNames.value.length > 0 && !isSelectAll.value);
const toggleSelectAll = () => {
  if (isSelectAll.value)
    selectedProjectNames.value = [];
  else
    selectedProjectNames.value = project_names.value.slice();
};

const onOpen = () => {
  editedItem.value.active = _user.value.active;
  editedItem.value.mail = _user.value.mail;
  editedItem.value.name = _user.value.name;
  editedItem.value.projects = _user.value.projects;
  editedItem.value.telephone = _user.value.telephone;
  editedItem.value.telegram = _user.value.telegram;
  editedItem.value.user_id = _user.value.user_id;

  selectedProjectNames.value = to_project_names(_user.value.projects.slice());
};
const close = () => emit('update:dialog', false);
const save = () => {
  editedItem.value.projects = to_project_ids(selectedProjectNames.value.slice());
  emit('editItem', editedItem.value.user_id, editedItem.value);
  emit('update:dialog', false);
};

const editedItem = ref({
  active: false,
  mail: '',
  name: '',
  projects: [],
  telephone: '',
  user_id: '',
});

const project_names = computed(() => {
  return allProjects.value.map((project) => project.project_name);
});

const to_project_ids = (project_names) => {
  return allProjects.value.filter((project) => project_names.includes(project.project_name)).map((project) => project.project_id);
};

const to_project_names = (project_ids) => {
  return allProjects.value.filter((project) => project_ids.includes(project.project_id)).map((project) => project.project_name);
};

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

const _user = computed({
  get() {
    return props.user;
  },
  set(value) {
    emit('update:user', value);
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

onMounted(async () => {
  await updateProjects();
});
</script>

<style scoped>
</style>
