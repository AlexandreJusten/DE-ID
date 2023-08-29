<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title>
          <q-avatar square>
            <img src="../../public/icons/icon.png" />
          </q-avatar>
        </q-toolbar-title>

        <div>De-Id v0.1</div>
        <a
          href="https://de-id.readme.io/reference/getting-started-with-your-api-1"
          target="_blank"
        >
          <q-btn color="blue-4" size="0.9em" style="margin-left: 7px">
            <q-icon left size="2em" name="map" />
            <div>Doc</div>
          </q-btn>
        </a>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <LoginForm />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref } from "vue";
import LoginForm from "src/components/LoginForm.vue";

export default defineComponent({
  name: "MainLayout",

  components: {
    LoginForm,
  },

  setup() {
    const leftDrawerOpen = ref(false);

    return {
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
    };
  },
});
</script>
