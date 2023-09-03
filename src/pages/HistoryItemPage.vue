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
      sessionToken: "3493543d769aa2bdbaefa52e7469e3fd397f4572", // Defina seu token aqui
      jsonResult: null, // Variável para armazenar o JSON como texto
    };
  },
  async mounted() {
    const url = "http://secstor.canoinhas.ifsc.edu.br:40123";
    const task_id = "result_detail"; // Substitua com o ID da tarefa desejada
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

        // Converte o objeto JSON em texto e armazena na variável jsonResult
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
/* Estilos do componente aqui */

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
  max-width: 80%; /* Defina a largura máxima desejada */
  overflow-x: auto; /* Adicione uma barra de rolagem horizontal se necessário */
  white-space: pre-wrap; /* Permite a quebra de linha dentro do <pre> */
}

h1 {
  font-size: 24px;
  margin-bottom: 20px;
}

/* Estilos para o componente LoginForm.vue podem ser adicionados aqui, se necessário */
</style>
