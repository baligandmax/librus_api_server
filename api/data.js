import Librus from "librus-api";

export default async function handler(req, res) {
  const { username, password } = req.query;

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
    const luckyNumber = await client.info.getLuckyNumber();
    const notifications = await client.info.getNotifications();

    const allHomework = [];

    if (subjects && subjects.length > 0) {
      for (const subject of subjects) {
        try {
          const homework = await client.homework.listHomework(subject.id);
          if (homework && homework.length > 0) {
            allHomework.push(...homework);
          }
        } catch (e) {}
      }
    }

    return res.status(200).json({
      account,
      grades,
      absences,
      timetable,
      homework: allHomework,
      luckyNumber,
      notifications,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
