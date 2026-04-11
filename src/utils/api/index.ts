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
import { getTaskPhases, createTaskPhase, clearTaskPhasesCache, updateTaskPhase } from "./taskPhase/taskPhase.api";
import { getTaskTags, createTaskTag, clearTaskTagsCache } from "./taskTag/taskTag.api";
import { getProjects, createProject, updateProject, deleteProject } from "./project/project.api";
import { getInsightsSummary, getContentMetricsHistory, getUserContentWithMetrics, getAccountInsightsHistory, triggerInsightsSync } from "./insights/insights.api";

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
  taskPhase: {
    getTaskPhases,
    createTaskPhase,
    clearTaskPhasesCache,
    updateTaskPhase
  },
  taskTag: {
    getTaskTags,
    createTaskTag,
    clearTaskTagsCache
  },
  chat: {
    sendMessage,
  },
  user:{
    searchUsers,
    getUser
  },
  project: {
    getProjects,
    createProject,
    updateProject,
    deleteProject
  },
  insights: {
    getInsightsSummary,
    getContentMetricsHistory,
    getUserContentWithMetrics,
    getAccountInsightsHistory,
    triggerInsightsSync
  }
}