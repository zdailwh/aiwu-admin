const Mock = require('mockjs')

const List = []
const count = 100

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    am_pm: 1,
	apply_date: "2021-05-03",
	area: "城区",
	city: "晋城市",
	contract_number: "18601949678",
	created_at: '@datetime',
	id: '@increment',
	idc_no: "140430199004083223",
	name: "赵丹",
	no: 3,
	officer_name: "东西派出所",
	province: "山西省",
	sex: 2,
	updated_at: '@datetime',
	user_id: 2
  }))
}

module.exports = [
  {
    url: '/admin/v1/orders',
    type: 'get',
    response: config => {
      const { importance, type, title, page = 0, per_page = 20, sort } = config.query

      let mockList = List.filter(item => {
        if (importance && item.importance !== +importance) return false
        if (type && item.type !== type) return false
        if (title && item.title.indexOf(title) < 0) return false
        return true
      })

      if (sort === '-id') {
        mockList = mockList.reverse()
      }

      const pageList = mockList.filter((item, index) => index < per_page * (page + 1) && index >= per_page * page)

      return {
        total: mockList.length,
        items: pageList
      }
    }
  }
]