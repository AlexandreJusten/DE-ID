<template>
  <div class="q-pa-md">
    <q-table
      flat
      bordered
      title="Dynamic Table"
      dense
      :rows="dynamicRows"
      :columns="dynamicColumns"
      row-key="id"
    />
  </div>
</template>

<script>
export default {
  props: {
    jsonData: {
      type: String, // O tipo da prop pode ser ajustado conforme necessário
      required: true, // Se você deseja que a prop seja obrigatória
    },
  },
  data() {
    return {
      dynamicColumns: [],
      dynamicRows: [],
    };
  },
  computed: {
    results() {
      // Parse os resultados do JSON
      console.log(jsonData);
      try {
        return JSON.parse(this.jsonData.results);
      } catch (error) {
        return [];
      }
    },
  },
  methods: {
    // Restante do seu código
  },
};
</script>
