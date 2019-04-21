import fs from 'fs'

export default ({ Vue }) => {
  Vue.prototype.$FS = fs
}
