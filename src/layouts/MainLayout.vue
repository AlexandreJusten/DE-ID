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
      style="box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2)"
    >
      <q-list style="padding: 15%; margin-top: -5%">
        <div style="margin-top: 20%">
          <q-btn color="primary" style="width: 200px">
            <div class="ellipsis">OP1</div>
          </q-btn>
        </div>
        <div style="margin-top: 10%">
          <q-btn color="primary" style="width: 200px">
            <div class="ellipsis">OP2</div>
          </q-btn>
        </div>
        <div style="margin-top: 10%">
          <q-btn color="primary" style="width: 200px">
            <div class="ellipsis">OP3</div>
          </q-btn>
        </div>
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
