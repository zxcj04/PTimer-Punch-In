<template>
  <v-dialog v-model="_dialog" class="mx-auto custom-dialog" justify="center">
    <v-card>
      <v-toolbar color="rgba(0, 0, 0, 0)" theme="dark">
        <template v-slot:prepend>
          <v-icon class="ml-2">mdi-pencil</v-icon>
        </template>

        <v-toolbar-title class="text-h6 font-weight-bold">
          編輯打卡紀錄
        </v-toolbar-title>
      </v-toolbar>

      <v-card-text>
        <v-row>
          <v-col cols="12" md="4" sm="12">
            <v-select label="專案名稱" :items="testItems" />
          </v-col>
          <v-col cols="12" md="4" sm="6">
            <v-text-field label="上班打卡時間" v-model="_punch_in_time_value" readonly></v-text-field>
            <VueDatePicker v-model="editedItem.punch_in_time" inline auto-apply hide-offset-dates :clearable="false" dark :max-date="editedItem.punch_out_time" />
          </v-col>
          <v-col cols="12" md="4" sm="6" v-if="editedItem.punch_out_time">
            <v-text-field label="下班打卡時間" v-model="_punch_out_time_value" readonly></v-text-field>
            <VueDatePicker v-model="editedItem.punch_out_time" inline auto-apply hide-offset-dates :clearable="false" dark :min-date="editedItem.punch_in_time" />
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
import { ref, computed } from 'vue';
import { formattedDate } from '@/lib/misc';

const props = defineProps(['dialog', 'punch']);
const emit = defineEmits(['update:dialog', 'update:punch', 'editItem']);

const onOpen = () => {
  editedItem.value.punch_in_time = new Date(_punch.value.punch_in_time);
  if (_punch.value.punch_out_time)
    editedItem.value.punch_out_time = new Date(_punch.value.punch_out_time);
  else
    editedItem.value.punch_out_time = undefined;
  editedItem.value.project_id = _punch.value.project_id;
};
const close = () => emit('update:dialog', false);
const save = () => {
  const punch_id = _punch.value.punch_id;
  const punch_in_time = editedItem.value.punch_in_time;
  const punch_out_time = editedItem.value.punch_out_time;
  const project_id = editedItem.value.project_id;
  const punch = {
    punch_id,
    punch_in_time,
    project_id,
  };
  if (punch_out_time)
    punch.punch_out_time = punch_out_time;
  emit('editItem', punch_id, punch);
  emit('update:dialog', false);
};

const editedItem = ref({
  punch_in_time: new Date(),
  punch_out_time: new Date(),
  project_id: "",
});

const testItems = ref(["1", "2", "3"]);

const _punch_in_time_value = computed({
  get() {
    return formattedDate(editedItem.value.punch_in_time);
  },
  set(value) {
    editedItem.value.punch_in_time = value;
  }
});

const _punch_out_time_value = computed({
  get() {
    return formattedDate(editedItem.value.punch_out_time);
  },
  set(value) {
    editedItem.value.punch_out_time = value;
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

const _punch = computed({
  get() {
    return props.punch;
  },
  set(value) {
    emit('update:punch', value);
  }
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
