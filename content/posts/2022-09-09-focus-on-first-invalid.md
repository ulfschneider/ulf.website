---
title: Focus on the first invalid field
tags: code
draft: true
---
Aaron Gustavson describes how to [<cite>Bring Focus to the First Form Field with an Error</cite>](https://www.aaron-gustafson.com/notebook/bring-focus-to-the-first-form-field-with-an-error/). The article describes much more than only focusing an errored field. It´s a general approach of validating by leveraging Web API´s. My key takes are:

1. A `novalidate` attribute can be assigned to the `form` element to deactivate client-side validation.
2. You can do:
	```html
	<input type="email"
       id="email"
       name="email"
       required
       aria-required="true"
       data-error-required="Please enter your email"
       data-error-invalid="Your email doesn’t look right"
       >
	```
	
	```js
	document.querySelectorAll("form") //adjust all forms
        .forEach(function(form){
          form.addEventListener('submit', validateMe, false); //use custom validation
          form.setAttribute('novalidate',''); //no default validation
        });
        
	function validateMe( e ) {
	  let form = e.target,
      i = 0,
      fieldCount = form.elements.length,
      firstError = false;
  
	  for ( i; i< fieldCount; i++) {
	    let field = form.elements[i],
	        valid = isValid(field);
	    if ( !firstError && !valid ) {
	      firstError = field;
	    }
	  }
	  if ( firstError ){
	    e.preventDefault();
	    firstError.focus();  //focus on first errored field
	  }
	}
	```
	
3. There is a [Validity State API](https://developer.mozilla.org/en-US/docs/Web/API/ValidityState) that can be accessed like:
	```js
	let field = document.getElementById("field-id");
	let validity = field.validity;
	
	console.log(validity.valid); //either true or false
	```
	`validity` has read-only boolean properties:
	- badInput
	- customError 
	- patternMismatch
	- rangeOverflow 
	- rangeUnderflow
	- stepMismatch 
	- tooLong 
	- tooShort
	- typeMismatch
	- valid
	- valueMissing
4. There is a [Constraint Validation API](https://developer.mozilla.org/en-US/docs/Web/API/Constraint_validation) that <q>enables checking values that users have entered into form controls, before submitting the values to the server.</q> The Constraint Validation API has three properties and three methods: 

	`validity`
	: it´s the validity property from the Validity Statre API

	`validationMessage`
	:If the element's value is not valid, it returns a localized validation message. This will be displayed in the UI if the element is the only form control with a validity problem; if a custom error message is set using setCustomValidity(), this will be shown.

	`willValidate`
	:The read only property is true if the element is a candidate for constraint validation.

	`checkValidity()`
	: Checks the element's value against its constraints.

	`reportValidity()`
	: Checks the element's value against its constraints and also reports the validity status.

	`setCustomValidity(message)`
	: Sets a custom error message string to be shown to the user upon submitting the form, explaining why the value is not valid – when a message is set, the validity state is set to invalid.