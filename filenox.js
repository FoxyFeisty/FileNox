(function() {
	
	var keyURL = "file:///Users/feist/Desktop/FileNox-current-work/pubkey.js", // URL of pubkey.js 
		fileDiv = document.getElementById("fileDiv"),
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
		pubkey = '', // filled by dynamically loading pubkey.js
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
    // copy data and save it to user's clipboard
    function textToClipboard(text) {
		var dummy = document.createElement('textarea');
		document.body.appendChild(dummy);
  		dummy.value = text;
  		dummy.select();
  		document.execCommand("copy");
  		document.body.removeChild(dummy);
    }
    // load external script with pubkey 
    function dynamicallyLoadScript(url) {
	    var script = document.createElement("script"); 
	    script.src = url;
	    document.body.appendChild(script); 
	}
	dynamicallyLoadScript(keyURL);
	pubkey=localStorage.getItem('pubkey');

    // encrypting
    function pgpEncrypt(text) {
    	// script provides var "pubkey"
    	if (pubkey !== undefined) {    		
    		const f = (async() => {
			    const options = {
			      message: openpgp.message.fromText(text),
			      publicKeys: (await openpgp.key.readArmored(pubkey)).keys,
			    }

			    openpgp.encrypt(options).then(ciphertext => {
			        encrypted = ciphertext.data
			        return encrypted
			    })
			    .then(encrypted => {
			      textToClipboard(encrypted);
			    })
			})();
    	} else {
    		alert('There is currently no public key provided. Please try again later.');
    	}
    } 

	// Encrypting & showing user message 
	function encryptMsg() {
		// no file or input 
		if (!textInput.value && !textUpload.value) {
			msgDiv.innerHTML = "No file or message added";
		}
		// file or input exists
		if (textInput.value) {
			pgpEncrypt(textInput.value);
		}
		else if (textUpload.value) {
			// Check for the various File API support
			if (!window.File && !window.FileReader && !window.FileList && !window.Blob) {
			  	alert('Your browser does not support the needed File APIs.');
			} else {
				pgpEncrypt(textToEncrypt);
			}
		}
		// error message if no pubkey 
		if (textUpload.value || textInput.value && pubkey !== undefined) {
				fileDiv.classList.add("hidden");
				msgSend.classList.remove('hidden');
		}
	}
	// open MailAccount
	function openMail() {
		window.location.href="mailto:?subject=FileNox%20message:"; 
	}

	toggleUpload.addEventListener('click', function() {showElem(divUpload, divInput)} );
	toggleInput.addEventListener('click', function() {showElem(divInput, divUpload)} );
	btnEncrypt.addEventListener('click', encryptMsg );
	btnSend.addEventListener('click', openMail );
	btnStop.addEventListener('click', function() { location.reload() } );
	textUpload.addEventListener('change', handleFileSelect, false);

})();