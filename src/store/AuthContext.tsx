// import {
//   createContext,
//   useState,
//   useContext,
//   ReactNode,
//   useEffect,
// } from "react";
// import { useNavigate } from "react-router-dom";

// interface AuthContextType {
//   user: { username: string; role: string } | null;
//   login: (username: string, role: string) => void;
//   logout: () => void;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const AuthProvider = ({ children }: { children: ReactNode }) => {
//   const [user, setUser] = useState<{ username: string; role: string } | null>(
//     null
//   );
//   const navigate = useNavigate();

//   useEffect(() => {
//     const storedRole = localStorage.getItem("role");
//     if (storedRole) {
//       setUser({ username: "JohnDoe", role: storedRole });
//     }
//   }, []);

//   const login = (username: string, role: string) => {
//     setUser({ username, role });
//     localStorage.setItem("role", role);
//     navigate("/dashboard");
//   };

//   const logout = () => {
//     setUser(null);
//     localStorage.removeItem("role");
//     navigate("/signin");
//   };

//   return (
//     <AuthContext.Provider value={{ user, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (context === undefined) {
//     throw new Error("useAuth must be used within an AuthProvider");
//   }
//   return context;
// };
