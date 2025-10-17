import Librus from "librus-api";

export default async function handler(req, res) {
  const username = process.env.LIBRUS_USERNAME;
  const password = process.env.LIBRUS_PASSWORD;

  if (!username || !password) {
    return res.status(400).json({ error: "Username et password requis." });
  }

  const client = new Librus();
  try {
    await client.authorize(username, password);
    const grades = await client.info.getGrades();
    const absences = await client.absence.getAbsences();
    return res.status(200).json({
      success: true,
      grades,
      absences
    });
  } catch (error) {
    console.error("Erreur Librus:", error.message);
    return res.status(500).json({ error: `Impossible de récupérer les données: ${error.message}` });
  }
}
