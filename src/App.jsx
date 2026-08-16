import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import CreateMixtape from "./pages/CreateMixtape";
import CreatedSuccess from "./pages/CreatedSuccess";
import EditMixtape from "./pages/EditMixtape";
import ShareView from "./pages/ShareView";
import NotFound from "./pages/NotFound";

function App() {
    return (
        <Routes>
            <Route element={<Layout />}>
                <Route path="/" element={<Home />} />
                <Route path="/create" element={<CreateMixtape />} />
                <Route path="/mixtapes/:id/created" element={<CreatedSuccess />} />
                <Route path="/mixtapes/:id/edit" element={<EditMixtape />} />
                <Route path="/share/:shareCode" element={<ShareView />} />
                <Route path="*" element={<NotFound />} />
            </Route>
        </Routes>
    );
}

export default App;
