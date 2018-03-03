var objectValues = require('object-values')
var objectKeys = require('object-keys')
var html = require('choo/html')

var views = require('./')

module.exports = view

function view (state, emit) {
  state.page = state.content[state.href || '/']
  // loading
  if (!state.site.loaded) return renderLoading(state, emit)
  // 404
  if (!state.page) return renderNotFound(state, emit)
  // view
  var view = views[state.page.view] || views.default

  // title
  var title = getTitle(state)
  if (state.title !== title) emit(state.events.DOMTITLECHANGE, title)

  // template
  return html`
    <body>
      ${renderStyles(state, emit)}
      ${renderNavigation(state, emit)}
      ${view(state, emit)} 
    </body>
  `
}

function renderLoading (state, emit) {
  return html`
    <body>
      <div class="loading"></div>
    </body>
  `
}

function renderNotFound (state, emit) {
  return html`
    <body>
      <h1>Page not found</h1>
    </body>
  `
}

function renderStyles (state, emit) {
  var page = state.content['/']
  return html`
    <style>
      :root {
        --background: ${page.background};
        --foreground: ${page.foreground};
      }
    </style>
  `
}

function renderNavigation (state, emit) {
  var home = state.content['/']
  var pages = objectValues(home.pages)
    .map(page => state.content[page.url])

  return html`
    <nav class="container">
      <div>
        <b><a href="${home.url}">${home.title}</a></b>
      </div>
      <div>
        ${pages.map(renderLink)}
      </div>
    </nav>
  `

  function renderLink (props, i, arr) {
    return html`
      <a href="${props.url}">${props.title}</a>
    `
  }
}

function getTitle (state) {
  var siteTitle = state.content['/'].title
  var pageTitle = state.page.title
  
  return siteTitle !== pageTitle
    ? siteTitle + ' | ' + pageTitle
    : siteTitle
}