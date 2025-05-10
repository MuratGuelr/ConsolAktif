import { db } from "./firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

/**
 * Initialize necessary data in Firebase
 * This function creates the connection_test document if it doesn't exist
 */
export const initializeFirebaseData = async () => {
  try {
    // Check if connection_test document exists
    const connectionTestRef = doc(db, "connection_test", "test");
    const docSnap = await getDoc(connectionTestRef);

    // If it doesn't exist, create it
    if (!docSnap.exists()) {
      await setDoc(connectionTestRef, {
        created: new Date(),
        purpose: "This document is used to test the connection to Firebase",
      });
      console.log("Connection test document created");
    }
  } catch (error) {
    console.error("Error initializing Firebase data:", error);
  }
};
