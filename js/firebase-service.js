/**
 * Firebase Configuration and Service Module
 * Counselor: Mrs. Preeti Pareek Website
 */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAYNJHdzS3OBEZoDAhCEBS-ptY-yMP43ts",
  authDomain: "red-studio-410914.firebaseapp.com",
  projectId: "red-studio-410914",
  storageBucket: "red-studio-410914.firebasestorage.app",
  messagingSenderId: "765651650341",
  appId: "1:765651650341:web:8a3c0863f9d4d036403ccc"
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Firestore using the designated databaseId
const db = getFirestore(app, "ai-studio-mrspreetipareekp-6c2c037a-2d45-41b0-b3fc-b42bf8838e3b");

// Initialize Auth to gather contextual user security data
const auth = getAuth(app);

const OperationType = {
  CREATE: 'create',
  UPDATE: 'update',
  DELETE: 'delete',
  LIST: 'list',
  GET: 'get',
  WRITE: 'write',
};

/**
 * Custom error handler for Firestore operations that yields structured JSON.
 */
function handleFirestoreError(error, operationType, path) {
  const errInfo = {
    error: error instanceof Error ? error.message : String(error),
    operationType,
    path,
    authInfo: {
      userId: auth.currentUser?.uid || null,
      email: auth.currentUser?.email || null,
      emailVerified: auth.currentUser?.emailVerified || null,
      isAnonymous: auth.currentUser?.isAnonymous || null,
      tenantId: auth.currentUser?.tenantId || null,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    }
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

/**
 * Save a new booking or enquiry lead to Firestore
 * @param {string} type - 'booking' or 'enquiry'
 * @param {Object} data - Lead details
 */
export async function saveLead(type, data) {
  const leadsCollection = collection(db, "leads");
  const leadData = {
    type: type,
    status: "New", // Default status
    ...data,
    timestamp: data.timestamp || new Date().toISOString()
  };

  try {
    const docRef = await addDoc(leadsCollection, leadData);
    console.log("Lead successfully stored with ID: ", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error storing lead in Firestore: ", error);
    
    // Fallback to local storage if firestore write fails (as a backup)
    try {
      const localLeads = JSON.parse(localStorage.getItem("leads_fallback") || "[]");
      localLeads.push({ type, status: "New", ...data });
      localStorage.setItem("leads_fallback", JSON.stringify(localLeads));
    } catch (fallbackError) {
      console.error("Local storage fallback failed:", fallbackError);
    }

    // Call the required central error handler to bubble structural debugging context
    handleFirestoreError(error, OperationType.CREATE, "leads");
  }
}

/**
 * Fetch all leads from Firestore
 */
export async function fetchLeads() {
  try {
    const leadsCollection = collection(db, "leads");
    const q = query(leadsCollection, orderBy("timestamp", "desc"));
    const querySnapshot = await getDocs(q);
    const leads = [];
    querySnapshot.forEach((docSnap) => {
      leads.push({
        id: docSnap.id,
        ...docSnap.data()
      });
    });
    return leads;
  } catch (error) {
    console.error("Error fetching leads from Firestore: ", error);
    handleFirestoreError(error, OperationType.LIST, "leads");
  }
}

/**
 * Update the status of a lead
 * @param {string} leadId 
 * @param {string} newStatus 
 */
export async function updateLeadStatus(leadId, newStatus) {
  try {
    const leadRef = doc(db, "leads", leadId);
    await updateDoc(leadRef, { status: newStatus });
    console.log(`Lead ${leadId} status updated to ${newStatus}`);
    return true;
  } catch (error) {
    console.error("Error updating lead status: ", error);
    handleFirestoreError(error, OperationType.UPDATE, `leads/${leadId}`);
  }
}

/**
 * Delete a lead
 * @param {string} leadId 
 */
export async function deleteLead(leadId) {
  try {
    const leadRef = doc(db, "leads", leadId);
    await deleteDoc(leadRef);
    console.log(`Lead ${leadId} deleted successfully`);
    return true;
  } catch (error) {
    console.error("Error deleting lead: ", error);
    handleFirestoreError(error, OperationType.DELETE, `leads/${leadId}`);
  }
}

