import clickOutsideDirective from './clickOutside'

export default {
  install(app) {
    app.directive('clickoutside', clickOutsideDirective)
  }
}
