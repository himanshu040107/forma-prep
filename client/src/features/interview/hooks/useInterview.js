import {
  generateInterviewReport,
  getInterviewReportById,
  getAllInterviewReports,
  deleteInterviewReport,
  generateResumePdf,
} from "../services/interview.api.js";
import { useContext } from "react";
import { InterviewContext } from "../interview.context.jsx";

/**
 * @description Custom hook to manage interview report state and actions.
 */
export const useInterview = () => {
  const { loading, setLoading, report, setReport, reports, setReports } =
    useContext(InterviewContext);

  /**
   * @description Generate an interview report based on self-description, resume PDF, and job description.
   */
  const generateReport = async ({
    resume,
    jobDescription,
    selfDescription,
  }) => {
    setLoading(true);
    try {
      const data = await generateInterviewReport({
        resume,
        jobDescription,
        selfDescription,
      });
      setReport(data.interviewReport);
      return data.interviewReport;
    } catch (error) {
      console.error("Error generating interview report:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * @description Get an interview report by its ID.
   */
  const fetchReportById = async (interviewId) => {
    setLoading(true);
    try {
      const data = await getInterviewReportById(interviewId);
      setReport(data.interviewReport);
      return data.interviewReport;
    } catch (error) {
      console.error("Error fetching interview report by ID:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * @description Get all interview reports of the user.
   */
  const fetchAllReports = async () => {
    setLoading(true);
    try {
      const data = await getAllInterviewReports();
      setReports(data.interviewReports);
      return data.interviewReports;
    } catch (error) {
      console.error("Error fetching all interview reports:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const removeReport = async (interviewId) => {
    await deleteInterviewReport(interviewId);
    setReports((currentReports) =>
      currentReports.filter((item) => item._id !== interviewId),
    );
  };

  const getResumePdf = async (interviewId) => {
    setLoading(true);
    let response = null;
    try {
      response = await generateResumePdf(interviewId);
      const url = window.URL.createObjectURL(
        new Blob([response], { type: "application/pdf" }),
      );
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `resume_${interviewId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error("Error generating resume PDF:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    report,
    reports,
    generateReport,
    fetchReportById,
    fetchAllReports,
    removeReport,
    getResumePdf
  };
};
