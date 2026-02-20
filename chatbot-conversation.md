the previous button is not working consistently, sometimes it doesn't go back

To resolve the issue with the "previous" button not working consistently, I need to review the relevant code handling the button's functionality. This is likely in your JavaScript files, possibly in fetch.js or src/main.js, or within a component in src/components/.

I'll search for the code related to the "previous" button and its event handler to diagnose the problem.

The "previous" button logic in fetch.js uses a stack to track page tokens. When "Previous" is clicked, it pops the last token and fetches the previous page. However, the code retrieves the token with imdbPageTokenStack[imdbPageTokenStack.length - 1] before popping, which may cause inconsistencies if the stack is empty or if the token order is off.

The stack should only pop after fetching the previous page.


popups are not being closed correctly after pressing the close-popup-button

The issue is likely that each time you open a popup, a new element with the same id (movie-popup) is created, but only the most recently created one is removed when you click the close button. If multiple popups are opened, previous ones remain in the DOM.

To fix this, you should ensure that only one popup exists at a time by removing any existing popup before creating a new one. I will update the showMoviePopup function to do this.

Edited
fetch.js+6-0
The code now removes any existing popup before creating a new one, ensuring the close button always works and only one popup is present at a time. Please test the popup behavior—this should resolve the issue with popups not closing correctly. Let me know if you need further adjustments!