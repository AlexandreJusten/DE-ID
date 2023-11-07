<template>
  <q-page>
    <FilePicker />
  </q-page>
</template>

<script>
import { defineComponent } from "vue";
import FilePicker from "src/components/FilePicker.vue";

export default defineComponent({
  name: "IndexPage",
  components: { FilePicker },
});
</script>
