export const routes = [
  {
    path: '/main',
    name: 'Main',
    redirect: '/main/find',
    component: () => import('../views/Main.vue'),
    children: [
      {
        path: 'list',
        name: 'List',
        component: () => import('../views/List.vue')
      },
      {
        path: 'find',
        name: 'Find',
        component: () => import('../views/Find.vue')
      },
      {
        path: 'rank',
        name: 'Rank',
        component: () => import('../views/Rank.vue')
      },
      
    ]
  },
  {
    path: '/musiclist/:id',
    name: 'MusicList',
    component: () => import('../views/MusicList.vue')
  },
  {
    path: '/search',
    name: 'Search',
    component: () => import('../views/Search.vue')
  },
  {
    path: '/history',
    name: 'History',
    component: () => import('../views/History.vue')
  },
  {
    path: '/like',
    name: 'Like',
    component: () => import('../views/Like.vue')
  },
  {
    path: '/likelist',
    name: 'Likelist',
    component: () => import('../views/Likelist.vue')
  },

  {
    path: '*',
    redirect: {
      name: 'Find'
    }
  }
]