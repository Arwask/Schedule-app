// search handling

$('.print-button').click(function(e) {
  console.log('here??');
  window.print();
  return false; // why false?
});

$('.test').change(function(e) {
  let data = $(this).val();
  console.log(data);
  data = data.split(':');
  if (data[3] > 7) {
    console.log('here', data[0], ':', data[1]);
    if (
      $(`#${data[0]}${data[1]}`)
        .parent()
        .hasClass('blue')
    ) {
      $(`#${data[0]}${data[1]}`)
        .parent()
        .removeClass('blue');
    }
    if (
      $(`#${data[0]}${data[1]}`)
        .parent()
        .hasClass('red ')
    ) {
      $(`#${data[0]}${data[1]}`)
        .parent()
        .removeClass('red');
    }
    $(`#${data[0]}${data[1]}`)
      .parent()
      .addClass('green');
  }

  if (data[3] <= 7 && data[3] >= 4) {
    console.log('here', data[0], ':', data[1]);

    if (
      $(`#${data[0]}${data[1]}`)
        .parent()
        .hasClass('green')
    ) {
      $(`#${data[0]}${data[1]}`)
        .parent()
        .removeClass('green');
    }
    if (
      $(`#${data[0]}${data[1]}`)
        .parent()
        .hasClass('red ')
    ) {
      $(`#${data[0]}${data[1]}`)
        .parent()
        .removeClass('red');
    }

    $(`#${data[0]}${data[1]}`)
      .parent()
      .addClass('blue');
  }

  if (data[3] < 4) {
    console.log('here', data[0], ':', data[1]);

    if (
      $(`#${data[0]}${data[1]}`)
        .parent()
        .hasClass('blue')
    ) {
      $(`#${data[0]}${data[1]}`)
        .parent()
        .removeClass('blue');
    }
    if (
      $(`#${data[0]}${data[1]}`)
        .parent()
        .hasClass('green ')
    ) {
      $(`#${data[0]}${data[1]}`)
        .parent()
        .removeClass('green');
    }

    $(`#${data[0]}${data[1]}`)
      .parent()
      .addClass('red');
  }
});
$('.editSelect').change(function(e) {
  let data = $(this).val();
  console.log(data);
  data = data.split(':');
  if (data[0] > 7) {
    if (
      $(`#${data[0]}${data[1]}`)
        .parent()
        .hasClass('blue')
    ) {
      $(`#${data[0]}${data[1]}`)
        .parent()
        .removeClass('blue');
    }
    if (
      $(`#${data[0]}${data[1]}`)
        .parent()
        .hasClass('red ')
    ) {
      $(`#${data[0]}${data[1]}`)
        .parent()
        .removeClass('red');
    }
    $(`#${data[0]}${data[1]}`)
      .parent()
      .addClass('green');
  }

  if (data[3] <= 7 && data[3] >= 4) {
    console.log('here', data[0], ':', data[1]);

    if (
      $(`#${data[0]}${data[1]}`)
        .parent()
        .hasClass('green')
    ) {
      $(`#${data[0]}${data[1]}`)
        .parent()
        .removeClass('green');
    }
    if (
      $(`#${data[0]}${data[1]}`)
        .parent()
        .hasClass('red ')
    ) {
      $(`#${data[0]}${data[1]}`)
        .parent()
        .removeClass('red');
    }

    $(`#${data[0]}${data[1]}`)
      .parent()
      .addClass('blue');
  }

  if (data[3] < 4) {
    console.log('here', data[0], ':', data[1]);

    if (
      $(`#${data[0]}${data[1]}`)
        .parent()
        .hasClass('blue')
    ) {
      $(`#${data[0]}${data[1]}`)
        .parent()
        .removeClass('blue');
    }
    if (
      $(`#${data[0]}${data[1]}`)
        .parent()
        .hasClass('green ')
    ) {
      $(`#${data[0]}${data[1]}`)
        .parent()
        .removeClass('green');
    }

    $(`#${data[0]}${data[1]}`)
      .parent()
      .addClass('red');
  }
});

if (
  window.location.href.split('/').pop() !== 'welcome' &&
  window.location.href.split('/').pop() !== 'index' &&
  window.location.href.split('/').pop() !== 'login' &&
  window.location.href.split('/').pop() !== ''
) {
  if ($('body').hasClass('backgroundDisplay')) {
    $('body').removeClass('backgroundDisplay');
  }
} else {
  $('body').addClass('backgroundDisplay');
}
console.log(window.location.href.split('/').pop());
