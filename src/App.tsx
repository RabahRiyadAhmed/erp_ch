import React,{useEffect} from "react";

import AllRoutes from "./routes/Routes";




// For Default import Default.scss
import './assets/scss/Default.scss';
import "leaflet/dist/leaflet.css";

// For Saas import Saas.scss
// import './assets/scss/Saas.scss';

// For Modern demo import Modern.scss
// import './assets/scss/Modern.scss';

// For Creative demo import Creative.scss
// import "./assets/scss/Creative.scss";

// For Purple demo import Purple.scss
// import './assets/scss/Purple.scss';

// For Material demo import Material.scss
// import './assets/scss/Material.scss';


// Other
import './assets/scss/Landing.scss';
import "./assets/scss/Icons.scss";
import { AuthProvider } from './helpers/AuthContext';
import { login } from './redux/authSlice';
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "./redux/store";
// configure fake backend
//configureFakeBackend();

const App = () => {
  const { token } = useSelector((state: RootState) => state.Auth);

  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    // Vérifier si l'utilisateur est déjà authentifié
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    const employeeDataString = localStorage.getItem('employeeData');
    const employeeData = employeeDataString ? JSON.parse(employeeDataString) : null;
    const nbnotif = localStorage.getItem('nbnotif');

    if (token) {
      // Mettre à jour l'état Redux
      dispatch(login({ token, role, employeeData, nbnotif }));
    }
  }, [dispatch]);
  return (
    <>
      <React.Fragment>
        <AuthProvider>
          <AllRoutes /> 
        </AuthProvider>
      </React.Fragment>
    </>
  );
};

export default App;
