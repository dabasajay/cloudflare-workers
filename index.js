/* Global variables */

// Links to be used in the JSON API.
const LINKS = [
  { "name": "My Portfolio", "url": "http://dabasajay.codes/" },
  { "name": "Cloudflare", "url": "https://www.cloudflare.com/" },
  { "name": "My Codeforces Profile", "url": "https://codeforces.com/profile/dabasajay" }
];

// My social links
const SOCIAL_LINKS = [
  { "href": "https://github.com/dabasajay", "src": "https://simpleicons.org/icons/github.svg" },
  { "href": "https://www.linkedin.com/in/dabasajay", "src": "https://simpleicons.org/icons/linkedin.svg" },
  { "href": "https://stackoverflow.com/users/12460593/ajay-dabas", "src": "https://simpleicons.org/icons/stackoverflow.svg" }
]

// Link to external HTML
const EXTERNAL_HTML_LINK = 'https://static-links-page.signalnerve.workers.dev';

// Error HTML page
const ERROR_HTML = `
  <!DOCTYPE html>
  <body>
    <h1>Some error occured! We're looking into the matter.</h1>
  </body>`;

/* Element handlers */

class LinkHandler {
  element (parentElement) {
    // Put the links as child of the given parent component.
    LINKS.forEach((link) => {
      parentElement.append(`<a href="${link.url}" rel="noopener" target="_blank">${link.name}</a>`, { html: true });
    });
  }
}

class ProfileHandler {
  element (ele) {
    // Remove the `display: none` from the `div#profile` container
    ele.removeAttribute('style');
  }
}

class AvatarHandler {
  element (ele) {
    // Setting the src to my avatar.
    ele.setAttribute('src', 'https://dabasajay.codes/assets/img/profile.png');
  }
}

class NameHandler {
  element (ele) {
    // Setting the text to my name.
    ele.setInnerContent("Ajay Dabas");
  }
}

class SocialHandler {
  element (ele) {
    // Setting the text to my name.
    ele.removeAttribute('style');
    SOCIAL_LINKS.forEach((link) => {
      ele.append(`<a href="${link.href}" rel="noopener" target="_blank"><img src="${link.src}"/></a>`, { html: true });
    });
  }
}

class TitleHandler {
  element (ele) {
    // Setting the title to my name.
    ele.setInnerContent("Ajay Dabas");
  }
}

class BackgroundHandler {
  element (ele) {
    // Change the background color
    ele.setAttribute("style", "background-color: #18bc9c");
  }
}

/* HTMLRewriter instance */

const rewriter = new HTMLRewriter()
  .on('div#links', new LinkHandler())
  .on('div#profile', new ProfileHandler())
  .on('img#avatar', new AvatarHandler())
  .on('h1#name', new NameHandler())
  .on('div#social', new SocialHandler())
  .on('title', new TitleHandler())
  .on('body', new BackgroundHandler());

/**
 * Respond to the request
 * @param {Request} request
 */
async function handleRequest(request) {
  try {
    // Get URL from request.
    const url = new URL(request.url);

    // Handle `/links` route
    if (url.pathname === '/links') {
      return new Response(JSON.stringify(LINKS), { headers: { 'Content-Type': 'application/json' } });
    }

    // For any other route, fetch the static HTML page first.
    const responseHTML = await fetch(EXTERNAL_HTML_LINK, { headers: { "content-type": "text/html;charset=UTF-8" } });

    // Then, transform and send it.
    // Content-Type is already correctly set by HTMLRewriter
    return rewriter.transform(responseHTML);

  } catch (err) {
    // Error handling
    console.log(err);
    return new Response(ERROR_HTML, { headers: { 'Content-Type': 'text/html;charset=UTF-8' } });
  }
}

/**
 * This function defines triggers for a worker script to execute.
 * `fetch` event will passes FetchEvent as argument in handler function.
 */
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
})
