// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { getFirestore, collection, doc, setDoc, getDoc, addDoc, onSnapshot, updateDoc, deleteDoc, serverTimestamp } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

// Firebase Config
const firebaseConfig = {
    apiKey: "AIzaSyBMzof_HjYfVqJ1kz3_qSPx39lAVt1nW54",
    authDomain: "medbuddy-carecircle.firebaseapp.com",
    projectId: "medbuddy-carecircle",
    storageBucket: "medbuddy-carecircle.appspot.com",
    messagingSenderId: "917369211094",
    appId: "1:917369211094:web:2df5aa896ae9bf65a3a177",
    measurementId: "G-W0EVLSFJN2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// 🔥 Auth State Listener
onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log("User logged in:", user);
        loadProfile(user);
        loadPosts();
    } else {
        console.log("No user logged in");
    }
});

// ✅ SIGN UP FUNCTION
function signUpUser() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const username = document.getElementById("username").value;

    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            return setDoc(doc(db, "users", user.uid), {
                username: username,
                email: email,
                accountType: "public",
                bio: "",
                posts: []
            });
        })
        .then(() => alert("Signup Successful!"))
        .catch((error) => console.error("Signup error:", error.message));
}

// ✅ LOGIN FUNCTION
function loginUser() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    signInWithEmailAndPassword(auth, email, password)
        .then(() => alert("Login Successful!"))
        .catch((error) => console.error("Login error:", error.message));
}

// ✅ SAVE PROFILE FUNCTION
function saveProfile() {
    const user = auth.currentUser;
    const name = document.getElementById("name").value;
    const bio = document.getElementById("bio").value;
    const accountType = document.getElementById("account-type").value;

    if (user) {
        updateDoc(doc(db, "users", user.uid), {
            name: name,
            bio: bio,
            accountType: accountType
        }).then(() => alert("Profile updated!"))
            .catch((error) => console.error("Profile update error:", error.message));
    }
}

// ✅ LOAD PROFILE FUNCTION
function loadProfile(user) {
    getDoc(doc(db, "users", user.uid)).then((docSnap) => {
        if (docSnap.exists()) {
            const data = docSnap.data();
            document.getElementById("name").value = data.name || "";
            document.getElementById("bio").value = data.bio || "";
            document.getElementById("account-type").value = data.accountType || "public";
        }
    }).catch((error) => console.error("Error loading profile:", error.message));
}

// ✅ ADD TEXT POST FUNCTION
function addPost() {
    const user = auth.currentUser;
    const postContent = document.getElementById("post-content").value;

    if (user) {
        addDoc(collection(db, "posts"), {
            userId: user.uid,
            content: postContent,
            timestamp: serverTimestamp()
        }).then(() => {
            document.getElementById("post-content").value = "";
            alert("Post added!");
        }).catch((error) => console.error("Error adding post:", error.message));
    }
}

// ✅ LOAD POSTS FUNCTION
function loadPosts() {
    onSnapshot(collection(db, "posts"), (snapshot) => {
        console.log("Fetched posts:", snapshot.docs.length);
        document.getElementById("post-feed").innerHTML = "";
        snapshot.forEach((doc) => {
            const post = doc.data();
            document.getElementById("post-feed").innerHTML += `
                <div class="post">
                    <p>${post.content}</p>
                    <button onclick="deletePost('${doc.id}')">Delete</button>
                </div>`;
        });
    }, (error) => console.error("Error loading posts:", error.message));
}

// ✅ DELETE POST FUNCTION
function deletePost(postId) {
    const user = auth.currentUser;
    if (user) {
        const postRef = doc(db, "posts", postId);
        deleteDoc(postRef).then(() => {
            console.log("Post deleted successfully!");
        }).catch((error) => {
            console.error("Error deleting post:", error.message);
        });
    }
}

// ✅ UPLOAD IMAGE FUNCTION
function uploadImage(file) {
    const user = auth.currentUser;
    const storageRef = ref(storage, `posts/${user.uid}/${file.name}`);

    uploadBytes(storageRef, file).then((snapshot) => {
        getDownloadURL(snapshot.ref).then((downloadURL) => {
            addDoc(collection(db, "posts"), {
                userId: user.uid,
                imageUrl: downloadURL,
                timestamp: serverTimestamp(),
            }).then(() => alert("Image uploaded and post added!"))
                .catch((error) => console.error("Error adding image post:", error.message));
        });
    }).catch((error) => console.error("Error uploading image:", error.message));
}

// ✅ ADD POST WITH IMAGE FUNCTION
function addPostWithImage() {
    const file = document.getElementById("image-upload").files[0];
    if (file) {
        uploadImage(file);
    }
}
