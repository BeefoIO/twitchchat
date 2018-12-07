mainColorObj = document.getElementById('main-color')
secondColorObj = document.getElementById('second-color')

mainFontObj = document.getElementById('main-font')
titleFontObj = document.getElementById('title-font')

designFormObj = document.getElementById('design-settings-form')

mainColorObj.value = 'D0752E'
secondColorObj.value = '292929'

designFormObj.addEventListener('submit', designFormSubmit)

// BoostFuze Link Clicked function()
function designFormSubmit (e) {
  e.preventDefault()
  ipcRenderer.send('settings:design:update', mainColorObj.value, secondColorObj.value, mainFontObj.value, titleFontObj.value)
}
