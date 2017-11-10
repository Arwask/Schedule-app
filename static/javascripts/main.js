'use strict';

// search handling

$('.print-button').click(function(e) {
  console.log('here??');
  window.print();
  return false; // why false?
});

$('.test').change(function(e) {
  let data = $(this).val();
  data = data.split(':');
  if (data[3] > 7) {
    console.log('here', data[0], ':', data[1]);
    $(`#${data[0]}${data[1]}`)
      .parent()
      .addClass('green');
  }
  if (data[3] <= 7 && data[3] >= 4) {
    console.log('here', data[0], ':', data[1]);
    $(`#${data[0]}${data[1]}`)
      .parent()
      .addClass('blue');
  }
  if (data[3] < 4) {
    console.log('here', data[0], ':', data[1]);
    $(`#${data[0]}${data[1]}`)
      .parent()
      .addClass('red');
  }
});

console.log('address', window.location);
let address = window.location.href.split('/');
let route = address.pop();
console.log('route', route);
if (route !== 'welcome' && route !== 'index' && route !== 'login' && route !== '') {
  if ($('body').hasClass('backgroundDisplay')) {
    $('body').removeClass('backgroundDisplay');
  }
} else {
  $('body').addClass('backgroundDisplay');
}
console.log(route);
