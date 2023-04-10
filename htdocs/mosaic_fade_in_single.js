/**
 * Copyright 2023 Kazumasa Yamashita
 * Released under the MIT License
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() : typeof define === 'function' && define.AMD ? define(factory) : (global = global || self, global.MosaicFadeInSingle = factory());
}(this, function () {
  'use strict';
  class MosaicFadeInSingle {
    constructor(options) {
      const container = document.querySelector(options.selector)
      if (!container) {
        throw new Error('can not find selector.')
      }
      const url = options.img
      const selector = `canvas${new Date().getTime().toString()}`
      container.style.position = 'relative'
      container.style.display = 'inline-block'
      const mosaic = (size) => {
        const canvas = document.querySelector(`.${selector}`)
        const _canvas = document.createElement('canvas')
        if (!canvas || !canvas.getContext) {
          throw new Error()
        }
        const createMosaic = (context, width, height, size, data) => {
          for (let y = 0; y < height; y += size) {
            for (let x = 0; x < width; x += size) {
              const cR = data.data[(y * width + x) * 4],
                cG = data.data[(y * width + x) * 4 + 1],
                cB = data.data[(y * width + x) * 4 + 2];
              context.fillStyle = `rgb(${cR},${cG},${cB})`
              context.fillRect(x, y, x + size, y + size)
            }
          }
        }
        const draw = (_context, imageData, context) => {
          createMosaic(_context, _canvas.width, _canvas.height, size, imageData)
          context.drawImage(_canvas, 0, 0)
        }
        const exec = () => {
          const context = canvas.getContext('2d')
          const img = new Image()
          img.src = canvas.dataset.url
          img.onload = () => {
            const _context = _canvas.getContext('2d')
            _canvas.width = img.width
            _canvas.height = img.height
            _context.drawImage(img, 0, 0)
            const imageData = _context.getImageData(0, 0, _canvas.width, _canvas.height)
            draw(_context, imageData, context)
          }
        }
        exec()
      }
      const setupCanvas = () => {
        const tag = document.createElement('canvas')
        tag.classList.add(selector)
        tag.style.position = 'absolute'
        tag.top = 0
        tag.left = 0
        tag.dataset.url = url
        container.insertAdjacentElement('beforeend', tag)
        const ctx = tag.getContext('2d')
        const img = new Image()
        img.src = url
        img.onload = () => {
          container.style.width = `${img.naturalWidth}px`
          container.style.height = `${img.naturalHeight}px`
          tag.width = img.naturalWidth
          tag.height = img.naturalHeight
          ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight)
        }
      }
      setupCanvas()
      setTimeout(()=>mosaic(20), 100)
      async function start() {
        const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))
        const t = 100
        mosaic(18)
        await sleep(t)
        mosaic(13)
        await sleep(t)
        mosaic(10)
        await sleep(t)
        mosaic(8)
        await sleep(t)
        mosaic(5)
        await sleep(t)
        setupCanvas(selector, url)
      }
      const mouseenter = () => {
        start()
        container.removeEventListener('mouseenter', mouseenter)
      }
      container.addEventListener('mouseenter', mouseenter)
    }
  }
  return MosaicFadeInSingle
}))