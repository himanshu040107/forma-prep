import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true,
});


/**
 * @description Generate an interview report based on self-description, resume PDF, and job description.
 */
export async function generateInterviewReport({
  resume,
  jobDescription,
  selfDescription,
}) {
  try {
    const formData = new FormData();
    formData.append("resume", resume);
    formData.append("jobDescription", jobDescription);
    formData.append("selfDescription", selfDescription);

    const response = await api.post("/api/interview", formData);
    return response.data;
  } catch (error) {
    console.error("Error generating interview report:", error);
    throw error;
  }
}


/**
 * @description Get an interview report by its ID.
 */

export async function getInterviewReportById(interviewId) {
  try {
    const response = await api.get(`/api/interview/report/${interviewId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching interview report by ID:", error);
    throw error;
  }
}


/**
 * @description Get all interview reports of the user.
 */

export async function getAllInterviewReports() {
  try {
    const response = await api.get("/api/interview");
    return response.data;
  } catch (error) {
    console.error("Error fetching all interview reports:", error);
    throw error;
  }
}

export async function deleteInterviewReport(interviewId) {
  try {
    const response = await api.delete(`/api/interview/${interviewId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting interview report:", error);
    throw error;
  }
}

/**
 * @description Generate a resume PDF for a given interview ID.
 * @param {string} interviewId - The ID of the interview for which to generate the resume PDF.
 * @returns {Promise<Blob>} A promise that resolves to the generated resume PDF as a Blob.
 */
export async function generateResumePdf(interviewId) {
  try {
    const response = await api.post(`/api/interview/resume/pdf/${interviewId}`, null, {
      responseType: "blob",
    });
    return response.data;
  } catch (error) {
    console.error("Error generating resume PDF:", error);
    throw error;
  }
}



/**
 * @description Download a resume PDF for a given interview ID.
 * @param {Object} param0 - The parameters for downloading the resume PDF.
 * @param {string} param0.interviewId - The ID of the interview for which to download the resume PDF.
 * @returns {Promise<Blob>} A promise that resolves to the downloaded resume PDF as a Blob.
 */
export async function downloadResumePdf({interviewId}) {
  const response=await api.post(`/api/interview/resume/pdf/${interviewId}`, null, {
    responseType: "blob",
  });
  return response.data;
}
