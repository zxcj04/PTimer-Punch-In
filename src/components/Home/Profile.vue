<template>
  <v-main>
    <v-card :loading="isLoading">
      <v-toolbar color="rgba(0, 0, 0, 0)">
        <template v-slot:prepend>
          <v-icon class="ml-2">mdi-account</v-icon>
        </template>

        <v-toolbar-title class="text-h6 font-weight-bold">
          個人資訊
        </v-toolbar-title>

        <template v-slot:append>
          <v-icon class="mr-2" @click="editUser" v-show="!isEditing">mdi-pencil</v-icon>
        </template>
      </v-toolbar>

      <template v-slot:loader="{ isActive }">
        <v-progress-linear :active="isActive" color="primary" height="4" indeterminate></v-progress-linear>
      </template>

      <v-card-text>
        <v-row>
          <v-col cols="12" v-if="isLoadingPage" class="text-center">
            <v-progress-circular indeterminate color="primary"></v-progress-circular>
          </v-col>
        </v-row>

        <v-form ref="editForm" @submit.prevent validate-on="lazy">
          <v-row v-if="!isLoadingPage">
            <v-col cols="12" md="6">
              <v-text-field v-model="user.name" label="姓名" :rules="[rules.required]" :readonly="!isEditing" :hint="isEditing? '必填': ''"
                :persistent-hint="isEditing"></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field v-model="user.mail" label="電子郵件" :rules="[rules.required]" readonly :disabled="isEditing"
              :hint="isEditing? '必填': ''" :persistent-hint="isEditing"></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field v-model="user.telephone" label="電話" :readonly="!isEditing"></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field v-model="user.telegram" label="Telegram ID" :readonly="!isEditing" placeholder="@example_user"></v-text-field>
            </v-col>
          </v-row>

          <v-expand-transition>
            <v-row v-show="isEditing">
              <v-col cols="12" md="4">
                <v-text-field v-model="old_password" type="password" label="舊密碼" validate-on="submit"
                  :rules="[rules.required_if_new_password]" :readonly="!isEditing" hint="不更改則留白"
                  :persistent-hint="isEditing"></v-text-field>
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field v-model="new_password" type="password" label="新密碼" validate-on="submit"
                  :rules="[rules.required_if_old_password, rules.same_as_confirm]"></v-text-field>
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field v-model="new_password_confirm" type="password" label="確認密碼" validate-on="submit"
                  :rules="[rules.required_if_old_password, rules.same_as_new_password]"></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-alert v-show="isEditing" :type="isPasswordError? 'error': 'info'" class="mt-4" :color="isPasswordError? 'error': 'primary'">
                  <span class="font-weight-bold">{{isPasswordError? '錯誤': '注意事項：'}}</span>
                  <ul>
                    <li v-if="isPasswordError">密碼錯誤，請重新輸入。</li>
                    <li v-else>更改密碼時，請輸入舊密碼以及新密碼，並確認新密碼無誤。</li>
                  </ul>
                </v-alert>
              </v-col>
            </v-row>
          </v-expand-transition>
        </v-form>

        <v-expand-transition v-if="!isLoadingPage">
          <v-card class="pa-2 mt-3" color="#282828" flat v-show="!isEditing">
            <v-card-title>
              可用專案
            </v-card-title>
            <v-card-text>
              <v-row>
                <v-col cols="12" md="4" v-for="p in user.projects" :key="p">
                  <ProjectCard :project="p" />
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-expand-transition>
      </v-card-text>

      <v-card-actions v-show="isEditing">
        <v-spacer />
        <v-icon class="mr-2" @click="cancelEdit" color="error">mdi-close</v-icon>
        <v-icon class="mr-2" @click="editUser">mdi-check</v-icon>
      </v-card-actions>
    </v-card>
  </v-main>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { checkLogin, changePassword } from '@/lib/auth';
import { userInfo, userUpdate } from '@/lib/user';

import ProjectCard from './ProjectCard.vue';

const emit = defineEmits(['userUpdated']);

const router = useRouter();
const user = ref({});
// user = { "active": true, "mail": "b", "name": "b", "projects": [], "telegram": "@botfather", "telephone": "0912345678", "user_id": "7d144b21-7c38-439b-a759-52631856e288" }

const old_password = ref('');
const new_password = ref('');
const new_password_confirm = ref('');
const isPasswordError = ref(false);

const isLoadingPage = ref(true);
const isLoading = ref(true);

const isEditing = ref(false);
const storedUser = ref({});

const rules = {
  required: (v) => !!v || '必填',
  required_if_new_password: (v) => (new_password.value ? !!v || '密碼不可為空' : true),
  required_if_old_password: (v) => (old_password.value ? !!v || '密碼不可為空' : true),
  same_as_new_password: (v) => v === new_password.value || '與新密碼不符',
  same_as_confirm: (v) => v === new_password_confirm.value || '與確認密碼不符',
};

const editForm = ref(null);

const editUser = async () => {
  if (!isEditing.value) {
    isEditing.value = true;
    storedUser.value = JSON.parse(JSON.stringify(user.value));

    old_password.value = '';
    new_password.value = '';
    new_password_confirm.value = '';

    await editForm.value.resetValidation();

    return;
  }

  const formValidate = await editForm.value.validate();
  const isValid = formValidate.valid;

  if (!isValid) {
    return;
  }

  isLoading.value = true;

  if (old_password.value) {
    const result = await changePassword(old_password.value, new_password.value);

    if (!result) {
      isLoading.value = false;
      isPasswordError.value = true;
      return;
    }
  }

  const [result, msg] = await userUpdate({
    name: user.value.name,
    mail: user.value.mail,
    telephone: user.value.telephone,
    telegram: user.value.telegram,
  });

  if (!result) {
    isLoading.value = false;
    console.warn(msg);
    return;
  }

  emit('userUpdated');

  isLoading.value = false;
  isEditing.value = false;
  isPasswordError.value = false;

  updateUserInfo();
};

const cancelEdit = () => {
  isEditing.value = false;
  isPasswordError.value = false;
  user.value = JSON.parse(JSON.stringify(storedUser.value));
};

const updateUserInfo = async () => {
  isLoading.value = true;

  const [result, u] = await userInfo();
  if (result)
    user.value = u;

  isLoading.value = false;
};

onMounted(async () => {
  const isLogin = await checkLogin();
  if (!isLogin) {
    router.push('login');
    return;
  }

  await updateUserInfo();

  isLoadingPage.value = false;
  isLoading.value = false;
});
</script>
