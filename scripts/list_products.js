
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyDdSs_8HHMKoPc4aK54Ts84YB7zzHfBq8U",
    authDomain: "gs-brand.firebaseapp.com",
    projectId: "gs-brand",
    storageBucket: "gs-brand.firebasestorage.app",
    messagingSenderId: "276391189400",
    appId: "1:276391189400:web:5bdb803f308dcc5de0a9ed",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function listProducts() {
    const querySnapshot = await getDocs(collection(db, "products"));
    console.log(`Found ${querySnapshot.size} products:`);
    querySnapshot.forEach((doc) => {
        const data = doc.data();
        console.log(`- ID: ${doc.id}, Name: ${data.name}, Category: ${data.category}, Price: ${data.price}`);
    });
}

listProducts().catch(console.error);
