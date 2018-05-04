<template>
  <div id="app">
    <area-selector
      v-if="defaultCities.length"
      :default-cities="defaultCities"
    ></area-selector>
  </div>
</template>

<script>
import areaSelector from './components/areaSelector';
import axios from 'axios';

export default {
  name: 'app',
  components: {
    areaSelector
  },
  data () {
    return {
        defaultCities:[],
    }
  }
}
</script>
