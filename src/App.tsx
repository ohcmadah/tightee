import { db } from "./config";
import Layout from "./pages/Layout";
import Login from "./pages/Login";
import "./App.css";

const App = () => (
  <Layout>
    <Login />
  </Layout>
);

export default App;
