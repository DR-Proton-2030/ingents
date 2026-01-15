"use client";
import initialState from "./store";
import actions from "./actions";
import reducer from "./reducer";
import { useCallback, useEffect, useReducer, useState, useRef } from "react";
import AuthContext from "./authContext";
import { IUser } from "@/types/interface/user.interface";
import { ContextProviderProps } from "@/types/contexts/context.types";
import { api } from "@/utils/api";

const AuthContextProvider = ({ children }: ContextProviderProps) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [isOnProtectedRoute, setIsOnProtectedRoute] = useState<boolean>(false);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const isMounted = useRef(true);

  const fetchUser = useCallback(async () => {
    try {
      if (!isOnProtectedRoute || isVerifying || !isMounted.current) return;

      setIsVerifying(true);
      console.log("🔍 Fetching user from auth context...");
      const response = await api.auth.verifyToken();

      if (!isMounted.current) return; // Prevent state update if unmounted

      if (response) {
        const { data } = response;
        console.log("✅ User verified successfully:", data.user);
        dispatch({
          type: actions.SET_USER,
          payload: { user: data.user, isLoggedIn: true },
        });
      }
    } catch (error: any) {
      if (!isMounted.current) return; // Prevent state update if unmounted

      console.error("❌ User verification failed:", error.message);
      dispatch({
        type: actions.SET_USER,
        payload: { user: null, isLoggedIn: false },
      });
    } finally {
      if (isMounted.current) {
        setIsVerifying(false);
      }
    }
  }, [isOnProtectedRoute, isVerifying]);

  const setUser = useCallback((user: IUser | null) => {
    dispatch({
      type: actions.SET_USER,
      payload: { user, isLoggedIn: !!user },
    });
  }, []);

  const value = {
    user: state.user,
    setUser,
  };

  useEffect(() => {
    // Only fetch user once when entering a protected route
    if (isOnProtectedRoute && !state.user && !isVerifying) {
      fetchUser();
    }
  }, [isOnProtectedRoute, state.user, isVerifying, fetchUser]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const currentPath = window.location.pathname;
      const isProtected =
        currentPath.includes("dashboard") ||
        currentPath.includes("analytics") ||
        currentPath.includes("chat") ||
        currentPath.includes("meeting") ||
        currentPath.includes("seo-management");
      setIsOnProtectedRoute(isProtected);
    }
  }, []);

  // Cleanup effect
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  console.log("Is on Protected Route:", isOnProtectedRoute);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContextProvider;
