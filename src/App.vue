<script setup>
</script>

<template>
  <v-app>
    <router-view />
  </v-app>
</template>

<style>
@media screen and (max-width: 1100px) {
  .v-data-table thead {
    border: none;
    clip: rect(0 0 0 0);
    height: 1px;
    margin: -1px;
    overflow: hidden;
    padding: 0;
    position: absolute;
    width: 1px;
  }

  .v-data-table td {
    border-bottom: thin solid rgba(var(--v-border-color), var(--v-border-opacity));
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    text-align: right;
    line-height: 48px;
  }

  .v-data-table td::before {
    content: attr(data-label);
    float: left;
    font-weight: bold;
    margin-right: 1em;
  }

  .v-data-table td:last-child {
    border-bottom: 0;
  }

  .v-data-table tr:not(:first-child) > td:first-child {
    border-top: medium solid rgba(var(--v-border-color), var(--v-border-opacity));
  }
}
</style>
