import * as admin from "firebase-admin";
import * as express from "express";
import { getAdminApp } from "../common";

export const checkToken: express.RequestHandler = async (req, res, next) => {
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
    req.body.uid = uid;

    return next();
  } catch (error) {
    return res
      .status(403)
      .json({ code: 403, message: "사용자 인증에 실패하였습니다." });
  }
};

export const checkFields: express.RequestHandler = (req, res, next) => {
  try {
    const { fields } = req.query;
    if (typeof fields === "string" && Array.isArray(JSON.parse(fields))) {
      const fieldStringList = JSON.parse(fields) as string[];
      const isAuthRequired =
        fieldStringList.includes("id") || fieldStringList.includes("email");
      if (isAuthRequired) {
        return checkToken(req, res, next);
      }
    }
    return next();
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

export const checkUserIdContained: express.RequestHandler = (
  req,
  res,
  next
) => {
  try {
    const userId = req.query.user;
    if (typeof userId === "string") {
      return checkToken(req, res, next);
    }
    return next();
  } catch (error) {
    return res.status(500).json(error);
  }
};
