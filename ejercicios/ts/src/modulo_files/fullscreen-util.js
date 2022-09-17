function toggleFullscreen() {
  if (isFullScreen()) {
    closeFullscreen()
    return
  }
  openFullscreen()
}

var getIsFulscreenActive = 0;

function handleContentFullscreen() {
  const contentContainer = document.querySelector('.container-contenido-asignatura')
  const contentContenidoAsignatura = document.querySelector('.container-menu-contenido-asignatura')
  function _setMenuVisibility (isVisible) {
    const elementsToHideSelectors = ['.container-menu-asignatura', '.navbaraula', '.navbarcampus', '.container-navbaraula-alerts', '#footer-campus', '.cabecera-edicion-curso']
    const getElements = Array.from(document.querySelectorAll(elementsToHideSelectors.join(', ')))

    getElements.forEach(menuEl => {
        menuEl.style.display = isVisible
          ? ''
          : 'none';
      }
    )
  }

  const enterFullscreenMode = () => {
    console.log('enter full screen mode')
    _setMenuVisibility(false)

    // Make content use all the available space.
    contentContainer.style.width = '100%';
    contentContainer.style.minHeight = '100vh';
    contentContainer.style.height = '100vh';
    contentContainer.style.overflowY = 'auto';
    contentContenidoAsignatura.style.maxWidth = '100%';

    // Make page scrollable.
    document.body.style.overflowY = 'auto'
  }

  const exitFullscreenMode = () => {
    console.log('exit full screen mode')
    _setMenuVisibility(true)
    contentContainer.style.removeProperty('width')
    contentContainer.style.removeProperty('min-height')
    contentContainer.style.removeProperty('height')
    contentContainer.style.removeProperty('overflow-y')
    contentContenidoAsignatura.style.removeProperty('max-width')
    document.body.style.removeProperty('overflow-y')
  }

  isFullScreen() ? enterFullscreenMode() : exitFullscreenMode()
}

function loadContentFullscreenListener() {
  document.addEventListener('fullscreenchange', handleContentFullscreen);
  document.addEventListener('mozfullscreenchange', handleContentFullscreen);
  document.addEventListener('webkitfullscreenchange', handleContentFullscreen);
  document.addEventListener('msfullscreenchange', handleContentFullscreen);
}

function isFullScreen()
{
  return document.fullscreenElement != null;
}

function openFullscreen() {
  if (document.documentElement.requestFullscreen) {
    document.documentElement.requestFullscreen();
  } else if (document.documentElement.mozRequestFullScreen) { /* Firefox */
    document.documentElement.mozRequestFullScreen();
  } else if (document.documentElement.webkitRequestFullscreen) { /* Chrome, Safari & Opera */
    document.documentElement.webkitRequestFullscreen();
  } else if (document.documentElement.msRequestFullscreen) { /* IE/Edge */
    document.documentElement = window.top.document.body; //To break out of frame in IE
    document.documentElement.msRequestFullscreen();
  }
}

/* Function to close fullscreen mode */
function closeFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen();
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) {
    window.top.document.msExitFullscreen();
  }
}
