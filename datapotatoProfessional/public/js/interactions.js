// Display hidden section
function display_references() {
	references = document.getElementById("references")
	references.classList.toggle("hidden")
}

// Expand SIGN IN in top-right
function display_sign_in_form() {
	sign_in_form = document.getElementById("sign_in_form")
	sign_in_form.classList.toggle("hidden")
}

// Expand userData edit form when signed in
function display_edit_user_data() {
	userData = document.getElementById("userData")
	userData.classList.toggle("none")

	edit_user_data = document.getElementById("edit_user_data")
	edit_user_data.classList.toggle("none")

	pencil = document.getElementById("pencil")
	pencil.classList.toggle("background_red")
}