<template>
  <v-card
    color="grey-darken-3" flat
  >
    <v-toolbar
      color="rgba(0, 0, 0, 0)"
      theme="dark"
    >
      <v-toolbar-title class="text-h6 font-weight-bold">
        {{ projectInfo.project_name }}
      </v-toolbar-title>

      <template v-slot:append>
        <v-chip
          color="primary"
          label
        >
          <v-icon start icon="mdi-account-circle-outline"></v-icon>
          {{ projectInfo.project_owner_name }}
        </v-chip>
      </template>
    </v-toolbar>

    <v-divider class="mx-3"></v-divider>

    <v-card-text>
      <v-chip
        class="mb-3"
        color="red"
        label
        small
        variant="outlined"
        v-if="projectInfo.is_delete"
      >
        <v-icon start icon="mdi-close-circle-outline"></v-icon>
        已停用
      </v-chip>
      <br>
      {{ projectInfo.description }}
    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getProjectInfo } from '@/lib/project';

const props = defineProps(['project']);

const projectInfo = ref({});

onMounted(async () => {
  const [result, p] = await getProjectInfo(props.project);
  if (!result)
    return;
  projectInfo.value = p;
});
</script>
