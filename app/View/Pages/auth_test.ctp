<button id="authorize-button" style="visibility: hidden">Authorize</button>
<div id="content"></div>
    <p>Retrieves your profile name using the Google Plus API.</p>

<script>

var clientId = "205449938055-06501obglsfmcellrtc67opqs6ogbs19.apps.googleusercontent.com";
var scopes = 'https://www.googleapis.com/auth/plus.me';
var token;
var secret = "zo03y8aW30ZAJnJLKYSH4b4v";
function handleClientLoad() {
	gapi.client.setApiKey(clientId);
	window.setTimeout(checkAuth,1);
}
function checkAuth() {
	gapi.auth.authorize({client_id: clientId, scope: scopes, immediate: true}, handleAuthResult);
}

function handleAuthResult(authResult) {
	console.log(authResult);
	var authorizeButton = document.getElementById('authorize-button');
	if (authResult && !authResult.error) {
	  authorizeButton.style.visibility = 'hidden';
	  token = authResult["access_token"];
	  makeApiCall();
	} else {
	  authorizeButton.style.visibility = '';
	  //authorizeButton.onclick = handleAuthClick;
	}
}
function handleAuthClick(event) {
	gapi.auth.authorize({client_id: clientId, scope: scopes, immediate: false}, handleAuthResult);
	return false;
}
// Load the API and make an API call.  Display the results on the screen.
function makeApiCall() {
		gapi.client.setApiKey("");
        gapi.client.load('plus', 'v1', function() {
        	console.log(gapi.client);
            var request = gapi.client.plus.people.get({
	            'userId': 'me'
	        });
	        request.execute(function(resp) {
	            var heading = document.createElement('h4');
	            var image = document.createElement('img');
	            image.src = resp.image.url;
	            heading.appendChild(image);
	            heading.appendChild(document.createTextNode(resp.displayName));

	            document.getElementById('content').appendChild(heading);
	         });
        });
      }
</script>

<script src="https://apis.google.com/js/client.js?onload=handleClientLoad"></script>

