import { createRequire } from "module";
const require = createRequire(import.meta.url);
const pdf = require("pdf-parse");
import mongoose from "mongoose";

import {
  generateInterviewReport,
  generateResumePdf,
} from "../services/ai.service.js";
import InterviewReportModel from "../models/interviewReport.model.js";

export const generateInterviewReportController = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "Please upload a resume PDF",
      });
    }

    // Parse the PDF buffer directly
    let resumeText = "";
    try {
      const pdfData = await pdf(req.file.buffer);
      resumeText = pdfData.text;
    } catch (parseErr) {
      console.error("PDF parsing error:", parseErr);
      return res.status(400).json({
        message: "Failed to read the uploaded PDF file.",
      });
    }

    const { jobDescription, selfDescription } = req.body;

    if (!jobDescription || !selfDescription) {
      return res.status(400).json({
        message: "Job description and self-description are required",
      });
    }

    // Generate report using Gemini AI service
    const interviewReportByAi = await generateInterviewReport({
      resume: resumeText,
      jobDescription,
      selfDescription,
    });

    // Save report to MongoDB
    const interviewReport = await InterviewReportModel.create({
      jobDescription,
      resumeText,
      selfDescription,
      title: interviewReportByAi.title,
      matchScore: interviewReportByAi.matchScore,
      technicalQuestions: interviewReportByAi.technicalQuestions,
      behavioralQuestions: interviewReportByAi.behavioralQuestions,
      skillGaps: interviewReportByAi.skillGaps,
      preparationPlan: interviewReportByAi.preparationPlan,
      users: req.user.id,
    });

    return res.status(201).json({
      interviewReport,
    });
  } catch (err) {
    console.error("Interview report generation failed:", err);
    return res.status(500).json({
      message: "Failed to generate interview report",
      error: err.message,
    });
  }
};

/**
 * @route GET /api/interview/report/:interviewId
 * @description get interview report on the basis of interviewId
 * @access Private
 */
export const generateInterviewReportByIdController = async (req, res) => {
  try {
    const { interviewId } = req.params;

    // Find the interview report by ID and user ID
    const interviewReport = await InterviewReportModel.findOne({
      _id: interviewId,
      users: req.user.id,
    });

    if (!interviewReport) {
      return res.status(404).json({
        message: "Interview report not found",
      });
    }

    return res.status(200).json({
      interviewReport,
    });
  } catch (err) {
    console.error("Fetching interview report failed:", err);
    return res.status(500).json({
      message: "Failed to fetch interview report",
      error: err.message,
    });
  }
};
/**
 * @route GET /api/interview
 * @description get all interview reports of the user
 * @access Private
 */
export const getAllInterviewReportsController = async (req, res) => {
  try {
    const interviewReports = await InterviewReportModel.find({
      users: req.user.id,
    })
      .sort({ createdAt: -1 })
      .select("_id title matchScore createdAt");
    return res.status(200).json({
      interviewReports,
    });
  } catch (err) {
    console.error("Fetching all interview reports failed:", err);
    return res.status(500).json({
      message: "Failed to fetch all interview reports",
      error: err.message,
    });
  }
};

/**
 * @route DELETE /api/interview/:interviewId
 * @description Delete an interview report owned by the current user
 * @access Private
 */
export const deleteInterviewReportController = async (req, res) => {
  try {
    const deletedReport = await InterviewReportModel.findOneAndDelete({
      _id: req.params.interviewId,
      users: req.user.id,
    });

    if (!deletedReport) {
      return res.status(404).json({ message: "Interview report not found" });
    }

    return res
      .status(200)
      .json({ message: "Interview report deleted successfully" });
  } catch (err) {
    console.error("Deleting interview report failed:", err);
    return res.status(500).json({
      message: "Failed to delete interview report",
      error: err.message,
    });
  }
};

/**
 * @route POST /api/interview/resume/pdf/:interviewId
 * @description Generate a resume PDF from a saved interview report
 * @access Private
 */
export const generateResumePdfController = async (req, res) => {
  try {
    const { interviewId } = req.params;

    if (!mongoose.isValidObjectId(interviewId)) {
      return res.status(400).json({ message: "A valid interview report ID is required" });
    }

    const interviewReport = await InterviewReportModel.findOne({
      _id: interviewId,
      users: req.user.id,
    });
    if (!interviewReport) {
      return res.status(404).json({ message: "Interview report not found" });
    }
    const { resumeText, selfDescription, jobDescription } = interviewReport;
    const pdfBuffer = await generateResumePdf({
      resume: resumeText,
      selfDescription,
      jobDescription,
    });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=resume_${interviewId}.pdf`);
    res.send(pdfBuffer);
  } catch (err) {
    console.error("Resume PDF generation failed:", err);
    res.status(500).json({ message: "Failed to generate resume PDF" });
  }
};
