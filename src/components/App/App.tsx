import { BrowserRouter } from "react-router-dom";
import { Layout } from "../../ui/Layout";
import { AppRoutes } from "../../Routes";

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <AppRoutes />
      </Layout>
    </BrowserRouter>
  );
}

export default App;
