import { DrFormDesign } from '@d-render/design'
import '@d-render/design/dist/index.css'
import PlInfo from '@cip/components/page-layout/info'
import { componentsGroupList } from './config'
import { ref } from 'vue'
import schema from './schema'

console.log(schema, 'schema')
export default {
  setup () {
    const schema = ref({})
    const equipment = ref('pc')
    return () => <PlInfo>
      <DrFormDesign
        style={'background: #fff'}
        componentsGroupList={componentsGroupList}
        v-model:schema={schema.value}
        v-model:equipment={equipment.value}
      />
    </PlInfo>
  }
}
