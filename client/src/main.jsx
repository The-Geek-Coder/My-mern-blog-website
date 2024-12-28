import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { persistor, store } from "./store/store.js";
import { Provider } from "react-redux";
import App from "./App.jsx";
import "./index.css";
import { PersistGate } from "redux-persist/integration/react";
import ThemeProvider from "./components/ThemeProvider/ThemeProvider.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* <Provider store={store}> */}
    <PersistGate persistor={persistor}>
      <Provider store={store}>
        <ThemeProvider>
        <App />
        </ThemeProvider>
      </Provider>
    </PersistGate>
  </StrictMode>
);
