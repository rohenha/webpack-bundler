import { module as mmodule } from 'modujs'
// import barba from '@barba/core'
import { isDebug } from '../utils/environment'

export default class Website extends mmodule {
  constructor(m) {
    super(m)
    this.initalized = false
    this.isAnimating = false
    this.updateModules = false
    this.experience = {}

    this.size = {
      width: 0,
      height: 0,
    }

    this.animate = this.animate.bind(this)
  }

  init() {
    const config = {
      debug: isDebug,
      transitions: this.setTransitions(),
    }

    if (isDebug) {
      config.logLevel = 'info'
      config.timeout = 10000
    }
    // barba.init(config)
  }
}
