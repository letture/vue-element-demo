const list = [
    {id: 1, title: '汽车'},
    {id: 2, title: '电器'},
]

module.exports = [
    {
        url: '/vue-admin-template/category/list',
        type: 'get',
        response: _ => {
            return {
                code: 20000,
                data: list
            }
        }
    },
    {
        url: '/vue-admin-template/category/add',
        type: 'post',
        response: _ => {
            return {
                code: 20000,
                data: 'success'
            }
        }
    },
    {
        url: '/vue-admin-template/category/edit',
        type: 'post',
        response: _ => {
            return {
                code: 20000,
                data: 'success'
            }
        }
    },
    {
        url: '/vue-admin-template/category/delete',
        type: 'get',
        response: _ => {
            return {
                code: 20000,
                data: 'success'
            }
        }
    },
]