<template>
  <div class="q-pa-sm" style="margin-top: 2vh">
    <div class="row justify-between">
      <div class="col-4"></div>
      <div class="col-2">
        <q-btn-dropdown
          split
          class="glossy"
          color="primary"
          label="Download"
          @click="onMainClick"
        >
          <q-list>
            <q-item clickable v-close-popup @click="downloadJson">
              <q-item-section avatar>
                <q-avatar
                  icon="description"
                  color="primary"
                  text-color="white"
                />
              </q-item-section>
              <q-item-section>
                <q-item-label>Json</q-item-label>
              </q-item-section>
            </q-item>

            <q-item clickable v-close-popup @click="downloadCsv">
              <q-item-section avatar>
                <q-avatar
                  icon="assignment"
                  color="secondary"
                  text-color="white"
                />
              </q-item-section>
              <q-item-section>
                <q-item-label>CSV</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </div>
    </div>
  </div>
  <MountTable :json-data="jsonResult" />
  <pre class="json-text">{{ jsonResult }}</pre>
</template>

<script>
import MountTable from "src/components/MountTable.vue";
import { useAuthStore } from "src/stores/user";
import { useRouter } from "vue-router";

const authStore = useAuthStore();
export default {
  props: {
    id: String,
  },
  setup() {
    return {
      onMainClick() {
        // console.log('Clicked on main button')
      },
    };
  },
  data() {
    return {
      items: {
        results: [],
      },
      sessionToken: "3493543d769aa2bdbaefa52e7469e3fd397f4572",
      jsonResult: null,
    };
  },
  async mounted() {
    const url = "http://secstor.canoinhas.ifsc.edu.br:40123";
    const task_id = "result_detail";
    const item_id = this.id;

    try {
      const response = await fetch(`${url}/${task_id}/${item_id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${authStore.token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        this.items.results = data.results;

        this.jsonResult = JSON.stringify(data, null, 2);
      } else {
        console.error("Erro ao buscar os dados:", response.statusText);
      }
    } catch (error) {
      console.error("Erro ao buscar os dados:", error);
    }
  },
  methods: {
    async downloadJson() {
      // Verifique se há dados JSON disponíveis
      if (!this.jsonResult) {
        console.error("Nenhum dado JSON disponível para download.");
        return;
      }
      // Crie um blob JSON
      const jsonBlob = new Blob([this.jsonResult], {
        type: "application/json",
      });
      // Crie um URL temporário para o blob
      const jsonUrl = URL.createObjectURL(jsonBlob);
      // Crie um elemento de link para iniciar o download
      const link = document.createElement("a");
      link.href = jsonUrl;
      link.download = "data.json";
      // Simule um clique no link para iniciar o download
      link.click();
      // Libere o URL do objeto temporário
      URL.revokeObjectURL(jsonUrl);
    },
    async downloadCsv() {
      // Verifique se há dados CSV disponíveis (você deve implementar a conversão para CSV)
      if (!this.items.results) {
        console.error("Nenhum dado CSV disponível para download.");
        return;
      }
      // Implemente a lógica de conversão para CSV aqui
      // Crie um blob CSV (substitua 'csvData' pela string CSV gerada)
      const csvBlob = new Blob([csvData], { type: "text/csv" });
      // Crie um URL temporário para o blob
      const csvUrl = URL.createObjectURL(csvBlob);
      // Crie um elemento de link para iniciar o download
      const link = document.createElement("a");
      link.href = csvUrl;
      link.download = "data.csv";
      // Simule um clique no link para iniciar o download
      link.click();
      // Libere o URL do objeto temporário
      URL.revokeObjectURL(csvUrl);
    },
  },
  components: { MountTable },
};
</script>

<style scoped>
.login-page {
  display: flex;
  justify-content: left;
  align-items: left;
  margin-top: 1%;
}
.box {
  overflow-y: hidden;
}

.json-text {
  max-width: 80%;
  overflow-x: auto;
  white-space: pre-wrap;
}

h1 {
  font-size: 24px;
  margin-bottom: 20px;
}
</style>
