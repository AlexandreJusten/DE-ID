<template>
  <div class="login-page">
    <div class="q-pa-md box">
      <pre class="json-text">{{ jsonResult }}</pre>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from "src/stores/user";
import { useRouter } from "vue-router";

const authStore = useAuthStore();
export default {
  props: {
    id: String,
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
