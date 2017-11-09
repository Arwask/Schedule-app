'use strict';
console.log('hi');

$('#fileInput').on('change', event => {
  let file = event.target.files[0];
  let fbStorageRef = firebase.storage().ref(`images/${file.name}`);
  let uploadTask = fbStorageRef.put(file);

  uploadTask.on(
    firebase.storage.TaskEvent.STATE_CHANGED,
    function(snapshot) {
      let progress = snapshot.bytesTransferred / snapshot.totalBytes * 100;
      $uploader.val(progress);
    },
    function(error) {
      console.log('error', error);
    },
    function() {
      let downloadURL = uploadTask.snapshot.downloadURL;
      $('#pictureUrl').val(downloadURL);
    }
  );
});

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
    $(`#${data[0]}${data[1]}`).addClass('green');
  }
});
