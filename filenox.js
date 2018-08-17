(function() {

	var fileDiv = document.getElementById("fileDiv"),
		chooseBtn = document.getElementById("chooseBtn"),
		toggleUpload = document.getElementById("chooseUpload"),
		toggleInput = document.getElementById("chooseInput"),
		divUpload = document.getElementById("divUpload"),
		divInput = document.getElementById("divInput"),
		btnEncrypt = document.getElementById("btnEncrypt"),
		textUpload = document.getElementById("textUpload"),
		textInput = document.getElementById("textInput"),
		msgDiv = document.getElementById("messageErr"),
		msgSend = document.getElementById("messageSend"),
		msgCrypt = [],
		btnSend = document.getElementById("btnSend"),
		btnStop = document.getElementById("btnStop"),
		textToEncrypt = '';

	// Choosing between Textinput or Fileupload
	function showElem(elem1, elem2) {
		elem2.classList.remove('shown');
		elem2.classList.add('hidden');
		elem1.classList.remove('hidden');
		elem1.classList.add('shown');
		btnEncrypt.classList.remove('hidden');
		btnEncrypt.classList.add('shown');
	}

	function handleFileSelect(evt) {
		var file = evt.target.files[0];
        var reader = new FileReader();
        reader.onload = function(event) {
        	// event.target points to FileReader
            var contents = event.target.result;
			textToEncrypt = contents;
        }
        reader.readAsDataURL(file);
    };
    // create DOM-Element to copy data and save it to user's clipboard
    function textToClipboard(text) {
		var dummy = document.createElement('input');
		document.body.appendChild(dummy);
  		dummy.value = text;
  		dummy.select();
  		document.execCommand("copy");
  		document.body.removeChild(dummy);
    }

	// Encrypting & opening mail account
	function encrypt() {
		if (!textInput.value && !textUpload.value) {
			msgDiv.innerHTML = "No file or message added";
		}
		if (textInput.value) {
			fileDiv.classList.add("hidden");
			msgSend.classList.remove('hidden');
			textToClipboard(textInput.value);
			// // encrypt
			// var ciphertext = CryptoJS.AES.encrypt(textInput.value, 'Passwort');
			// // decrypt
			// var bytes  = CryptoJS.AES.decrypt(ciphertext.toString(), 'Passwort');
			// // byte to string
			// var plaintext = bytes.toString(CryptoJS.enc.Utf8);
			// msgCrypt.push(plaintext);
		}
		if (textUpload.value) {
			// Check for the various File API support
			if (window.File && window.FileReader && window.FileList && window.Blob) {
		  	// All the File APIs are supported.
			} else {
		  	alert('Your browser does not support the needed File APIs.');
		  	return;
			}
			// check file type
      		// if (!f.type.match('image.*')) {
        // 		continue;
      		// }
      		fileDiv.classList.add("hidden");
			msgSend.classList.remove('hidden');
      		textToClipboard(textToEncrypt);
  
		}
	}
	// open MailAccount
	function openMail() {
		window.location.href="mailto:?subject=FileNox%20message:"; 
	}

	toggleUpload.addEventListener('click', function() {showElem(divUpload, divInput)} );
	toggleInput.addEventListener('click', function() {showElem(divInput, divUpload)} );
	btnEncrypt.addEventListener('click', encrypt );
	btnSend.addEventListener('click', openMail );
	btnStop.addEventListener('click', function() { location.reload() } );
	textUpload.addEventListener('change', handleFileSelect, false);

})();