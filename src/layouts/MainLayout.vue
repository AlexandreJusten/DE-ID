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
            <img src="/icons/icon.png" />
          </q-avatar>
        </q-toolbar-title>

        <a href="https://de-id.readme.io/reference/getting-started-with-your-api-1" target="_blank">
          <q-btn color="blue-4" size="0.9em" style="margin-left: 7px">
            <div>docs</div>
            <q-icon right size="xs" name="open_in_new" />
          </q-btn>
        </a>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      style="background-color: #f6f5f5;"
    >
      <q-list style="padding: 0%; margin-top: 0%">
        <div class="column">
          <div class="row justify-between">
            <q-item-label header>De-ID v1.0 <q-badge rounded color="red-4" label="demo"/></q-item-label>
            <q-btn flat rel="noopener" to="/login"><q-icon name="logout" /></q-btn>
          </div>
        </div>
        
        <q-separator inset />
        <q-item
          clickable
          rel="noopener"
          to="/"
          exact
          class="q-mt-md"
        >
          <q-item-section avatar>
            <q-icon name="security" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Anonymize</q-item-label>
          </q-item-section>
        </q-item>
        <q-item
          clickable
          rel="noopener"
          to="/payload"
          exact
        >
          <q-item-section avatar>
            <q-icon name="edit_note" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Manual</q-item-label>
          </q-item-section>
        </q-item>
        <q-item
          clickable
          rel="noopener"
          to="/history"
        >
          <q-item-section avatar>
            <q-icon name="history" />
          </q-item-section>
          <q-item-section>
            <q-item-label>History</q-item-label>
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

  setup() {
    const leftDrawerOpen = ref(false);

    const toggleLeftDrawer = () => {
      leftDrawerOpen.value = !leftDrawerOpen.value;
    };

    return {
      leftDrawerOpen,
      toggleLeftDrawer,
    };
  },
});
</script>
