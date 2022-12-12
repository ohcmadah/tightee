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

    const { docs: questions } = await db
      .collection("questions")
      .where("createdAt", "==", date)
      .get();

    if (questions.length === 0) {
      return res
        .status(204)
        .json({ code: 204, message: "오늘의 질문이 존재하지 않습니다." });
    }

    const question = questions[0].data() as Question;
    const options = question.options.map((option) => option.id);

    return res.status(200).json({
      ...question,
      id: questions[0].id,
      options,
    });
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
      return res
        .status(200)
        .json({ ...questionDoc.data(), id: questionDoc.id });
    } else {
      return res.status(204).json({});
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }
});

export default https.onRequest(app);
