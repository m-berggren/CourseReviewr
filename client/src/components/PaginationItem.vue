<template>
  <b-pagination
    :v-model="currentPage"
    :total-rows="totalRows"
    :per-page="perPage"
    @change="onPageChange"
  ></b-pagination>
</template>

<script setup>
defineProps({
  currentPage: Number,
  totalRows: Number,
  perPage: Number
})

// Define emits for emitting events back to the parent component
const emit = defineEmits(['pageChange'])

// Emit the 'pageChange' event when the page changes
const onPageChange = (page) => {
  emit('pageChange', page)
}
</script>

<style></style>
