import * as admin from "firebase-admin";
import * as express from "express";
import * as cors from "cors";
import { Answer } from "./@types";
import { getAdminApp, https } from "./common";
import { OrderByDirection, WhereFilterOp } from "firebase/firestore";

const app = express();
app.use(cors({ origin: true }));

type Query =
  | { type: "where"; path: string; operation: WhereFilterOp; value: any }
  | { type: "orderBy"; path: string; direction?: OrderByDirection };

const createQuery = (
  db: admin.firestore.Firestore,
  queryParams: { user?: string; question?: string }
) => {
  const userId = queryParams.user;
  const questionId = queryParams.question;

  const coll = db.collection("answers");
  const queries: Query[] = [];

  if (userId) {
    const user = db.doc("users/" + userId);
    queries.push({ type: "where", path: "user", operation: "==", value: user });
  }
  if (questionId) {
    const question = db.doc("questions/" + questionId);
    queries.push({
      type: "where",
      path: "question",
      operation: "==",
      value: question,
    });
  }

  queries.push({ type: "orderBy", path: "createdAt", direction: "desc" });
  const query = queries.reduce((acc: FirebaseFirestore.Query, q) => {
    switch (q.type) {
      case "where":
        return acc.where(q.path, q.operation, q.value);

      case "orderBy":
        return acc.orderBy(q.path, q.direction);

      default:
        return acc;
    }
  }, coll);
  return query;
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

    const answersPromise = docs.map(async (doc) => {
      const answer = doc.data() as Answer;
      const user = await db.doc("users/" + answer.question.id).get();
      const question = await db.doc("questions/" + answer.question.id).get();
      const option = await db.doc("options/" + answer.option.id).get();

      const allAnswers = await createQuery(db, {
        question: answer.question.id,
      }).get();
      const sameAnswers = allAnswers.docs.filter((doc) => {
        const data = doc.data() as Answer;
        return data.option.id === answer.option.id;
      });
      const ratio = sameAnswers.length / allAnswers.docs.length;

      return {
        id: doc.id,
        user: user.data(),
        question: question.data(),
        option: option.data(),
        ratio,
      };
    });

    const answers = (await Promise.allSettled(answersPromise)).reduce(
      (acc: any[], result) =>
        result.status === "fulfilled" ? [...acc, result.value] : acc,
      []
    );

    return res.status(200).json(answers);
  } catch (error) {
    return res.status(500).json(error);
  }
});

export default https.onRequest(app);
