const js_svg = document.querySelectorAll('.svg')
js_svg.forEach(svg => {
  let src = svg.getAttribute('data-src')
  svg.removeAttribute('data-src')
  svg.style.maskImage = `url(${src})`
})

const js_background = document.querySelectorAll('.bg')
js_background.forEach(background => {
  let src = background.getAttribute('data-src')
  background.removeAttribute('data-src')
  background.style.backgroundImage = `url(${src})`
})

const js_img = document.querySelectorAll('img')
js_img.forEach(img => img.setAttribute('draggable', false))