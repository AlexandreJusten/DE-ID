<template>
  <q-card class="q-pa-md q-ma-md">
    <div class="text-h6 q-pb-md q-pl-sm">Anonymize</div>
    <q-file v-model="files" label="Drop or Select a File..." filled max-files="1" multiple class="custom-file-input"
      :disable="!userLoggedIn" accept=".csv" @update:model-value="uploadFile">
      <template v-slot:prepend>
        <q-icon name="attach_file" class="file-icon" />
      </template>
    </q-file>
    <div v-if="columns && columns.length > 0">
      <br />
      <div v-for="(column, index) in columns" :key="index">
        <q-card class="q-pa-md">
          <q-card-section>
            <div class="text-subtitle2" align="center">{{ column }}</div>
          </q-card-section>
          <q-card-section>
            <div class="column-options q-pa-md">
              <q-select v-model="selectedColumns[column]" :options="firstSelectorOptions" label="Technique"
                @update:model-value="clearSecondSelector(column)" />
              <q-select v-if="selectedColumns[column] !== null" v-model="selectedSecondSelectors[column]"
                :options="secondSelectorOptions[selectedColumns[column]]" label="Method" />
              <div v-if="selectedSecondSelectors[column]">
                <div v-for="(value, key) in secondSelectorVariables[selectedSecondSelectors[column]]" :key="key">
                  <q-input v-model="secondSelectorVariables[selectedSecondSelectors[column]][key]" :label="key"
                    :rules="getValidationRules(selectedSecondSelectors[column], key)" />
                </div>
              </div>
              <br />
              <div align="center">
                <q-checkbox v-model="sensitiveColumns[column]" label="Sensitive" />
                <q-checkbox v-model="diversityColumns[column]" label="Diversity" />
                <q-checkbox v-model="closenessColumns[column]" label="Closeness" />
              </div>
            </div>
          </q-card-section>
        </q-card>
        <br />
      </div>
    </div>
    <div align="right">
      <q-btn label="Submit" color="primary" @click="onSubmit" v-if="showBtn" />
    </div>
  </q-card>
