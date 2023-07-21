<template>
  <v-dialog v-model="_dialog" class="mx-auto" justify="center" width="unset">
    <v-card>
      <v-toolbar color="rgba(0, 0, 0, 0)" theme="dark">
        <template v-slot:prepend>
          <v-icon class="ml-2">mdi-account-plus</v-icon>
        </template>

        <v-toolbar-title class="text-h6 font-weight-bold">
          註冊
        </v-toolbar-title>
      </v-toolbar>

      <v-form ref="form" @submit.prevent validate-on="lazy" :disabled="isLoading">
        <v-card-text>
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field label="姓名" v-model="newItem.name" :rules="[rules.required]" hint="必填"
                persistent-hint></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field label="電子信箱" v-model="newItem.mail" :rules="[rules.required, rules.mail]" hint="必填"
                persistent-hint></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field label="電話" v-model="newItem.telephone" :rules="[rules.phone]"></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field label="Telegram" v-model="newItem.telegram" :rules="[rules.telegram]" hint="@exampleID"
                persistent-hint></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field label="密碼" type="password" v-model="newItem.password" validate-on="submit"
                :rules="[rules.required, rules.same_as_confirm]" hint="必填" persistent-hint></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field label="確認密碼" type="password" v-model="newItem.password_confirm" validate-on="submit"
                :rules="[rules.required, rules.same_as_password]" hint="必填" persistent-hint></v-text-field>
            </v-col>

            <v-col cols="12">
              <v-expand-transition>
                <v-alert
                  v-model:model-value="alertShow"
                  type="error"
                >
                  {{ alertText }}
                </v-alert>
              </v-expand-transition>
            </v-col>
          </v-row>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red-lighten-1" variant="text" @click="close">
            取消
          </v-btn>
          <v-btn type="submit" color="blue-darken-1" variant="text" @click="save">
            {{ isLoading ? "" : "確定" }}
            <v-progress-circular indeterminate color="gray" size="24" v-if="isLoading"></v-progress-circular>
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, computed } from 'vue';

import { userCreate } from '@/lib/auth';

const props = defineProps(['dialog']);
const emit = defineEmits(['update:dialog', 'registerSuccess']);

const form = ref(null);
const rules = {
  required: (v) => !!v || '必填',
  mail: (v) => /.+@.+\..+/.test(v) || '電子信箱格式錯誤',
  telegram: (v) => /^$|(^@.+$)/.test(v) || 'Telegram ID格式錯誤',
  phone: (v) => /^$|(^\d+$)/.test(v) || '電話號碼格式錯誤',
  same_as_password: (v) => v === newItem.value.password || '與新密碼不符',
  same_as_confirm: (v) => v === newItem.value.password_confirm || '與確認密碼不符',
};

const isLoading = ref(false);

const alertShow = ref(false);
const alertText = ref('');

const timeout = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const close = () => emit('update:dialog', false);
const save = async () => {

  const formValidate = await form.value.validate();
  const isValid = formValidate.valid;

  if (!isValid) {
    return;
  }

  alertShow.value = false;
  alertText.value = '';

  isLoading.value = true;

  const data = {
    name: newItem.value.name,
    mail: newItem.value.mail,
    telephone: newItem.value.telephone,
    telegram: newItem.value.telegram,
    password: newItem.value.password,
  };

  const [result, msg] = await userCreate(data);
  await timeout(500);

  isLoading.value = false;

  if (result) {
    emit('registerSuccess');
    emit('update:dialog', false);
    return;
  } else {
    alertText.value = msg;
    alertShow.value = true;
  }
};

const newItem = ref({
  name: '',
  mail: '',
  telephone: '',
  telegram: '',
  password: '',
  password_confirm: '',
});

const onOpen = () => {
  newItem.value = {
    name: '',
    mail: '',
    telephone: '',
    telegram: '',
    password: '',
    password_confirm: '',
  };

  alertShow.value = false;
  alertText.value = '';
};

const _dialog = computed({
  get() {
    if (props.dialog) {
      onOpen();
    }
    return props.dialog;
  },
  set(value) {
    emit('update:dialog', value);
  }
});
</script>