<template>
  <div class="area-selector" v-if="visiable">
    <!-- 顶部的bar条开始 -->
    <div class="title-bar" v-if="showTitleBar">
      <div class="go-back__arrow" @click="goBack">
        <img class="back-img" src="https://ssl-assets.che300.com/feimg/bapp/substitution/left-arrow.png">
      </div>
      <h2 class="title-name">选择地区</h2>
    </div>
    <!-- 顶部bar条结束 -->
    <index-list 
      :area-data="oAreaData"
      :show-tar-bar="showTarBar"
      :side-bar-list="sideBarList"
      :item-click="showCities"
      :sub-item-click="selectCity"
      :wrap-style="wrapStyle">
      <!-- 自定义的头部插槽开始 -->
      <div slot="header">
        <div 
          class="header__title list__item" 
          data-index="定"
          v-if="deep === 'city' && type === 'single' && showCurCity === true">
          <p class="header__name">
            当前城市
          </p>
        </div>
        <div 
          class="header__content" 
          v-if="deep === 'city' && type === 'single' && showCurCity === true">
          <div class="cur-city">
            <img class="cur-city__location-img" src="../assets/images/components/areaSelector/city_location@3x.png">
            <span class="cur-city__name">{{curCity}}</span>
          </div>
          <div class="reload" @click.stop="reloadlLocation">
            <img 
              class="reload__relocation-img" 
              :class="{'spin': isReloadCurCity}"
              src="../assets/images/components/areaSelector/city_relocation@3x.png">
            <span class="reload__tip">重新定位</span>
          </div>
        </div>
        <div 
          class="header__title list__item" 
          data-index="热"
          v-if="deep === 'city' && showHotCity === true">
          <p class="header__name">
            热门城市
          </p>
        </div>
        <div 
          class="hot-city__wrapper"
          v-if="deep === 'city' && showHotCity === true">
          <div class="hot-city__item"
            v-for="item in hotCities"
            @click.stop="selectCity(item)"
            :key="item.id">{{item.city_name}}</div>
        </div>
      </div>
      <!-- 自定义的头部插槽结束 -->
    </index-list>
  </div>
</template>

<script>
import Vue from 'vue';
import axios from 'axios';
import areaJson from '@/assets/json/constants.json';
import indexList from '@/widget/indexList';
import '@/sass/areaSelector.scss';
import urls from '@/api/urlConfig';

Vue.prototype.$http = axios;

