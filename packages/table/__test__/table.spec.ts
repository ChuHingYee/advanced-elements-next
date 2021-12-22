import { shallowMount, enableAutoUnmount, mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import AdvTable from '../src/table.vue'
import { ElLoadingDirective } from 'element-plus'
const mockPush = jest.fn()
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
      {
        id: '1',
        name: 1,
      },
      {
        id: '2',
        name: 2,
      },
      {
        id: '1',
        name: 1,
      },
      {
        id: '2',
        name: 2,
      },
      {
        id: '1',
        name: 1,
      },
      {
        id: '2',
        name: 2,
      },
      {
        id: '1',
        name: 1,
      },
      {
        id: '2',
        name: 2,
      },
    ],
    size: 10,
    totalPage: 2,
    total: 20,
  })
)
const headers = [
  {
    label: '姓名',
    prop: 'name',
  },
  {
    label: '地址',
    prop: 'address',
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
describe('AdvTable', () => {
  it('table init', () => {
    const wrapper = shallowMount(AdvTable, {
      global: {
        directives: {
          Loading: ElLoadingDirective,
        },
      },
      props: {
        data: [
          {
            name: 'test',
          },
        ],
      },
    })
    const tableDiv = wrapper.findComponent({
      name: 'AdvTable',
    })
    expect(tableDiv.exists()).toBe(true)
    enableAutoUnmount(() => {
      wrapper.unmount()
    })
  })
  it('table init localPage and localSize from query', () => {
    const wrapper = shallowMount(AdvTable, {
      props: {
        source: loadFn,
        isRecord: true,
      },
      global: {
        directives: {
          Loading: ElLoadingDirective,
        },
      },
    })
    const vm = wrapper.vm
    expect(vm.localCurrentPage).toBe(8)
    expect(vm.localPageSize).toBe(10)
    expect(loadFn).toBeCalledTimes(1)
    // enableAutoUnmount(() => {
    //   wrapper.unmount()
    // })
  })
  it('table init with not autoRequest', () => {
    const wrapper = shallowMount(AdvTable, {
      props: {
        source: loadFn,
        autoRequest: false,
      },
      global: {
        directives: {
          Loading: ElLoadingDirective,
        },
      },
    })
    const vm = wrapper.vm
    expect(loadFn).toBeCalledTimes(1)
    vm.refresh(true)
    expect(loadFn).toBeCalledTimes(2)
  })
  it('table init with isManual', async () => {
    const wrapper = shallowMount(AdvTable, {
      props: {
        source: loadFn,
        isManual: true,
      },
      global: {
        directives: {
          Loading: ElLoadingDirective,
        },
      },
    })
    const tableDiv = wrapper.findComponent({
      name: 'AdvTable',
    })
    expect(loadFn).toBeCalledTimes(3)
    expect(tableDiv.exists()).toBe(true)
    const button = tableDiv.findComponent({
      name: 'ElButton',
    })
    await button.trigger('click')
    expect(loadFn).toBeCalledTimes(4)
  })
  it('table setting loading', async () => {
    const wrapper = shallowMount(AdvTable, {
      props: {
        data: [
          {
            name: 'test',
          },
        ],
      },
      global: {
        directives: {
          Loading: ElLoadingDirective,
        },
      },
    })
    const vm = wrapper.vm
    expect(vm.localLoading).toBe(false)
    vm.setLoading(true)
    expect(vm.localLoading).toBe(true)
  })
  it('table without pagination', async () => {
    const wrapper = shallowMount(AdvTable, {
      props: {
        source: loadFn,
        hasPage: false,
      },
      global: {
        directives: {
          Loading: ElLoadingDirective,
        },
      },
    })
    expect(wrapper.find('.advtable').find('.advtable-page').exists()).toBe(
      false
    )
  })
  it('table without pagination', async () => {
    const wrapper = shallowMount(AdvTable, {
      props: {
        source: loadFn,
        hasPage: false,
      },
      global: {
        directives: {
          Loading: ElLoadingDirective,
        },
      },
    })
    expect(wrapper.find('.advtable').find('.advtable-page').exists()).toBe(
      false
    )
  })
  it('table init with headers prop', async () => {
    const wrapper = mount(AdvTable, {
      props: {
        source: loadFn,
        headers,
        hasPage: false,
      },
      global: {
        directives: {
          Loading: ElLoadingDirective,
        },
      },
    })
    await nextTick()
    const ths = wrapper.findAll('thead th')
    expect(ths.map((node) => node.text()).filter((o) => o)).toEqual([
      '姓名',
      '地址',
      '格式化',
    ])
  })
})
