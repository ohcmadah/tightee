import * as admin from "firebase-admin";
import * as express from "express";
import * as cors from "cors";
import { Question } from "./@types";
import { getAdminApp, https } from "./common";

const app = express();
app.use(cors({ origin: true }));

app.get("/", async (req, res) => {
  const { date } = req.query;

  try {
    const app = getAdminApp();
    const db = admin.firestore(app);

    const { docs } = await db
      .collection("questions")
      .where("createdAt", "==", date)
      .get();

    if (docs.length === 0) {
      return res
        .status(204)
        .json({ code: 204, message: "오늘의 질문이 존재하지 않습니다." });
    }

    const questions = docs.map((doc) => ({
      ...(doc.data() as Question),
      id: doc.id,
    }));

    return res.status(200).json(questions);
  } catch (error) {
    return res.status(500).json(error);
  }
});

app.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const app = getAdminApp();
    const db = admin.firestore(app);

    const questionDoc = await db.doc("questions/" + id).get();
    if (questionDoc.exists) {
      const question = questionDoc.data() as Question;
      return res.status(200).json({ ...question, id: questionDoc.id });
    } else {
      return res.status(204).json({});
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }
});

export default https.onRequest(app);
