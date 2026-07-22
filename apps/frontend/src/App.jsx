import { useState, useEffect } from "react";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import HomePage from "./components/HomePage.jsx";
import SpawnPointsPage from "./components/SpawnPointsPage.jsx";
import SpawnPointDetail from "./components/SpawnPointDetail.jsx";
import SpawnPointForm from "./components/SpawnPointForm.jsx";
import SideQuestsPage from "./components/SideQuestsPage.jsx";
import SideQuestDetail from "./components/SideQuestDetail.jsx";
import SideQuestForm from "./components/SideQuestForm.jsx";
import ConsPage from "./components/ConsPage.jsx";
import ConForm from "./components/ConForm.jsx";
import NeighborhoodPage from "./components/NeighborhoodPage.jsx";
import SuggestionsPage from "./components/SuggestionsPage.jsx";
import Modal from "./components/Modal.jsx";
import Toast from "./components/Toast.jsx";
import "./styles.css";

export default function App() {
  const [currentPage, setCurrentPage] = useState("home");
  const [selectedSpawnPoint, setSelectedSpawnPoint] = useState(null);
  const [selectedSideQuest, setSelectedSideQuest] = useState(null);
  const [editingSpawnPoint, setEditingSpawnPoint] = useState(null);
  const [editingSideQuest, setEditingSideQuest] = useState(null);
  const [editingCon, setEditingCon] = useState(null);
  const [modal, setModal] = useState(null);
  const [toast, setToast] = useState(null);
  const [globalSearch, setGlobalSearch] = useState("");

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  useEffect(() => {
    const titles = {
      home: "404 Offline · Atlanta's Nerd Scene",
      "spawn-points": "Spawn Points · 404 Offline",
      "spawn-point-detail": selectedSpawnPoint ? `${selectedSpawnPoint.name} · 404 Offline` : "404 Offline",
      "spawn-point-form": editingSpawnPoint ? `Edit ${editingSpawnPoint.name} · 404 Offline` : "Add Spawn Point · 404 Offline",
      "side-quests": "Side Quests · 404 Offline",
      "side-quest-detail": selectedSideQuest ? `${selectedSideQuest.name} · 404 Offline` : "404 Offline",
      "side-quest-form": editingSideQuest ? `Edit ${editingSideQuest.name} · 404 Offline` : "Add Side Quest · 404 Offline",
      cons: "Con Calendar · 404 Offline",
      "con-form": editingCon ? `Edit ${editingCon.name} · 404 Offline` : "Add Convention · 404 Offline",
      neighborhoods: "Neighborhoods · 404 Offline",
      suggestions: "Suggestions · 404 Offline",
    };
    document.title = titles[currentPage] || "404 Offline · Atlanta's Nerd Scene";
  }, [currentPage, selectedSpawnPoint, selectedSideQuest, editingSpawnPoint, editingSideQuest, editingCon]);

  function showModal({ title, message, onConfirm, confirmLabel = "Confirm", cancelLabel = "Cancel", danger = false }) {
    setModal({ title, message, onConfirm, confirmLabel, cancelLabel, danger });
  }

  function showToast(message, type = "success") {
    setToast({ message, type });
  }

  async function handleModalConfirm() {
    if (modal?.onConfirm) await modal.onConfirm();
    setModal(null);
  }

  function closeModal() { setModal(null); }

  function handleSetPage(page) {
    if (page === "spawn-points") setEditingSpawnPoint(null);
    if (page === "side-quests") setEditingSideQuest(null);
    if (page === "cons") setEditingCon(null);
    setCurrentPage(page);
  }

  function renderPage() {
    switch (currentPage) {
      case "home":
        return (
          <HomePage
            setCurrentPage={handleSetPage}
            setSelectedSideQuest={setSelectedSideQuest}
            setSelectedSpawnPoint={setSelectedSpawnPoint}
            initialSearch={globalSearch}
            onSearchHandled={() => setGlobalSearch("")}
          />
        );
      case "spawn-points":
        return (
          <SpawnPointsPage
            setCurrentPage={handleSetPage}
            setSelectedSpawnPoint={setSelectedSpawnPoint}
            setEditingSpawnPoint={setEditingSpawnPoint}
            showModal={showModal}
            showToast={showToast}
          />
        );
      case "spawn-point-detail":
        return (
          <SpawnPointDetail
            spawnPoint={selectedSpawnPoint}
            setCurrentPage={handleSetPage}
            setSelectedSideQuest={setSelectedSideQuest}
            setEditingSpawnPoint={setEditingSpawnPoint}
            setEditingSideQuest={setEditingSideQuest}
            showModal={showModal}
            showToast={showToast}
          />
        );
      case "spawn-point-form":
        return (
          <SpawnPointForm
            editingSpawnPoint={editingSpawnPoint}
            setCurrentPage={handleSetPage}
            showToast={showToast}
          />
        );
      case "side-quests":
        return (
          <SideQuestsPage
            setCurrentPage={handleSetPage}
            setSelectedSideQuest={setSelectedSideQuest}
            setEditingSideQuest={setEditingSideQuest}
            showModal={showModal}
            showToast={showToast}
          />
        );
      case "side-quest-detail":
        return (
          <SideQuestDetail
            sideQuest={selectedSideQuest}
            setCurrentPage={handleSetPage}
            setEditingSideQuest={setEditingSideQuest}
            showModal={showModal}
            showToast={showToast}
            setSelectedSpawnPoint={setSelectedSpawnPoint}
            setSelectedSideQuest={setSelectedSideQuest}
          />
        );
      case "side-quest-form":
        return (
          <SideQuestForm
            editingSideQuest={editingSideQuest}
            setCurrentPage={handleSetPage}
            showToast={showToast}
          />
        );
      case "cons":
        return (
          <ConsPage
            setCurrentPage={handleSetPage}
            setEditingCon={setEditingCon}
            showModal={showModal}
            showToast={showToast}
          />
        );
      case "con-form":
        return (
          <ConForm
            editingCon={editingCon}
            setCurrentPage={handleSetPage}
            showToast={showToast}
          />
        );
      case "neighborhoods":
        return (
          <NeighborhoodPage
            setCurrentPage={handleSetPage}
            setSelectedSpawnPoint={setSelectedSpawnPoint}
            setSelectedSideQuest={setSelectedSideQuest}
          />
        );
      case "suggestions":
        return <SuggestionsPage showToast={showToast} />;
      default:
        return <HomePage setCurrentPage={handleSetPage} />;
    }
  }

  return (
    <div>
      <Navbar
        currentPage={currentPage}
        setCurrentPage={handleSetPage}
        onSearch={(term) => { setGlobalSearch(term); handleSetPage("home"); }}
      />
      {renderPage()}
      <Footer setCurrentPage={handleSetPage} />
      {modal && (
        <Modal
          title={modal.title}
          message={modal.message}
          onConfirm={handleModalConfirm}
          onCancel={closeModal}
          confirmLabel={modal.confirmLabel}
          cancelLabel={modal.cancelLabel}
          danger={modal.danger}
        />
      )}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}