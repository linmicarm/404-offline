import { useState } from "react";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import HomePage from "./components/HomePage.jsx";
import SpawnPointsPage from "./components/SpawnPointsPage.jsx";
import SpawnPointDetail from "./components/SpawnPointDetail.jsx";
import SpawnPointForm from "./components/SpawnPointForm.jsx";
import SideQuestsPage from "./components/SideQuestsPage.jsx";
import SideQuestDetail from "./components/SideQuestDetail.jsx";
import SideQuestForm from "./components/SideQuestForm.jsx";
import Modal from "./components/Modal.jsx";
import "./styles.css";

export default function App() {
  const [currentPage, setCurrentPage] = useState("home");
  const [selectedSpawnPoint, setSelectedSpawnPoint] = useState(null);
  const [selectedSideQuest, setSelectedSideQuest] = useState(null);
  const [editingSpawnPoint, setEditingSpawnPoint] = useState(null);
  const [editingSideQuest, setEditingSideQuest] = useState(null);
  const [modal, setModal] = useState(null);

  function showModal({ title, message, onConfirm, confirmLabel = "Confirm", cancelLabel = "Cancel", danger = false }) {
    setModal({ title, message, onConfirm, confirmLabel, cancelLabel, danger });
  }

  async function handleModalConfirm() {
    if (modal?.onConfirm) {
      await modal.onConfirm();
    }
    setModal(null);
  }

  function closeModal() {
    setModal(null);
  }

  function handleSetPage(page) {
    if (page === "spawn-points") setEditingSpawnPoint(null);
    if (page === "side-quests") setEditingSideQuest(null);
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
          />
        );
      case "spawn-points":
        return (
          <SpawnPointsPage
            setCurrentPage={handleSetPage}
            setSelectedSpawnPoint={setSelectedSpawnPoint}
            setEditingSpawnPoint={setEditingSpawnPoint}
            showModal={showModal}
          />
        );
      case "spawn-point-detail":
        return (
          <SpawnPointDetail
            spawnPoint={selectedSpawnPoint}
            setCurrentPage={handleSetPage}
            setSelectedSideQuest={setSelectedSideQuest}
            setEditingSpawnPoint={setEditingSpawnPoint}
            showModal={showModal}
          />
        );
      case "spawn-point-form":
        return (
          <SpawnPointForm
            editingSpawnPoint={editingSpawnPoint}
            setCurrentPage={handleSetPage}
          />
        );
      case "side-quests":
        return (
          <SideQuestsPage
            setCurrentPage={handleSetPage}
            setSelectedSideQuest={setSelectedSideQuest}
            setEditingSideQuest={setEditingSideQuest}
            showModal={showModal}
          />
        );
      case "side-quest-detail":
        return (
          <SideQuestDetail
            sideQuest={selectedSideQuest}
            setCurrentPage={handleSetPage}
            setEditingSideQuest={setEditingSideQuest}
            showModal={showModal}
          />
        );
      case "side-quest-form":
        return (
          <SideQuestForm
            editingSideQuest={editingSideQuest}
            setCurrentPage={handleSetPage}
          />
        );
      default:
        return <HomePage setCurrentPage={handleSetPage} />;
    }
  }

  return (
    <div>
      <Navbar currentPage={currentPage} setCurrentPage={handleSetPage} />
      {renderPage()}
      <Footer />
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
    </div>
  );
}