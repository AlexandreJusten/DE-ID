<template>
  <div class="q-pa-md" style="max-width: 400px; margin-top: 10%">
    <!-- <q-item-label header style="text-align: center">Login</q-item-label> -->
    <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
      <q-input
        filled
        v-model="username"
        label="UserName"
        lazy-rules
        :rules="[(val) => (val && val.length > 0) || 'Please type something']"
      />

      <q-input filled type="password" v-model="password" label="Password" />

      <q-toggle v-model="accept" label="I accept the license and terms" />

      <div>
        <q-btn label="Login" type="submit" color="primary" />
        <q-btn
          label="Register"
          color="primary"
          flat
          class="q-ml-sm"
          @click="onRegister"
        />
      </div>
    </q-form>
  </div>
</template>

<script>
import { useQuasar } from "quasar";
import { ref } from "vue";
import axios from "axios";
import { useAuthStore } from "stores/user";
import { useRouter } from "vue-router";

export default {
  setup() {
    const $q = useQuasar();

    const username = ref(null);
    const password = ref(null);
    const accept = ref(false);
    const authStore = useAuthStore();
    const router = useRouter();

    const onSubmit = async (event) => {
      event.preventDefault();

      if (accept.value !== true) {
        $q.notify({
          color: "red-5",
          textColor: "white",
          icon: "warning",
          message: "You need to accept the license and terms first",
        });
      } else {
        try {
          const response = await axios.post(
            "http://secstor.canoinhas.ifsc.edu.br:40123/login",
            {
              username: username.value,
              password: password.value,
            }
          );
          const token = response.data.token;
          console.log("Received token:", token);
          authStore.setToken(token);
          router.push({ path: "/" });
        } catch (error) {
          console.error("Error:", error);
        }
      }
    };

    const onRegister = async (event) => {
      event.preventDefault();

      if (accept.value !== true) {
        $q.notify({
          color: "red-5",
          textColor: "white",
          icon: "warning",
          message: "You need to accept the license and terms first",
        });
      } else {
        try {
          const response = await axios.post(
            "http://secstor.canoinhas.ifsc.edu.br:40123/register",
            {
              username: username.value,
              password: password.value,
            }
          );
          const token = response.data.token;
          console.log("Received token:", token);
          authStore.setToken(token);
          router.push({ path: "/" });
        } catch (error) {
          console.error("Error:", error);
        }
      }
    };
    const onReset = () => {
      username.value = null;
      password.value = null;
      accept.value = false;
    };

    return {
      username,
      password,
      accept,
      onSubmit,
      onRegister,
      onReset,
    };
  },
};
</script>
