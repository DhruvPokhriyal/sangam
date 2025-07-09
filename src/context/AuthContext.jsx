import { createContext } from "react";

export const AuthContext = createContext({user: null, signup: () => {}, login: () => {}, logout: () => {}});