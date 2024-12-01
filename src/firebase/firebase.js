import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { query, collection, where, getDocs, getFirestore, doc, setDoc, getDoc, updateDoc, addDoc, arrayUnion, serverTimestamp, onSnapshot, Timestamp} from "firebase/firestore"; // Firestore imports
import { getStorage, ref, uploadBytesResumable, uploadBytes, getDownloadURL } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyDUAHMtPZbSlfUZEmoQz6bC36VawI7B-Hc",
    authDomain: "hazardhub-gfg.firebaseapp.com",
    projectId: "hazardhub-gfg",
    storageBucket: "hazardhub-gfg.appspot.com",
    messagingSenderId: "178925033138",
    appId: "1:178925033138:web:29b17369f4a93ec2439bab",
    measurementId: "G-X56DGTRFNM"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app); // Firestore instance
const storage = getStorage(app);

// Register user with specific collection (volunteer or department)
export const registerUser = async (email, password, userDetails) => {
  try{
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    let dataToSave = {};

    // Filter data based on user type
    if (userDetails.selectedUserType === 'Volunteer') {
        dataToSave = {
        name: userDetails.name,
        email: email,
        mobile: userDetails.mobile,
        bloodGroup: userDetails.bloodGroup,
        add1: userDetails.add1,
        add2: userDetails.add2,
        state: userDetails.state,
        pincode: userDetails.pincode
        };
    } else if (userDetails.selectedUserType === 'Department') {
        dataToSave = {
        name: userDetails.name,
        statesOfOperation: userDetails.statesOfOperation,
        email: email, 
        };
    }
    // Determine collection based on user type
    const collection = userDetails.selectedUserType === 'Volunteer' ? 'volunteers' : 'departments';

    // Create document in the appropriate collection
    const userRef = doc(db, collection, user.uid);
    console.log("Data to save:", dataToSave);
    console.log("Document reference:", userRef);
    console.log("Collection name:", collection);
    await setDoc(userRef, dataToSave);
    console.log("Submited");
    return user;
  } catch(error){
    console.error("Error during registration:", error);
    throw error;
  }
};

// Login User
export const loginUser = async(email, password, selectedUserType) => {

  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  const collectionName = selectedUserType === 'Volunteer' ? 'volunteers' : 'departments';
  const q = query(collection(db, collectionName), where("email", "==", email));
  const querySnapshot = await getDocs(q);
    
  if (querySnapshot.empty) {
    throw new Error('Invalid user type');
  }
  console.log(userCredential.user);
  return userCredential.user;
};

// Send password reset email
export const sendPasswordReset = (email) => {
  return sendPasswordResetEmail(auth, email);
};

// Upload project image and return the download URL
export const uploadProjectImage = (imageFile, projectId) => {
  return new Promise((resolve, reject) => {
    const storageRef = ref(storage, `projects/${projectId}.png`);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);

    uploadTask.on('state_changed', 
      (snapshot) => {
        // Optional: Handle progress if needed
      }, 
      (error) => {
        reject(error);
      }, 
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        resolve(downloadURL); // Resolve with the image URL
      }
    );
  });
};

// Upload project details (including image URL) to Firestore
export const uploadProjectDetails = async (projectData, projectId) => {
  try {
    const projectRef = doc(db, "projects", projectId);

    // Add initiateTime field with the current timestamp
    const projectDataWithTime = {
      ...projectData,
      initiateTime: Timestamp.now(), // Adds the current Firestore Timestamp
    };

    await setDoc(projectRef, projectDataWithTime);
    console.log("Project details uploaded to Firestore:", projectId);
  } catch (error) {
    console.error("Error uploading project details:", error);
  }
};

export const getProjects = async () => {
  const projectsCollection = collection(db, "projects"); // Reference to your 'projects' collection
  const projectsSnapshot = await getDocs(projectsCollection);
  
  // Map the documents into an array of project objects
  const projectsList = projectsSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));

  // Sort the projects by initiateTime in descending order
  const sortedProjects = projectsList.sort((a, b) => {
    // Check if initiateTime exists and is valid
    const timeA = a.initiateTime?.seconds
      ? new Date(a.initiateTime.seconds * 1000)
      : new Date(0); // Default to epoch time if missing
    const timeB = b.initiateTime?.seconds
      ? new Date(b.initiateTime.seconds * 1000)
      : new Date(0); // Default to epoch time if missing

    return timeB - timeA; // Sort descending
  });

  return sortedProjects; // Return the sorted array of projects
};


