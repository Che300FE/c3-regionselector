<template>
  <div class="index-list__wrapper">
    <div class="side-bar__wrapper" 
      v-if="showTarBar"
      @touchstart="handleTouchstart" 
      @touchmove="handleTouchmove">
      <span class="side-bar__tar"
        v-for="(tar, index) in sideBarList"
        :key="index">{{tar}}</span>
    </div>
    <div class="index-list__content">
      <slot name="header"></slot>
      <ul class="list__content">
        <li class="list__item"
          v-for="(value, key) in areaData"
          :key="key" 
          :data-index="key">
          <p class="list__title">{{key}}</p>
          <ul class="list__sub-list">
            <li class="list__sub-item"
              v-for="item in value"
              @click.stop="itemClick(item, key, areaData)"
              :key="item.id">
              <div class="list__sub-item-name">{{item.name}}</div>
              <ul class="city__list" 
                v-show="item.toggle && item.tarIndex !== '#'">
                <li class="city__item" 
                  v-for="city in item.cities"
                  @click.stop="subItemClick(city)"
                  :key="city.id">{{city.name}}</li>
              </ul>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import '@/sass/widget/indexList.scss';
export default {
  props: {
    areaData: {
      type: Object,
      default: function(){
        return {};
      }
    },
    sideBarList: {
      type: Array,
      default: []
    },
    showTarBar: {
      type: Boolean,
      default: true
    },
    // 点击列表单项的时候的回调函数
    itemClick: {
      type: Function,
      default: function () {}
    },
    // 点击列表单项的子项的回调函数
    subItemClick: {
      type: Function,
      default: function () {}
    },
    wrapStyle: {
      type: Object,
      default: function(){
        return {
          top: '0px',
          bottom: '0px'
        };
      }
    }
  },
  data () {
    return {
      oWrapper: null,     // 滚动外壳DOM对象
      navOffsetX: 0,      // 在右侧bar条上拖动时触摸点距离屏幕左侧的距离
      lastDomTop: 0,      // 上次滚动距离
      wrapperHeight: 0,   // 滚动外壳的高度
      contentHeight: 0,   // 滚动主体的高度
      currentText: '',    // 当前选中的bar条标签
      wrapperTop: 0,      // 滚动外壳距离屏幕顶部的高度
    }
  },
  mounted () {
    this.initWrapperStyle();
    document.body.addEventListener('touchend', this.handleBodyTouchEnd, false);
  },
  methods: {
    initWrapperStyle (){
      this.oWrapper = document.querySelector('.index-list__wrapper');
      this.oWrapper.style.top = this.wrapStyle.top;
      this.wrapperTop = this.wrapStyle.top.split('px')[0];
    },
    handleTouchstart (e) {
      // 如果不是在索引栏开始滑动, 直接return
      if (e.target.className !== 'side-bar__tar') {
        return;
      }

      let oContent = document.querySelector('.index-list__content');
      this.contentHeight = oContent.offsetHeight;
      this.wrapperHeight = this.oWrapper.offsetHeight;

      // 触摸点对象
      let oTouch = e.targetTouches[0];
      // 记录触摸点 距离屏幕左侧的距离
      this.navOffsetX = oTouch.clientX;
      this.scrollMove(oTouch.clientY);
    },
    scrollMove (y) {
      let currentItem = document.elementFromPoint(this.navOffsetX, y);
      let listItems = document.querySelectorAll('.list__item');
      
      if (!currentItem || !currentItem.classList.contains('side-bar__tar')) {
        return;
      }

      // 获取所有 data-index 属性值为当前选中标签值的列表元素
      let targets = [].slice.call(listItems).filter(item => {
        let itemIndexName = item.getAttribute('data-index');
        return itemIndexName === currentItem.innerText;
      });

      // 保证当前触摸的标签为新的标签再进行计算 防止页面重复计算发生抖动
      if (targets.length && currentItem.innerText !== this.currentText) {
        let targetDom = targets[0];
        let moveTop = targetDom.getBoundingClientRect().top - this.wrapperTop;
        // 记录新的标签值
        this.currentText = currentItem.innerText;

        // 当移动之后使得剩下的页面高度不足一屏高度时
        if (moveTop + this.lastDomTop > this.contentHeight - this.wrapperHeight) {
          this.oWrapper.scrollTop = this.lastDomTop = this.contentHeight - this.wrapperHeight;
        } else {
          this.oWrapper.scrollTop = this.lastDomTop = moveTop + this.lastDomTop;
        }
      }
    },
    handleTouchmove (e) {
      // 如果不是在索引栏开始滑动, 直接return
      if (e.target.className !== 'side-bar__tar') {
        return;
      }

      // 阻止默认的滑动
      e.preventDefault();

      // 触摸点对象
      let oTouch = e.targetTouches[0];
      this.scrollMove(oTouch.clientY);
    },
    handleBodyTouchEnd (e) {
      let excludeClassNames = ['side-bar__wrapper', 'side-bar__tar'];
      // 触摸点不是标签bar条
      if (excludeClassNames.indexOf(e.target.className) === -1) {
        (!this.oWrapper) && (this.oWrapper = document.querySelector('.index-list__wrapper'))
        this.lastDomTop = this.oWrapper.scrollTop;
      }
    }
  }
}
</script>
