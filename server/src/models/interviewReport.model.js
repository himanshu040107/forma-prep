import mongoose from "mongoose";

/**
 * -job description:String
 * -resume text:String
 * -self description:String
 * matchScore:Number
 * -Technical questions:
 *      [{
 *         question: "",
 *         intention: "",
 *         answer: ""
 *      }]
 * -Behavioral questions:[
 *     {
 *      question: "",
 *      intention: "",
 *      answer: ""
 *     }]
 * -Skill gaps:[
 *      {
 *      skill: "",
 *      severity:{
 *      type: String,
 *      enum: ['low', 'medium', 'high'],}
 *      }]
 * -preparation plan:[
 *      {
 *      day: String,
 *      focus: String,
 *      tasks: [String]
 *      }
 *  ]
 *
 */

const techincalQuestionSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: [true, "Question is required"],
    },
    intention: {
      type: String,
      required: [true, "Intention is required"],
    },
    answer: {
      type: String,
      required: [true, "Answer is required"],
    },
  },
  {
    _id: false,
  },
);

const behavioralQuestionSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: [true, "Question is required"],
    },
    intention: {
      type: String,
      required: [true, "Intention is required"],
    },
    answer: {
      type: String,
      required: [true, "Answer is required"],
    },
  },
  {
    _id: false,
  },
);

const skillGapSchema = new mongoose.Schema(
  {
    skill: {
      type: String,
      required: [true, "Skill is required"],
    },
    severity: {
      type: String,
      enum: ["low", "medium", "high"],
      required: [true, "Severity is required"],
    },
  },
  {
    _id: false,
  },
);

const preparationPlanSchema = new mongoose.Schema(
  {
    day: {
      type: Number,
      required: [true, "Day is required"],
    },
    focus: {
      type: String,
      required: [true, "Focus is required"],
    },
    tasks: [
      {
        type: String,
        required: [true, "Task is required"],
      },
    ],
  },
  {
    _id: false,
  },
);

export const interviewReportSchema = new mongoose.Schema({
  jobDescription: {
    type: String,
    required: true,
  },
  resumeText: {
    type: String,
    required: true,
  },
  selfDescription: {
    type: String,
  },
  title: {
    type: String,
    trim: true,
    required: [true, "Job Title is required"],
  },
  matchScore: {
    type: Number,
    min: 0,
    max: 100,
  },
  technicalQuestions: [techincalQuestionSchema],
  behavioralQuestions: [behavioralQuestionSchema],
  skillGaps: [skillGapSchema],
  preparationPlan: [preparationPlanSchema],
  users: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});
const InterviewReportModel = mongoose.model(
  "InterviewReport",
  interviewReportSchema,
);
export default InterviewReportModel;
