import {createBrowserRouter, Link} from "react-router"
import Register from "./features/auth/pages/Register.jsx"
import Login from "./features/auth/pages/Login.jsx"
import Protected from "./features/auth/components/Protected.jsx"
import Home from "./features/interview/pages/Home.jsx"
import InterviewReport from "./features/interview/pages/InterviewReport.jsx"

const NotFound = () => (
    <main style={{maxWidth: 640, margin: "12vh auto", padding: 24, fontFamily: "sans-serif"}}>
        <p>404 · PAGE NOT FOUND</p>
        <h1>This page isn’t here.</h1>
        <p>That page doesn’t exist. Return to your resume and interview workspace to continue preparing for your next role.</p>
        <Link to="/">Back to your workspace</Link>
    </main>
)

export const router=createBrowserRouter([
    {
        element:<Login/>,
        path:"/login",
    },
    {
        element:<Register/>,
        path:"/register",
    },
    {
        element:<Protected><Home /></Protected>,
        path:"/",
    },
    {
        element:<Protected><InterviewReport /></Protected>,
        path:"/interview/:interviewId",
    },
    { path: "*", element: <NotFound /> },
])
