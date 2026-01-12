import { 
  verifyToken, 
  signupUser, 
  loginUser, 
  logoutUser, 
  getOtp, 
  googleSignUp, 
  createUsers, 
  getUsers, 
  setupPassword
} from "./auth/auth.api";
import { createTask, deleteTask, getTasks, updateTask } from "./task/task.api";
import { sendMessage } from "./chat/chat.api";
import { getUser, searchUsers } from "./user/user.api";

export const api = {
  auth: {
    verifyToken,
    signupUser,
    loginUser,
    logoutUser,
    getOtp,
    googleSignUp,
    createUsers,
    getUsers,
    setupPassword
  },
  task: {
    getTasks,
    createTask,
    updateTask,
    deleteTask
  },
  chat: {
    sendMessage,
  },
  user:{
    searchUsers,
    getUser
  }
}