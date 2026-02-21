Q: the previous button is not working consistently, sometimes it doesn't go back

A: To resolve the issue with the "previous" button not working consistently, I need to review the relevant code handling the button's functionality. This is likely in your JavaScript files, possibly in fetch.js or src/main.js, or within a component in src/components/.

I'll search for the code related to the "previous" button and its event handler to diagnose the problem.

The "previous" button logic in fetch.js uses a stack to track page tokens. When "Previous" is clicked, it pops the last token and fetches the previous page. However, the code retrieves the token with imdbPageTokenStack[imdbPageTokenStack.length - 1] before popping, which may cause inconsistencies if the stack is empty or if the token order is off.

The stack should only pop after fetching the previous page.


Q: popups are not being closed correctly after pressing the close-popup-button

A: The issue is likely that each time you open a popup, a new element with the same id (movie-popup) is created, but only the most recently created one is removed when you click the close button. If multiple popups are opened, previous ones remain in the DOM.

To fix this, you should ensure that only one popup exists at a time by removing any existing popup before creating a new one. I will update the showMoviePopup function to do this.

Edited
fetch.js+6-0
The code now removes any existing popup before creating a new one, ensuring the close button always works and only one popup is present at a time. Please test the popup behavior—this should resolve the issue with popups not closing correctly. Let me know if you need further adjustments!


Q: fetching moviegenres doesn't work, or should be awaited

A: Edited
fetch.js+15-12
Fixed! The issues were:

The function wasn't returning the fetch promise
The result wasn't being awaited, so genres was undefined
Changed to async/await pattern and stored result in a module-level genres array that gets populated when the async function completes


Q: hasMorePagesToLoad doesn't update correctly

A: Fixed! Now hasMorePagesToLoad is properly updated with the return value from fetchIMDBData, which indicates whether there are more pages to load. When there are no more pages, the scroll listener will stop making additional requests.


Q: won't my load on scrolling down do parallel api calls?

A: Let me check your implementation to see if parallel API calls could occur.

Yes, your current implementation will trigger parallel API calls. Here's the problem:

In main.js:89-99, you check hasMorePagesToLoad but you don't have an isLoading flag to prevent multiple calls. When the user scrolls quickly or stays at the bottom, the scroll event fires multiple times before the first API call completes, triggering multiple simultaneous requests.

You reference isLoading = false on line 98, but isLoading is never declared or set to true before the API call.

Here's the fix - add a loading flag:

Edited
main.js+1-0
Edited
main.js+2-1
Fixed! Now isLoading is properly declared and set to true before the API call, preventing parallel requests. The scroll event will be ignored while a fetch is in progress.


Q: movie images don't always fill the entire height

A: Let me check the current CSS styling for the movie images.

style.css

I can see the issue. The .movie-img class has max-height: 100% which doesn't enforce a consistent height. Movie posters have different aspect ratios, so without a fixed height, they'll vary in size. Let me fix this by setting a consistent height:

Edited
style.css+2-2
Fixed! Changed from max-width and max-height to fixed width and height with a 2:3 aspect ratio (16vw × 24vw), which is typical for movie posters. The object-fit: cover ensures images fill the space even if they have slightly different dimensions.