import request from '@/utils/request'

export function fetchList(query) {
  var params = {
    page: query.page,
    per_page: query.limit
  }
  if (query.date_range && query.date_range.length) {
    params.begin_date = query.date_range[0]
    params.end_date = query.date_range[1]
  }
  if (query.name !== '') {
    params.name = query.name
  }
  if (query.sex !== '') {
    params.sex = query.sex
  }
  return request({
    url: '/admin/list',
    method: 'get',
    params
  })
}

export function editDate(data) {
  return request({
    url: '/admin/edit_apply',
    method: 'post',
    data: data
  })
}
