import request from '@/utils/request'

export function fetchList(query) {
  var params = {
    page: query.page - 1,
    per_page: query.limit
  }
  if (query.create_time_range && query.create_time_range.length) {
    params.create_time_range = query.create_time_range
  }
  if (query.username !== '') {
    params.username = query.username
  }
  return request({
    url: '/admin/v1/orders',
    method: 'get',
    params
  })
}
