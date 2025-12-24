import { 
  verifyToken, 
  signupUser, 
  loginUser, 
  logoutUser, 
  getOtp, 
  googleSignUp, 
  createUsers, 
  getUsers 
} from "./auth/auth.api";
import { createTask, deleteTask, getTasks, updateTask } from "./task/task.api";
import { sendMessage } from "./chat/chat.api";

export const api = {
  auth: {
    verifyToken,
    signupUser,
    loginUser,
    logoutUser,
    getOtp,
    googleSignUp,
    createUsers,
    getUsers
  },
  task: {
    getTasks,
    createTask,
    updateTask,
    deleteTask
  },
  chat: {
    sendMessage,
  }
}