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
  const [hasCheckedAuth, setHasCheckedAuth] = useState<boolean>(false);
  const isMounted = useRef(true);

  const fetchUser = useCallback(async () => {
    if (isVerifying || !isMounted.current) return;

    try {
      setIsVerifying(true);
      console.log("🔍 Fetching user from auth context...");
      const response = await api.auth.verifyToken();

      if (!isMounted.current) return;

      if (response && response.data) {
        console.log("✅ User verified successfully:", response.data.user);
        dispatch({
          type: actions.SET_USER,
          payload: { user: response.data.user, isLoggedIn: true },
        });
      }
    } catch (error: any) {
      if (!isMounted.current) return;
      console.error("❌ User verification failed:", error.message);
      dispatch({
        type: actions.SET_USER,
        payload: { user: null, isLoggedIn: false },
      });
    } finally {
      if (isMounted.current) {
        setIsVerifying(false);
        setHasCheckedAuth(true);
      }
    }
  }, [isVerifying]); // Removed isOnProtectedRoute to prevent recreation

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
    // Only fetch user if we haven't checked yet or if we're on a protected route without a user
    if (!state.user && !isVerifying && !hasCheckedAuth && isOnProtectedRoute) {
      fetchUser();
    }
  }, [isOnProtectedRoute, state.user, isVerifying, hasCheckedAuth, fetchUser]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const currentPath = window.location.pathname;
      // Any path under /dashboard or a site slug is protected
      const publicPaths = ["/login", "/signup", "/forgot-password", "/setup-password", "/verify"];
      const isPublic = publicPaths.some((p) => currentPath.startsWith(p));
      setIsOnProtectedRoute(!isPublic && currentPath !== "/");
    }
  }, []);

  // Reset check status when route changes (optional, but keep it for now)
  // Actually, don't reset unless you want to re-verify on every internal navigation.

  // Cleanup effect
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContextProvider;
