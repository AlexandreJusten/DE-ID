<template>
  <div class="login-page">
    <div class="q-pa-md">
      <q-list bordered separator style="width: 600px">
        <q-item
          v-for="item in items.results"
          :key="item.task_id"
          clickable
          v-ripple
          :to="'/historic/' + item.task_id"
        >
          <q-item-section>
            <q-item-label>{{ item.created_at }}</q-item-label>
            <q-item-label caption>{{ item.status }}</q-item-label>
            <q-item-label caption>{{ item.task_id }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from "src/stores/user";
import routers from "../../config/routers.json";

const authStore = useAuthStore();
export default {
  data() {
    return {
      routers,
      items: {
        results: [],
      },
      sessionToken: "3493543d769aa2bdbaefa52e7469e3fd397f4572",
    };
  },

  async mounted() {
    const url = "http://secstor.canoinhas.ifsc.edu.br:40123";
    const task_id = "results";

    try {
      const response = await fetch(routers.RESULTS, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${authStore.token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        this.items.results = data.results;
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

h1 {
  font-size: 24px;
  margin-bottom: 20px;
}
</style>
