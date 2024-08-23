import { AiplComponentProvider } from "aipl-components";
import ReactDOM from "react-dom/client";
import { aiplComponentConfig } from "./aiplComponentConfig";
import { PizzaDemo } from "./PizzaDemo";

export const App = () => {
  const rootElement = document.getElementById("root");

  if (rootElement) {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <AiplComponentProvider config={aiplComponentConfig}>
        <PizzaDemo />
      </AiplComponentProvider>
    );
  } else {
    console.error("No root element found");
  }
};
