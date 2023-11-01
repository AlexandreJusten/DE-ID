<template>
  <div class="login-page">
    <div class="q-pa-md" style="width: 90%;">
      <q-list bordered separator style="min-width: 350px; width: 100%">
        <q-item
          v-for="item in items"
          :key="item.task_id"
          clickable
          v-ripple
          :to="'/history/' + item.task_id"
        >
          <q-item-section>
            <q-item-label>
              {{ item.description }}
              <q-badge rounded :color="getStatusColor(item.status)">
                {{ formatStatus(item.status) }}
              </q-badge>
            </q-item-label>
            <q-item-label caption>{{ item.task_id }}</q-item-label>
            <q-item-label caption>{{ item.created_at }}</q-item-label>
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

const STATUS_COLORS = {
  COMPLETED: 'green',
  COMPLETED_WITH_ERRORS: 'orange',
  ERROR: 'red',
  PENDING: 'primary',
};

const STATUS_LABELS = {
  COMPLETED: 'Completed',
  COMPLETED_WITH_ERRORS: 'Completed With Errors',
  ERROR: 'Error',
  PENDING: 'Pending',
};

export default {
  data() {
    return {
      routers,
      items: [],
      sessionToken: "3493543d769aa2bdbaefa52e7469e3fd397f4572",
    };
  },

  methods: {
    getStatusColor(status) {
      return STATUS_COLORS[status] || 'primary';
    },
    formatStatus(status) {
      return STATUS_LABELS[status] || 'gray';
    },
  },

  async mounted() {
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
        this.items = data;
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
  justify-content: center; /* Centralizar horizontalmente */
  align-items: center; /* Centralizar verticalmente */
  height: 100vh; /* Tornar a tela inteira visível */
}

/* Conteúdo responsivo */
.q-item-label {
  max-width: 100%; /* Conteúdo se ajustará à largura máxima */
}

h1 {
  font-size: 24px;
  margin-bottom: 20px;
}
</style>
