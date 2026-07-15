import "dotenv/config";
import prisma from "../server/db/prisma.js";

async function main() {
  await prisma.sideQuest.deleteMany();
  await prisma.spawnPoint.deleteMany();

const spawnPoints = await prisma.spawnPoint.createMany({
    data: [
      { name: "Battle & Brew", category: "Gaming venue", neighborhood: "Sandy Springs", address: "1489 Dunwoody Village Pkwy, Sandy Springs, GA 30338", latitude: 33.9265, longitude: -84.3505, is_marta_accessible: false },
      { name: "Oxford Comics & Games", category: "Comics & cards", neighborhood: "Buckhead", address: "2855 Piedmont Rd NE, Atlanta, GA 30305", latitude: 33.8384, longitude: -84.3642, is_marta_accessible: false },
      { name: "Matcha Cafe Maiko", category: "Boba & matcha", neighborhood: "Doraville", address: "5671 Buford Hwy NE, Doraville, GA 30340", latitude: 33.8986, longitude: -84.2915, is_marta_accessible: false },
      { name: "Fluffy Fluffy", category: "Cute cafe", neighborhood: "Doraville", address: "5001 Buford Hwy NE, Doraville, GA 30340", latitude: 33.8942, longitude: -84.2923, is_marta_accessible: false },
      { name: "Tokyo Kuma", category: "Kawaii shop", neighborhood: "Buford Highway", address: "5150 Buford Hwy NE, Doraville, GA 30340", latitude: 33.8958, longitude: -84.2918, is_marta_accessible: false },
      { name: "Giga-Bites Cafe", category: "Comics & cards", neighborhood: "Marietta", address: "1985 Cobb Pkwy SE, Marietta, GA 30060", latitude: 33.9382, longitude: -84.5218, is_marta_accessible: false },
      { name: "Joystick Game Bar", category: "Gaming venue", neighborhood: "Old Fourth Ward", address: "427 Edgewood Ave SE, Atlanta, GA 30312", latitude: 33.7537, longitude: -84.3762, is_marta_accessible: true },
      { name: "My Parent's Basement", category: "Comics & cards", neighborhood: "Avondale Estates", address: "5 N Avondale Rd, Avondale Estates, GA 30002", latitude: 33.7706, longitude: -84.2699, is_marta_accessible: false },
    ],
  });

  console.log(`Created ${spawnPoints.count} spawn points`);

  const savedSpawnPoints = await prisma.spawnPoint.findMany({
    orderBy: { id: "asc" },
  });

  await prisma.sideQuest.createMany({
    data: [
      { spawn_point_id: savedSpawnPoints[1].id, name: "Friday Night Magic — Standard", description: "Weekly MTG tournament open to all skill levels. Bring your standard deck or borrow one at the shop.", date: "2026-05-23", time: "7:00 PM", cost: null, is_free: true, is_beginner_friendly: true, category: "Gaming", tags: "MTG,cards,tournament" },
      { spawn_point_id: savedSpawnPoints[5].id, name: "Pokémon League — All Skill Levels", description: "Casual Pokémon TCG league night. Beginners welcome, loaner decks available.", date: "2026-05-24", time: "12:00 PM", cost: null, is_free: true, is_beginner_friendly: true, category: "Gaming", tags: "Pokemon,cards,casual" },
      { spawn_point_id: savedSpawnPoints[2].id, name: "Matcha & Manga Morning", description: "Bring your favorite manga volume and enjoy matcha together. All genres welcome.", date: "2026-05-24", time: "10:00 AM", cost: null, is_free: true, is_beginner_friendly: true, category: "Social", tags: "manga,matcha,chill" },
      { spawn_point_id: savedSpawnPoints[6].id, name: "Cosplay Meetup @ Joystick", description: "Casual cosplay hangout between con seasons. All fandoms and skill levels welcome.", date: "2026-05-25", time: "2:00 PM", cost: null, is_free: true, is_beginner_friendly: true, category: "Cosplay", tags: "cosplay,casual,social" },
      { spawn_point_id: savedSpawnPoints[0].id, name: "Tekken 8 Weekly — Warrior Wednesday", description: "Competitive Tekken 8 tournament. Cash prize for top 3. 21+ only.", date: "2026-05-27", time: "8:00 PM", cost: 5.00, is_free: false, is_beginner_friendly: false, category: "Gaming", tags: "FGC,Tekken,competitive" },
      { spawn_point_id: savedSpawnPoints[2].id, name: "Japanese Language Exchange", description: "Casual Japanese conversation practice for all levels. Native and learner speakers welcome.", date: "2026-05-27", time: "6:30 PM", cost: null, is_free: true, is_beginner_friendly: true, category: "Language", tags: "Japanese,language,social" },
      { spawn_point_id: savedSpawnPoints[5].id, name: "D&D Open Table — One Shot", description: "Drop-in D&D one-shot adventure. No experience needed, characters provided.", date: "2026-05-28", time: "6:00 PM", cost: null, is_free: true, is_beginner_friendly: true, category: "Tabletop", tags: "DnD,tabletop,beginner" },
      { spawn_point_id: savedSpawnPoints[1].id, name: "Pokémon Go Community Day", description: "Group up for Community Day at the park nearby. All trainers welcome.", date: "2026-06-01", time: "11:00 AM", cost: null, is_free: true, is_beginner_friendly: true, category: "Gaming", tags: "Pokemon,mobile,outdoors" },
    ],
  });

await prisma.con.deleteMany();

await prisma.con.createMany({
  data: [
    {
      name: "MomoCon 2026",
      start_date: "2026-05-21",
      end_date: "2026-05-24",
      venue: "Georgia World Congress Center",
      neighborhood: "Downtown Atlanta",
      size: "Large",
      type: "Anime & Gaming",
      ticket_url: "https://momocon.com",
    },
    {
      name: "DragonCon 2026",
      start_date: "2026-09-03",
      end_date: "2026-09-07",
      venue: "Multiple Downtown Hotels",
      neighborhood: "Downtown Atlanta",
      size: "Massive",
      type: "Sci-Fi, Fantasy & Gaming",
      ticket_url: "https://dragoncon.org",
    },
    {
      name: "Anime Weekend Atlanta 2026",
      start_date: "2026-11-19",
      end_date: "2026-11-22",
      venue: "Renaissance Waverly Hotel",
      neighborhood: "Cobb Galleria",
      size: "Mid-size",
      type: "Anime",
      ticket_url: "https://awa-con.com",
    },
    {
      name: "HeroesCon Atlanta 2026",
      start_date: "2026-12-05",
      end_date: "2026-12-06",
      venue: "Cobb Galleria Centre",
      neighborhood: "Cobb Galleria",
      size: "Small",
      type: "Comics & Artist Alley",
      ticket_url: null,
    },
  ],
});

console.log("Created 4 cons");

  console.log("Created 8 side quests");
  console.log("🍑 Seed complete!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });