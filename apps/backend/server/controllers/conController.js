import prisma from "../db/prisma.js";

export async function getAllCons(req, res) {
  try {
    const cons = await prisma.con.findMany({
      orderBy: { start_date: "asc" },
    });
    res.json({ message: "Cons retrieved", data: cons });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to retrieve cons" });
  }
}

export async function getConById(req, res) {
  const { id } = req.params;
  try {
    const con = await prisma.con.findUnique({
      where: { id: parseInt(id) },
    });
    if (!con) return res.status(404).json({ message: "Con not found" });
    res.json({ message: "Con retrieved", data: con });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to retrieve con" });
  }
}

export async function createCon(req, res) {
  const { name, start_date, end_date, venue, neighborhood, size, type, ticket_url } = req.body;

  if (!name || !start_date || !end_date || !venue || !neighborhood || !size || !type) {
    return res.status(400).json({ message: "All fields except ticket URL are required" });
  }

  try {
    const con = await prisma.con.create({
      data: { name, start_date, end_date, venue, neighborhood, size, type, ticket_url: ticket_url || null },
    });
    res.status(201).json({ message: "Con created", data: con });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create con" });
  }
}

export async function updateCon(req, res) {
  const { id } = req.params;
  const { name, start_date, end_date, venue, neighborhood, size, type, ticket_url } = req.body;

  if (!name || !start_date || !end_date || !venue || !neighborhood || !size || !type) {
    return res.status(400).json({ message: "All fields except ticket URL are required" });
  }

  try {
    const con = await prisma.con.update({
      where: { id: parseInt(id) },
      data: { name, start_date, end_date, venue, neighborhood, size, type, ticket_url: ticket_url || null },
    });
    res.json({ message: "Con updated", data: con });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update con" });
  }
}

export async function deleteCon(req, res) {
  const { id } = req.params;
  try {
    await prisma.con.delete({ where: { id: parseInt(id) } });
    res.json({ message: "Con deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete con" });
  }
}