export default {
  name: 'cheAreaSelector',
  components: {
    indexList
  },
  props: {
    // 是否显示当前的组件
    visiable: {
      type: Boolean,
      default: false
    },
    // 是否显示自定义的h5 bar条
    showTitleBar: {
      type: Boolean,
      default: true
    },
    // 配置是单选还是多选
    // single | mutiple
    type: {
      type: String,
      default: 'single',
    },
    // 选择深度是城市还是省份
    // province | city
    deep: {
      type: String,
      default: 'city',
    },
    // 多选时最多可选项的数目
    maxLength: {
      type: Number,
      default: 10,
    },
    // 城市单选维度下，是否显示当前城市
    showCurCity: {
      type: Boolean,
      default: true
    },
    // 城市选择维度下，是否显示热门城市
    showHotCity: {
      type: Boolean,
      default: true
    },
    // 城市或者省份单选情况下，是否显示选择全国
    showCountry: {
      type: Boolean,
      default: true
    },
    // 城市多选情况下，是否显示选择全省
    showProvince: {
      type: Boolean,
      default: true      
    },
    // 是否显示右侧快速定位导航栏
    showTarBar: {
      type: Boolean,
      default: true
    },
    wrapStyle: {
      type: Object,
      default: function(){
        return {};
      }
    },
    // 自定义的热门城市
    hotCities: {
      type: Array,
      default: function () {
        return [
          {
            "city_id": "1",
            "city_name": "北京",
            "prov_id": "1"
          },
          {
            "city_id": "3",
            "city_name": "上海",
            "prov_id": "3"
          },
          {
            "city_id": "4",
            "city_name": "重庆",
            "prov_id": "4"
          },
          {
            "city_id": "2",
            "city_name": "天津",
            "prov_id": "2"
          },
          {
            "city_id": "11",
            "city_name": "南京",
            "prov_id": "11"
          },
          {
            "city_id": "50",
            "city_name": "深圳",
            "prov_id": "20"
          },
          {
            "city_id": "20",
            "city_name": "广州",
            "prov_id": "20"
          },
          {
            "city_id": "12",
            "city_name": "杭州",
            "prov_id": "12"
          }                                
        ]        
      }
    },
    // 完成选择时调用的函数
    selectFinsh: {
      type: Function,
      default: function(){}
    },
    // 点击左上角返回时调用的函数
    goBack: {
      type: Function,
      default: function(){}
    }
  },
  data () {
    return {
      areaJson,
      // 右侧快速定位标签的默认配置
      baseTars: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N',
                 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'],
      oAreaData: {},
      sideBarList: [],
      // 全国的数据配置
      country: {
        id: '#',
        name: '全国',
        tarIndex: '#'
      },
      // 当前城市的名字
      curCity: '',
      // 是否正在重新定位当前的城市
      isReloadCurCity: false, 
    }
  },
  created () {
    this.setWrapperStyle();
  },
  mounted () {
    if (this.deep === 'city' && this.showCurCity) {
      this.getLocation();
    }
    this.createAreaData(this.areaJson, this.baseTars);
  },
  methods: {
    // 设置 index-list 区域的外壳样式
    setWrapperStyle () {
      // 如果用户没有自定义 top 值
      if (!this.wrapStyle.top) {
        this.wrapStyle.top = this.showTitleBar ? '45px' : '0px';
      }
    },
    getLocation () {
      if (navigator.geolocation) {
        this.isReloadCurCity = true;
        navigator.geolocation.getCurrentPosition(this.showPosition, this.positionError);
      } else {
        console.log('你的浏览器不支持地理定位');
      }
    },
    showPosition (position) {
      console.log(position, position.coords.latitude, position.coords.longitude);
      this.$http.post(urls.queryCityByGeo, {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      }).then(res => {
        this.curCity = res.data.cityName;
        this.isReloadCurCity = false;
      })
    },
    positionError (error) {
      console.log(error);
      let msg = '';
      switch (error.code) {
        case error.PERMISSION_DENIED:
          msg = '用户拒绝了获取地理位置的请求。'
          break;
        case error.POSITION_UNAVAILABLE:
          msg = '位置信息是不可用的。'
          break;
        case error.TIMEOUT:
          msg = '请求用户地理位置超时。'
          break;
        case error.UNKNOWN_ERROR:
          msg = '未知错误。'
          break;      
      }
      this.isReloadCurCity = false;
      alert(msg);
    },
    // 重新定位当前城市
    reloadlLocation () {
      console.log('重新定位当前城市');
      this.getLocation();
    },
    createAreaData (areaJson, baseTars) {
      // 全国所有省和市的数据
      let provis = areaJson.provinces || [];
      let cities = areaJson.city || [];
      // 以标签为key的省数组
      let oTarProvis = {};
      // 以省id为key的市数组
      let oIdsProvis = {};

      oTarProvis = this.createTarProvis(this.baseTars, provis);
      oIdsProvis = this.createIdsProvis(cities);

      this.oAreaData = this.mergeCityIntoProvince(oTarProvis, oIdsProvis);

      // 如需显示右侧定位栏则进行定位栏数据整理
      if (this.showTarBar) {
        this.sideBarList = this.createSideBarList(this.oAreaData);
      }
    },
    // 生成以标签为key的 名字首字母为该key的数组对象
    createTarProvis (baseTars, provis) {
      let tarProvis = {};

      if (this.type === 'single' && this.showCountry === true) {
        this.baseTars.unshift('#');
      }

      baseTars.forEach(tar => {
        tarProvis[tar] = [];
      });

      provis.forEach(province => {
        let curTar = province.sld.substring(0, 1).toUpperCase();
        tarProvis[curTar].push({
          tarIndex: curTar,
          id: province.prov_id,
          name: province.prov_name,
          cities: [],
          toggle: false
        })
      });

      return tarProvis;
    },
    // 生成以省的id为key值的 包含该省下面所有市的数组对象
    createIdsProvis (cities) {
      let idsProvis = {};

      cities.forEach(city => {
        let provId = city.prov_id;

        (!idsProvis[provId]) && (idsProvis[provId] = []);
        idsProvis[provId].push({
          id: city.city_id,
          name: city.city_name
        });
      })

      return idsProvis;
    },
    // 将城市数据合并到省数据内
    mergeCityIntoProvince (oTarProvis, oIdsProvis) {
      if (this.type === 'single' && this.showCountry === true) {
        oTarProvis['#'] = [this.country];
      }

      for (let tar in oTarProvis) {
        // 标签有对应的城市
        if (oTarProvis[tar].length) {
          oTarProvis[tar].forEach(tarProvis => {
            tarProvis.cities = oIdsProvis[tarProvis.id];
          })
        } else {
          delete oTarProvis[tar];
        }
      }

      return oTarProvis;
    },
    // 生成侧边栏数据
    createSideBarList (oAreaData) {
      let sideBarList = [];

      // 城市单选维度下 显示当前城市
      if (this.deep === 'city' && 
          this.type === 'single' &&
          this.showCurCity === true) {
        sideBarList.push('定');
      }

      // 城市选择维度下 显示热门城市
      if (this.deep === 'city' && this.showHotCity === true) {
        sideBarList.push('热');
      }

      for (let tar in oAreaData) {
        sideBarList.push(tar);
      }

      return sideBarList;
    },
    // 只要不是单选省份 点击身份栏都是显示下面对应的城市
    showCities (oProvince, key, areaData) {
      // 城市选择维度下 点击省显示下面对应的城市
      if (this.deep === 'city') {
        oProvince.toggle = !oProvince.toggle;
      }

      // 单选省份
      if (this.deep === 'province' && this.type === 'single') {
        console.log('单选了省份 >>>', oProvince);
        this.selectFinsh(oProvince);
      }

      // TODO 点击全国的时候应该如何交互？？？
    },
    // 点击选择一个城市
    selectCity (city) {
      // 单选城市
      if (this.type === 'single') {
        console.log("单选了城市 >>>", city);
        this.selectFinsh(city);
      }
    }
  }
}
</script>
