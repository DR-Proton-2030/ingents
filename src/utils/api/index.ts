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
  }
}