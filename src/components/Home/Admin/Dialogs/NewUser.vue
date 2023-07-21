<template>
  <v-dialog v-model="_dialog" class="mx-auto custom-dialog" justify="center">
    <v-card>
      <v-toolbar color="rgba(0, 0, 0, 0)" theme="dark">
        <template v-slot:prepend>
          <v-icon class="ml-2">mdi-pencil</v-icon>
        </template>

        <v-toolbar-title class="text-h6 font-weight-bold">
          新增使用者
        </v-toolbar-title>
      </v-toolbar>

      <v-card-text>
        <v-form ref="form" @submit.prevent validate-on="lazy">
          <v-row>
            <v-col cols="12" md="3" sm="6">
              <v-text-field label="姓名" v-model="newItem.name" :rules="[rules.required]" hint="必填"
                persistent-hint></v-text-field>
            </v-col>
            <v-col cols="12" md="3" sm="6">
              <v-text-field label="電子信箱" v-model="newItem.mail" :rules="[rules.required]" hint="必填"
                persistent-hint></v-text-field>
            </v-col>
            <v-col cols="12" md="3" sm="6">
              <v-text-field label="電話" v-model="newItem.telephone"></v-text-field>
            </v-col>
            <v-col cols="12" md="3" sm="6">
              <v-text-field label="Telegram" v-model="newItem.telegram"></v-text-field>
            </v-col>
            <v-col cols="12" md="3" sm="6">
              <v-text-field label="密碼" type="password" v-model="newItem.password" validate-on="submit"
                :rules="[rules.required, rules.same_as_confirm]" hint="必填" persistent-hint></v-text-field>
            </v-col>
            <v-col cols="12" md="3" sm="6">
              <v-text-field label="確認密碼" type="password" v-model="newItem.password_confirm" validate-on="submit"
                :rules="[rules.required, rules.same_as_password]" hint="必填" persistent-hint></v-text-field>
            </v-col>
            <v-col cols="12" md="3" sm="6">
              <v-checkbox color="primary" label="啟用" v-model="newItem.active"></v-checkbox>
            </v-col>
          </v-row>
        </v-form>
        <v-row>
          <v-col cols="12">
            <v-select v-model="selectedProjectNames" label="可用專案" :items="project_names" multiple>
              <template v-slot:prepend-item>
                <v-list-item title="Select All" @click="toggleSelectAll">
                  <template v-slot:prepend>
                    <v-checkbox-btn :color="isSelectSome ? 'primary' : undefined"
                      :indeterminate="isSelectSome && !isSelectAll" :model-value="isSelectAll"></v-checkbox-btn>
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
const emit = defineEmits(['update:dialog', 'update:user', 'newItem']);

const selectedProjectNames = ref([]);
const isSelectAll = computed(() => selectedProjectNames.value.length === project_names.value.length);
const isSelectSome = computed(() => selectedProjectNames.value.length > 0 && !isSelectAll.value);
const toggleSelectAll = () => {
  if (isSelectAll.value)
    selectedProjectNames.value = [];
  else
    selectedProjectNames.value = project_names.value.slice();
};

const close = () => emit('update:dialog', false);
const save = async () => {
  const formValidate = await form.value.validate();
  const isValid = formValidate.valid;

  if (!isValid) {
    return;
  }

  newItem.value.projects = to_project_ids(selectedProjectNames.value.slice());
  emit('newItem', newItem.value);
  emit('update:dialog', false);
};

const newItem = ref({
  active: false,
  mail: '',
  name: '',
  projects: [],
  telephone: '',
  user_id: '',
  password: '',
  password_confirm: '',
});

const form = ref(null);
const rules = {
  required: (v) => !!v || '必填',
  same_as_password: (v) => v === newItem.value.password || '與新密碼不符',
  same_as_confirm: (v) => v === newItem.value.password_confirm || '與確認密碼不符',
};

const project_names = computed(() => {
  return allProjects.value.map((project) => project.project_name);
});

const to_project_ids = (project_names) => {
  return allProjects.value.filter((project) => project_names.includes(project.project_name)).map((project) => project.project_id);
};

const _dialog = computed({
  get() {
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

onMounted(async () => {
  await updateProjects();

  newItem.value = {
    active: false,
    mail: '',
    name: '',
    projects: [],
    telephone: '',
    user_id: '',
    password: '',
    password_confirm: '',
  };
});
</script>

<style scoped></style>
