import { createContext, useContext, useEffect, useState } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { getFirestore, collection, addDoc, getDocs, doc, getDoc, deleteDoc, updateDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const FirebaseContext = createContext(null);

const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: ""
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };

export const useFirebase = () => useContext(FirebaseContext);

export const FirebaseProvider = (props) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      if (user) setUser(user);
      else setUser(null);
     
    });
    
    return () => unsubscribe();
  }, [auth]);

  const isLoggedIn = user !== null;

  const signinUserWithEmailAndPass = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const signoutUser = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  };

  const handleAddNewMember = async (name, phoneNo, email, paidDate, photo, fee, joinDate, dueDate) => {
    const imgRef = ref(storage, `uploads/images/${Date.now()}-${photo.name}`);
    const uploadResult = await uploadBytes(imgRef, photo);
    await addDoc(collection(db, 'members'), {
      name,
      phoneNo,
      email,
      paidDate,
      fee,
      joinDate,
      dueDate,
      imgURL: uploadResult.ref.fullPath
    });
  };

  const getMembers = () => {
    return getDocs(collection(db, 'members'));
  };

  const getMembersById = async (id) => {
    const docRef = doc(db, 'members', id);
    const result = await getDoc(docRef);
    return result;
  };

  const getImageUrl = (path) => {
    const storageRef = ref(storage, path);
    return getDownloadURL(storageRef);
  };

  const deleteMember = async (id) => {
    const docRef = doc(db, 'members', id);
    const result = await deleteDoc(docRef);
    return result;
  };

  const updateMember = async (id, updatedData) => {
    const docRef = doc(db, 'members', id);
    await updateDoc(docRef, updatedData);
  };

  return (
    <FirebaseContext.Provider value={{ 
      signinUserWithEmailAndPass, 
      signoutUser, 
      isLoggedIn, 
      handleAddNewMember, 
      getMembers, 
      getMembersById, 
      getImageUrl, 
      deleteMember, 
      updateMember 
    }}>
      {props.children}
    </FirebaseContext.Provider>
  );
};
