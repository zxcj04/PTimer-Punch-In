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
          專案資訊 - 管理員
        </v-toolbar-title>

        <template v-slot:append>
          <v-icon class="mr-2" @click="openCreateDialog">mdi-plus-box</v-icon>
          <v-icon class="mr-2" @click="init">mdi-restart</v-icon>
        </template>
      </v-toolbar>

      <v-card-text>

        <div class="custom-table-container">
          <v-data-table v-model:items-per-page="itemsPerPage" :headers="headers" :items="projects" item-value="name"
            class="elevation-1 custom-table" :loading="isLoadingProjects" loading-text="載入使用者中..." fixed-header hover>
            <template v-slot:top>
            </template>
            <template #item="{ item }">
              <tr class="v-data-table__tr">
                <td v-for="(value, key) in item.columns" :key="value"
                  :data-label="headers.filter(e => e.key === key).map(e => e.title)"
                  class="v-data-table__td v-data-table-column--align-start">
                  <template v-if="key === 'project_owner_name'">
                    <v-chip color="primary" label small variant="outlined">
                      <v-icon start icon="mdi-account-circle"></v-icon>
                      {{ value }}
                    </v-chip>
                  </template>
                  <template v-else-if="key === 'note'">
                    <v-chip color="red" label small variant="outlined" v-if="item.raw.is_delete">
                      <v-icon start icon="mdi-close-circle-outline"></v-icon>
                      已停用
                    </v-chip>
                  </template>
                  <template v-else-if="key === 'actions'">
                    <div>
                      <v-icon class="mx-1" size="small" @click="openEditDialog(item.raw)">
                        mdi-pencil
                      </v-icon>
                      <v-icon class="mx-1" v-if="!item.raw.is_delete" size="small" @click="deleteItem(item.raw)"
                        :color="isDeleteItemConfirm == item.raw.project_id ? 'red' : ''">
                        {{ isDeleteItemConfirm == item.raw.project_id ? 'mdi-check-bold' : 'mdi-delete' }}
                      </v-icon>
                      <v-icon class="mx-1" v-else size="small" @click="recoverItem(item.raw)"
                        :color="isDeleteItemConfirm == item.raw.project_id ? 'red' : ''">
                        {{ isDeleteItemConfirm == item.raw.project_id ? 'mdi-check-bold' : 'mdi-restore' }}
                      </v-icon>
                    </div>
                  </template>
                  <template v-else>{{ value }}</template>
                </td>
              </tr>
            </template>
            <template v-slot:no-data>
              <div class="text-center">
                <v-icon>mdi-alert-circle-outline</v-icon>
                沒有專案資料
              </div>
            </template>
          </v-data-table>
        </div>
      </v-card-text>
    </v-card>

    <NewProject v-model:dialog="createProps.openDialog" v-on:newItem="newItem" />
    <EditProject v-model:dialog="editProps.openDialog" v-model:project="editProps.project" v-on:editItem="editItem" />
  </v-main>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useDisplay } from 'vuetify';
import { useRouter } from 'vue-router';
import { checkLogin, checkAdmin, userLogout } from '@/lib/auth';
import { getProjectList, createProject, updateProject, recoverProject, deleteProject, } from '@/lib/project';

import NewProject from '@/components/Home/Admin/Dialogs/NewProject.vue';
import EditProject from '@/components/Home/Admin/Dialogs/EditProject.vue';

const router = useRouter();

const isMobile = computed(() => {
  const { mobile } = useDisplay();
  return mobile.value;
});

const itemsPerPage = ref(isMobile.value? -1: 10);

const headers = [
  { title: '專案名稱', key: 'project_name' },
  { title: '專案擁有者', key: 'project_owner_name' },
  { title: '描述', key: 'description' },
  { title: '備註', key: 'note' },
  { title: '操作', key: 'actions', sortable: false },
];

const createProps = ref({
  openDialog: false,
});

const openCreateDialog = () => {
  createProps.value.openDialog = true;
  createProps.value.user = null;
};

const newItem = async (item) => {
  const [result, msg] = await createProject(item);
  if (!result) {
    console.log(msg);
    return;
  }

  await updateProjects();
};

const editProps = ref({
  openDialog: false,
  project: null,
});

const editItem = async (project_id, project) => {
  await updateProject(project_id, project);

  await updateProjects();
};

const openEditDialog = async (item) => {
  editProps.value.openDialog = true;
  editProps.value.project = item;
};

const isDeleteItemConfirm = ref(null);
const deleteItem = async (item) => {
  if (isDeleteItemConfirm.value != item.project_id) {
    isDeleteItemConfirm.value = item.project_id;
    return;
  }

  await deleteProject(item.project_id);

  isDeleteItemConfirm.value = null;

  await updateProjects();
};
const recoverItem = async (item) => {
  if (isDeleteItemConfirm.value != item.project_id) {
    isDeleteItemConfirm.value = item.project_id;
    return;
  }

  await recoverProject(item.project_id);

  isDeleteItemConfirm.value = null;

  await updateProjects();
};

const projects = ref([]);
const isLoadingProjects = ref(true);

const updateProjects = async () => {
  const [result, p] = await getProjectList();
  if (result) {
    projects.value = p;
  } else {
    projects.value = [];
  }
};

const init = async () => {
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

  await updateProjects();
  isLoadingProjects.value = false;
};

onMounted(init);
</script>

<style scoped>
.v-card-text {
  padding: 0;
}
</style>
