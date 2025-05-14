/**
 * Emergency header visibility fix
 */
(function() {
  // Run immediately without waiting for DOM ready to fix header ASAP
  var fixHeader = function() {
    // Force header visibility
    var siteHeader = document.querySelector('.site-header');
    if (siteHeader) {
      siteHeader.style.display = 'block';
      siteHeader.style.visibility = 'visible';
    }
    
    // Force header container visibility
    var headerContainer = document.querySelector('.header-container');
    if (headerContainer) {
      headerContainer.style.display = 'flex';
      headerContainer.style.visibility = 'visible';
    }
    
    // Force logo visibility
    var siteLogo = document.querySelector('.site-logo');
    if (siteLogo) {
      siteLogo.style.display = 'flex';
      siteLogo.style.visibility = 'visible';
    }
    
    // Force header actions visibility
    var headerActions = document.querySelector('.header-actions');
    if (headerActions) {
      headerActions.style.display = 'flex';
      headerActions.style.visibility = 'visible';
    }
    
    console.log('Emergency header fix applied');
  };
  
  // Run immediately
  fixHeader();
  
  // Also run after DOMContentLoaded
  document.addEventListener('DOMContentLoaded', fixHeader);
  
  // And after window load for good measure
  window.addEventListener('load', fixHeader);
  
  // Set an interval to keep checking and fixing
  setInterval(fixHeader, 500);
})(); 