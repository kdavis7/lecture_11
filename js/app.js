//Checks to see if the browser supports Service Workers. 

if ("serviceWorker" in navigator) {
  // Service Worker Installation is put on hold until the page finishes loading. 
  window.addEventListener("load", () => {
    //Registering the Service Worker.
    navigator.serviceWorker
      .register("/sw.js")
      .then((reg) => {
        //display a Registration message once the Service Worker is registered.
        console.log(`Service Worker Registration (Scope: ${reg.scope})`);
      })
      //catches error with Service Worker Registration.
      .catch((error) => {
        //display an error message to the console if Service Worker cannot be registered.
        console.log(`Service Worker Error (${error})`);
      });
  });
} else {
  //If the Browser is unable to support the Service worker display this to the console. 
  console.log("Service Worker not available");
}