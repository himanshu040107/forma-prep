import { Router } from "express";
import { authenticateToken } from "../middleware/auth.middleware.js";
import {
  generateInterviewReportController,
  generateInterviewReportByIdController,
  getAllInterviewReportsController,
  deleteInterviewReportController,
  generateResumePdfController,
} from "../controllers/interview.controller.js";
import upload from "../middleware/file.middleware.js";
const router = Router();

/**
 * @route POST /api/interview
 * @description generate interview report on the basis of self description ,resume pdf and job description
 * @access Private
 */
router.post(
  "/",
  authenticateToken,
  upload.single("resume"),
  generateInterviewReportController,
);

/**
 * @route GET /api/intervew/report/:interviewId
 * @description get interview report on the basis of interviewId
 * @access Private
 */
router.get(
  "/report/:interviewId",
  authenticateToken,
  generateInterviewReportByIdController,
);

/**
 * @route GET /api/interview
 * @description get all interview reports of the user
 * @access Private
 */
router.get("/", authenticateToken, getAllInterviewReportsController);

/**
 * @route DELETE /api/interview/:interviewId
 * @description Delete one of the current user's interview reports
 * @access Private
 */
router.delete(
  "/:interviewId",
  authenticateToken,
  deleteInterviewReportController,
);

/**
 * @route POST /api/interview/resume/pdf/:interviewId
 * @description Generate a resume PDF from a saved interview report
 * @access Private
 */
router.post("/resume/pdf/:interviewId", authenticateToken, generateResumePdfController);

export default router;
