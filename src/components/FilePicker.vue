<template>
  <div class="file-picker q-pa-md">
    <div class="q-gutter-md row items-start">
      <q-file
        style="width: 400px; height: 100px"
        v-model="files"
        label="Drop Them Here"
        filled
        counter
        :counter-label="counterLabelFn"
        max-files="1"
        multiple
        class="custom-file-input"
        :disable="!userLoggedIn"
      >
        <template v-slot:prepend>
          <q-icon name="attach_file" class="file-icon" />
        </template>
      </q-file>
    </div>
  </div>
</template>

<style scoped>
.custom-file-input {
  background-color: rgba(192, 192, 192, 0.3); /* Cor cinza transparente */
  border: none;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.4); /* Sombra pequena */
  transition: background-color 0.3s, box-shadow 0.3s;
}

.custom-file-input:focus {
  outline: none;
  background-color: rgba(
    192,
    192,
    192,
    0.5
  ); /* Cor cinza transparente ao focar */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* Sombra um pouco maior ao focar */
}

.file-icon {
  font-size: 36px;
  color: #007bff;
}
</style>

<script>
import { ref, watch } from "vue";
import { Dialog } from "quasar";

export default {
  setup() {
    const files = ref(null);
    const userLoggedIn = ref(false);

    function counterLabelFn({ totalSize, filesNumber, maxFiles }) {
      return `${filesNumber} files of ${maxFiles} | ${totalSize}`;
    }

    function showLoginError() {
      Dialog.create({
        title: "Error",
        message: "You need to be logged in to upload files.",
        buttons: [{ label: "OK", color: "primary" }],
      });
    }

    watch(userLoggedIn, (newValue) => {
      if (!newValue && files.value) {
        files.value = null;
        showLoginError();
      }
    });

    return {
      files,
      counterLabelFn,
      userLoggedIn,
    };
  },
};
</script>
