<template>
  <MountTable :json-data="jsonResult" />
</template>

<script>
import MountTable from "src/components/MountTable.vue";
import { useAuthStore } from "src/stores/user";
import routers from "../../config/routers.json";

export default {
  props: {
    id: String,
  },
  data() {
    return {
      items: {
        results: [],
      },
      jsonResult: null,
    };
  },
  async mounted() {
    const authStore = useAuthStore();
    const item_id = this.id;
    let not_result = true;
    
    const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));

    while (not_result) {
      try {
        const response = await fetch(routers.RESULTS_DETAILS + `${item_id}`, {
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
          not_result = false;
        } else {
          console.error("", response.statusText);
        }
      } catch (error) {
        console.error("", error);
      }
      await sleep(5000);
    }
  },
  components: { MountTable },
};
</script>
