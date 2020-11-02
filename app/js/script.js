const pageSvgs = document.querySelectorAll('.svg')
pageSvgs.forEach(svg => {
	let src = svg.getAttribute('data-src')
	svg.removeAttribute('data-src')
	svg.style.maskImage = `url(${src})`
})

const pageBackgrounds = document.querySelectorAll('.bg')
pageBackgrounds.forEach(background => {
	let src = background.getAttribute('data-src')
	background.removeAttribute('data-src')
	background.style.backgroundImage = `url(${src})`
})