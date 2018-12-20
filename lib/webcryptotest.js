
//begin main program
var crypto = window.crypto || window.msCrypto;
	
function MakeKeys(KeyField){
	var key_object = null; 
	var promise_key = null;
	promise_key = crypto.subtle.generateKey({name: "AES-CBC", length: 128}, true, ["encrypt", "decrypt"]);
	promise_key.then(function(key){
		key_object = key;
		window.crypto.subtle.exportKey("jwk", key_object).then(function(e){
			expkey=e
			document.getElementById(KeyField).innerHTML=expkey.k;
			console.log(KeyField+ " k=" + expkey.k);});
	});
	promise_key.catch = function(e){
		console.log(e.message);
		}
}

function MakeVector(VectorField){
VectorString= Base64Enc(convertArrayBufferViewtoString(crypto.getRandomValues(new Uint8Array(16))));
document.getElementById(VectorField).innerHTML=VectorString;
console.log(VectorField + "=" + VectorString);
};

function EncryptFields(DataField, KeyField, VectorField, OutputField) {
	var encrypted_data = null;
	var encrypt_promise = null;
	var key_object = null; 
	var promise_key = null;
	
	//Import KeyField from page
	importKeyString=document.getElementById(KeyField).innerHTML;
	importKeyArray={alg:"A128CBC",ext:true,k:importKeyString,kty:"oct",key_ops:["encrypt", "decrypt"]};
	console.log(KeyField + " imported as " + importKeyArray.k);
	
	//Import VectorField from page
	importVectorString=document.getElementById(VectorField).innerHTML;
	importVectorArray=convertStringToArrayBufferView(Base64Dec(importVectorString));
	console.log(VectorField + " imported as " + Base64Enc(convertArrayBufferViewtoString(importVectorArray)));
	
	//Import DataField from page	
	importDataString=document.getElementById(DataField).value;
	importDataArrayNC=convertStringToArrayBufferView(importDataString);
	importDataArray=shoco.compress(importDataString);
	console.log("Original string for " + DataField + " was " + importDataArrayNC.length + " bytes.  Shoco compressed field is " + importDataArray.length + " bytes. Compression estimated as " +  Math.round(importDataArray.length/importDataArrayNC.length*100) + "%" );
	console.log(DataField + " imported as " + convertArrayBufferViewtoString(importDataArray));
	
	window.crypto.subtle.importKey("jwk",importKeyArray,{name: "AES-CBC", length: 128}, true, ["encrypt", "decrypt"]).then(function(key){
		key_object=key;
		console.log(KeyField + " imported");
		encrypt_promise = crypto.subtle.encrypt({name: "AES-CBC", iv: importVectorArray}, key_object, importDataArray);
		encrypt_promise.then(
			function(result){
				encrypted_data = new Uint8Array(result);
				encrypted_string = Base64Enc(convertArrayBufferViewtoString(encrypted_data));
				document.getElementById(OutputField).innerHTML=encrypted_string;
				console.log("Encrypted " + DataField + "=" + encrypted_string);
				document.getElementById(DataField).value=""; //clear cleartext fields
			},
				function(e){
					console.log(e.message);
				}
			);
		});
}

function DecryptFields(DataField, KeyField, VectorField, OutputField) {
	var decrypt_promise = null;
	var decrypted_data = null;
	var key_object = null; 
	var promise_key = null;
	
		//Import KeyField from page
	importKeyString=document.getElementById(KeyField).innerHTML;
	importKeyArray={alg:"A128CBC",ext:true,k:importKeyString,kty:"oct",key_ops:["encrypt", "decrypt"]};
	console.log(KeyField + " imported as " + importKeyArray.k);
	
	//Import VectorField from page
	importVectorString=document.getElementById(VectorField).innerHTML;
	importVectorArray=convertStringToArrayBufferView(Base64Dec(importVectorString));
	console.log(VectorField + " imported as " + Base64Enc(convertArrayBufferViewtoString(importVectorArray)));
	
	//Import DataField from page	
	importDataString=document.getElementById(DataField).innerHTML;
	importDataArray=convertStringToArrayBufferView(Base64Dec(importDataString));
	
	console.log(DataField + " imported as " + Base64Enc(convertArrayBufferViewtoString(importDataArray)));

	window.crypto.subtle.importKey("jwk",importKeyArray,{name: "AES-CBC", length: 128}, true, ["encrypt", "decrypt"]).then(function(key){
		key_object=key;
		console.log(KeyField + " imported");
		decrypt_promise = crypto.subtle.decrypt({name: "AES-CBC", iv: importVectorArray}, key_object, importDataArray);
		decrypt_promise.then(
		function(result){
			decrypted_data = new Uint8Array(result);
			//decrypted_string = convertArrayBufferViewtoString(decrypted_data);
			decrypted_string = shoco.decompress(decrypted_data);
			document.getElementById(OutputField).innerHTML=decrypted_string;
			console.log(OutputField + "=" + decrypted_string);
			},
				function(e){
					console.log(e.message);
				}
			);
		});
}

function convertStringToArrayBufferView(str)
{
     var bytes = new Uint8Array(str.length);
     for (var iii = 0; iii < str.length; iii++) 
     {
         bytes[iii] = str.charCodeAt(iii);
     }

     return bytes;
}

function convertArrayBufferViewtoString(buffer)
{
     var str = "";
     for (var iii = 0; iii < buffer.byteLength; iii++) 
     {
         str += String.fromCharCode(buffer[iii]);
     }

     return str;
}


function Base64Enc(str){
    strb=btoa(str);
	return strb.replace(/\+/g, '-').replace(/\//g, '_').replace(/\=+$/, '');
}


function Base64Dec(str){
	if (str.length % 4 != 0)
      str += ('===').slice(0, 4 - (str.length % 4));
    return atob(str.replace(/-/g, '+').replace(/_/g, '/'));
}


