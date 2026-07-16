import prisma from "../db/prisma.js";

export async function getAllSpawnPoints(req, res) {
  try {
    const spawnPoints = await prisma.spawnPoint.findMany({
      orderBy: { created_at: "desc" },
      include: {
        _count: {
          select: { side_quests: true },
        },
        side_quests: {
          where: {
            date: {
              gte: new Date().toISOString().split("T")[0],
            },
          },
          orderBy: { date: "asc" },
          take: 2,
        },
      },
    });
    res.json({ message: "Spawn points retrieved", data: spawnPoints });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to retrieve spawn points" });
  }
}

export async function getSpawnPointById(req, res) {
  const { id } = req.params;
  try {
    const spawnPoint = await prisma.spawnPoint.findUnique({
      where: { id: parseInt(id) },
      include: { side_quests: true },
    });
    if (!spawnPoint) {
      return res.status(404).json({ message: "Spawn point not found" });
    }
    res.json({ message: "Spawn point retrieved", data: spawnPoint });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to retrieve spawn point" });
  }
}

export async function createSpawnPoint(req, res) {
  const { name, category, neighborhood, address, latitude, longitude, hours, is_marta_accessible } = req.body;

  if (!name || !category || !neighborhood || !address) {
    return res.status(400).json({ message: "Name, category, neighborhood, and address are required" });
  }

  try {
    const spawnPoint = await prisma.spawnPoint.create({
      data: {
        name,
        category,
        neighborhood,
        address,
        latitude: latitude ? parseFloat(latitude) : null,
        longitude: longitude ? parseFloat(longitude) : null,
        hours: hours || null,
        is_marta_accessible: is_marta_accessible || false,
      },
    });
    res.status(201).json({ message: "Spawn point created", data: spawnPoint });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create spawn point" });
  }
}

export async function updateSpawnPoint(req, res) {
  const { id } = req.params;
  const { name, category, neighborhood, address, latitude, longitude, hours, is_marta_accessible } = req.body;

  if (!name || !category || !neighborhood || !address) {
    return res.status(400).json({ message: "Name, category, neighborhood, and address are required" });
  }

  try {
    const spawnPoint = await prisma.spawnPoint.update({
      where: { id: parseInt(id) },
      data: {
        name,
        category,
        neighborhood,
        address,
        latitude: latitude ? parseFloat(latitude) : null,
        longitude: longitude ? parseFloat(longitude) : null,
        hours: hours || null,
        is_marta_accessible,
      },
    });
    res.json({ message: "Spawn point updated", data: spawnPoint });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update spawn point" });
  }
}

export async function deleteSpawnPoint(req, res) {
  const { id } = req.params;
  try {
    await prisma.spawnPoint.delete({
      where: { id: parseInt(id) },
    });
    res.json({ message: "Spawn point deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete spawn point" });
  }
}

export async function rateSpawnPoint(req, res) {
  const { id } = req.params;
  const { rating, previousRating } = req.body;

  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({ message: "Rating must be between 1 and 5" });
  }

  try {
    const data = previousRating
      ? { rating_sum: { increment: rating - previousRating } }
      : { rating_sum: { increment: rating }, rating_count: { increment: 1 } };

    const spawnPoint = await prisma.spawnPoint.update({
      where: { id: parseInt(id) },
      data,
    });

    const avgRating = spawnPoint.rating_count > 0
      ? (spawnPoint.rating_sum / spawnPoint.rating_count).toFixed(1)
      : null;

    res.json({ message: "Rating submitted", data: { ...spawnPoint, avg_rating: avgRating } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to submit rating" });
  }
}