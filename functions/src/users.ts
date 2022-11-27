import * as admin from "firebase-admin";
import * as express from "express";
import * as cors from "cors";
import { getAdminApp, https } from "./common";

const app = express();
app.use(cors({ origin: true }));

const createQuery = (
  db: admin.firestore.Firestore,
  queryParams: { fields?: string[] }
) => {
  const coll = db.collection("users");
  const { fields } = queryParams;
  if (fields) {
    return coll.select(...fields);
  }
  return coll;
};

app.get("/", async (req, res) => {
  try {
    const app = getAdminApp();
    const db = admin.firestore(app);

    const query = createQuery(db, req.query);
    const { empty, docs } = await query.get();

    if (empty) {
      return res.status(204).json([]);
    }

    const users = docs.map((doc) => {
      return { id: doc.id, ...doc.data() };
    });

    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json(error);
  }
});

export default https.onRequest(app);
