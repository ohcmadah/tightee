import * as admin from "firebase-admin";
import * as express from "express";
import * as cors from "cors";
import { getAdminApp, https } from "./common";

const app = express();
app.use(cors({ origin: true }));

const checkToken: express.RequestHandler = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split("Bearer ")[1];

    if (!token) {
      return res
        .status(403)
        .json({ code: 403, message: "No credentials sent!" });
    }

    const app = getAdminApp();
    const auth = admin.auth(app);

    const { uid } = await auth.verifyIdToken(token);
    const { id } = req.params;

    if (uid !== id) {
      return res
        .status(403)
        .json({ code: 403, message: "사용자 인증에 실패하였습니다." });
    }

    return next();
  } catch (error) {
    return res
      .status(403)
      .json({ code: 403, message: "사용자 인증에 실패하였습니다." });
  }
};

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

app.post("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const { nickname, region, birthdate, gender } = data;
    if (!nickname || !region || !birthdate || !gender) {
      return res.status(400).json({
        code: 400,
        message: "Bad Request.",
      });
    }

    const app = getAdminApp();
    const db = admin.firestore(app);

    await db.collection("users").doc(id).set(data);
    return res.status(200).json({});
  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }
});

app.get("/:id", checkToken, async (req, res) => {
  try {
    const { id } = req.params;

    const app = getAdminApp();
    const db = admin.firestore(app);

    const userDoc = await db.doc("users/" + id).get();
    if (userDoc.exists) {
      return res.status(200).json({ ...userDoc.data() });
    } else {
      return res.status(204).json({});
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }
});

app.patch("/:id", checkToken, async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const app = getAdminApp();
    const db = admin.firestore(app);

    await db.doc("users/" + id).update(data);
    return res.status(200).json({});
  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }
});

app.delete("/:id", checkToken, async (req, res) => {
  try {
    const { id } = req.params;

    const app = getAdminApp();
    const db = admin.firestore(app);
    const auth = admin.auth(app);

    try {
      await auth.deleteUser(id);
    } catch (error: any) {
      if (error.code == "auth/requires-recent-login") {
        return res.status(400).json({
          code: 400,
          message: "Please sign in again to delete your account.",
        });
      }
      throw error;
    }

    const batch = db.batch();
    const answers = await db
      .collection("answers")
      .where("user.id", "==", id)
      .get();
    answers.forEach((answer) => batch.update(answer.ref, { "user.id": null }));
    batch.delete(db.doc("users/" + id));
    await batch.commit();

    return res.status(200).json({});
  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }
});

export default https.onRequest(app);
