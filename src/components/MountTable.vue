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
  <pre>{{ this.formattedData }}</pre>
</template>

<script>
export default {
  props: {
    jsonData: {},
  },
  data() {
    return {
      dynamicColumns: [],
      dynamicRows: [],
      formattedData: [],
    };
  },
  created() {
    this.parseJsonData();
  },
  methods: {
    parseJsonData() {
      const checkData = () => {
        if (this.jsonData) {
          const parsedData = JSON.parse(this.jsonData);
          const results = parsedData.results;
          this.formattedData = results;
        } else {
          setTimeout(checkData, 1000);
        }
      };

      checkData();
    },
  },
};
</script>
