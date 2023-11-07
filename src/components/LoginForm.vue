<template>
  <div class="q-pa-md" style="min-width: 300px; max-width: 400px; margin-top: 10%;">
    <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
      <q-input
        filled
        v-model="username"
        label="Username"
        autocomplete="username"
        lazy-rules
        :rules="[(val) => (val && val.length > 0) || 'Please type something']"
      />

      <q-input
        filled
        type="password"
        v-model="password"
        label="Password"
        autocomplete="current-password"
        :rules="[(val) => (val && val.length > 0) || 'Please type something']"
      />

      <br />

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
import routers from "../../config/routers.json";

export default {
  setup() {
    const $q = useQuasar();
    const username = ref(null);
    const password = ref(null);
    const authStore = useAuthStore();
    const router = useRouter();

    const onSubmit = async (event) => {
      event.preventDefault();

      try {
        const response = await axios.post(routers.LOGIN, {
          username: username.value,
          password: password.value,
        });
        const token = response.data.token;
        authStore.setToken(token);
        router.push({ path: "/" });
      } catch (error) {
        showErrorNotification("Login Failed", "Invalid username or password");
      }
    };

    const onRegister = async (event) => {
      event.preventDefault();

      try {
        const response = await axios.post(routers.REGISTER, {
          username: username.value,
          password: password.value,
        });
        const token = response.data.token;
        authStore.setToken(token);
        router.push({ path: "/" });
      } catch (error) {
        showErrorNotification("Register Failed", "User already registered");
      }
    };

    const onReset = () => {
      username.value = null;
      password.value = null;
    };

    const showErrorNotification = (message, caption) => {
      $q.notify({
        message: message,
        caption: caption,
        icon: 'error',
        color: "red",
      });
    };

    return {
      username,
      password,
      onSubmit,
      onRegister,
      onReset,
      routers,
    };
  },
};
</script>
