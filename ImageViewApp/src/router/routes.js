import FacebookImagePage from '../pages/FacebookImages'
import ImageUpload from '../pages/AmazonImage'
const routes = [
  {
    path: '/',
    component: () => import('layouts/MyLayout.vue'),
    children: [
      { path: '/fb', component: FacebookImagePage },
      { path: '/img', component: ImageUpload }
    ],
    meta: {
      requiresAuth: false
    }
  }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes
