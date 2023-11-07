<template>
  <div class="q-pa-md" v-if="!isLoading">
    <q-card class="q-pa-lg">
      <q-table flat bordered dense :title="title" :rows="formattedData" :columns="dynamicColumns" row-key="id">
        <template v-slot:top-right>
          <q-btn color="primary" icon-right="archive" label="Export to CSV" no-caps @click="exportTable" :disable="disableDownload" />
        </template>
      </q-table>
    </q-card>
    <br>
    <q-card class="q-pa-md">
      <q-table grid flat bordered title="Analysis" :rows="analysis_rows" :columns="analysis_columns" row-key="name" hide-header hide-bottom>
      </q-table>
      <br>
    </q-card>
  </div>
  <div class="q-pa-md flex flex-center loading-center" v-if="isLoading">
    <q-circular-progress indeterminate rounded size="50px" color="light-blue" class="q-ma-md" />
  </div>
</template>

<script>
import { exportFile } from 'quasar';

export default {
  props: {
    jsonData: {},
  },
  data() {
    return {
      title: "Table",
      isLoading: true,
      isErrors: false,
      disableDownload: false,
      errors: [],
      dynamicColumns: [],
      formattedData: [],
      analysis_columns: [],
      analysis_rows: [],
    };
  },
  watch: {
    jsonData: {
      immediate: true,
      handler(newJsonData) {
        if (newJsonData !== null) {
          this.parseJsonData(newJsonData);
        }
      },
    },
  },
  methods: {
    parseJsonData(jsonData) {
      try {
        const parsedData = JSON.parse(jsonData);

        this.title = parsedData.description;

        if (parsedData.errors === "[]") {
          this.analysis_columns = [
            { name: 'type', label: 'Type', field: 'type', sortable: true },
            { name: 'original', label: 'Original', field: 'original', sortable: true },
            { name: 'anonymized', label: 'Anonymized', field: 'anonymized', sortable: true },
          ];

          this.analysis_rows = [
            {
              type: 'K-Anonymity',
              anonymized: parsedData.anonymized_data_k_anonymity,
              original: parsedData.real_data_k_anonymity,
            },
            {
              type: 'L-Diversity',
              anonymized: parsedData.anonymized_data_l_diversity,
              original: parsedData.real_data_l_diversity,
            },
            {
              type: 'T-Closeness',
              anonymized: parsedData.anonymized_data_t_closeness,
              original: parsedData.real_data_t_closeness,
            },
          ];
        } else {
          this.analysis_columns = [
            { name: 'type', label: 'Type', field: 'type', sortable: true },
            { name: 'original', label: 'Original', field: 'original', sortable: true },
          ];

          this.analysis_rows = [
            {
              type: 'K-Anonymity',
              original: parsedData.real_data_k_anonymity,
            },
            {
              type: 'L-Diversity',
              original: parsedData.real_data_l_diversity,
            },
            {
              type: 'T-Closeness',
              original: parsedData.real_data_t_closeness,
            },
          ];

          this.isLoading = false;
          this.disableDownload = true;

          this.$q.notify({
            message: "Error",
            caption: parsedData.errors,
            icon: 'error',
            color: "red",
          });
        }

        const results = JSON.parse(parsedData.results);

        if (Array.isArray(results)) {
          this.formattedData = results;

          this.dynamicColumns = Object.keys(results[0]).map((key) => ({
            name: key,
            label: key,
            field: key,
            sortable: true,
          }));

          this.isLoading = false;
        } else {
          this.$q.notify({
            message: "Error",
            caption: "Invalid Results",
            icon: 'error',
            color: "red",
          });
        }
      } catch (error) {
        console.error("", error);
      }
    },
    exportTable() {
      const content = [this.dynamicColumns.map(col => this.wrapCsvValue(col.label))].concat(
        this.formattedData.map(row => this.dynamicColumns.map(col => this.wrapCsvValue(
          typeof col.field === 'function'
            ? col.field(row)
            : row[col.field === void 0 ? col.name : col.field]
        )).join(','))
      ).join('\r\n');

      const status = exportFile(
        this.title.concat('.csv'),
        content,
        'text/csv'
      );

      if (status !== true) {
        this.$q.notify({
          message: 'Browser denied file download...',
          color: 'negative',
          icon: 'warning',
        });
      }
    },
    wrapCsvValue(val, formatFn, row) {
      let formatted = formatFn !== void 0
        ? formatFn(val, row)
        : val;

      formatted = formatted === void 0 || formatted === null
        ? ''
        : String(formatted);

      formatted = formatted.split('"').join('""');
      return `"${formatted}"`;
    },
  },
};
</script>

<style scoped>
.loading-center {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.q-item-label {
  max-width: 100%;
}

h1 {
  font-size: 24px;
  margin-bottom: 20px;
}
</style>
