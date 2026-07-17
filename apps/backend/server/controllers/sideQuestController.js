import prisma from "../db/prisma.js";

export async function getAllSideQuests(req, res) {
  const { category, neighborhood, free } = req.query;

  try {
    const where = {};

    if (category) {
      where.category = { contains: category, mode: "insensitive" };
    }

    if (free === "true") {
      where.is_free = true;
    }

    if (neighborhood) {
      where.spawn_point = {
        neighborhood: { contains: neighborhood, mode: "insensitive" },
      };
    }

    const sideQuests = await prisma.sideQuest.findMany({
      where,
      orderBy: { date: "asc" },
      include: {
        spawn_point: {
          select: {
            id: true,
            name: true,
            neighborhood: true,
            category: true,
            is_marta_accessible: true,
          },
        },
      },
    });

    res.json({ message: "Side quests retrieved", data: sideQuests });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to retrieve side quests" });
  }
}

export async function getSideQuestById(req, res) {
  const { id } = req.params;
  try {
    const sideQuest = await prisma.sideQuest.findUnique({
      where: { id: parseInt(id) },
      include: { spawn_point: true },
    });
    if (!sideQuest) {
      return res.status(404).json({ message: "Side quest not found" });
    }
    res.json({ message: "Side quest retrieved", data: sideQuest });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to retrieve side quest" });
  }
}

export async function createSideQuest(req, res) {
  const { spawn_point_id, name, description, date, time, cost, is_free, is_beginner_friendly, is_recurring, recurrence, category, tags, image_url } = req.body;

  if (!spawn_point_id || !name || !description || !date || !time || !category) {
    return res.status(400).json({ message: "Spawn point, name, description, date, time, and category are required" });
  }

  try {
    const sideQuest = await prisma.sideQuest.create({
      data: {
        spawn_point_id: parseInt(spawn_point_id),
        name,
        description,
        date,
        time,
        cost: cost ? parseFloat(cost) : null,
        is_free: is_free ?? true,
        is_beginner_friendly: is_beginner_friendly ?? false,
        is_recurring: is_recurring ?? false,
        recurrence: recurrence || null,
        category,
        tags: tags || "",
        image_url: image_url || null,
      },
      include: { spawn_point: true },
    });
    res.status(201).json({ message: "Side quest created", data: sideQuest });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create side quest" });
  }
}

export async function updateSideQuest(req, res) {
  const { id } = req.params;
  const { spawn_point_id, name, description, date, time, cost, is_free, is_beginner_friendly, is_recurring, recurrence, category, tags, image_url } = req.body;

  if (!name || !description || !date || !time || !category) {
    return res.status(400).json({ message: "Name, description, date, time, and category are required" });
  }

  try {
    const sideQuest = await prisma.sideQuest.update({
      where: { id: parseInt(id) },
      data: {
        spawn_point_id: parseInt(spawn_point_id),
        name,
        description,
        date,
        time,
        cost: cost ? parseFloat(cost) : null,
        is_free,
        is_beginner_friendly,
        is_recurring,
        recurrence: recurrence || null,
        category,
        tags,
        image_url: image_url || null,
      },
      include: { spawn_point: true },
    });
    res.json({ message: "Side quest updated", data: sideQuest });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update side quest" });
  }
}

export async function deleteSideQuest(req, res) {
  const { id } = req.params;
  try {
    await prisma.sideQuest.delete({
      where: { id: parseInt(id) },
    });
    res.json({ message: "Side quest deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete side quest" });
  }
}

export async function updateGoingCount(req, res) {
  const { id } = req.params;
  const { action } = req.body;

  try {
    const sideQuest = await prisma.sideQuest.update({
      where: { id: parseInt(id) },
      data: {
        going_count: {
          increment: action === "decrement" ? -1 : 1,
        },
      },
    });
    res.json({ message: "Going count updated", data: sideQuest });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update going count" });
  }
}

export async function toggleFeatured(req, res) {
  const { id } = req.params;
  try {
    const current = await prisma.sideQuest.findUnique({
      where: { id: parseInt(id) },
    });

    await prisma.sideQuest.updateMany({
      where: { is_featured: true },
      data: { is_featured: false },
    });

    if (!current.is_featured) {
      await prisma.sideQuest.update({
        where: { id: parseInt(id) },
        data: { is_featured: true },
      });
    }

    const updated = await prisma.sideQuest.findUnique({
      where: { id: parseInt(id) },
      include: { spawn_point: true },
    });

    res.json({ message: "Featured updated", data: updated });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update featured" });
  }
}