import * as admin from "firebase-admin";
import * as express from "express";
import * as cors from "cors";
import * as moment from "moment-timezone";
import { Answer, Option, Question } from "./@types";
import { getAdminApp, getProperty, https, promiseAll, toMap } from "./common";
import { DocumentReference } from "firebase/firestore";
import { checkUserIdContained } from "./middleware";

const app = express();
app.use(cors({ origin: true }));

type ReturnAnswer = {
  id: string;
  user: Answer["user"];
  question: { id: string } & Question;
  option: { id: string } & Option;
  createdAt: number;
};

const convertDocToAnswer = async (
  db: admin.firestore.Firestore,
  doc: admin.firestore.QueryDocumentSnapshot | admin.firestore.DocumentSnapshot
) => {
  const answer = doc.data() as Answer;
  const questionPromise = db.doc("questions/" + answer.question.id).get();
  const optionPromise = db.doc("options/" + answer.option.id).get();
  const [question, option] = await promiseAll([questionPromise, optionPromise]);

  const options = question
    .get("options")
    .map((doc: DocumentReference) => doc.id);

  const converted: ReturnAnswer = {
    ...answer,
    id: doc.id,
    question: {
      id: question.id,
      ...(question.data() as Question),
      options,
    },
    option: { id: option.id, ...(option.data() as Option) },
  };
  return converted;
};

const convertDocsToAnswers = async (
  db: admin.firestore.Firestore,
  docs: admin.firestore.QueryDocumentSnapshot<admin.firestore.DocumentData>[]
) => {
  const answersPromise = docs.map((doc) => convertDocToAnswer(db, doc));

  const answers = (await Promise.allSettled(answersPromise)).reduce(
    (acc: ReturnAnswer[], result) =>
      result.status === "fulfilled" ? [...acc, result.value] : acc,
    []
  );

  return answers.sort((a, b) => b.createdAt - a.createdAt);
};

const calcAgeGroup = (birthdate: number) => {
  const year = moment.tz(birthdate, "Asia/Seoul").year();
  const currentYear = moment().tz("Asia/Seoul").year();
  const age = currentYear - year + 1;
  return age.toString().slice(0, 1) + "0";
};

app.get("/", checkUserIdContained, async (req, res) => {
  try {
    const app = getAdminApp();
    const db = admin.firestore(app);

    const { user: userId, question: questionId, groups } = req.query;

    if (userId) {
      if (userId === req.body.uid) {
        const { empty, docs } = await db
          .collection("answers")
          .where("user.id", "==", userId)
          .get();
        const answers = await convertDocsToAnswers(db, docs);
        if (empty) {
          return res.status(204).json();
        }
        return res.status(200).json(answers);
      }
      return res
        .status(403)
        .json({ code: 403, message: "사용자 인증에 실패하였습니다." });
    }

    if (groups && Array.isArray(groups)) {
      const coll = db.collection("answers");
      const query = questionId
        ? coll.where("question", "==", db.doc("questions/" + questionId))
        : coll;
      const { empty, docs } = await query.get();
      if (empty) {
        return res.status(204).json();
      }
      const answers = await convertDocsToAnswers(db, docs);

      const result = (groups as string[]).reduce((acc, groupKey) => {
        const keyGetter = (answer: ReturnAnswer) => {
          const key = getProperty(answer, groupKey);
          return groupKey.match(/birthdate/) ? calcAgeGroup(key) : key;
        };
        const group = toMap(answers, keyGetter, (answer) => answer.option);
        return { ...acc, [groupKey]: Object.fromEntries(group) };
      }, {});

      return res.status(200).json(result);
    }

    return res
      .status(400)
      .json({ code: 400, message: "전체 답변은 불러올 수 없습니다." });
  } catch (error) {
    return res.status(500).json(error);
  }
});

app.get("/:id", async (req, res) => {
  try {
    const { id: answerId } = req.params;

    const app = getAdminApp();
    const db = admin.firestore(app);
    const auth = admin.auth(app);

    const answerDoc = await db.doc("answers/" + answerId).get();
    if (!answerDoc.exists) {
      return res.status(204).json({});
    }

    const answer = await convertDocToAnswer(db, answerDoc);
    const { id, nickname, region, birthdate, gender, MBTI } = answer.user;

    const token = req.headers.authorization?.split("Bearer ")[1];
    if (token) {
      try {
        const { uid } = await auth.verifyIdToken(token);
        if (uid === id) {
          return res.status(200).json({
            ...answer,
            user: { id, nickname, region, birthdate, gender, MBTI },
          });
        }
      } catch (error) {}
    }

    return res.status(200).json({
      ...answer,
      user: { nickname, region, birthdate, gender, MBTI },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
});

app.post("/", async (req, res) => {
  try {
    const app = getAdminApp();
    const db = admin.firestore(app);

    const { question: questionId, option: optionId, user: userId } = req.body;

    if (!questionId || !optionId || !userId) {
      return res.status(400).json({
        code: 400,
        message: "Bad Request.",
      });
    }

    const { docs: answers } = await db.collection("answers").get();
    const isAlreadyAnswered = answers.find(
      (answer) =>
        answer.get("question").id === questionId &&
        answer.data().user.id === userId
    );

    if (isAlreadyAnswered) {
      return res
        .status(400)
        .json({ code: 400, message: "You have already answered." });
    }

    const option = db.doc("options/" + optionId);
    const question = db.doc("questions/" + questionId);
    const user = await db.doc("users/" + userId).get();

    const data = {
      option,
      question,
      user: user.data(),
      createdAt: admin.firestore.Timestamp.now(),
    };
    const answer = await db.collection("answers").add(data);

    return res.status(200).json({ id: answer.id });
  } catch (error) {
    return res.status(500).json(error);
  }
});

export default https.onRequest(app);
