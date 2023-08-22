import { DRender } from 'd-render'
import { inject, ref, provide, reactive } from 'vue'
import { ElTag, ElIcon } from 'element-plus'
import { CaretRight } from '@element-plus/icons-vue'
import logo from "play/src/views/framework/logo";
// import './index.less'
const dRender = new DRender()
const isLayoutType = (type) => dRender.isLayoutType(type)
console.log(dRender.layoutTypeList, 'layoutTypeList')
const CustomTree = {
  props: {
    list: Array,
    modelValue: [String, Number],
    isSub: Boolean
  },
  setup (props) {
    const pageDesign = inject('pageDesign', {})
    return () => <div class={{ 'structure-tree': !props.isSub, 'structure-sub-tree': props.isSub }}>{props.list.map(item => {
      console.log(item, 'CustomTree', item.config.type)
      const isLayout = isLayoutType(pageDesign?.drawTypeMap?.[item.config.type] ?? item.config.type)
      console.log(isLayout, 'isLayout')
      if (isLayout) {
        return <CustomTreeParent modelValue={props.modelValue} item={item}/>
      }
      return <CustomTreeItem modelValue={props.modelValue} item={item}/>
    })}
    </div>
  }
}
const CustomTreeParent = {
  props: { item: Object, modelValue: [String, Number] },
  setup (props) {
    const isExpand = ref(false)
    const toggleExpand = () => {
      isExpand.value = !isExpand.value
    }
    const pageStructure = inject('page-structure', {})
    return () => <div class={['structure-sub-tree', { 'is-expand': isExpand.value, 'is-active': props.modelValue === props.item.id }]}>
      <div class={'structure-sub-tree__title'} onClick={(e) => {
        if (e.target === e.currentTarget) {
          pageStructure.onSelect(props.item)
        }
      }}>
        <ElIcon class={['structure-sub-tree__title__icon', { 'is-expand': isExpand.value }]}
                onClick={() => toggleExpand()}><CaretRight/></ElIcon>
        {props.item.config.type}
      </div>
      <div class={['structure-sub-tree__panel', { 'is-expand': isExpand.value }]}>
        {props.item.config.options.map((option, idx) => <div key={`${option.key}-${idx}`}>
          {/* <ElTag type={'info'}>slot-{option.key}</ElTag> */}
          <div style={'padding-left: 4px;'}>
            <CustomTree isSub={true} modelValue={props.modelValue} list={option.children}/>
          </div>
        </div>)}
      </div>
    </div>
  }
}
const CustomTreeItem = {
  props: { item: Object, modelValue: [String, Number] },
  setup (props) {
    const pageStructure = inject('page-structure', {})
    return () => <div class={['structure-tree__item', { 'is-active': props.modelValue === props.item.id }]}
                      onClick={() => pageStructure.onSelect(props.item)}
    ><span>{props.item.config.type}（{props.item.key}）</span></div>
  }
}

export default {
  props: {
    list: Array,
    modelValue: [String, Number]
  },
  emits: ['update:selectItem'],
  setup (props, { emit }) {
    provide('page-structure', reactive({
      activeId: props.modelValue,
      onSelect: (item) => {
        emit('update:selectItem', item)
      }
    }))
    return () => <div class={'page-design-structure'}>
      <CustomTree
        modelValue={props.modelValue}
        list={props.list}>
      </CustomTree>

    </div>
  }
}
