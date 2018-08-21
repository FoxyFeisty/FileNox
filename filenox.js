(function() {
	// URL of pubkey.js 
	var keyURL = "file:///Users/feist/Desktop/FileNox-current-work/pubkey.js",
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
		textToEncrypt = '',
		testVar = '';
		// sKey = pubkey;

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
    	// text = "foo\r\nbar";
		var dummy = document.createElement('textarea');
		document.body.appendChild(dummy);
  		dummy.value = text;
  		dummy.select();
  		// \n durch \r\n ersetzen
  		document.execCommand("copy");
  		document.body.removeChild(dummy);
    }
    // load external script with pubkey 
    function dynamicallyLoadScript(url) {
	    var script = document.createElement("script"); 
	    script.src = url;
	    document.head.appendChild(script); 
	}

  //   	const f = async() => {

		//     const options = {
		//       message: openpgp.message.fromText(text),
		//       publicKeys: (await openpgp.key.readArmored(pubkey)).keys,
		//     }

		//     openpgp.encrypt(options).then(ciphertext => {
		//         encrypted = ciphertext.data
		//         return encrypted
		//     })
		//     .then(encrypted => {
		//       textToClipboard(encrypted);
		//     })

		// };
		// f();


    // encrypting
    function pgpEncrypt(text) {
    	// script provides var "pubkey"
    	try {
    		dynamicallyLoadScript(keyURL);
    	} catch {
    		alert('There is currently no public key prodided. Please try again later.');
    	}

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
    } 

	// Encrypting & opening mail account
	function encryptMsg() {
		// no file or text 
		if (!textInput.value && !textUpload.value) {
			msgDiv.innerHTML = "No file or message added";
		}
		if (textInput.value) {
			fileDiv.classList.add("hidden");
			msgSend.classList.remove('hidden');
		 	pgpEncrypt(textInput.value);
		}
		if (textUpload.value) {
			// Check for the various File API support
			if (!window.File && !window.FileReader && !window.FileList && !window.Blob) {
			  	alert('Your browser does not support the needed File APIs.');
			  	return;
			} 
      		fileDiv.classList.add("hidden");
			msgSend.classList.remove('hidden');		
			pgpEncrypt(textToEncrypt);
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