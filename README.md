# SnapNest — Part 3: Polish, Error States & Deploy

A responsive image-search website built using plain HTML, CSS, and JavaScript. It uses the free Wikimedia Commons API and does not require an API key.

## Features
- Loading spinner and skeleton placeholders while searching
- Empty-results message for searches with no matches
- Friendly error message if the API/network fails
- Result count and animated result cards
- Responsive design for desktop and mobile
- Links to original Wikimedia Commons pages

## Test the states
1. Search `cats` or `nature` to see results.
2. Search a nonsense term such as `zxqwlkqv` to test the empty state.
3. Disconnect your internet temporarily, then search to test the error state.
4. Resize the browser or open the site on a phone to check the responsive layout.

## Deploy with GitHub Pages (no terminal needed)
1. Upload `index.html`, `style.css`, `script.js`, and `README.md` to the root of your existing public repository.
2. Open **Settings → Pages** in that repository.
3. Under **Build and deployment**, choose **Deploy from a branch**.
4. Select your branch and `/ (root)`, then click **Save**.
5. Wait for the live URL to appear in the Pages section.

## Important for the Kalvium assignment
Continue in the same public GitHub repository from Parts 1 and 2. Commit the files on a new branch such as `part-3-polish-deploy`, then open a pull request into `main`. Put both your public repository URL and deployed live URL in the pull request description, and submit the pull request URL.

**Note:** SnapNest is a starter example. Keep using your existing repository and adapt the design to your own Part 1/Part 2 app rather than creating a separate repository just for this ZIP.
