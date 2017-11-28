function validateEmail(email) {
  var re = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
  return re.test(email);
}

function validatePhone(number){
    var re = /\+?[0-9]{5,15}/
    return re.test(number)
}

function configUrl(){
  return window.location.origin
}

$(document).ready(function(){
  $(window).scroll(function(){
    if($(window).scrollTop() < 30){
      $('#luovat-navbar').css('background','rgba(0,0,0,0.0)');
      $('.nav-page-link').css('color','white');
      $('.nav-logo-text').css('color','white');
    }else{
      $('#luovat-navbar').css('background','rgba(255,255,255,0.9)');
      $('.nav-page-link').css('color','black');
      $('.nav-logo-text').css('color','black');
    }
  });
  
$(window).bind('mousewheel', function(event) {
  if (event.originalEvent.wheelDelta >= 0) {
    $('#luovat-navbar').show('fast')
  }
  else {
    $('#luovat-navbar').hide('slow')
  }
  });
});