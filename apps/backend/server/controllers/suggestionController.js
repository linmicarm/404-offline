import prisma from "../db/prisma.js";

export async function getSuggestions(req, res) {
  try {
    const suggestions = await prisma.suggestion.findMany({
      orderBy: { created_at: "desc" },
      include: {
        spawn_point: {
          select: { id: true, name: true, neighborhood: true },
        },
      },
    });
    res.json({ message: "Suggestions retrieved", data: suggestions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to retrieve suggestions" });
  }
}

export async function createSuggestion(req, res) {
  const { spawn_point_id, author_name, field, current_value, suggested_value, note } = req.body;

  if (!spawn_point_id || !author_name || !field || !suggested_value) {
    return res.status(400).json({ message: "Spawn point, name, field and suggestion are required" });
  }

  try {
    const suggestion = await prisma.suggestion.create({
      data: {
        spawn_point_id: parseInt(spawn_point_id),
        author_name: author_name.trim(),
        field,
        current_value: current_value || null,
        suggested_value: suggested_value.trim(),
        note: note || null,
      },
    });
    res.status(201).json({ message: "Suggestion submitted", data: suggestion });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to submit suggestion" });
  }
}

export async function updateSuggestionStatus(req, res) {
  const { id } = req.params;
  const { status } = req.body;

  if (!["pending", "applied", "dismissed"].includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  try {
    const suggestion = await prisma.suggestion.update({
      where: { id: parseInt(id) },
      data: { status },
    });
    res.json({ message: "Suggestion updated", data: suggestion });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update suggestion" });
  }
}