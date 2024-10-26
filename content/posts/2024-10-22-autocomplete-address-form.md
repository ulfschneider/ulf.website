---
title: Autofilling the address form
tags:
  - til
  - code
---
[[TOC]]

## The HTML specification

The HTML `autocomplete` attribute can be used to hint the browser how to prefill an address form based on earlier user input. This can be achieved by assigning *space separated, case-insensitive autofill detail tokens* to the `autocomplete` attribute. Like so:

```html
<label>Street address
  <input type="text" name="address" autocomplete="street-address address-line1">
</label>
```

The [HTML specification](https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#autofilling-form-controls:-the-autocomplete-attribute) lists the following tokens to indicate the browser the purpose of a form field, hinting the browser to prefill with suitable content. The tokens require its associated form control group being  `Text`, if not stated otherwise in the //comment. 

- `name` 
	- `honorific-prefix` 
	- `given-name` 
	- `additional-name` 
	- `family-name` 
	- `honorific-suffix` 
	- `nickname` 
	- `username` //Username
- `new-password` //Password
- `current-password`  //Password
- `one-time-code` //Password
- `organization-title` 
- `organization` 
- `street-address` //Multiline text
	- `address-line1` 
	- `address-line2` 
	- `address-line3` 
- `address-level4` 
- `address-level3` 
- `address-level2` 
- `address-level1` 
- `country` 
- `country-name` 
- `postal-code` 
- `cc-name` //`cc-…` indicates *payment instrument* data, like for credit cards.
	- `cc-given-name`
	- `cc-additional-name`
	- `cc-family-name`
- `cc-number`
- `cc-exp` //month
	- `cc-exp-month` //Numeric
	- `cc-exp-year` //Numeric
- `cc-csc`
- `cc-type`
- `transaction-currency`
- `transaction-amount` //Numeric
- `language`
- `bday` //Date
	- `bday-day` //Numeric
	- `bday-month` //Numeric
	- `bday-year` //Numeric
- `sex`
- `url` //Url
- `photo` //Url

==If none of the above tokens is used==, you can use the following tokens in the given order:

- `home`, meaning the field is for contacting someone at their residence
- `work`, meaning the field is for contacting someone at their workplace
- `mobile`, meaning the field is for contacting someone regardless of location
- `fax`, meaning the field describes a fax machine's contact details
- `pager`, meaning the field describes a pager's or beeper's contact details

and combine them with 

- `tel` //Tel
- `tel-country-code`
- `tel-national`
- `tel-area-code`
- `tel-local`
- `tel-local-prefix`
- `tel-local-suffix`
- `tel-extension`
- `email` //Username
- `impp` //Url

For example:

```html
<label>Email address
  <input type="email" name="email" autocomplete="home email">
</label>
```

==All the above tokens== can optionally be used together with either `shipping` or `billing` to denote if the form field is part of a shipping address or if it belongs to the billing address. And there are `section-` tokens, that can be used to group, for example, two shipping addresses in the form `section-address1` and `section-address2`. 


> [!Note] <span>According to <a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete">MDN</a></span>
> In order to provide autocompletion, user-agents might require `<input>/<select>/<textarea>` elements to:
> - Have a name and/or id attribute
> - Be descendants of a `<form>` element
> - Be owned by a form with a submit button


## The address form example

<figure>
<p class="codepen" data-height="720" data-default-tab="html,result" data-slug-hash="VwoMYNV" data-pen-title="Untitled" data-user="ulfschneider" style="height: 720px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;">
  <span>See the Pen <a href="https://codepen.io/ulfschneider/pen/VwoMYNV">
  Untitled</a> by Ulf Schneider (<a href="https://codepen.io/ulfschneider">@ulfschneider</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>
</figure>
