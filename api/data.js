import Librus from "librus-api";

export default async function handler(req, res) {
  const username = process.env.LIBRUS_USERNAME;
  const password = process.env.LIBRUS_PASSWORD;

  if (!username || !password) {
    return res.status(400).json({ error: "Username et password requis." });
  }

  const client = new Librus({
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Accept-Encoding': 'gzip, deflate, br',
      'Connection': 'keep-alive'
    },
    timeout: 15000 // 15s timeout
  });

  try {
    console.log("Tentative de connexion à Synergia...");
    await client.authorize(username, password);
    console.log("Connexion réussie !");
    const grades = await client.info.getGrades();
    console.log("Notes récupérées:", grades.length);
    const absences = await client.absence.getAbsences();
    console.log("Absences récupérées:", absences.length);
    return res.status(200).json({
      success: true,
      grades,
      absences
    });
  } catch (error) {
    console.error("Erreur détaillée:", error.message, error.stack);
    return res.status(500).json({ error: `Impossible de récupérer les données: ${error.message}` });
  }
}
