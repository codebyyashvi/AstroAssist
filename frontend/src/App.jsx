import React from "react";
import {BrowserRouter, Routes, Route} from "react-router-dom"
import Layout from "./components/Layout";
import Chat from "./pages/Chat"
import LiveUpdates from "./pages/LiveUpdates"
import PDFBot from "./pages/PDFBot";
import PDFViewing from "./pages/PDFViewing"

const App = () => {

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Chat />} />
            <Route path="/updates" element={<LiveUpdates />}/>
            <Route path="/pdf-viewing" element={<PDFViewing />} />
            <Route path="/pdf-bot/:bookId" element={<PDFBot />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App;