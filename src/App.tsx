import { CssBaseline, ThemeProvider } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { ReportsProvider } from "./context/ReportsContext";
import { AuthProvider } from "./context/AuthContext";
import Dashboard from "./pages/Dashboard";
import theme from "./theme";
import Layout from "./components/Layout";
import ErrorBoundary from "./components/ErrorBoundary";

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider theme={theme}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <AuthProvider>
            <ReportsProvider>
              <CssBaseline />
              <Layout>
                <Dashboard />
              </Layout>
            </ReportsProvider>
          </AuthProvider>
        </LocalizationProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
