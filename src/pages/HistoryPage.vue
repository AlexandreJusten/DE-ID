<template>
  <q-card class="q-ma-md q-pa-md">
    <div class="text-h6 q-pb-md q-pl-sm">History</div>
    <div v-if="!isLoading">
      <div class="q-pa-md" style="width: 100%;">
        <q-list bordered separator style="min-width: 350px; width: 100%;">
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
    <div class="q-pa-md flex flex-center loading-center" v-if="isLoading">
      <q-circular-progress indeterminate rounded size="50px" color="light-blue" class="q-ma-md" />
    </div>
  </q-card>
</template>

<script>
import { useAuthStore } from "src/stores/user";
import routers from "../../config/routers.json";

export default {
  data() {
    return {
      isLoading: true,
      routers,
      items: [],
      sessionToken: "3493543d769aa2bdbaefa52e7469e3fd397f4572",
    };
  },

  computed: {
    STATUS_COLORS() {
      return {
        COMPLETED: 'green',
        COMPLETED_WITH_ERRORS: 'orange',
        ERROR: 'red',
        PENDING: 'primary',
      };
    },
    STATUS_LABELS() {
      return {
        COMPLETED: 'Completed',
        COMPLETED_WITH_ERRORS: 'Completed With Errors',
        ERROR: 'Error',
        PENDING: 'Pending',
      };
    },
  },

  methods: {
    getStatusColor(status) {
      return this.STATUS_COLORS[status] || 'primary';
    },
    formatStatus(status) {
      return this.STATUS_LABELS[status] || 'gray';
    },
  },

  async mounted() {
    const authStore = useAuthStore();
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
        this.isLoading = false;
      } else {
        console.error("Error fetching data:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
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
