import regionSelector from './areaSelector.vue';

const areaSelector = {
    install (Vue) {
        Vue.component(regionSelector.name, regionSelector)
    }
}

if (typeof window !== undefined && window.Vue) {
    window.Vue.use(areaSelector);
}

export default areaSelector