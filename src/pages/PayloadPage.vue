<template>
  <div class="q-pa-md q-gutter-sm">
    <div
      class="editor-container"
      style="
        height: 200px;
        box-shadow: 4px 2px 2px 2px rgba(0, 0, 0, 0.2);
        overflow-y: auto;
      "
    >
      <q-editor
        v-model="editor"
        placeholder="Ex.: { 'execution_parameters': [ { 'algorithm', 'configuration', 'columns' } ], 'data' : [ { Object_1 }... ] }"
        :definitions="{
          bold: { label: 'Bold', icon: null, tip: 'My bold tooltip' },
        }"
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
