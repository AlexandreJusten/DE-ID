<template>
  <div class="login-page">
    <div class="login-container">
      <q-avatar square>
        <img src="../../public/icons/icon.png" />
      </q-avatar>
      <LoginForm />
    </div>
  </div>
</template>

<script>
import LoginForm from "src/components/LoginForm.vue";

export default {
  name: "LoginPage",
  components: { LoginForm },
};
</script>

<style scoped>
/* Estilos do componente aqui */

.login-page {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f4f4f4;
}

.login-container {
  background-color: #ffffff;
  padding: 20px;
  border-radius: 20px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
}

h1 {
  font-size: 24px;
  margin-bottom: 20px;
}

/* Estilos para o componente LoginForm.vue podem ser adicionados aqui, se necessário */
</style>
