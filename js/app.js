$(document).foundation();


$('.menuLinks').on('click', function(event) {
	event.preventDefault();
	var location = $(this).attr('href');
	$(location).ScrollTo();
});

$('#menuButton').on('click', function() {
	$('#menu').slideToggle("slow");
});



$('#email').on('submit', function(event) {
	event.preventDefault();
	var $sendButton = $('button[name=email_submit]');
	sendButtonDisplay($sendButton, true);
	var modal = $('#contactResult');
	modal.foundation('open');

	function proccessResult(data){
		data = $.parseJSON(data);
		modal.find('h4').html(data.MESSAGE);
		if (data.STATUS) {
			grecaptcha.reset();
			$('.emailFormFields').val('');
		}
	}

	$.post('submit.cfm', $(this).serialize(), function(data, textStatus, xhr) {
		proccessResult(data);
		sendButtonDisplay($sendButton, false);
	});
});


function sendButtonDisplay($sendButton, bool){
	$sendButton.attr('disabled', bool);
	$('.loading').toggle();
}

function rename(){
    $('[name=g-recaptcha-response]').attr('name', 'gRecaptchaResponse');
}

