the previous button is not working consistently, sometimes it doesn't go back

To resolve the issue with the "previous" button not working consistently, I need to review the relevant code handling the button's functionality. This is likely in your JavaScript files, possibly in fetch.js or src/main.js, or within a component in src/components/.

I'll search for the code related to the "previous" button and its event handler to diagnose the problem.

The "previous" button logic in fetch.js uses a stack to track page tokens. When "Previous" is clicked, it pops the last token and fetches the previous page. However, the code retrieves the token with imdbPageTokenStack[imdbPageTokenStack.length - 1] before popping, which may cause inconsistencies if the stack is empty or if the token order is off.

The stack should only pop after fetching the previous page.