// Fetch project details by ID
export const fetchProjectById = async (projectId) => {
  const projectDoc = await getDoc(doc(db, 'projects', projectId));
  return projectDoc.exists() ? projectDoc.data() : null;
};

// Fetch volunteers for a specific project
export const fetchVolunteersForProject = async (projectId) => {
  // Step 1: Fetch the volunteersIdArray from the specified project
  const volunteersQuery = query(
    collection(db, 'projects-volunteers'),
    where('projectId', '==', projectId)
  );
  const querySnapshot = await getDocs(volunteersQuery);

  // Assuming one document per projectId; adjust as needed
  const volunteersIdArray = querySnapshot.docs[0]?.data().volunteersIdArray;

  if (!volunteersIdArray || volunteersIdArray.length === 0) {
    return []; // Return empty array if no volunteers are found
  }

  // Step 2: Fetch volunteer details for each email in volunteersIdArray
  const volunteersDetailsQuery = query(
    collection(db, 'volunteers'),
    where('email', 'in', volunteersIdArray)
  );
  const volunteerDetailsSnapshot = await getDocs(volunteersDetailsQuery);

  // Step 3: Map and return the desired fields from each matching volunteer
  return volunteerDetailsSnapshot.docs.map(doc => {
    const { name, mobile, bloodGroup } = doc.data();
    return { name, mobile, bloodGroup };
  });
};

// Fetch hospitals for a specific project
export const fetchHospitalsForProject = async (pincode) => {
  const hospitalsQuery = query(collection(db, 'hospitals'), where('pincode', '==', pincode));
  const querySnapshot = await getDocs(hospitalsQuery);
  return querySnapshot.docs.map(doc => doc.data());
};

export const addVolunteerToProject = async (projectId, volunteerEmail) => {
  // Step 1: Find the document with the matching projectId
  const volunteersQuery = query(
    collection(db, 'projects-volunteers'),
    where('projectId', '==', projectId)
  );
  const querySnapshot = await getDocs(volunteersQuery);

  if (querySnapshot.empty) {
    // Step 2: Create a new document with the projectId and add volunteerEmail to volunteersIdArray
    const newDocRef = doc(collection(db, 'projects-volunteers'));
    await setDoc(newDocRef, {
      projectId,
      volunteersIdArray: [volunteerEmail]
    });
    return `New project created with ID ${projectId}, and volunteer email ${volunteerEmail} added.`;
  } else {
    // Assuming there's only one document per projectId
    const docRef = querySnapshot.docs[0].ref;

    // Step 3: If the document exists, add the volunteerEmail to the volunteersIdArray field
    await updateDoc(docRef, {
      volunteersIdArray: arrayUnion(volunteerEmail)
    });
    return `Volunteer with email ${volunteerEmail} added to project ${projectId}`;
  }
};

// Update project status
export const updateProjectStatus = async (projectId, status) => {
  await updateDoc(doc(db, 'projects', projectId), { status });
};


export const addHospital = async (hospitalData) => {
  try {
    const hospitalsRef = collection(db, 'hospitals');
    const docRef = await addDoc(hospitalsRef, hospitalData);
    return docRef.id;
  } catch (error) {
    console.error('Error adding hospital:', error);
    throw error;
  }
};

// Add a lost person to `losts` and return the document ID
export const addLostPerson = async (lostPerson) => {
  const lostsRef = collection(db, 'losts');
  const docRef = await addDoc(lostsRef, lostPerson);
  return docRef.id;
};

// Add a lost ID to a project in `project-losts`
export const addLostToProject = async (projectId, lostId) => {
  const projectLostsRef = doc(db, 'project-losts', projectId);
  const projectLostsDoc = await getDoc(projectLostsRef);

  if (projectLostsDoc.exists()) {
      // Document exists; update the array of lost IDs
      await updateDoc(projectLostsRef, {
          losts: arrayUnion(lostId),
      });
  } else {
      // Document does not exist; create a new document
      await setDoc(projectLostsRef, {
          projectId: projectId,
          losts: [lostId],
      });
  }
};

