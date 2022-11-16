import * as admin from "firebase-admin";
import * as express from "express";
import * as cors from "cors";
import { Question, Option } from "../@types";
import { getAdminApp, https } from "./common";

const app = express();
app.use(cors({ origin: true }));

app.get("/", async (req, res) => {
  const { date } = req.query;

  try {
    const app = getAdminApp();
    const db = admin.firestore(app);

    const questions = await db
      .collection("questions")
      .where("createdAt", "==", date)
      .get();

    if (questions.docs.length === 0) {
      return res
        .status(204)
        .json({ code: 204, message: "오늘의 질문이 존재하지 않습니다." });
    }

    const question = questions.docs[0].data() as Question;
    const optionsPromise = question.options.map(
      async (option) => await db.doc("options/" + option.id).get()
    );
    const options = (await Promise.allSettled(optionsPromise)).reduce(
      (acc: { id: string; text: string }[], result) => {
        if (result.status === "fulfilled") {
          const option = result.value.data() as Option;
          return [...acc, { id: result.value.id, text: option.text }];
        } else {
          return acc;
        }
      },
      []
    );

    return res.status(200).json({
      ...question,
      id: questions.docs[0].id,
      options,
    });
  } catch (error) {
    return res.status(500).json(error);
  }
});

export default https.onRequest(app);
