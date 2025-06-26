import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import 'leaflet/dist/leaflet.css';
import { LoaderProvider } from "./Components/loader/LoaderContext.jsx";
import { Provider } from "react-redux";
import { persistor, store } from "./store/store.js";
import { PersistGate } from "redux-persist/integration/react";
import Loader from "./Components/loader/Loader.jsx";
import { ServiceProvider } from "./context/ServiceContext.jsx";

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <ServiceProvider>
      <PersistGate loading={null} persistor={persistor}>
        <LoaderProvider>
          <Loader />
          <App />
        </LoaderProvider>
      </PersistGate>
    </ServiceProvider>
  </Provider>
);
