import * as admin from "firebase-admin";
import * as express from "express";
import * as cors from "cors";
import { getAdminApp, https } from "./common";
import { Option } from "./@types";

const app = express();
app.use(cors({ origin: true }));

app.get("/", async (req, res) => {
  try {
    const app = getAdminApp();
    const db = admin.firestore(app);

    const { docs } = await db.collection("options").get();

    if (docs.length === 0) {
      return res.status(204).json([]);
    }

    const options = docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Option),
    }));
    const { ids } = req.query;
    if (ids && Array.isArray(ids)) {
      const idsSet = new Set(ids as string[]);
      const filtered = options.filter((option) => idsSet.has(option.id));
      return res.status(200).json(filtered);
    }

    return res.status(200).json(options);
  } catch (error) {
    return res.status(500).json(error);
  }
});

export default https.onRequest(app);
