---
title: One-time passcodes without JavaScript
tags: code
bookmark: true
---
Tyler Sticka shows how to do OTP´s (one-time passcodes) in his article [<cite>Simple One-Time Passcode Inputs</cite>](https://cloudfour.com/thinks/simple-one-time-passcode-inputs/). The key element is the `autocomplete="one-time-code"` setting on the `input` element, which adds support for autofill from password managers or via SMS. The other attributes make typing in the code more convenient and activate client-side input validation:

```html
<form action="…" method="post">
  <h2>Verify Account</h2>
  <label for="otp">
    Enter the 6-digit numeric code sent to +1 (555) 555-5555
  </label>
  <input type="text"
    id="otp"
    inputmode="numeric"
    autocomplete="one-time-code"
    maxlength="6"
    pattern="\d{6}"
    required>
  <button>
    Continue
  </button>
  <a href="…">
    Try another way…
  </a>
</form>
```

One by one:

`type="text"`
: OTP´s appear as a number, but a six digit `000004` is not the a countable number, but a sequence of 6 digits, therefore the OTP is treated as text

`inputmode="numeric"`
: enable the numeric virtual keyboard on touch devices

`autocomplete="one-time-code"`
: this add´s support for [autofill](https://cloudfour.com/thinks/autofill-what-web-devs-should-know-but-dont/) from password managers or via [SMS](https://web.dev/articles/sms-otp-form)

`maxlength="6"`
: prevent users putting in more than 6 digits

`pattern="\d{6}"`
: we want 6 digits, and no other values

`required`
: make the field mandatory