---
title: HTML attributes for better web forms
draft: true
tags: 
  - accessibility
  - code
---
Using the correct HTML attributes can improve web forms drastically, especially on mobile devices. [Tips](https://adactio.com/journal/19842) by Jeremy Keith:

## `type`

Use the right `type` for input. There is not only `text`,  `search`, `email`, `url`, `password`, `tel`, `number` and the like might might be better suited.

## `inputmode`

The [`inputmode`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/inputmode) hints the type of data that might be entered by the user, which allows the browser to display the appropriate virtual keyboard.The combination of `type` and `inputmode` is interesting! E.g. `type="text"` plus `inputtype="numeric"` creates a field for number input, but without the spinners that come with `type="number"`. `inputmode="numeric"` combined with `pattern="[0-9]"`  leads to a numeric keypad with no other characters. Possible values for `inputmode` are:

`none`
:  No virtual keyboard

`text` (default)
: Standard input with current locale

`decimal`
: Fractional numeric input with <kbd>0</kbd>–<kbd>9</kbd>, decimal separator in the users locale and possibly a minus key.

`numeric`
: Numeric input with <kbd>0</kbd>–<kbd>9</kbd>,  and possibly a minus key.
: <

`tel`
: Telephone input with <kbd>0</kbd>–<kbd>9</kbd>, <kbd>*</kbd>, and <kbd>#</kbd>. 

`search`
: Optimized for search input. The submit key *may* be labeled "Search".