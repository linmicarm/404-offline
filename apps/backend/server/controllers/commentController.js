import prisma from "../db/prisma.js";

export async function getCommentsByQuest(req, res) {
  const { sideQuestId } = req.params;
  try {
    const comments = await prisma.comment.findMany({
      where: {
        side_quest_id: parseInt(sideQuestId),
        parent_id: null,
      },
      include: {
        replies: {
          orderBy: { created_at: "asc" },
        },
      },
      orderBy: { created_at: "asc" },
    });
    res.json({ message: "Comments retrieved", data: comments });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to retrieve comments" });
  }
}

export async function createComment(req, res) {
  const { sideQuestId } = req.params;
  const { author_name, body, parent_id } = req.body;

  if (!author_name || !body) {
    return res.status(400).json({ message: "Name and comment are required" });
  }

  if (body.length > 500) {
    return res.status(400).json({ message: "Comment must be under 500 characters" });
  }

  try {
    const comment = await prisma.comment.create({
      data: {
        side_quest_id: parseInt(sideQuestId),
        author_name: author_name.trim(),
        body: body.trim(),
        parent_id: parent_id ? parseInt(parent_id) : null,
      },
    });
    res.status(201).json({ message: "Comment created", data: comment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create comment" });
  }
}

export async function updateComment(req, res) {
  const { id } = req.params;
  const { body } = req.body;

  if (!body || body.trim().length === 0) {
    return res.status(400).json({ message: "Comment body is required" });
  }

  if (body.length > 500) {
    return res.status(400).json({ message: "Comment must be under 500 characters" });
  }

  try {
    const comment = await prisma.comment.update({
      where: { id: parseInt(id) },
      data: { body: body.trim() },
    });
    res.json({ message: "Comment updated", data: comment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update comment" });
  }
}

export async function deleteComment(req, res) {
  const { id } = req.params;
  try {
    await prisma.comment.delete({
      where: { id: parseInt(id) },
    });
    res.json({ message: "Comment deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete comment" });
  }
}