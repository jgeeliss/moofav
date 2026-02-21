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


Q: when changing a filter, the entire movie container refreshes on insertAdjacentHTML, instead of only the movies

A: Looking at the code, the issue is that insertAdjacentHTML always appends new content to existing movies. When you change a filter, you want to replace the movies, not append to them. Currently, this only happens correctly when there's no movie matrix yet.

The fix is to check if this is page 1 (a new search/filter) and clear the existing movies before displaying the filtered results:

Edited
fetch.js+3-3
Edited
fetch.js+1-1
Fixed! Now when you change a filter, the movie matrix will append the new page to the movie container and show only the filtered results (since filters trigger a new search starting at page 1). The insertAdjacentHTML will only append movies when loading additional pages (page 2, 3, etc.) for pagination.


Q: when page===1 it should only reload the images, but it refreshes the entire page

A: I'll examine the fetch.js file to understand the issue with the page refresh.

I can see the issue. When page === 1, the code at fetch.js:68-70 replaces the images correctly, but the problem is likely that somewhere else in the code, the entire page is being refreshed. Let me check the main.js file to see how fetchIMDBData is being called:

main.js

I found the issue! In main.js:68-70, when the dropdowns change, the code is setting movieContainer.innerHTML = '' which clears the entire container before calling fetchIMDBData with page = 1. This is causing the page to refresh completely.

The fix is simple: remove the movieContainer.innerHTML = '' line from the dropdown event listeners. The renderIMDBData function already handles replacing the images when page === 1.

Edited
main.js+0-3
Fixed! I removed the movieContainer.innerHTML = '' lines from all three dropdown event listeners in main.js. Now when page === 1, the renderIMDBData function will only replace the images inside the #movie-matrix div instead of clearing the entire container, which should eliminate the page refresh effect.