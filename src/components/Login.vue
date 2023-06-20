<template>
  <v-container class="fill-height bg l" fluid>
    <v-row class="align-center" justify="center">
      <v-col cols="12" sm="8" md="4">
        <v-card elevation-5 class="pa-3">
          <v-form @submit.prevent="submit" ref="form" lazy-validation>
            <v-card-title class="justify-center" style="text-align: center;">國立海洋大學先進計算實驗室</v-card-title>
            <v-card-subtitle style="text-align: center;">工讀生打卡系統</v-card-subtitle>
            <v-card-text>
              <v-text-field
                label="電子信箱"
                :rules="[v => !!v || '請填入您的電子信箱']"
                v-model="account"
                placeholder="abc@gmail.com"
              />
              <v-text-field
                label="密碼"
                :rules="[v => !!v || '請填入您的密碼']"
                v-model="password"
              />
              <v-expand-transition>
                <v-alert
                  v-model:model-value="alertShow"
                  :type="alertType"
                >
                  <v-progress-circular
                    indeterminate
                    color="gray"
                    v-if="alertType === undefined"
                  ></v-progress-circular>
                  {{ alertMessage }}
                </v-alert>
              </v-expand-transition>
            </v-card-text>
            <v-card-actions>
                <v-spacer />
                <v-btn
                  type="submit"
                  color="primary"
                  :disabled="alertType === undefined || alertType === 'success'"
                >
                登入
                </v-btn>
            </v-card-actions>
          </v-form>
        </v-card>
      </v-col>
    </v-row>

    <!-- <Alert /> -->
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

// import Alert from "./Alert.vue";
import { userLogin } from '@/lib/auth';

class AlertType {
  static Error = 'error';
  static Success = 'success';
  static Info = 'info';
  static Warning = 'warning';
}

const account = ref('');
const password = ref('');

const alertShow = ref(false);
const alertType = ref(AlertType.Info);
const alertMessage = ref('');

const form = ref();

const router = useRouter();

const submit = async () => {
  const { valid } = await form.value.validate();
  if(!valid)
  return;

  alertShow.value = true;
  alertType.value = undefined;
  alertMessage.value = '登入中...';
  const [isLogin, msg] = await userLogin(account.value, password.value);
  if (!isLogin) {
    alertType.value = AlertType.Error;
    alertMessage.value = '登入失敗，請檢查您的電子信箱及密碼是否正確';
    return;
  } else {
    alertType.value = AlertType.Success;
    alertMessage.value = '已登入';
    setTimeout(() => {
      router.push({ name: 'home' });
    }, 1000);
  }
}

</script>

<style scpoed>
.align-center {
  height: 90vh;
}
.bg.l::before{
  background-image: url("/login-background.jpg");
}
.bg::before{
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center center;
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  filter: brightness(90%);
  opacity: 0.6;
}
</style>
