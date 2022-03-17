const modal = document.getElementById('modal');

function ModalVisibility(state){
	if (state)
		modal.className = 'modal_open';
	else 
		modal.className = 'modal_close';
}


function SaveSecret(){
	const secret = document.getElementById('secret_user').value;

	document.getElementById('secret').value = secret;
	localStorage.setItem('secret',secret)

	ModalVisibility(0);
}

// Check if user have secret
if(localStorage.getItem('secret') != undefined) {
	document.getElementById('secret').value = localStorage.getItem('secret');
	document.getElementById('secret_user').value = localStorage.getItem('secret');

	const Http = new XMLHttpRequest();
	Http.open("POST", '/', true);
	Http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	Http.send("secret="+localStorage.getItem('secret'));

	Http.onreadystatechange = (e) => {
		document.getElementById('posts').innerHTML = JSON.parse( Http.responseText );
	}
}

