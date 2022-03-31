<template>
  <v-app>
    
    <v-main>
      <Grid/>
    </v-main>

  </v-app>
</template>

<script>
import Grid from './components/Grid';

export default {
  name: 'App',

  components: {
    Grid,
  },

  data: () => ({
    //
  }),

};
</script>
