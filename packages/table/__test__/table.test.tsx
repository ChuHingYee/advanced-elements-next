import { nextTick, ref } from 'vue'
import { mount } from '@vue/test-utils'
import { expect, it, vi } from 'vitest'
import {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ElTable,
  ElTableColumn,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ElPagination,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ElButton,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ElLoading,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ElIcon,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ElTooltip,
} from 'element-plus'
import AdvTable from '../src/table.vue'
import type { VNode } from 'vue'
const mock = {
  getData: () => {
    return Promise.resolve({
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
  },
}
const getDataSpy = vi.spyOn(mock, 'getData')

const _mount = (render: () => VNode) =>
  mount(render, {
    global: {
      config: {
        globalProperties: {
          $router: {
            query: {
              p: 2,
              s: 3,
            },
          },
        },
      },
    },
  })

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
describe('Table.vue', () => {
  // afterEach(() => {
  //   vi.restoreAllMocks()
  // })
  describe('rendering data is correct', async () => {
    const slots = {
      default: () => <ElTableColumn prop="failName" label="不出现" />,
      name: () => <ElTableColumn prop="name" label="姓名" />,
      id: () => <ElTableColumn prop="id" label="id" />,
      formatName: () => <ElTableColumn prop="formatName" label="格式化" />,
      footer: () => <div class="custom-footer">footer</div>,
    }
    const headers = ref(getHeaders())
    const hasRefreshBtn = ref(false)
    const hasPollingBtn = ref(false)
    function getData() {
      return mock.getData()
    }
    const wrapper = _mount(() => (
      <AdvTable
        source={getData}
        headers={headers.value}
        hasRefreshBtn={hasRefreshBtn.value}
        hasPollingBtn={hasPollingBtn.value}
        ref="table"
        v-slots={slots}
      ></AdvTable>
    ))
    await nextTick()
    it('rendering column is correct', async () => {
      await nextTick()
      expect(getDataSpy).toHaveBeenCalledTimes(1)
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
      hasRefreshBtn.value = true
      await nextTick()
      await nextTick()
      // expect(getDataSpy).toHaveBeenCalledTimes(1)
      const rightFreshBtn = wrapper.find('.right-fresh')
      expect(rightFreshBtn.exists()).toBe(true)
      await rightFreshBtn.trigger('click')
      await nextTick()
      expect(getDataSpy).toHaveBeenCalledTimes(2)
    })

    it('rendering polling-btn is correct', async () => {
      hasPollingBtn.value = true
      await nextTick()
      const rightFreshBtn = wrapper.find('.right-polling')
      expect(rightFreshBtn.exists()).toBe(true)
    })
  })
})
