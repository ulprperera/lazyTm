import {initializeApp} from 'firebase';


const app = initializeApp({
    apiKey: "AIzaSyAZzDFE7CwBq2VBmQxCJcAPnuJt6jXcET8",
    authDomain: "jarabaraz.firebaseapp.com",
    databaseURL: "https://jarabaraz.firebaseio.com",
    projectId: "jarabaraz",
    storageBucket: "jarabaraz.appspot.com",
    messagingSenderId: "185516086224" 
});

const settings = {timestampsInSnapshots: true};
app.firestore().settings(settings)


export const db=app.database();
export const cs = app.firestore();