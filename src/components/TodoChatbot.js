import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Modal } from 'react-bootstrap'
import QuickMath from "./game/QuickMath"
import ChatBot from "react-simple-chatbot";
import { ThemeProvider } from "styled-components";

function TodoChatbot(props) {

  const [showQuickMath, setQuickMathShow] = useState(false);

  // declare controllers for showing and hiding modals
  const handleQuickMathClose = () => setQuickMathShow(false);
  const handleQuickMathShow = () => setQuickMathShow(true);

  const config = {
    width: "300px",
    height: "400px",
    floating: true
  };
  const theme = {
    background: "white",
    fontFamily: "Arial, Helvetica, sans-serif",
    headerBgColor: "#00CED1",
    headerFontColor: "#fff",
    headerFontSize: "25px",
    botBubbleColor: "#00B2B2",
    botFontColor: "#fff",
    userBubbleColor: "#fff",
    userFontColor: "#4c4c4c",
  };
  const steps = [
    {
      id: "Greet",
      message: "Hello, Welcome to Todo Manager!",
      trigger: "Ask what help user need"
    },
    {
      id: "Ask what help user need",
      message: "How can I help you today? :)",
      trigger: "Show help categories"
    },
    {
      id: "Show help categories",
      options: [
        {
          value: "Account issues",
          label: "Account issues",
          trigger: "Ask what account help user need"
          },
          { 
          value: "Task issues",
          label: "Task issues",
          trigger: "Ask what tasks help user need"
          },
          { 
          value: "Provide feedback",
          label: "Provide feedback",
          trigger: "Ask what type of feedback"
          },
          { 
          value: "Other enquiries",
          label: "Other enquiries",
          trigger: "Ask what other enquiries"
          },
          { 
          value: "Entertain me",
          label: "Entertain me",
          trigger: "Show entertainment"
        } 
      ]
    },
    {
      id: "Ask what account help user need",
      message: "What help do you need with your account?",
      trigger: "Show account options"
    },
    {
      id: "Ask what tasks help user need",
      message: "What help do you need with your tasks?",
      trigger: "Show tasks options"
    },
    {
      id: "Ask what type of feedback",
      message: "What kind of feedback do you have for us?",
      trigger: "Show feedback options"
    },
    {
      id: "Ask what other enquiries",
      message: "What enquiries do you have?",
      trigger: "Show enquiry options"   
    },
    {
      id: "Show feedback options",
      options: [
        {
          value: "I have a suggestion",
          label: "I have a suggestion",
          trigger: "Teach give suggestion"
          },
          { 
          value: "I have a bug to report",
          label: "I have a bug to report",
          trigger: "Teach report bug"
          },
          { 
          value: "I have a complaint to make",
          label: "I have a complaint to make",
          trigger: "Teach make complaint"
        } 
      ]
    },
    {
      id: "Teach report bug",
      message: "Thank you for helping us to identify bugs in our application. Please click on the button below to raise an issue at our github repository.",
      trigger: "Provide github issues link"
    },
    {
      id: "Teach give suggestion",
      message: "Thank you for your interest in providing suggestions. As we have yet to set up a proper platform for suggestions, we currently take in suggestions through email at: cjtanjin@gmail.com",
      trigger: "Ask if have any other questions"
    },
    {
      id: "Teach make complaint",
      message: "We apologize for any inconvenience caused to you. As we have yet to set up a proper platform for complaints, we currently take in complaints through email at: cjtanjin@gmail.com",
      trigger: "Ask if have any other questions"
    },
    {
      id: "Provide github issues link",
      component: (
        <div><a className="btn btn-dark btn-block" target="_blank" rel="noopener noreferrer" href="https://github.com/tjtanjin/todo_website/issues">Github</a></div>
      ),
      trigger: "Ask if have any other questions"
    },
    {
      id: "Provide github link",
      component: (
        <div><a className="btn btn-dark btn-block" target="_blank" rel="noopener noreferrer" href="https://github.com/tjtanjin/todo_website">Github</a></div>
      ),
      trigger: "Ask if have any other questions"
    },
    {
      id: "Show account options",
      options: [
        {
          value: "I forgot my password",
          label: "I forgot my password",
          trigger: "Teach reset password"
          },
          { 
          value: "How do I verify my account?",
          label: "How do I verify my account?",
          trigger: "Teach verify account"
          },
          { 
          value: "How do I update my profile?",
          label: "How do I update my profile?",
          trigger: "Teach update profile"
          },
          { 
          value: "How do I delete my account?",
          label: "How do I delete my account?",
          trigger: "Teach delete account"
        } 
      ]
    },
    {
      id: "Show tasks options",
      options: [
        {
          value: "How do I enable email reminders?",
          label: "How do I enable email reminders?",
          trigger: "Teach enable email notifications"
          },
          { 
          value: "How do I enable telegram reminders?",
          label: "How do I enable telegram reminders?",
          trigger: "Teach enable telegram notifications"
          },
          { 
          value: "How do I download my tasks?",
          label: "How do I download my tasks?",
          trigger: "Teach download tasks"
          },
          { 
          value: "How do I sort my tasks?",
          label: "How do I sort my tasks?",
          trigger: "Teach sort tasks"
          },
          { 
          value: "How do I search for my tasks?",
          label: "How do I search for my tasks?",
          trigger: "Teach search tasks"
          },
          { 
          value: "My tasks disappeared!",
          label: "My tasks disappeared!",
          trigger: "Teach disappeared tasks"
        } 
      ]
    },
    {
      id: "Teach reset password",
      message: "To reset your password, click on the button below and enter your email",
      trigger: "Provide forgotpassword link"
    },
    {
      id: "Provide forgotpassword link",
      component: (
        <div><Link className="btn btn-dark btn-block" to="/forgotpassword">Forgot Password</Link></div>
      ),
      trigger: "Ask if have any other questions"
    },
    {
      id: "Teach verify account",
      message: "To verify your account, you need to click on the verification link sent to your email. If you need a new verification link, click on the button below to go to our login page and upon logging in, you will be prompted to verify your account with a button to resend verification link.",
      trigger: "Provide login link"
    },
    {
      id: "Provide login link",
      component: (
        <div><Link className="btn btn-dark btn-block" to="/login">Login</Link></div>
      ),
      trigger: "Ask if have any other questions"
    },
    {
      id: "Teach update profile",
      message: "To update your account, click on the button below to go to your profile page. Look for the relevant buttons to make your changes.",
      trigger: "Provide profile link"
    },
    {
      id: "Provide profile link",
      component: (
        <div><Link className="btn btn-dark btn-block" to="/profile">Profile</Link></div>
      ),
      trigger: "Ask if have any other questions"
    },
    {
      id: "Teach delete account",
      message: "Why would you want to delete your account? :( If you insist, click on the button below to go to your profile page. The delete user button will irreversibly remove your account, take note!",
      trigger: "Provide profile link"
    },
    {
      id: "Teach enable email notifications",
      message: "To enable email reminders, click on the button below to go to your profile and toggle your email notifications on.",
      trigger: "Provide profile link"
    },
    {
      id: "Teach enable telegram notifications",
      message: "To enable telegram reminders, click on the button below to go to your profile and toggle your telegram notifications on. Note that before doing so, you need to configure your telegram handle and link your account with our telegram bot.",
      trigger: "Provide profile link"
    },
    {
      id: "Teach download tasks",
      message: "To download your tasks into excel, click on the button below to go to your tasks page. The download tasks button at the bottom is just what you need.",
      trigger: "Provide tasks link"
    },
    {
      id: "Teach sort tasks",
      message: "To sort your tasks, click on the buttons beside the table headers.",
      trigger: "Ask if have any other questions"
    },
    {
      id: "Teach search tasks",
      message: "To search for your tasks, click on the search box on the top left hand corner of your tasks table and pick the relevant columns you wish to search from before entering your search terms.",
      trigger: "Ask if have any other questions"
    },
    {
      id: "Teach disappeared tasks",
      message: "By default, the tasks page only shows your tasks in-progress. To view completed or overdue tasks, click on the button below and select the relevant state of your tasks from the top right dropdown",
      trigger: "Provide tasks link"
    },
    {
      id: "Provide tasks link",
      component: (
        <div><Link className="btn btn-dark btn-block" to="/tasks">Tasks</Link></div>
      ),
      trigger: "Ask if have any other questions"
    },
    {
      id: "Teach complete task",
      message: "To complete a task, go to the tasks page and click on the check button under the actions/tools beside the specific task.",
      trigger: "Ask if have any other questions"
    },
    {
      id: "Ask if have any other questions",
      message: "Do you have any other questions?",
      trigger: "Show other questions options"
    },
    {
      id: "Show other questions options",
      options: [
        {
          value: "Yes",
          label: "Yes",
          trigger: "Ask what help user need again"
          },
          { 
          value: "No",
          label: "No",
          trigger: "Done"
        } 
      ]
    },
    {
      id: "Ask what help user need again",
      message: "What else may I help you with? :)",
      trigger: "Show help categories"
    },
    {
      id: "Done",
      message: "Thank you and have a nice day! Let me know again if you have any more questions^^",
      trigger: "Wait for next question"
    },
    {
      id: "Wait for next question",
      options: [
        {
          value: "I have another question",
          label: "I have another question",
          trigger: "Ask what help user need again"
        } 
      ]
    },
    {
      id: "Show enquiry options",
      options: [
        {
          value: "Where is the code for this project?",
          label:  "Where is the code for this project?",
          trigger: "Teach where is code"
          },
          { 
          value: "What are the features available?",
          label: "What are the features available?",
          trigger: "Teach features"
          },
          { 
          value: "Is there an admin I can contact?",
          label: "Is there an admin I can contact?",
          trigger: "Teach contact admin"
        } 
      ]
    },
    {
      id: "Teach where is code",
      message: "To view the code for our project, visit our github repository by clicking on the button below.",
      trigger: "Provide github link"
    },
    {
      id: "Teach features",
      message: "For a full list of our features, please refer to our user guide by clicking on the button below:",
      trigger: "Provide guide link"
    },
    {
      id: "Teach contact admin",
      message: "To contact the team, you may refer to the details on our about page by clicking on the button below:",
      trigger: "Provide about link"
    },
    {
      id: "Provide about link",
      component: (
        <div><Link className="btn btn-dark btn-block" to="/about">About</Link></div>
      ),
      trigger: "Ask if have any other questions"
    },
    {
      id: "Provide guide link",
      component: (
        <div><a className="btn btn-dark btn-block" target="_blank" rel="noopener noreferrer" href="https://github.com/tjtanjin/todo_website/wiki/User-Guide">User Guide</a></div>
      ),
      trigger: "Ask if have any other questions"
    },
    {
      id: "Show entertainment",
      component: (
        <div>
        <a className="btn btn-dark btn-block" target="_blank" rel="noopener noreferrer" href="https://t.me/Ageofempire_bot">
          Play Age Of Empires
        </a>
        <button type="button" className="btn btn-dark btn-block" onClick={handleQuickMathShow}>
          Play QuickMath
        </button>
        </div>
      ),
      trigger: "Ask if have any other questions"
    }
];
   
  return (
    <div>
      <ThemeProvider theme={theme}>
        <ChatBot headerTitle="Todo Admin" steps={steps} {...config} />;
      </ThemeProvider>
      <Modal size="lg" show={showQuickMath} onHide={handleQuickMathClose}>
        <Modal.Header className="modal_header_bg">
          <Modal.Title>QuickMath</Modal.Title>
        </Modal.Header>
        <Modal.Body><QuickMath onCloseModal={handleQuickMathClose}></QuickMath></Modal.Body>
      </Modal>
    </div>
  )
}

export default TodoChatbot;
