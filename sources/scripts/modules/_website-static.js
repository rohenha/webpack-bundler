import { module as mmodule } from 'modujs'
import Stats from 'stats.js'
import { html, body, isDebug } from '../utils/environment'
import { debounce } from '../utils/utils'
import { modulesConfig } from '../organisms/_modules-config'

export default class WebsiteStatic extends mmodule {
  constructor(m) {
    super(m)
    this.isAnimating = false
    this.updateModules = false

    this.size = {
      width: 0,
      height: 0,
    }

    this.animate = this.animate.bind(this)
    this.debounceResize = debounce(this.resize.bind(this, false), 600)

    this.config = {
      debug: isDebug,
      animate: this.el.dataset.animate !== undefined,
    }
  }

  setStats() {
    this.stats = new Stats()
    this.stats.showPanel(0) // 0: fps, 1: ms, 2: mb, 3+: custom
    body.appendChild(this.stats.dom)
  }

  init() {
    this.setStats()
    this.updateModules = true
    this.toggleLoad(false)
    window.addEventListener('resize', this.debounceResize)
    if (isDebug || this.config.animate) {
      this.requestId = window.requestAnimationFrame(this.animate)
    }
  }

  resize(force = false) {
    if (
      window.innerWidth < 768 &&
      window.innerWidth === this.size.width &&
      force === false
    ) {
      return
    }
    this.size = {
      width: window.innerWidth,
      height: window.innerHeight,
    }
    if (this.updateModules) {
      this.parseModulesFunctions('resize')
      this.parseModulesFunctions('aResize')
    }
  }

  animate() {
    if (isDebug) {
      this.stats.begin()
    }

    if (this.updateModules && this.isAnimating) {
      this.parseModulesFunctions('animate')
      this.parseModulesFunctions('aAnimate')
    }

    // monitored code goes here
    if (isDebug) {
      this.stats.end()
    }
    this.requestId = window.requestAnimationFrame(this.animate)
  }

  toggleLoad(state) {
    html.classList[state ? 'remove' : 'add']('is-loaded')
    html.classList[state ? 'add' : 'remove']('is-loading')
    this.isAnimating = !state
  }

  parseModulesFunctions(func) {
    const modulesFunct = modulesConfig[func]
    const length = modulesFunct.length - 1
    if (length < 0) {
      return
    }

    for (let i = length; i >= 0; i -= 1) {
      const moduleName = modulesFunct[i]
      this.call(func, null, moduleName)
    }
  }
}
