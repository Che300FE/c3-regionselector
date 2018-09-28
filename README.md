# che_area_selector

> 车300地区选择器组件

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build
```

For detailed explanation on how things work, consult the [docs for vue-loader](http://vuejs.github.io/vue-loader).


## 注意

默认是按照flexible设置的rem值，如果需要兼容老版本的1rem=50px，使用对应如下的scss

```
c3-regionselector/src/widget/indexList.vue
// import '@/sass/widget/indexList_50px.scss';

c3-regionselector/src/components/areaSelector.vue
// import '@/sass/areaSelector_50px.scss';
```
