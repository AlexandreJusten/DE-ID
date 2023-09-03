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

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      style="
        box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
        background-color: #f6f5f5;
      "
    >
      <q-list style="padding: 0%; margin-top: 0%">
        <q-item-label header>Essential Links</q-item-label>
        <q-item
          clickable
          rel="noopener"
          to="/"
          exact
          style="box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1)"
        >
          <q-item-section avatar>
            <q-icon name="api" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Anonymize</q-item-label>
          </q-item-section>
        </q-item>
        <q-item
          clickable
          rel="noopener"
          to="/historic"
          style="box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1); margin-top: 2vh"
        >
          <q-item-section avatar>
            <q-icon name="description" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Historic</q-item-label>
          </q-item-section>
        </q-item>

        <q-item
          clickable
          rel="noopener"
          to="/login"
          style="box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1); margin-top: 2vh"
        >
          <q-item-section avatar>
            <q-icon name="logout" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Exit</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref } from "vue";

export default defineComponent({
  name: "MainLayout",

  components: {},

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
