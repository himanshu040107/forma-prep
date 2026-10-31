import config from "../config/config.js";
import { GoogleGenAI } from "@google/genai";
import puppeteer from "puppeteer";
import { z } from "zod";

const ai = new GoogleGenAI({
  apiKey: config.GOOGLE_GENAI_API_KEY,
});
const interviewReportSchema = z.object({
  matchScore: z
    .number()
    .describe(
      "A score between 0 and 100 indicating how well the candidate's profile matches the job describe",
    ),
  technicalQuestions: z
    .array(
      z.object({
        question: z
          .string()
          .describe("The technical question can be asked in the interview"),
        intention: z
          .string()
          .describe("The intention of interviewer behind asking this question"),
        answer: z
          .string()
          .describe(
            "How to answer this question, what points to cover, what approach to take etc.",
          ),
      }),
    )
    .describe(
      "Technical questions that can be asked in the interview along with their intention and how to answer them",
    ),
  behavioralQuestions: z
    .array(
      z.object({
        question: z
          .string()
          .describe("The behavioral question can be asked in the interview"),
        intention: z
          .string()
          .describe("The intention of interviewer behind asking this question"),
        answer: z
          .string()
          .describe(
            "How to answer this question, what points to cover, what approach to take etc.",
          ),
      }),
    )
    .describe(
      "Behavioral questions that can be asked in the interview along with their intention and how to answer them",
    ),
  skillGaps: z
    .array(
      z.object({
        skill: z.string().describe("The skill which the candidate is lacking"),
        severity: z
          .enum(["low", "medium", "high"])
          .describe(
            "The severity of this skill gap, i.e. how important is this skill for the job and how much it can impact the candidate's chances",
          ),
      }),
    )
    .describe(
      "List of skill gaps in the candidate's profile along with their severity",
    ),
  preparationPlan: z
    .array(
      z.object({
        day: z
          .number()
          .describe("The day number in the preparation plan, starting from 1"),
        focus: z
          .string()
          .describe(
            "The main focus of this day in the preparation plan, e.g. data structures, system design, mock interviews etc.",
          ),
        tasks: z
          .array(z.string())
          .describe(
            "List of tasks to be done on this day to follow the preparation plan, e.g. read a specific book or article, solve a set of problems, watch a video etc.",
          ),
      }),
    )
    .describe(
      "A day-wise preparation plan for the candidate to follow in order to prepare for the interview effectively",
    ),
  title: z
    .string()
    .describe(
      "The title of the job for which the interview report is generated",
    ),
});

async function generatePdfFromHtml(htmlContent) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(htmlContent, { waitUntil: "networkidle0" });
  const pdf = await page.pdf({ format: "A4" ,margin:{top:"20mm",bottom:"20mm",left:"15mm",right:"15mm"}});
  await browser.close();
  return pdf;
}

async function generateInterviewReport({
  resume,
  selfDescription,
  jobDescription,
}) {
  const prompt = `Generate an interview report for a candidate with the following details:
                        Resume: ${resume}
                        Self Description: ${selfDescription}
                        Job Description: ${jobDescription}
`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseJsonSchema: z.toJSONSchema(interviewReportSchema),
    },
  });

  return interviewReportSchema.parse(JSON.parse(response.text));
}

const generateResumePdf = async ({
  resume,
  selfDescription,
  jobDescription,
}) => {
  const resumePdfSchema = z.object({
    html: z.string().describe("The HTML content of the resume PDF"),
  });
  const prompt = `Generate a resume for a candidate with the following details:
                        Resume: ${resume}
                        Self Description: ${selfDescription}
                        Job Description: ${jobDescription}
                  The result should be a JSON object with a single key "html" containing the HTML content of the resume PDF.
                  The resume should be well-formatted and visually appealing, suitable for printing as a PDF.
                  The resume should be well-tailored to the job description, highlighting the candidate's relevant skills and experiences.
                  you can use any HTML and CSS techniques to make the resume visually appealing, but it should be suitable for printing as a PDF.
                  you can use different colors to highlight but make sure the colors are not too bright or distracting. The resume should be well-structured and easy to read, with clear headings and sections.
                  The content of the resume must not feel like its AI generated. It should be natural and human-like, as if it was written by a professional resume writer.
                  The resume should be in a single page, if possible. If the content is too long, you can use multiple pages, but make sure the content is well-organized and easy to read.
                  The resume should be in a professional format, suitable for job applications. It should include the candidate's name, contact information, and a professional summary at the top.
                  The content should be ATS freindly, meaning it should be easily readable by applicant tracking systems. Avoid using images or graphics that may not be parsed correctly by ATS software.
`;
  const response = await ai.models.generateContent({
    contents: prompt,
    model: "gemini-3-flash-preview",
    config: {
      responseMimeType: "application/json",
      responseJsonSchema: z.toJSONSchema(resumePdfSchema),
    },
  });
  const jsonContent= JSON.parse(response.text);
  const pdfBuffer=await generatePdfFromHtml(jsonContent.html);
  return pdfBuffer;

};

export { generateInterviewReport, generateResumePdf };
