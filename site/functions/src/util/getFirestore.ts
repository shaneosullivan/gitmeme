import serviceAccount from "../service_account";
import * as admin from "firebase-admin";

let firebaseApp: admin.app.App = admin.initializeApp({
  credential: admin.credential.cert({
    projectId: serviceAccount.project_id,
    clientEmail: serviceAccount.client_email,
    privateKey: serviceAccount.private_key
  }),
  storageBucket: "git-meme-prod.appspot.com"
});

export default function getFirestore() {
  return firebaseApp.firestore();
}

export function getFirebase() {
  return firebaseApp;
}

export function getStorage() {
  return admin.storage();
}
