<template>
    <span class="th-content">
      <span class="header-text">{{ text }}
        <span class="sort-icon">
          {{ currentSort === column ? (currentOrder === 'asc' ? ' ▲' : ' ▼') : ' ●' }}
        </span>
      </span>
    </span>
  </template>

<script setup>
defineProps({
  column: String,
  currentSort: String,
  currentOrder: String,
  text: String
})
</script>

  <style scoped>
  .th-content {
    display: inline-block;
    width: 100%;
  }

  .header-text {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: inline-block;
    max-width: 100%;
  }

  .sort-icon {
    display: inline-block;
    font-size: 0.8em;
    color: #333;
    margin-left: 0.2em;
    vertical-align: middle;
  }
  </style>
