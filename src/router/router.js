const Login = () => import('@/components/Login.vue')
const Home = () => import('@/components/Home.vue')
const Crm = () => import('@/components/authorization/Crm/Crm.vue')
const MenuM = r => require.ensure([], () => r(require('@/components/authorization/MenuM/MenuM.vue')))
const Roles = r => require.ensure([], () => r(require('@/components/authorization/Roles/Roles.vue')))
const templateParent = r => require.ensure([], () => r(require('@/components/contentM/templateParent.vue')))
const TagM = () => import('@/components/contentM/TagM.vue')
const PicM = () => import('@/components/resourceM/PicM.vue')
const Master = () => import('@/components/Master.vue')
const PlatForm = () => import('@/components/PlatForm')

var routes = [
    {
        path: '*',
        redirect: '/login'
    },{
        path: '/login',
        name: 'Login',
        component: Login,
        children: []
    },{
        path: '/homePage',
        name: 'Home',
        component: Home,
        children: [
            {
                path: '/masterPage',
                name: 'masterPage',
                meta: { cache: false },
                component: Master,
                children: [
                    {
                        path: '/userList',
                        name: 'userList',
                        meta: { cache: true },
                        component: Crm
                    },{
                        path: '/menuList',
                        name: 'menuList',
                        meta: { cache: true },
                        component: MenuM
                    },{
                        path: '/roleList',
                        name: 'roleList', 
                        meta: { cache: true },
                        component: Roles
                    },{
                        path: '/specialParent',
                        name: 'templateParent',
                        meta: { cache: true },
                        component: templateParent
                    },{
                        path: '/labelList',
                        name: 'labelList',
                        component: TagM
                    },{
                        path: '/imageList',
                        name: 'imageList',
                        component: PicM
                    },{
                        path: '/platform',
                        name: 'platform',
                        component: PlatForm
                    }
                ]
            }
        ]
    }
]

module.exports = { routes }