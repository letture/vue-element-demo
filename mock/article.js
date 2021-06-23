const Mock = require('mockjs');
const List = [];
const count = 100;

const baseContent = '<p>I am testing data, I am testing data.</p><p><img src="https://wpimg.wallstcn.com/4c69009c-0fd4-4153-b112-6cb53d1cf943"></p>'
const image_uri = 'https://wpimg.wallstcn.com/e4558086-631c-425c-9430-56ffb46e70b3'

for (let i = 0; i < count; i++) {
    List.push(Mock.mock({
        id: '@increment',
        timestamp: +Mock.Random.date('T'),
        author: '@first',
        reviewer: '@first',
        title: '@title(5, 10)',
        content: baseContent,
        'status|1': [0,1,2],
        'category_id|1': [1,2],
        image_uri,
    }))
}

module.exports = [
    {
        url: '/vue-admin-template/article/list',
        type: 'post',
        response: config => {
            const { status, title, page = 1, limit = 20, sort } = config.query

            let mockList = List.filter(item => {
                if (status && item.status !== status) return false
                if (title && item.title.indexOf(title) < 0) return false
                return true
            })

            if (sort === '-id') {
                mockList = mockList.reverse()
            }

            const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1))

            return {
                code: 20000,
                data: {
                    total: mockList.length,
                    items: pageList
                }
            }
        }
    },
    {
        url: '/vue-admin-template/article/add',
        type: 'post',
        response: _ => {
            return {
                code: 20000,
                data: 'success'
            }
        }
    },
    {
        url: '/vue-admin-template/article/edit',
        type: 'post',
        response: _ => {
            return {
              code: 20000,
              data: 'success'
            }
        }
    },
    {
        url: '/vue-admin-template/article/delete',
        type: 'get',
        response: _ => {
            return {
                code: 20000,
                data: 'success'
            }
        }
    },
    {
        url: '/vue-admin-template/article/detail',
        type: 'get',
        response: config => {
          const { id } = config.query
          for (const article of List) {
            if (article.id === +id) {
              return {
                code: 20000,
                data: article
              }
            }
          }
        }
    },
]