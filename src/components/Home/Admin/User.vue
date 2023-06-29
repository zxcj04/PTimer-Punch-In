<!-- eslint-disable vue/valid-v-slot -->
<template>
  <v-main>
    <v-card>
      <v-toolbar color="rgba(0, 0, 0, 0)" theme="dark">
        <template v-slot:prepend>
          <v-icon class="ml-2">mdi-list-box-outline</v-icon>
        </template>

        <v-toolbar-title class="text-h6 font-weight-bold">
          帳戶資訊 - 管理員
        </v-toolbar-title>

        <template v-slot:append>
          <v-icon class="mr-2" @click="init">mdi-restart</v-icon>
        </template>
      </v-toolbar>

      <div class="custom-table-container">
        <v-data-table v-model:items-per-page="itemsPerPage" :headers="headers" :items="users" item-value="name"
          class="elevation-1 custom-table" :loading="isLoadingUsers" loading-text="載入使用者中..." fixed-header hover>
          <template v-slot:top>
          </template>
          <template v-slot:item.name="{ item }">
            <v-chip :color="item.raw.is_admin? '#FFD700': 'primary'" label small variant="outlined">
              <v-icon start :icon="item.raw.is_admin ? 'mdi-shield-crown' : 'mdi-account-circle'"></v-icon>
              {{ item.raw.name }}
            </v-chip>
          </template>
          <template v-slot:item.note="{ item }">
            <v-chip color="warning" label small variant="outlined" v-if="!item.raw.active">
              <v-icon start icon="mdi-alert"></v-icon>
              未啟用
            </v-chip>
          </template>
          <template v-slot:item.admin_actions="{ item }">
            <div>
              <v-icon class="mx-1" size="small" @click="administerUser(item.raw)" v-if="!item.raw.is_admin"
                :color="isUserAdminActionConfirm == item.raw.user_id ? 'green' : ''">
                mdi-arrow-up-bold-hexagon-outline
              </v-icon>
              <v-icon class="mx-1" size="small" @click="revokeAdminUser(item.raw)" v-else
                :color="isUserAdminActionConfirm == item.raw.user_id ? 'red' : ''">
                mdi-arrow-down-bold
              </v-icon>
            </div>
          </template>
          <template v-slot:item.actions="{ item }">
            <div>
              <v-icon class="mx-1" size="small" @click="openEditDialog(item.raw)">
                mdi-pencil
              </v-icon>
              <v-icon class="mx-1" v-if="item.raw.active" size="small" @click="inactiveUser(item.raw)"
                :color="isUserActionConfirm == item.raw.user_id ? 'red' : ''">
                {{ isUserActionConfirm == item.raw.user_id ? 'mdi-minus-box' : 'mdi-minus-box-outline' }}
              </v-icon>
              <v-icon class="mx-1" v-else size="small" @click="activeUser(item.raw)"
                :color="isUserActionConfirm == item.raw.user_id ? 'green' : ''">
                {{ isUserActionConfirm == item.raw.user_id ? 'mdi-checkbox-marked-circle' :
                  'mdi-checkbox-marked-circle-outline' }}
              </v-icon>
            </div>
          </template>
          <template v-slot:no-data>
            <div class="text-center">
              <v-icon>mdi-alert-circle-outline</v-icon>
              沒有使用者資料
            </div>
          </template>
        </v-data-table>
      </div>
    </v-card>

    <EditUser v-model:dialog="editProps.openDialog" v-model:user="editProps.user" v-on:editItem="editItem"
      :projects="projects"></EditUser>
  </v-main>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router';
import { checkLogin, checkAdmin, userLogout, administer, revokeAdmin } from '@/lib/auth';
import { getAdminUserList, adminActiveUser, adminInactiveUser, adminUpdateUser } from '@/lib/user';
import { getProjectList } from '@/lib/project';

import EditUser from '@/components/Home/Admin/EditUser.vue';

const router = useRouter();

const itemsPerPage = ref(10);

const headers = [
  { title: '姓名', align: 'center', key: 'name' },
  { title: '電子信箱', align: 'center', key: 'mail' },
  { title: '電話', align: 'center', key: 'telephone' },
  { title: 'Telegram', align: 'center', key: 'telegram' },
  { title: '備註', align: 'center', key: 'note', sortable: false },
  { title: '權限', key: 'admin_actions', sortable: false },
  { title: '操作', key: 'actions', sortable: false },
];

const editProps = ref({
  openDialog: false,
  user: null,
});

const editItem = async (user_id, user) => {
  await adminUpdateUser(user_id, user);

  await updateUsers();
};

const openEditDialog = async (item) => {
  editProps.value.openDialog = true;
  editProps.value.user = item;
};

const isUserAdminActionConfirm = ref(null);
const administerUser = async (item) => {
  if (isUserAdminActionConfirm.value != item.user_id) {
    isUserAdminActionConfirm.value = item.user_id;
    return;
  }

  await administer(item.user_id);
  isUserAdminActionConfirm.value = null;
  await updateUsers();
};

const revokeAdminUser = async (item) => {
  if (isUserAdminActionConfirm.value != item.user_id) {
    isUserAdminActionConfirm.value = item.user_id;
    return;
  }

  await revokeAdmin(item.user_id);
  isUserAdminActionConfirm.value = null;
  await updateUsers();
};

const isUserActionConfirm = ref(null);
const inactiveUser = async (item) => {
  if (isUserActionConfirm.value != item.user_id) {
    isUserActionConfirm.value = item.user_id;
    return;
  }

  await adminInactiveUser(item.user_id);

  isUserActionConfirm.value = null;

  await updateUsers();
};

const activeUser = async (item) => {
  if (isUserActionConfirm.value != item.user_id) {
    isUserActionConfirm.value = item.user_id;
    return;
  }

  await adminActiveUser(item.user_id);

  isUserActionConfirm.value = null;

  await updateUsers();
};

const users = ref([]);
const isLoadingUsers = ref(true);

const projects = ref([]);

const updateProjects = async () => {
  const [result, p] = await getProjectList();
  if (result) {
    projects.value = p;
  } else {
    projects.value = [];
  }
};

const updateUsers = async () => {
  isLoadingUsers.value = true;
  const [result, u] = await getAdminUserList();
  if (result) {
    users.value = u;
  } else {
    users.value = [];
  }
  isLoadingUsers.value = false;
};

const init = async () => {
  isLoadingUsers.value = true;
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

  isUserActionConfirm.value = null;

  await updateUsers();
  await updateProjects();
  isLoadingUsers.value = false;
};

onMounted(init);
</script>

<style scoped>
.custom-table-container {
  overflow-x: scroll;
}

.custom-table {
  min-width: 800px;
}
</style>
