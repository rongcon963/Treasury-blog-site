import { Suspense } from "react";
import routers from "@/routers/routers";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastProvider } from "@contexts/ToastProvider";
import { StoreProvider } from "@contexts/storeProvider";

function App() {
  return (
    <StoreProvider>
      <ToastProvider>
        <BrowserRouter>
          <Suspense fallback={<div>Loading...</div>}>
            <Routes>
              {routers.map((item, index) => {
                return (
                  <Route
                    key={index}
                    path={item.path}
                    element={<item.component />}
                  />
                );
              })}
            </Routes>
          </Suspense>
        </BrowserRouter>
      </ToastProvider>
    </StoreProvider>
  );
}

export default App;