</template>
<script>
import { ref } from "vue";
import { useQuasar } from 'quasar';
import routers from "../../config/routers.json";
import { useRouter } from "vue-router";
import { useAuthStore } from "stores/user";
import Papa from "papaparse";
export default {
  setup() {
    const $q = useQuasar()
    const router = useRouter();
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
    const payload = ref(null);
    const secondSelectorVariables = ref({
      salsa20: { key: "" },
      aes: { key: "" },
      chacha20: { key: "" },
      first_n_characters: { n: "" },
      last_n_characters: { n: "" },
      range: { start_index: "", end_index: "" },
      date: { unit: "", min_value: "", max_value: "" },
      numeric_range: { min_value: "", max_value: "" },
      numeric_gaussian: { std: "" },
      numeric_laplacian: { value: "" },
    });
    const showBtn = ref(false);
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
                if (fileContent.value.length > 0) {
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
          showBtn.value = true;
        }
      } catch (error) {
        console.error("Error reading file:", error);
      }
    }
    function clearSecondSelector(column) {
      selectedSecondSelectors.value[column] = null;
    }
    function generatePayload() {
      const executionParameters = {};
      const sensitiveColumnsArray = [];
      const diversityColumnsArray = [];
      const closenessColumnsArray = [];
      let fileName = '';
      if (files.value && files.value.length > 0) {
        fileName = files.value[0].name;
      }
      const dataTypeMap = {
        string: (value) => value.toString(),
        int: (value) => parseInt(value),
        float: (value) => parseFloat(value),
      };
      for (const column of columns.value) {
        const technique = selectedColumns.value[column];
        const method = selectedSecondSelectors.value[column];
        if (technique && method) {
          const key = `${technique}.${method}`;
          if (!executionParameters[key]) {
            executionParameters[key] = {
              algorithm: key,
              configuration: {}, 
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
      for (const column in selectedSecondSelectors.value) {
        const selectedMethod = selectedSecondSelectors.value[column];
        const additionalVariables = secondSelectorVariables.value[selectedMethod];
        if (selectedMethod && additionalVariables) {
          const configValues = {};
          const variableTypes = {
            salsa20: {
              key: "string",
            },
            aes: {
              key: "string",
            },
            chacha20: {
              key: "string",
            },
            first_n_characters: {
              n: "int",
            },
            last_n_characters: {
              n: "int",
            },
            range: {
              start_index: "int",
              end_index: "int",
            },
            date: {
              unit: "string",
              min_value: "int",
              max_value: "int",
            },
            numeric_range: {
              min_value: "int",
              max_value: "int",
            },
            numeric_gaussian: {
              std: "float",
            },
            numeric_laplacian: {
              value: "int",
            },
          };
          for (const variable in additionalVariables) {
            if (secondSelectorVariables.value[selectedMethod][variable] == "") {
              throw new Error('Configuration field missing');
            }
            const value = secondSelectorVariables.value[selectedMethod][variable];
            const expectedType = variableTypes[selectedMethod][variable];
            if (dataTypeMap[expectedType]) {
      
              configValues[variable] = dataTypeMap[expectedType](value);
            } else {
              configValues[variable] = value;
            }
          }
          const key = `${selectedColumns.value[column]}.${selectedMethod}`;
          if (executionParameters[key]) {
            executionParameters[key].configuration = configValues;
          }
        }
      }
      const payloadData = {
        description: fileName,
        execution_parameters: Object.values(executionParameters),
        sensitive_columns: sensitiveColumnsArray,
        diversity_columns: diversityColumnsArray,
        closeness_columns: closenessColumnsArray,
        data: fileContent.value,
      };
      return payloadData;
    }
    async function onSubmit() {
      try {
        const authStore = useAuthStore();
        const generatedPayload = generatePayload();
        let missingField = '';
        
        if (!generatedPayload.execution_parameters.length) {
          missingField = 'execution_parameters';
        } else if (!generatedPayload.sensitive_columns.length) {
          missingField = 'sensitive_columns';
        } else if (!generatedPayload.diversity_columns.length) {
          missingField = 'diversity_columns';
        } else if (!generatedPayload.closeness_columns.length) {
          missingField = 'closeness_columns';
        } else if (!generatedPayload.data.length) {
          missingField = 'data';
        }
        if (missingField) {
          $q.notify({
            color: 'red',
            textColor: 'white',
            icon: 'error',
            message: `Field '${missingField}' cannot be empty`
          });
          return;
        }
        const response = await fetch(routers.ASYNC, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Token ${authStore.token}`
          },
          body: JSON.stringify(generatedPayload)
        });
        if (response.ok) {
          const data = await response.json();
          router.push(`/history/${data.task_id}`);
        } else {
          $q.notify({
            color: 'red',
            textColor: 'white',
            icon: 'error',
            message: 'Bad Request '.concat(response.status)
          });
        }
      } catch (error) {
        $q.notify({
          color: 'red',
          textColor: 'white',
          icon: 'error',
          message: ' '.concat(error)
        });
      }
    }
    function getFieldType(selectedMethod, variable) {
      const variableTypes = {
        salsa20: {
          key: "string",
        },
        aes: {
          key: "string",
        },
        chacha20: {
          key: "string",
        },
        first_n_characters: {
          n: "int",
        },
        last_n_characters: {
          n: "int",
        },
        range: {
          start_index: "int",
          end_index: "int",
        },
        date: {
          unit: "string",
          min_value: "int",
          max_value: "int",
        },
        numeric_range: {
          min_value: "int",
          max_value: "int",
        },
        numeric_gaussian: {
          std: "float",
        },
        numeric_laplacian: {
          value: "int",
        },
      };
      return variableTypes[selectedMethod][variable];
    }
    function getValidationRules(selectedMethod, variable) {
      const fieldType = getFieldType(selectedMethod, variable);
      if (fieldType === "int") {
        return [val => !isNaN(val) ? true : "Please provide a valid number"];
      } else if (fieldType === "string") {
        return [val => typeof val === "string" ? true : "Please provide a text"];
      } else if (fieldType === "float") {
        return [val => !isNaN(val) && !Number.isInteger(val) ? true : "Please provide a float value"];
      }
    }
    return {
      files,
      userLoggedIn,
      fileContent,
      columns,
      selectedColumns,
      firstSelectorOptions,
      selectedSecondSelectors,
      secondSelectorOptions,
      sensitiveColumns,
      diversityColumns,
      closenessColumns,
      payload,
      secondSelectorVariables,
      showBtn,
      uploadFile,
      clearSecondSelector,
      onSubmit,
      getValidationRules,
      getFieldType,
    };
  }
};
</script>
