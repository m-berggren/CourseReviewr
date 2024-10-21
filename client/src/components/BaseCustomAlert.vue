<template>
  <div v-if="show" class="custom-alert">
    <div class="custom-alert-content">
      <p>{{ message }}</p>
      <button @click="closeAlert">OK</button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    show: Boolean,
    message: String
  },
  methods: {
    closeAlert() {
      this.$emit('close')
    }
  }
}
</script>

<style scoped>
.custom-alert {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}
.custom-alert-content {
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
}

button {
  margin-top: 10px;
  background-color: #4a4747;
  color: white;
}
button:hover {
  background-color: #007bff;
  border-color: #007bff;
}
</style>
