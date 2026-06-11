import "./App.css";
import { App as AntdApp } from "antd";
import { UserServices } from "./components/UserServices";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { AppContextProvider } from "./context/appContext";
import NotFoundPage from "./utils/404";
import LoginPage from "./components/Login";
import ThemeProvider from "./theme/antdTheme";
import PrivateRoutes from "./protected_routes/ProtectedRoutes";
import RegisterPage from "./components/Register";
import { Profile } from "./components/Profile";
import { Products } from "./components/Products";
import { Inventory } from "./components/Inventory";
import Dashboard from "./components/Dashboard";
import Assets from "./components/Assets";
import MaintenanceOrders from "./components/MaintenanceOrders";
import WorkInstructions from "./components/WorkInstructions";
import MyRequests from "./components/MyRequests";

function App() {
  return (
    <AntdApp>
      <div className="App">
        <AppContextProvider>
          <Router>
            <ThemeProvider>
              <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                <Route element={<PrivateRoutes />}>
                  <Route path="assets" element={<Assets />} />
                  <Route
                    path="maintenance-orders"
                    element={<MaintenanceOrders />}
                  />
                  <Route
                    path="work-instructions"
                    element={<WorkInstructions />}
                  />
                  <Route path="requests" element={<MyRequests />} />
                  <Route path="profile" element={<Profile />} />
                </Route>

                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </ThemeProvider>
          </Router>
        </AppContextProvider>
      </div>
    </AntdApp>
  );
}

export default App;