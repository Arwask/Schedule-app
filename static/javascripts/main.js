'use strict';

// upload progress bar
let $uploader = $('#uploader');

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
$('.search-products-btn').on('click', function(e) {
	e.preventDefault();
	var searchInput = $('.product-search-input').val();
	let queryStringAction = `/products?title=${searchInput}`;
	window.location.href = queryStringAction;
});
