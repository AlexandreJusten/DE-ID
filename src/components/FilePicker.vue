<template>
  <div class="q-pa-md q-gutter-sm" style="width: 90%;">
    <q-file
      style="width: 100%;  background-color: rgba(195, 195, 195, 0.682)"
      v-model="files"
      label="Drop or Select a File..."
      filled
      max-files="1"
      multiple
      class="custom-file-input"
      :disable="!userLoggedIn"
      accept=".csv"
      @rejected="onRejected"
      v-on:update:model-value="uploadFile"
    >
      <template v-slot:prepend>
        <q-icon name="attach_file" class="file-icon" />
      </template>
    </q-file>
    <q-tooltip v-if="!userLoggedIn" anchor="top middle" style="font-size: 15px">
      You need to login to enable uploading
    </q-tooltip>
    <div v-if="columns && columns.length > 0">
      <q-card>
      <q-card-section>
      <h4>Parameterization:</h4>
      <ul class="column-list">
        <li v-for="(column, index) in columns" :key="index" class="column-item">
          {{ column }}
          <q-checkbox v-model="sensitiveColumns[column]" label="Sensitive" />
          <q-checkbox v-model="diversityColumns[column]" label="Diversity" />
          <q-checkbox v-model="closenessColumns[column]" label="Closeness" />
          <q-select
            v-model="selectedColumns[column]"
            :options="firstSelectorOptions"
            label="Select Technique"
            @update:model-value="clearSecondSelector(column)"
          />
          <q-select
            v-if="selectedColumns[column] !== null"
            v-model="selectedSecondSelectors[column]"
            :options="secondSelectorOptions[selectedColumns[column]]"
            label="Select Method"
          />
        </li>
      </ul>
      </q-card-section>
      </q-card>
    </div>
    <div>
      <q-btn
        label="Show Payload"
        color="primary"
        @click="showPayload"
        style="margin-top: 20px"
      />
    </div>
    <q-dialog v-model="payloadDialog">
      <q-card>
        <q-card-section>
          <div class="text-h6">Payload</div>
        </q-card-section>
        <q-card-section>
          <pre>{{ payload }}</pre>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { ref, watch, computed } from "vue";
import { Dialog } from "quasar";
import { useAuthStore } from "stores/user";
import Papa from "papaparse";

export default {
  setup() {
    const files = ref(null);
    const authStore = useAuthStore();
    const userLoggedIn = ref(authStore.isAuthenticated);
    const fileContent = ref(null);
    const columns = ref([]);
    const selectedColumns = ref({});
    const firstSelectorOptions = ref([
      "encrypt",
      "generalize",
      "hash",
      "mask",
      "null_out",
      "perturb",
      "pseudonymize",
      "swap",
    ]);
    const selectedSecondSelectors = ref({});

    const secondSelectorOptions = {
      encrypt: ["chacha20", "aes", "salsa20"],
      generalize: ["percent", "age"],
      hash: ["md5", "sha1", "sha256"],
      mask: [
        "full",
        "range",
        "first_n_characters",
        "last_n_characters",
        "email",
        "cpf",
      ],
      null_out: ["columns"],
      perturb: [
        "date",
        "numeric_range",
        "numeric_gaussian",
        "numeric_laplacian",
      ],
      pseudonymize: ["columns", "rows"],
      swap: ["columns", "rows"],
    };

    const sensitiveColumns = ref({});
    const diversityColumns = ref({});
    const closenessColumns = ref({});

    const payloadDialog = ref(false);

    const payload = computed(() => {
      const executionParameters = {};
      const sensitiveColumnsArray = [];
      const diversityColumnsArray = [];
      const closenessColumnsArray = [];

      for (const column of columns.value) {
        const technique = selectedColumns.value[column];
        const method = selectedSecondSelectors.value[column];

        if (technique && method) {
          const key = `${technique}.${method}`;
          if (!executionParameters[key]) {
            executionParameters[key] = {
              algorithm: key,
              columns: [],
            };
          }
          executionParameters[key].columns.push(column);
        }

        if (sensitiveColumns.value[column]) {
          sensitiveColumnsArray.push(column);
        }

        if (diversityColumns.value[column]) {
          diversityColumnsArray.push(column);
        }

        if (closenessColumns.value[column]) {
          closenessColumnsArray.push(column);
        }
      }

      const payload = {
        execution_parameters: Object.values(executionParameters),
        sensitive_columns: sensitiveColumnsArray,
        diversity_columns: diversityColumnsArray,
        closeness_columns: closenessColumnsArray,
        data: fileContent.value,
      };

      return JSON.stringify(payload, null, 2);
    });

    function uploadFile() {
      try {
        if (files.value) {
          const file = files.value[0];
          const fileReader = new FileReader();
          fileReader.onload = (event) => {
            Papa.parse(event.target.result, {
              header: true,
              complete: (results) => {
                columns.value = Object.keys(results.data[0]);
                fileContent.value = results.data;
                console.log("Parsed CSV data:", fileContent.value);
                if (fileContent.value.length > 0) {
                  console.log("Columns:", columns.value);
                  selectedColumns.value = {};
                  selectedSecondSelectors.value = {};
                }
              },
              error: (error) => {
                console.error("Error parsing CSV:", error.message);
              },
            });
          };
          fileReader.readAsText(file);
        }
      } catch (error) {
        console.error("Error reading file:", error);
      }
    }

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

    function clearSecondSelector(column) {
      selectedSecondSelectors.value[column] = null;
    }

    watch(authStore.isAuthenticated, (newValue) => {
      userLoggedIn.value = newValue;
    });

    watch(userLoggedIn, (newValue) => {
      if (!newValue && files.value) {
        files.value = null;
        showLoginError();
      }
    });

    function showPayload() {
      payloadDialog.value = true;
    }

    return {
      files,
      counterLabelFn,
      userLoggedIn,
      fileContent,
      uploadFile,
      selectedColumns,
      firstSelectorOptions,
      columns,
      selectedSecondSelectors,
      secondSelectorOptions,
      clearSecondSelector,
      sensitiveColumns,
      diversityColumns,
      closenessColumns,
      payload,
      showPayload,
      payloadDialog,
    };
  },
};
</script>

<style>
.column-list {
  list-style: none;
  padding: 0;
}

.column-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
  padding: 10px;
  background-color: #f0f0f0;
  border-radius: 5px;
}

.column-item q-select {
  flex: 1;
  margin-left: 10px;
}

.column-item q-checkbox {
  margin-left: 10px;
}
</style>
