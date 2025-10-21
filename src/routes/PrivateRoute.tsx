import React, { ReactNode, useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../helpers/AuthContext";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
interface PrivateRouteProps {
  children: ReactNode; // Les enfants à rendre si l'utilisateur est authentifié
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
 // const { auth } = useContext(AuthContext);
  const auth = useSelector((state: RootState) => state.Auth);
  // Si auth est null, afficher un indicateur de chargement
  if (auth === null) {
    return <div>Loading...</div>;
  }

  // Si l'utilisateur est authentifié, afficher la page demandée
  if (auth.token) {
    return <>{children}</>;
  }

  // Si l'utilisateur n'est pas authentifié, rediriger vers la page de login
  return <Navigate to="/auth/login" />;
};

export default PrivateRoute;
