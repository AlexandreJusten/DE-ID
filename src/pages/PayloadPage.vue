<template>
  <div class="q-pa-md q-gutter-sm">

    <div class="q-pa-md" >
      <q-input
        v-model="text"
        filled
        type="textarea"
      />
    </div>
  </div>
  <div class="col" style="margin-top: 2vh; text-align: center">
    <q-btn push color="primary" label="Upload" />
  </div>
</template>

<script>
import { ref } from "vue";

export default {
  setup() {
    return {
      editor: ref(""),
    };
  },
};
</script>

<style scoped>
/* Estilos do componente aqui */

.editor-container {
  max-height: 200px; /* Altura máxima do contêiner */
}
</style>
