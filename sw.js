
//Assignment of staticCache and dynamic Cache. 
const staticCache = "Static-cache-v1";
const dynamicCache = "Dynamic-cache-v2";

//Assignment of asset variables. These Will be added to the static cache. These are the static files. 
const assets = [
  "/",
  "/index.html",
  "/mypages/fallback.html",
  "/js/app.js",
  "/js/ui.js",
  "/js/materialize.min.js",
  "/css/materialize.min.css",
  "/css/app.css",
  "/coffee.jpg",
  "https://fonts.googleapis.com/icon?family=Material+Icons",
];

//function to limit cache size
const limitCacheSize = (name, size) => {
  caches.open(name).then((cache) => {
    cache.keys().then((keys) => {
      if (keys.length > size) {
        cache.delete(keys[0]).then(limitCacheSize(name, size));
      }
    });
  });
};

self.addEventListener("install", function (event) {
 
  //Event activates when the browser installs the application.
  //Event Logging to the console and displays the contents of the object that was passed to the event. 
  
  //Allows the Service worker to set up a local environment for when the browser finishes installing it. 
  console.log(`SW: Event fired: ${event.type}`);
  event.waitUntil(
    caches.open(staticCache).then(function (cache) {
      console.log("SW: Precaching App shell");
      cache.addAll(assets);
    })
  );
});

self.addEventListener("activate", function (event) {
  //Event fires after the service worker finishes being installed.
  // Allows the Service Worker to clean up previous versions. 
  // console.log(`SW: Event fired: ${event.type}`);
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => key !== staticCache && key !== dynamicCache)
          .map((key) => caches.delete(key))
      );
    })
  );
});

self.addEventListener("fetch", function (event) {
  //Event fires when the app requests resources (file or data)
  // console.log(`SW: Fetching ${event.request.url}`);


  //Pulls the requested resource from the network.
  event.respondWith(
    caches
      .match(event.request)
      .then((response) => {
        return (
          response ||
          fetch(event.request).then((fetchRes) => {
            return caches.open(dynamicCache).then((cache) => {
              cache.put(event.request.url, fetchRes.clone());
              //Restricts dynamicCache, deletes old caches that exceeds the limit. 
              //Due to the large amount of recipe pages, I opted to increase the limit from 3 to 8. 
              limitCacheSize(dynamicCache, 3);
              return fetchRes;
            });
          })
        );
      })
      //If a match is not found in cache then default to Offline page to redirect user.
      //A user will see the Fallback page if they had not visited it prior or the page is not within the cache while they are offline. 
      .catch(() => caches.match("/mypages/fallback.html"))
  );
});