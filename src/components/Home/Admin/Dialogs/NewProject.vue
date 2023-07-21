<template>
  <v-dialog v-model="_dialog" class="mx-auto custom-dialog" justify="center">
    <v-card>
      <v-toolbar color="rgba(0, 0, 0, 0)" theme="dark">
        <template v-slot:prepend>
          <v-icon class="ml-2">mdi-pencil</v-icon>
        </template>

        <v-toolbar-title class="text-h6 font-weight-bold">
          新增專案
        </v-toolbar-title>
      </v-toolbar>

      <v-card-text>
        <v-form ref="form" @submit.prevent validate-on="lazy">
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field label="專案名稱" v-model="newItem.project_name" :rules="[rules.required]" hint="必填"
                persistent-hint></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-select label="專案擁有者" v-model="selectedUserName" :items=userNames :rules="[rules.required]" hint="必填"
                persistent-hint></v-select>
            </v-col>
            <v-col cols="12">
              <v-text-field label="專案描述" v-model="newItem.description" :rules="[rules.required]" hint="必填"
                persistent-hint></v-text-field>
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
import { getAdminUserList } from '@/lib/user';

const props = defineProps(['dialog']);
const emit = defineEmits(['update:dialog', 'newItem']);

const onOpen = () => {
  newItem.value = {
    project_name: '',
    project_owner: '',
    description: '',
  };
  _selectedUserName.value = '';
};

const close = () => emit('update:dialog', false);
const save = async () => {
  const formValidate = await form.value.validate();
  const isValid = formValidate.valid;

  if (!isValid) {
    return;
  }

  emit('newItem', newItem.value);
  emit('update:dialog', false);
};

const newItem = ref({
});

const form = ref(null);
const rules = {
  required: (v) => !!v || '必填',
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

const _selectedUserName = ref('');

const selectedUserName = computed({
  get() {
    return _selectedUserName.value;
  },
  set(value) {
    _selectedUserName.value = value;
    newItem.value.project_owner = toUserId(value);
  }
});

const userNames = computed(() => {
  return users.value.map((user) => user.name);
});

const toUserId = (name) => {
  const user = users.value.find((user) => user.name === name) || {};
  return user.user_id;
};

const users = ref([]);

const updateUsers = async () => {
  const [result, u] = await getAdminUserList();
  if (result) {
    users.value = u;
  } else {
    users.value = [];
    console.log(u);
  }
};

onMounted(async () => {
  updateUsers();
});
</script>

<style scoped></style>
