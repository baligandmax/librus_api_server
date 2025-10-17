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

    const account = await client.info.getAccountInfo();
    const grades = await client.info.getGrades();
    const absences = await client.absence.getAbsences();
    const timetable = await client.calendar.getTimetable();
    const subjects = await client.homework.listSubjects();

    const allHomework = [];

    if (subjects && subjects.length > 0) {
      for (const subject of subjects) {
        try {
          const homework = await client.homework.listHomework(subject.id);
          if (homework && homework.length > 0) {
            allHomework.push(...homework);
          }
        } catch (e) {
          console.error("Erreur récup. devoirs:", e.message);
        }
      }
    }

    return res.status(200).json({
      account,
      grades,
      absences,
      timetable,
      homework: allHomework,
    });
  } catch (error) {
    console.error("Erreur Librus:", error.message);
    res.status(500).json({ error: "Impossible de récupérer les données Librus." });
  }
}
