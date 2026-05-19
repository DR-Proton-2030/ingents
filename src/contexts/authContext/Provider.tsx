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
  const isMounted = useRef(true);
  const hasFetched = useRef(false);

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
    if (hasFetched.current) return;

    const currentPath = window.location.pathname;
    const publicPaths = ["/login", "/signup", "/forgot-password", "/setup-password", "/verify"];
    const isPublic = publicPaths.some((p) => currentPath.startsWith(p));
    const isProtected = !isPublic && currentPath !== "/";

    if (!isProtected) return;

    hasFetched.current = true;

    const fetchUser = async () => {
      try {
        console.log("🔍 Fetching user from auth context...");
        const response = await api.auth.verifyToken();

        if (!isMounted.current) return;

        console.log("🔎 Full verify response:", JSON.stringify(response, null, 2)?.slice(0, 500));

        // Extract user - handle multiple possible response shapes
        const user = response?.data?.user  // { data: { user: {...} } }
          || response?.user               // { user: {...} }
          || (response?.data?.full_name ? response.data : null)  // { data: { full_name: ... } }
          || (response?.full_name ? response : null);             // { full_name: ... }

        console.log("👤 Extracted user:", user?.full_name, user?._id);

        if (user) {
          dispatch({
            type: actions.SET_USER,
            payload: { user, isLoggedIn: true },
          });
        } else {
          console.error("❌ Could not extract user from response");
        }
      } catch (error: any) {
        if (!isMounted.current) return;
        console.error("❌ User verification failed:", error.message);
        dispatch({
          type: actions.SET_USER,
          payload: { user: null, isLoggedIn: false },
        });
      }
    };

    fetchUser();
  }, []);

  // Cleanup effect
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContextProvider;
