'use strict';

$('#register').submit(function(event) {
  event.preventDefault();
  let username = this.username.value;
  let name = this.name.value;

  if(!username || !name) {
    alert('Name or username is missing')
    return
  }

  getMakeCredentialsChallenge({username, name})
    .then((response) => {
      console.log(response)
      let publicKey = preformatMakeCredReq(response);
      return navigator.credentials.create({publicKey})
    })
    .then((response) => {
      let makeCredResponse = publicKeyCredentialToJSON(response);
      return sendWebAuthnResponse(makeCredResponse);
    })
    .then((response) => {
      console.log('resp: ', response);
      if(response.status === 'ok') {
        loadMainContainer()
      } else {
        alert(`Server responded with error: ${response.message}`);
      }
    })
    .catch((error) => alert('dick' + error));
})

let getMakeCredentialsChallenge = (formBody) => {
  return fetch('/webauthn/register', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(formBody)
  })
  .then((response) => response.json())
  .then((response) => {
    if (response.status !== 'ok')
      throw new Error(`server responded with an error: ${response.message}`)
    return response;
  }).catch((error) => alert('dong') + error)
}

let sendWebAuthnResponse = (body) => {
  console.log(body);
  return fetch('/webauthn/response', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  })
  .then((response) => response.json())
  .then((response) => {
    if(response.status !== 'ok')
      throw new Error(`Server responded with error: ${response.message}`);
    return response;
  }).catch((error) => alert('dong2') + error)
}
