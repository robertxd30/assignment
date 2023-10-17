import { Routes, Route } from "react-router-dom";
import "./App.css";
import UserManagement from "./pages/userManagement";
import Dashboard from "./pages/dashboard";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<UserManagement />}></Route>
        <Route path="/dashboard" element={<Dashboard/>}></Route>
      </Routes>
    </div>
  );
}

export default App;
