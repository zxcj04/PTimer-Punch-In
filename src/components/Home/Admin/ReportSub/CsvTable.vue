<template>
  <table class="w-90 styled-table">
    <thead>
      <tr>
        <th v-for="h in useTable.headers" :key="h">
          {{ h }}
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="line in useTable.rows" :key="line">
        <td v-for="s in line" :key="s">
          {{ s }}
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  targetCsv: {
    type: String,
    required: true,
  },
});

const useTable = computed(() => {
  const t = {
    headers: [],
    rows: [],
  };
  const table = [];
  const lines = props.targetCsv.split('\n');
  for (const line of lines) {
    const row = line.split(',');
    table.push(row);
  }
  t.headers = table[0];
  t.rows = table.slice(1);
  return t;
});
</script>

<style scpoed>
.styled-table {
  border-collapse: collapse;
  margin: 25px 0;
  font-size: 0.9em;
  min-width: 400px;
  border-radius: 5px 5px 0 0;
  overflow: hidden;
  box-shadow: 0 0 20px rgba(143, 143, 143, 0.15);
}

.styled-table thead tr {
  background-color: #009879;
  color: #ffffff;
  text-align: left;
}

.styled-table th,
.styled-table td {
  padding: 12px 15px;
}

.styled-table tbody tr {
  border-bottom: 1px solid #dddddd;
}

.styled-table tbody tr:nth-of-type(even) {
  background-color: #464646;
}

.styled-table tbody tr:last-of-type {
  border-bottom: 2px solid #009879;
}

.styled-table tbody th.active-row {
  font-weight: bold;
  color: #009879;
}
</style>