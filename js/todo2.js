//TO DO
//add red border validation, remove html errors
//redo remove function
//fix save button changing to edit on hover
//special character bug

var config = {
	listId: "todo-list",
	inputBoxId: "inputBox",
	addButtonId: "btnAdd",
	addButtonText: "add task",
	editButtonId: "btnEdit",
	editButtonText: "",
	editBox: "editBox",
	saveButtonId: "btnSave",
	saveButtonText: "",
	removeButtonId: "btnRemove",
	removeButtonText: "",
	deleteLinkClass: "delete-link",
	editLinkClass: "edit-link",
	saveButtonClass: "save-btn",
}

var todoList = (function(config) {

	function appendListItem(task) {
		console.log("appendListItem was called");
		var span = document.createElement("span");
		var listElement = document.createElement('li');
		span.setAttribute("class", "task-content");
		listElement.setAttribute("class", "task-row");

		span.innerHTML = task;

		//Prepare list item
		listElement.appendChild(span);
		listElement.appendChild(createRemoveButton());
		listElement.appendChild(createEditButton());

		list.appendChild(listElement);
		inputBox.value = "";

		//checks if button type is edit or save
		// var buttonType = listElement.children[2].className;
		// listElement.addEventListener("mouseenter", function() { visible(listElement, buttonType) });
		// listElement.addEventListener("mouseleave", function() { console.log("when leaving, buttonType is...."+buttonType); invisible(listElement, buttonType) });
	}

	//Create initial html elements
	createInputBox();
	createAddButton();
	createListHtml();

	var addButton = document.getElementById(config.addButtonId),
		inputBox = document.getElementById(config.inputBoxId),
		list = document.getElementById(config.listId),
		replaceText;

	var errors = [];
	var norepeat = false;

	if (localStorage['tasks']) {
		var tasks =  JSON.parse(localStorage['tasks']);
		console.log("localStorage has tasks");
	} else {
		var tasks = [];
		console.log("localStorage has no tasks");
	}

	console.log(document.getElementsByClassName("task-row").length);
	console.log(document.getElementsByClassName("task-row"));

	for (i = 0; i < tasks.length; i++) {
		appendListItem(tasks[i]);
	}

		function validate() {
			console.log("validate was called");
			if (!norepeat && errors.length > 0) {
				createErrors(errors);
				norepeat = true;
			}
			else {
				removeErrors(errors);
			}
		}
		

    	addButton.addEventListener("click", addItem);

		//
		//Factory Functions
		//
		function createInputBox() {
			console.log("createInputBox was called");
			var inputBox = document.createElement("input");
			inputBox.setAttribute("type", "text");
			inputBox.setAttribute("id", config.inputBoxId);
			inputBox.setAttribute("class", "input-box");
			inputBox.setAttribute("placeholder", "What needs to be done?");
			inputBox.setAttribute("onkeydown", "if (event.keyCode == 13) document.getElementById('btnAdd').click()");

			document.getElementById("to-do-list").appendChild(inputBox);
		}

		function createAddButton() {
			console.log("createAddButton was called");
			var addButton = document.createElement("button");
			addButton.setAttribute("id", config.addButtonId);
			addButton.className = "icon";
			addButton.setAttribute("type", "submit");
			addButton.setAttribute("for", "inputBox");
			addButton.innerHTML = config.addButtonText;

			document.getElementById("to-do-list").appendChild(addButton);
		}

		function createRemoveButton() {
			console.log("createRemoveButton was called");
			var removeButton = document.createElement("button");
			removeButton.className = "icon "+config.removeButtonId;
			removeButton.innerHTML = config.removeButtonText;
			removeButton.addEventListener("click", removeListItem);

			return removeButton;
		}

		function createEditButton() {
			console.log("createEditButton was called");
			var editButton = document.createElement("button");
//			editButton.setAttribute("class", config.editButtonId);
			editButton.className = "icon "+config.editButtonId;
			editButton.innerHTML = config.editButtonText;
			editButton.addEventListener("click", editItem);

			return editButton;
		}

		function createErrors(errors) {
			console.log("createErrors was called");
			var errorContainer = document.createElement("ul");
			errorContainer.setAttribute("id", "error-container");

			for (i = 0; i < errors.length; i++) {
				var errorItem = document.createElement("li");
				errorItem.setAttribute("class", "error");
				errorItem.innerHTML = errors[i];
				errorContainer.appendChild(errorItem);
			}

			document.getElementById("to-do-list").insertBefore(errorContainer, inputBox);

		}

		function removeErrors(errors) {
			console.log("removeErrors was called");
			errors.length = 0;  //empties array

			var container = document.getElementById("error-container");
            var content = container.innerHTML;
            container.innerHTML= content;
		}

		function createListHtml() {
			console.log("createListHtml was called");
			var list = document.createElement("ul");
			list.setAttribute("id", config.listId);

			document.getElementById("to-do-list").appendChild(list);
		}

		//
		//Action Functions
		//
		function addItem() {
			console.log("addItem was called");
			if (inputBox.value) {
				//Add task to array
				tasks.push(inputBox.value);

				//Save to Local Storage
				localStorage["tasks"] = JSON.stringify(tasks);

				//Append item to task list
				appendListItem(inputBox.value);
				validate();

				

			} else {
				errors.push("Can't submit if you have nothing to add, son.");
				validate();
			}
		}

		function removeListItem() {
			console.log("removeListItem was called");
			var parent = this.parentNode.parentNode, //ul
				child = this.parentNode, //li
				listText = child.firstChild.innerHTML; //list text
	
			var index = tasks.indexOf(listText);
			if (index >= 0) {
  				tasks.splice( index, 1 );
			}

			//Save to Local Storage
			localStorage["tasks"] = JSON.stringify(tasks);

			//localStorage.removeItem(listText);
			parent.removeChild(child);

		}

		function editItem() {
			console.log("editItem was called");
			var currentText = this.previousSibling.previousSibling.innerHTML,
			    span = this.previousSibling.previousSibling;

			console.log("editable current text is: "+currentText);

			span.innerHTML = "<input id='"+config.editBox+"' type='text' value='"+currentText+"' >";

			//Change edit button to save button
			//this.setAttribute("id", config.saveButtonId);
			this.className = "icon btnSave visible";
			this.innerHTML = config.saveButtonText;
			this.removeEventListener("click", editItem);
			this.addEventListener("click", saveItem);

			replaceText = currentText;

		}

		function saveItem() {
			console.log("saveItem was called");
			// var currentText = document.getElementById(btnSave).previousSibling.childNodes[0].value;
			var btnSave = this;
			var currentText = document.getElementById(config.editBox).value;
			var old = replaceText;
			var span = btnSave.previousSibling.previousSibling;

			console.log("btnSave previous sibling is "+btnSave.previousSibling);
			console.log("btnSave="+btnSave);
			console.log("currentText="+currentText);

				// //replaces text in array
				var index = tasks.indexOf(old);
				if (index >= 0) {
					tasks[index] = currentText;
				}
				console.log("oldText="+old);
				console.log("index="+index);
				console.log("tasks["+index+"]="+tasks[index]);

				// //Save to Local Storage
				localStorage["tasks"] = JSON.stringify(tasks);

			if (currentText != "") {

				span.innerHTML = currentText;

				//Change save button to edit button
				//btnSave.setAttribute("id", config.editButtonId);
				btnSave.className = "icon btnEdit visible";
				btnSave.innerHTML = config.editButtonText;
				btnSave.removeEventListener("click", saveItem);
				btnSave.addEventListener("click", editItem);

			} else {
				errors.push("Please enter a task.");
				validate();
			}

		}

		// function visible(listElement, buttonType) {
		// 	console.log("visible was called");
		// 	console.log("buttonType is..."+buttonType);
		// 		listElement.children[1].className = "icon btnRemove visible";
		// 		if (buttonType.indexOf("btnEdit") >= 0) {
		// 			listElement.children[2].setAttribute("class", "icon btnEdit visible");	
		// 		}
		// 		else {
		// 			listElement.children[2].setAttribute("class", "icon btnSave visible");
		// 		}
		// }
		// function invisible(listElement, buttonType) {
		// 	console.log("invisible was called");
		// 	console.log("buttonType is..."+buttonType);
		// 		listElement.children[1].setAttribute("class", "icon btnRemove invisible");
		// 		if (buttonType.indexOf("btnEdit") >= 0) {
		// 			listElement.children[2].setAttribute("class", "icon btnEdit invisible");	
		// 		}
		// 		else {
		// 			listElement.children[2].setAttribute("class", "icon btnSave invisible");
		// 		}
		// }
})(config);