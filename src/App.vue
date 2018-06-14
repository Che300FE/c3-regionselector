<template>
  <div id="app">
    <area-selector
      :visiable="true"
      :select-finsh="selectFinsh"
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
  },
  methods: {
	  selectFinsh (city, provice) {
      console.log('城市数据 >>>', city, '省份数据 >>>', provice);
    }
  }
}
</script>
