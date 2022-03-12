import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import AdvTable from '../src/table.vue'
import {
  ElTable,
  ElTableColumn,
  ElPagination,
  ElButton,
  ElLoading,
  ElIcon,
  ElTooltip,
  ElConfigProvider,
  useGlobalConfig,
} from 'element-plus'
jest.useFakeTimers()
const mockPush = jest.fn()
const loadFn = jest.fn(() =>
  Promise.resolve({
    data: [
      {
        id: '1',
        name: 1,
      },
      {
        id: '2',
        name: 2,
      },
    ],
  })
)

jest.mock('vue-router', () => ({
  useRouter: () => ({
    replace: mockPush,
  }),
  useRoute: () => ({
    query: {
      p: 8,
      s: 10,
      a: 1,
      b: 2,
    },
    path: '/home',
  }),
}))
const getHeaders = () => {
  return [
    {
      label: '姓名',
      prop: 'name',
    },
    {
      label: 'id',
      prop: 'id',
    },
    {
      label: '格式化',
      prop: 'formatName',
      width: 120,
      align: 'center',
      format(val) {
        return `i am ${val.name}test`
      },
    },
  ]
}

describe('AdvTable', () => {
  const wrapper = mount(
    {
      data() {
        return {
          headers: getHeaders(),
        }
      },
      components: {
        AdvTable,
        ElTable,
        ElTableColumn,
        ElPagination,
        ElButton,
        ElLoading,
        ElIcon,
        ElTooltip,
        ElConfigProvider,
        useGlobalConfig,
      },
      template: `
      <adv-table :source="getData" :headers="headers" ref="table">
        <el-table-column prop="failName" label="不出现" />
        <template #name>
          <el-table-column prop="name" label="姓名" />
        </template>   
        <template #id>
          <el-table-column prop="id" label="id" />
        </template>  
        <template #formatName>
          <el-table-column prop="formatName" label="格式化" />
        </template>
        <template #footer>
          <div class="custom-footer" @click="refresh">footer</div>
        </template>   
      </adv-table>
    `,
      methods: {
        getData() {
          return loadFn()
        },
        refresh() {
          ;(this.$refs.table as any).refresh()
        },
      },
    },
    {
      attachTo: 'body',
    }
  )
  it('rendering is correct', async () => {
    await nextTick()
    expect(loadFn).toBeCalledTimes(1)
    const advTableCom = wrapper.findComponent({
      name: 'AdvTable',
    })
    expect(advTableCom.exists()).toBe(true)
    const elTableCom = wrapper.getComponent({
      name: 'ElTable',
    })
    const ths = elTableCom.findAll('thead th')
    expect(ths.map((node) => node.text()).filter((o) => o)).toEqual([
      '姓名',
      'id',
      '格式化',
    ])
    const rightPollingBtn = wrapper.find('.right-polling')
    const rightFreshBtn = wrapper.find('.right-fresh')
    const rightcolumnBtn = wrapper.find('.right-column')
    expect(rightPollingBtn.exists()).toBe(false)
    expect(rightFreshBtn.exists()).toBe(false)
    expect(rightcolumnBtn.exists()).toBe(true)
  })
  it('rendering refresh-btn is correct', async () => {
    wrapper.setProps({
      hasRefreshBtn: true,
    })
    await nextTick()
    const rightFreshBtn = wrapper.find('.right-fresh')
    expect(rightFreshBtn.exists()).toBe(true)
    rightFreshBtn.trigger('click')
    expect(loadFn).toBeCalledTimes(2)
  })

  it('rendering polling-btn is correct', async () => {
    wrapper.setProps({
      hasPollingBtn: true,
    })
    await nextTick()
    const rightFreshBtn = wrapper.find('.right-polling')
    expect(rightFreshBtn.exists()).toBe(true)
  })
})
