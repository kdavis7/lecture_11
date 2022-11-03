
  // Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.13.0/firebase-app.js";
import{
  getFirestore, 
  collection,
  getDocs,
  onSnapshot,
} from "https://www.gstatic.com/firebasejs/9.13.0/firebase-firestore.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyAbf8nLa4JtlfoHGP2tDZg7EHC6QqwMqQo",
    authDomain: "newbie-scoffee.firebaseapp.com",
    projectId: "newbie-scoffee",
    storageBucket: "newbie-scoffee.appspot.com",
    messagingSenderId: "478864673853",
    appId: "1:478864673853:web:4b3fa4d4b73dfc1a216e54"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  async function getRecipes(db){
    const recipeCol =collection(db,"recipes");
    const recipeSnapshot = await getDocs(recipeCol);
    const recipeList = recipeSnapshot.docs.map((doc)=> doc);
    return recipeList;
  }

  const unsub =onSnapshot(collection(db,"recipes"), (doc) => {
    //console.log(doc.docChanges());
  doc.docChanges().forEach((change)=> {
    //console.log(change, change.doc.data(), change.doc.id);
    if(change.type === "added"){
        //call renderFunction in UI
        renderRecipe(change.doc.data(), change.doc.id);
    }
    if (change.type ==="removed"){
      //do something. 
    }
  });
  });