// Upload an image to Firebase Storage and get its download URL
export const uploadLostImage = async (file, lostId) => {
  const imageRef = ref(storage, `lost/${lostId}`);
  await uploadBytes(imageRef, file);
  return await getDownloadURL(imageRef);
};

export const updateLostPersonPhoto = async (lostId, photoUrl) => {
  const lostDocRef = doc(db, 'losts', lostId);
  await updateDoc(lostDocRef, { photo: photoUrl });
};

export const fetchLostPeopleForProject = async (projectId) => {
  try {
      // Step 1: Retrieve lost person IDs for the project
      const projectLostDocRef = doc(db, 'project-losts', projectId);
      const projectLostDoc = await getDoc(projectLostDocRef);

      if (projectLostDoc.exists()) {
          const { losts } = projectLostDoc.data();

          // Step 2: Use the lost IDs to fetch lost person details
          const lostPeopleQuery = query(
              collection(db, 'losts'),
              where('__name__', 'in', losts)
          );
          const lostPeopleSnapshot = await getDocs(lostPeopleQuery);

          // Step 3: Map data to an array
          const lostPeople = lostPeopleSnapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data()
          }));

          return lostPeople;
      } else {
          // Return empty array if no document exists for the project
          return [];
      }
  } catch (error) {
      console.error("Error fetching lost people for project:", error);
      throw error;
  }
};

export const fetchNotifications = async () => {
  const notificationsSnapshot = await getDocs(collection(db, 'notifications'));
  return notificationsSnapshot.docs.map(doc => ({
    ...doc.data(),
    id: doc.id,
  }));
};

// Fetch project name by project ID
export const fetchProjectNameById = async (projectId) => {
  const projectRef = doc(db, 'projects', projectId);
  const projectSnapshot = await getDoc(projectRef);

  if (projectSnapshot.exists()) {
    return projectSnapshot.data().projectName;
  }
  return null;
};

export const addNotification = async (notificationData) => {
  try {
      await addDoc(collection(db, "notifications"), {
          ...notificationData,
          timestamp: serverTimestamp() // Automatically sets the server's current timestamp
      });
  } catch (error) {
      console.error("Error adding notification:", error);
  }
};

export const subscribeToNotifications = (callback) => {
  const notificationsRef = collection(db, "notifications");
  return onSnapshot(notificationsRef, async (snapshot) => {
    const notificationsData = await Promise.all(
      snapshot.docs.map(async (notificationDoc) => {
        const notification = { id: notificationDoc.id, ...notificationDoc.data() };
        
        if (notification.projectId) {
          const projectDocRef = doc(db, "projects", notification.projectId);
          const projectDoc = await getDoc(projectDocRef);
          if (projectDoc.exists()) {
            notification.projectName = projectDoc.data().projectName;
          }
        }

        return notification;
      })
    );

    callback(notificationsData);
  });
};

export const addNoticeToProject = async (projectId, message) => {
  const noticesRef = collection(db, 'notices');
  const q = query(noticesRef, where('projectId', '==', projectId));
  const querySnapshot = await getDocs(q);
  
  const time = new Date(); // Using JavaScript Date for timestamp
  
  if (querySnapshot.empty) {
      // If no document exists, create a new one with the projectId and an array of notices
      await addDoc(noticesRef, {
          projectId: projectId,
          notices: [{ message, timestamp: time }]
      });
  } else {
      // If document exists, update it by appending the new notice
      const docRef = querySnapshot.docs[0].ref;
      await updateDoc(docRef, {
          notices: arrayUnion({ message, timestamp: time })
      });
  }
};

export const getNoticesForProject = async (projectId) => {
  try {
    // Reference to the 'notices' collection
    const noticesRef = collection(db, 'notices');

    // Query to fetch notices that match the given projectId
    const q = query(noticesRef, where('projectId', '==', projectId));

    // Fetch the notices documents
    const querySnapshot = await getDocs(q);

    // Check if any notices were found
    if (querySnapshot.empty) {
      console.log('No notices found for the specified projectId');
      return [];
    }

    // Extract the notices data from the query snapshot
    const notices = querySnapshot.docs.map(doc => doc.data())[0].notices;

    const sortedMessages = notices
    .sort((a, b) => {
      const timestampA = a.timestamp.seconds * 1000 + a.timestamp.nanoseconds / 1000000;
      const timestampB = b.timestamp.seconds * 1000 + b.timestamp.nanoseconds / 1000000;
      return timestampB - timestampA;
    })
    .map(notice => notice.message);
    
    return sortedMessages;

  } catch (error) {
    console.error('Error fetching notices:', error);
    return [];
  }
};

