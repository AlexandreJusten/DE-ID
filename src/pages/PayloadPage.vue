<template>
  <div class="q-pa-md q-gutter-sm">
    <q-card class="q-pa-md">
      <div class="text-h6 q-pb-md q-pl-sm">Manual</div>
      <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
        <q-input v-model="payload" filled type="textarea" label="Payload" />
        <div align="right">
          <q-btn label="Submit" type="submit" color="primary" />
          <q-btn label="Reset" type="reset" color="primary" flat class="q-ml-sm" />
        </div>
      </q-form>
    </q-card>
  </div>
</template>

<script>
import { useQuasar } from 'quasar'
import { ref } from 'vue'
import routers from "../../config/routers.json";
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from "src/stores/user";

export default {
  setup() {
    const $q = useQuasar()
    const router = useRouter()

    const payload = ref(null)

    return {
      payload,

      async onSubmit() {
        try {
          const parsedPayload = JSON.parse(payload.value)

          if (parsedPayload && parsedPayload != {}) {
            try {
              const authStore = useAuthStore();

              const response = await fetch(routers.ASYNC, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Token ${authStore.token}`,
                },
                body: JSON.stringify(parsedPayload)
              });

              if (response.ok) {
                const data = await response.json();

                router.push(`/history/${data.task_id}`);

              } else {
                $q.notify({
                  color: 'red',
                  textColor: 'white',
                  icon: 'error',
                  message: "Bad Request".concat(" ", response.status)
                })
              }
            } catch (error) {
              $q.notify({
                color: 'red',
                textColor: 'white',
                icon: 'error',
                message: error
              })
            }
          } else {
            $q.notify({
              color: 'red',
              textColor: 'white',
              icon: 'error',
              message: 'JSON is Empty'
            })
          }
        } catch (error) {
          $q.notify({
            color: 'red',
            textColor: 'white',
            icon: 'error',
            message: 'Invalid JSON'
          })
        }
      },

      onReset() {
        payload.value = null
      }
    }
  }
}
</script>
