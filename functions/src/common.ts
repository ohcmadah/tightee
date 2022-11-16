import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { SEOUL_CODE } from "./constants";

export const https = functions
  .runWith({ secrets: ["SERVICE_ACCOUNT_KEY"] })
  .region(SEOUL_CODE).https;

export const getAdminApp = () => {
  const serviceAccountKey = JSON.parse(process.env.SERVICE_ACCOUNT_KEY || "");

  const app = !admin.apps.length
    ? admin.initializeApp({
        credential: admin.credential.cert(serviceAccountKey),
      })
    : admin.app();

  return app;
};
