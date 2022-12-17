import * as admin from "firebase-admin";
import * as express from "express";
import * as cors from "cors";
import { Answer, Option, Question } from "./@types";
import { getAdminApp, https } from "./common";
import { DocumentReference } from "firebase/firestore";
import { checkUserIdContained } from "./middleware";

const app = express();
app.use(cors({ origin: true }));

type QueryParams = {
  user?: string;
  question?: string;
  date?: string;
};
type ReturnAnswer = {
  id: string;
  user: Answer["user"];
  question: { id: string } & Question;
  option: { id: string } & Option;
  createdAt: number;
};

const createPredicate = (queryParams: QueryParams) => {
  const { user, question, date } = queryParams;

  const pred = (answer: ReturnAnswer) => {
    const results = [];
    if (user) {
      results.push(answer.user.id === user);
    }
    if (question) {
      results.push(answer.question.id === question);
    }
    if (date) {
      results.push(answer.question.createdAt === date);
    }
    return results.every((v) => v);
  };

  return pred;
};

app.get("/", async (req, res) => {
  try {
    const app = getAdminApp();
    const db = admin.firestore(app);

    const { empty, docs } = await db.collection("answers").get();
    if (empty) {
      return res.status(204).json([]);
    }

    const answersPromise = docs.map(async (doc) => {
      const answer = doc.data() as Answer;
      const question = await db.doc("questions/" + answer.question.id).get();
      const option = await db.doc("options/" + answer.option.id).get();

      const converted: ReturnAnswer = {
        ...answer,
        id: doc.id,
        question: { id: question.id, ...(question.data() as Question) },
        option: { id: option.id, ...(option.data() as Option) },
      };
      return converted;
    });

    const answers = (await Promise.allSettled(answersPromise)).reduce(
      (acc: ReturnAnswer[], result) =>
        result.status === "fulfilled" ? [...acc, result.value] : acc,
      []
    );

    const pred = createPredicate(req.query);
    const filteredAnswers = answers
      .filter(pred)
      .sort((a, b) => b.createdAt - a.createdAt);

    if (filteredAnswers.length === 0) {
      return res.status(204).json([]);
    } else {
      return res.status(200).json(filteredAnswers);
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
});

app.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const app = getAdminApp();
    const db = admin.firestore(app);

    const answerDoc = await db.doc("answers/" + id).get();
    if (!answerDoc.exists) {
      return res.status(204).json({});
    }

    const answer = answerDoc.data() as Answer;
    const question = await db.doc("questions/" + answer.question.id).get();
    const option = await db.doc("options/" + answer.option.id).get();

    const optionsPromise = question
      .get("options")
      .map((doc: DocumentReference) => db.doc("options/" + doc.id).get());

    const options = (await Promise.allSettled(optionsPromise)).reduce(
      (acc: ({ id: string } & Option)[], result) =>
        result.status === "fulfilled"
          ? [
              ...acc,
              { ...(result.value.data() as Option), id: result.value.id },
            ]
          : acc,
      []
    );

    return res.status(200).json({
      ...answer,
      id: answerDoc.id,
      question: { id: question.id, ...(question.data() as Question), options },
      option: { id: option.id, ...(option.data() as Option) },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
});

const convertDocsToAnswers = async (
  db: admin.firestore.Firestore,
  docs: admin.firestore.QueryDocumentSnapshot<admin.firestore.DocumentData>[]
) => {
  const answersPromise = docs.map(async (doc) => {
    const answer = doc.data() as Answer;
    const question = await db.doc("questions/" + answer.question.id).get();
    const option = await db.doc("options/" + answer.option.id).get();

    const converted: ReturnAnswer = {
      ...answer,
      id: doc.id,
      question: { id: question.id, ...(question.data() as Question) },
      option: { id: option.id, ...(option.data() as Option) },
    };
    return converted;
  });

  const answers = (await Promise.allSettled(answersPromise)).reduce(
    (acc: ReturnAnswer[], result) =>
      result.status === "fulfilled" ? [...acc, result.value] : acc,
    []
  );

  return answers.sort((a, b) => b.createdAt - a.createdAt);
};

app.get("/", checkUserIdContained, async (req, res) => {
  try {
    const app = getAdminApp();
    const db = admin.firestore(app);

    const { user: userId } = req.query;

    if (userId) {
      if (userId === req.body.uid) {
        const { empty, docs } = await db
          .collection("answers")
          .where("user.id", "==", userId)
          .get();
        if (empty) {
          return res.status(204).json();
        }
        const answers = await convertDocsToAnswers(db, docs);
        return res.status(200).json(answers);
      }
      return res
        .status(403)
        .json({ code: 403, message: "사용자 인증에 실패하였습니다." });
    }

    return res.status(204).json();
  } catch (error) {
    return res.status(500).json(error);
  }
});

app.post("/", async (req, res) => {
  try {
    const app = getAdminApp();
    const db = admin.firestore(app);

    const { question: questionId, option: optionId, user: userId } = req.body;

    if (!questionId || !optionId) {
      return res.status(400).json({
        code: 400,
        message: "Bad Request.",
      });
    }

    const { docs: answers } = await db
      .collection("answers")
      .where("user.id", "==", userId)
      .get();
    const isAlreadyAnswered =
      answers.filter((answer) => answer.get("question").id === questionId)
        .length !== 0;

    if (isAlreadyAnswered) {
      return res
        .status(400)
        .json({ code: 400, message: "You have already answered." });
    }

    const option = db.doc("options/" + optionId);
    const question = db.doc("questions/" + questionId);
    const user = await db.doc("users/" + userId).get();

    const answer = {
      option,
      question,
      user: user.data(),
      createdAt: admin.firestore.Timestamp.now(),
    };
    await db.collection("answers").add(answer);

    return res.status(200).json({});
  } catch (error) {
    return res.status(500).json(error);
  }
});

export default https.onRequest(app);