export const getNoticesWithTime = async (projectId) => {
  try {
    // Reference to the 'notices' collection
    const noticesRef = collection(db, 'notices');

    // Query to fetch notices that match the given projectId
    const q = query(noticesRef, where('projectId', '==', projectId));

    // Fetch the notices documents
    const querySnapshot = await getDocs(q);

    // Check if any notices were found
    if (querySnapshot.empty) {
      console.log('No notices found for the specified projectId');
      return [];
    }

    // Extract the notices data from the query snapshot
    const notices = querySnapshot.docs.map(doc => doc.data())[0].notices;

    const sortedMessages = notices
    .sort((a, b) => {
      const timestampA = a.timestamp.seconds * 1000 + a.timestamp.nanoseconds / 1000000;
      const timestampB = b.timestamp.seconds * 1000 + b.timestamp.nanoseconds / 1000000;
      return timestampB - timestampA;
    });
    
    return sortedMessages;

  } catch (error) {
    console.error('Error fetching notices:', error);
    return [];
  }
};


export const addConcernToProject = async (projectId, concernData) => {
  try {
    let imageUrl = null;

    // Upload image if provided
    if (concernData.imageFile) {
      const storageRef = ref(storage, `concerns/${projectId}/${Date.now()}`);
      await uploadBytes(storageRef, concernData.imageFile);
      imageUrl = await getDownloadURL(storageRef);
    }

    // Create a new concern document in the `concerns` collection
    const concernsCollectionRef = collection(db, 'concerns');
    const newConcernRef = await addDoc(concernsCollectionRef, {
      description: concernData.concern,
      imageUrl: imageUrl || null,
      timestamp: concernData.timestamp || new Date().toISOString(),
      status: 'In Progress', // Default status
    });

    // Reference to the `project-concerns` collection
    const projectConcernsRef = doc(db, 'project-concerns', projectId);

    // Check if a document for the project already exists
    const docSnap = await getDoc(projectConcernsRef);
    if (docSnap.exists()) {
      // Document exists: Add the new concern's ID to the concerns array
      await updateDoc(projectConcernsRef, {
        concerns: arrayUnion(newConcernRef.id),
      });
    } else {
      // Document does not exist: Create a new document with projectId and concerns array
      await setDoc(projectConcernsRef, {
        projectId: projectId,
        concerns: [newConcernRef.id],
      });
    }
  } catch (error) {
    console.error('Error adding concern:', error);
    throw error;
  }
};

export const getConcernsForProject = async (projectId) => {
  try {
    // Query the project-concerns collection for the matching projectId
    const projectConcernsRef = collection(db, 'project-concerns');
    const projectQuery = query(projectConcernsRef, where('projectId', '==', projectId));
    const projectSnapshot = await getDocs(projectQuery);

    if (projectSnapshot.empty) {
      console.log('No concerns found for the project');
      return [];
    }

    // Assume there is only one matching document
    const projectDoc = projectSnapshot.docs[0];
    const { concerns: concernIds } = projectDoc.data(); // Array of concern document IDs

    if (!concernIds || concernIds.length === 0) {
      console.log('No concerns listed for the project');
      return [];
    }

    // Fetch the details of each concern from the concerns collection
    const concernsCollection = collection(db, 'concerns');
    const concerns = await Promise.all(
      concernIds.map(async (concernId) => {
        const concernDoc = await getDoc(doc(concernsCollection, concernId));
        return { id: concernDoc.id, ...concernDoc.data() };
      })
    );

    return concerns;
  } catch (error) {
    console.error('Error fetching concerns for project:', error);
    throw error;
  }
};

export const updateConcernStatus = async (concernId, status) => {
  try {
    const concernRef = doc(db, 'concerns', concernId);
    await updateDoc(concernRef, { status });
    console.log(`Concern ${concernId} status updated to ${status}`);
  } catch (error) {
    console.error('Error updating concern status:', error);
    throw error;
  }
};