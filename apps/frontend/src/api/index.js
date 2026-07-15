const BASE_URL = "http://localhost:3001/api";

// Spawn Points
export async function getSpawnPoints() {
  const res = await fetch(`${BASE_URL}/spawn-points`);
  const data = await res.json();
  return data.data;
}

export async function getSpawnPointById(id) {
  const res = await fetch(`${BASE_URL}/spawn-points/${id}`);
  const data = await res.json();
  return data.data;
}

export async function createSpawnPoint(spawnPoint) {
  const res = await fetch(`${BASE_URL}/spawn-points`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(spawnPoint),
  });
  const data = await res.json();
  return data;
}

export async function updateSpawnPoint(id, spawnPoint) {
  const res = await fetch(`${BASE_URL}/spawn-points/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(spawnPoint),
  });
  const data = await res.json();
  return data;
}

export async function deleteSpawnPoint(id) {
  const res = await fetch(`${BASE_URL}/spawn-points/${id}`, {
    method: "DELETE",
  });
  const data = await res.json();
  return data;
}

// Side Quests
export async function getSideQuests(filters = {}) {
  const params = new URLSearchParams();
  if (filters.category) params.append("category", filters.category);
  if (filters.neighborhood) params.append("neighborhood", filters.neighborhood);
  if (filters.free) params.append("free", filters.free);

  const res = await fetch(`${BASE_URL}/side-quests?${params.toString()}`);
  const data = await res.json();
  return data.data;
}

export async function getSideQuestById(id) {
  const res = await fetch(`${BASE_URL}/side-quests/${id}`);
  const data = await res.json();
  return data.data;
}

export async function createSideQuest(sideQuest) {
  const res = await fetch(`${BASE_URL}/side-quests`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(sideQuest),
  });
  const data = await res.json();
  return data;
}

export async function updateSideQuest(id, sideQuest) {
  const res = await fetch(`${BASE_URL}/side-quests/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(sideQuest),
  });
  const data = await res.json();
  return data;
}

export async function deleteSideQuest(id) {
  const res = await fetch(`${BASE_URL}/side-quests/${id}`, {
    method: "DELETE",
  });
  const data = await res.json();
  return data;
}

export async function updateGoingCount(id, action = "increment") {
  const res = await fetch(`${BASE_URL}/side-quests/${id}/going`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action }),
  });
  const data = await res.json();
  return data;
}

// Cons
export async function getCons() {
  const res = await fetch(`${BASE_URL}/cons`);
  const data = await res.json();
  return data.data;
}

export async function getConById(id) {
  const res = await fetch(`${BASE_URL}/cons/${id}`);
  const data = await res.json();
  return data.data;
}

export async function createCon(con) {
  const res = await fetch(`${BASE_URL}/cons`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(con),
  });
  const data = await res.json();
  return data;
}

export async function updateCon(id, con) {
  const res = await fetch(`${BASE_URL}/cons/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(con),
  });
  const data = await res.json();
  return data;
}

export async function deleteCon(id) {
  const res = await fetch(`${BASE_URL}/cons/${id}`, {
    method: "DELETE",
  });
  const data = await res.json();
  return data;
}