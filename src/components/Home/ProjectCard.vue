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
          {{ projectInfo.project_owner }}
        </v-chip>
      </template>
    </v-toolbar>

    <v-card-text>
      {{ projectInfo.description }}
    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref, defineProps, onMounted } from 'vue';
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
