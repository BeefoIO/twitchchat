function boot_open () {
  document.getElementById('main').style.marginLeft = '55px'
  document.getElementById('bootSidebar').style.width = '55px'
  document.getElementById('bootSidebar').style.display = 'block'
  document.getElementById('boot-collapse').style.display = 'block'
  document.getElementById('bootOpenNav').style.display = 'none'
}
function boot_close () {
  document.getElementById('main').style.marginLeft = '0%'
  document.getElementById('bootSidebar').style.display = 'none'
  document.getElementById('boot-collapse').style.display = 'none'
  document.getElementById('bootOpenNav').style.display = 'inline-block'
}
