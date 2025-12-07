import AppRoutes from "./routes/index";
import LanguageProvider from "./context/LanguageProvider";

function App() {
  return (
    <LanguageProvider>
      <AppRoutes />
    </LanguageProvider>
  );
}

export default App;
