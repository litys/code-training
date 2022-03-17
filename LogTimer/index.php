<?php
	$password = 'YourAccessPassword';

	if(isset($_POST['secret']) && isset($_POST['post'])) {
		if($_POST['secret'] != $password)
			die('The password is incorrect');

		$log = file_get_contents("log.txt");
		$logFile = fopen("log.txt", "w") or die("The file cannot be opened!");
		
		$date = "<h2>" . date("H:i") . " " . date("d.m.Y") . "</h2>";
		$text = $date . "<article>" . $_POST['post'] . "</article>" . $log;

		fwrite($logFile, $text);
		fclose($logFile);
	}

	// Displaying all via XHTTP
	elseif(isset($_POST['secret'])) {
		if($_POST['secret'] != $password)
			die('The password is incorrect');

		$logFile = fopen("log.txt", "r") or die("The file cannot be opened!");
		$fileContent = fread($logFile,filesize("log.txt"));
		fclose($logFile);

		header('Content-type: application/json');
		echo json_encode($fileContent);
		exit();
	}

?>

<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Micro Journaling | Bite-Sized Thoughts </title>
	<link href="https://fonts.googleapis.com/css2?family=PT+Serif:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet">
	<link rel="stylesheet" href="style.css">
</head>
<body>
	
	<nav>
		<h1>Micro Journaling</h1>
		<button onclick="ModalVisibility(1)"><img class="icon" src="/img/ui-settings.svg" alt="settings"></button>
	</nav>
	
	<main>
		
		<form action="" method="post">
			<div class="post_area">
				<textarea id="post" name="post" rows="8" cols="50"></textarea>
			</div>
			<input id="secret" type="text" name="secret">
			<div class="form_options">
				<input id="addPost" type="submit" value="Dodaj wpis">
			</div>
		</form>

	</main>

	<div id="modal" class="modal_close">
		<div class="modal_option_close">
			<button type="reset" onclick="ModalVisibility(0)"><img class="icon" src="/img/close-squared-alt.svg" alt="settings"></button>
		</div>
		<div class="modal_container">
			<div class="option">
				<label for="secret">Hasło dostępowe: </label><br>
				<input type="text" id="secret_user" name="secret" value=""><br>
				<button type="submit" onclick="SaveSecret()">Zapisz</button>
			</div>
		</div>
	</div>
	
	<script src="script.js"></script>

	<div id="posts"></div>

</body>
</html>