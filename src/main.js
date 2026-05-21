import React, { useEffect, useMemo, useState } from "https://esm.sh/react@18.3.1";
import { createRoot } from "https://esm.sh/react-dom@18.3.1/client";

const h = React.createElement;

const fieldLabels = {
  gradeLevel: "ระดับชั้น",
  subject: "รายวิชา",
  learningUnit: "หน่วยการเรียนรู้",
  lessonTopic: "หัวข้อที่เรียน",
  studentLevel: "ระดับผู้เรียน",
  targetSkill: "ทักษะที่เน้น",
  activityType: "รูปแบบกิจกรรม",
};

const defaultForm = {
  gradeLevel: "ชั้นประถมศึกษาปีที่ 4",
  subject: "ภาษาอังกฤษพื้นฐาน",
  learningUnit: "Hello English!",
  lessonTopic: "Hello and Goodbye",
  studentLevel: "พื้นฐานปานกลาง",
  targetSkill: "การพูด",
  activityType: "ฝึกสนทนาเป็นคู่",
};

const fallbackUnitFrame = {
  semester: "ยังไม่ระบุภาคเรียน",
  unitNumber: "-",
  totalHours: 0,
  topics: ["หัวข้อบทเรียนตัวอย่าง"],
  vocabulary: ["hello", "book", "teacher", "student"],
  speakingFocus: ["Hello.", "This is a book."],
  lessonProgression: [
    "ครูทบทวนความรู้เดิมด้วยคำถามง่าย ๆ และใช้ภาพช่วยให้นักเรียนเข้าใจบริบท",
    "ครูนำเสนอคำศัพท์หรือรูปประโยคสั้น ๆ แล้วให้นักเรียนฟังและพูดตามอย่างช้า ๆ",
    "นักเรียนฝึกใช้ภาษาเป็นคู่หรือเป็นกลุ่มเล็ก โดยครูคอยช่วยเหลืออย่างใกล้ชิด"
  ],
  classroomActivities: [
    "ให้นักเรียนฝึกพูดคำศัพท์และประโยคตัวอย่างจากบัตรภาพ",
    "จัดกิจกรรมถาม-ตอบสั้น ๆ เพื่อให้นักเรียนกล้าพูดภาษาอังกฤษ"
  ],
  worksheetIdeas: [
    "ให้นักเรียนจับคู่คำศัพท์กับภาพ",
    "ให้นักเรียนเติมคำในประโยคตัวอย่าง",
    "ให้นักเรียนวาดภาพและเขียนคำศัพท์สำคัญ 1-2 คำ"
  ],
  assessmentIdeas: [
    "ครูสังเกตการมีส่วนร่วมและความกล้าพูดของนักเรียน",
    "ให้นักเรียนพูดคำศัพท์หรือประโยคสั้น ๆ อย่างน้อย 1 ประโยค"
  ],
  media: ["บัตรภาพ", "บัตรคำ", "แถบประโยคตัวอย่าง"],
};

const fallbackActivityFrame = {
  warmUp: "ครูเริ่มบทเรียนด้วยกิจกรรมทบทวนคำศัพท์อย่างสั้น ๆ เพื่อให้นักเรียนคุ้นเคยกับหัวข้อ",
  teachingSteps: fallbackUnitFrame.lessonProgression,
  summary: [
    "ครูและนักเรียนร่วมกันทบทวนคำศัพท์และรูปประโยคสำคัญของบทเรียน",
    "ให้นักเรียนพูดคำศัพท์หรือประโยคสั้น ๆ เพื่อสรุปความเข้าใจด้วยตนเอง"
  ],
  activities: fallbackUnitFrame.classroomActivities,
  media: fallbackUnitFrame.media,
  worksheet: fallbackUnitFrame.worksheetIdeas,
  classroomActivity: "นักเรียนฝึกใช้คำศัพท์และรูปประโยคผ่านกิจกรรมง่าย ๆ โดยมีครูช่วยออกเสียงและให้กำลังใจ",
  assessment: "ครูประเมินจากการสังเกต การตอบคำถามสั้น ๆ และความพยายามในการใช้ภาษาอังกฤษของนักเรียน",
};

const fallbackTemplates = {
  fieldOptions: {
    gradeLevels: [defaultForm.gradeLevel],
    subjects: [defaultForm.subject],
    learningUnits: [defaultForm.learningUnit],
    studentLevels: [defaultForm.studentLevel],
    targetSkills: [defaultForm.targetSkill],
    activityTypes: [defaultForm.activityType],
  },
  lessonFrames: {
    [defaultForm.learningUnit]: fallbackUnitFrame,
  },
  activityTemplates: {
    [defaultForm.activityType]: fallbackActivityFrame,
  },
};

function asArray(value, fallback = []) {
  if (!Array.isArray(value)) {
    return fallback;
  }

  const filtered = value.filter((item) => item !== null && item !== undefined && item !== "");
  return filtered.length > 0 ? filtered : fallback;
}

function normalizeUnitFrame(unitFrame = {}) {
  const frame = unitFrame || {};
  return {
    ...fallbackUnitFrame,
    ...frame,
    topics: asArray(frame.topics, fallbackUnitFrame.topics),
    vocabulary: asArray(frame.vocabulary, fallbackUnitFrame.vocabulary),
    speakingFocus: asArray(frame.speakingFocus, fallbackUnitFrame.speakingFocus),
    lessonProgression: asArray(frame.lessonProgression, fallbackUnitFrame.lessonProgression),
    classroomActivities: asArray(frame.classroomActivities, fallbackUnitFrame.classroomActivities),
    worksheetIdeas: asArray(frame.worksheetIdeas, fallbackUnitFrame.worksheetIdeas),
    assessmentIdeas: asArray(frame.assessmentIdeas, fallbackUnitFrame.assessmentIdeas),
    media: asArray(frame.media, fallbackUnitFrame.media),
  };
}

function normalizeActivityFrame(activityFrame = {}) {
  const frame = activityFrame || {};
  return {
    ...fallbackActivityFrame,
    ...frame,
    teachingSteps: asArray(frame.teachingSteps, fallbackActivityFrame.teachingSteps),
    summary: asArray(frame.summary, fallbackActivityFrame.summary),
    activities: asArray(frame.activities, fallbackActivityFrame.activities),
    media: asArray(frame.media, fallbackActivityFrame.media),
    worksheet: asArray(frame.worksheet, fallbackActivityFrame.worksheet),
    warmUp: frame.warmUp || fallbackActivityFrame.warmUp,
    classroomActivity: frame.classroomActivity || fallbackActivityFrame.classroomActivity,
    assessment: frame.assessment || fallbackActivityFrame.assessment,
  };
}

function readEmbeddedTemplates() {
  if (typeof window !== "undefined" && window.MKL_LESSON_TEMPLATES) {
    return window.MKL_LESSON_TEMPLATES;
  }

  if (typeof document === "undefined") {
    return null;
  }

  const embeddedNode = document.getElementById("lesson-template-data");
  if (!embeddedNode?.textContent) {
    return null;
  }

  try {
    return JSON.parse(embeddedNode.textContent);
  } catch (error) {
    console.error("ข้อมูลหลักสูตรที่ฝังในหน้าเว็บไม่ถูกต้อง", error);
    return null;
  }
}

const pastelTabs = ["bg-peach", "bg-mint", "bg-skysoft", "bg-butter", "bg-lilac"];

const lessonSectionMeta = {
  "จุดประสงค์การเรียนรู้": { icon: "star", tone: "bg-peach" },
  "ขั้นนำเข้าสู่บทเรียน": { icon: "spark", tone: "bg-butter" },
  "ขั้นสอน": { icon: "book", tone: "bg-skysoft" },
  "ขั้นสรุป": { icon: "check", tone: "bg-mint" },
  "กิจกรรมการเรียนรู้": { icon: "blocks", tone: "bg-lilac" },
  "สื่อการสอน": { icon: "cards", tone: "bg-peach" },
  "ใบงานตัวอย่าง": { icon: "paper", tone: "bg-butter" },
  "การวัดและประเมินผล": { icon: "clipboard", tone: "bg-mint" },
};

function buildLesson(form, templates) {
  const safeForm = { ...defaultForm, ...form };
  const lessonFrames = templates?.lessonFrames || {};
  const activityTemplates = templates?.activityTemplates || {};
  const unitFrame = normalizeUnitFrame(lessonFrames[safeForm.learningUnit]);
  const activityFrame = normalizeActivityFrame(activityTemplates[safeForm.activityType]);
  const vocabularyLimit = safeForm.studentLevel === "พื้นฐานอ่อน" ? 4 : 6;
  const vocabulary = asArray(unitFrame.vocabulary, fallbackUnitFrame.vocabulary).slice(0, vocabularyLimit);
  const topics = asArray(unitFrame.topics, fallbackUnitFrame.topics);
  const topic = safeForm.lessonTopic || topics[0] || "หัวข้อบทเรียนตัวอย่าง";
  const speakingFocus = asArray(unitFrame.speakingFocus, fallbackUnitFrame.speakingFocus).slice(0, safeForm.studentLevel === "เริ่มมั่นใจ" ? 5 : 4);

  return [
    {
      title: "จุดประสงค์การเรียนรู้",
      content: [
        `นักเรียนเข้าใจและใช้คำศัพท์พื้นฐานเกี่ยวกับหัวข้อ “${topic}” ได้อย่างเหมาะสมกับระดับชั้น`,
        `นักเรียนฝึกพูดประโยคภาษาอังกฤษสั้น ๆ ได้ เช่น ${speakingFocus.slice(0, 2).join(" / ")}`,
        `นักเรียนมีส่วนร่วมในกิจกรรม ${safeForm.activityType} โดยใช้บัตรภาพ การพูดซ้ำ และการช่วยเหลือจากครู`,
      ],
    },
    {
      title: "ขั้นนำเข้าสู่บทเรียน",
      content: [
        activityFrame.warmUp,
        `ครูใช้ภาพ ท่าทาง และคำถามนำง่าย ๆ เพื่อเชื่อมโยงเข้าสู่หัวข้อ “${topic}” โดยไม่เร่งให้นักเรียนตอบยาว`,
      ],
    },
    {
      title: "ขั้นสอน",
      content: [
        `ครูสอนคำศัพท์สำคัญด้วยบัตรภาพหรือสิ่งของจริง ได้แก่ ${vocabulary.join(", ")}`,
        `ครูออกเสียงและให้เด็กพูดตามรูปประโยคอย่างช้า ๆ เช่น ${speakingFocus.slice(0, 3).join(" / ")}`,
        ...unitFrame.lessonProgression.slice(0, 3),
      ],
    },
    {
      title: "ขั้นสรุป",
      content: [
        `ให้นักเรียนเลือกพูดคำศัพท์ 1 คำ และประโยคสั้น ๆ 1 ประโยคเกี่ยวกับ “${topic}”`,
        ...activityFrame.summary,
      ],
    },
    {
      title: "กิจกรรมการเรียนรู้",
      content: [
        activityFrame.classroomActivity,
        ...activityFrame.activities.slice(0, 1),
        ...unitFrame.classroomActivities.slice(0, 2),
      ],
    },
    {
      title: "สื่อการสอน",
      content: [
        ...activityFrame.media,
        ...unitFrame.media,
        `คำศัพท์ที่เน้น: ${vocabulary.join(", ")}`,
        `รูปประโยคที่ใช้ฝึกพูด: ${speakingFocus.join(" / ")}`,
      ],
    },
    {
      title: "ใบงานตัวอย่าง",
      content: [...activityFrame.worksheet, ...unitFrame.worksheetIdeas],
    },
    {
      title: "การวัดและประเมินผล",
      content: [
        activityFrame.assessment,
        ...unitFrame.assessmentIdeas.slice(0, 2),
      ],
    },
  ];
}

function TextIcon({ children, tone = "bg-white" }) {
  return h(
    "span",
    {
      className: `${tone} inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-white/80 text-lg shadow-soft`,
      "aria-hidden": "true",
    },
    children
  );
}

function ClassroomIcon({ type }) {
  const common = {
    className: "h-5 w-5",
    fill: "none",
    stroke: "currentColor",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: "2.2",
    viewBox: "0 0 24 24",
  };

  const icons = {
    star: [
      h("path", { d: "M12 3.5l2.3 4.7 5.2.8-3.8 3.7.9 5.2-4.6-2.4-4.6 2.4.9-5.2L4.5 9l5.2-.8L12 3.5z", key: "star" }),
    ],
    spark: [
      h("path", { d: "M12 4v4", key: "spark-1" }),
      h("path", { d: "M12 16v4", key: "spark-2" }),
      h("path", { d: "M4 12h4", key: "spark-3" }),
      h("path", { d: "M16 12h4", key: "spark-4" }),
      h("path", { d: "M8.5 8.5l-2-2", key: "spark-5" }),
      h("path", { d: "M17.5 17.5l-2-2", key: "spark-6" }),
      h("path", { d: "M15.5 8.5l2-2", key: "spark-7" }),
      h("path", { d: "M6.5 17.5l2-2", key: "spark-8" }),
    ],
    book: [
      h("path", { d: "M5 5.5h5.5A2.5 2.5 0 0 1 13 8v11a2.5 2.5 0 0 0-2.5-2.5H5z", key: "book-1" }),
      h("path", { d: "M19 5.5h-5.5A2.5 2.5 0 0 0 11 8v11a2.5 2.5 0 0 1 2.5-2.5H19z", key: "book-2" }),
    ],
    check: [
      h("path", { d: "M20 7L10 17l-5-5", key: "check" }),
    ],
    blocks: [
      h("rect", { height: "6", key: "block-1", rx: "1.5", width: "6", x: "4", y: "4" }),
      h("rect", { height: "6", key: "block-2", rx: "1.5", width: "6", x: "14", y: "4" }),
      h("rect", { height: "6", key: "block-3", rx: "1.5", width: "6", x: "9", y: "14" }),
    ],
    cards: [
      h("rect", { height: "12", key: "card-1", rx: "2", width: "10", x: "5", y: "7" }),
      h("path", { d: "M9 5h8a2 2 0 0 1 2 2v10", key: "card-2" }),
      h("path", { d: "M8 11h4", key: "card-3" }),
      h("path", { d: "M8 15h3", key: "card-4" }),
    ],
    paper: [
      h("path", { d: "M7 3.5h7l3 3V20a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 6 20V5A1.5 1.5 0 0 1 7.5 3.5z", key: "paper-1" }),
      h("path", { d: "M14 3.5V7h3", key: "paper-2" }),
      h("path", { d: "M9 12h5", key: "paper-3" }),
      h("path", { d: "M9 16h4", key: "paper-4" }),
    ],
    clipboard: [
      h("path", { d: "M9 5h6", key: "clip-1" }),
      h("rect", { height: "16", key: "clip-2", rx: "2", width: "12", x: "6", y: "5.5" }),
      h("path", { d: "M9 12l2 2 4-4", key: "clip-3" }),
    ],
  };

  return h("svg", common, icons[type] || icons.star);
}

function LessonSectionCard({ section, index }) {
  const meta = lessonSectionMeta[section.title] || { icon: String(index + 1), tone: pastelTabs[index % pastelTabs.length] };

  return h("article", { className: "lesson-section-card", key: section.title }, [
    h("div", { className: "mb-4 flex items-center gap-3", key: "heading" }, [
      h(TextIcon, { tone: meta.tone, key: "icon" }, h(ClassroomIcon, { type: meta.icon })),
      h("div", { key: "heading-text" }, [
        h("p", { className: "text-xs font-black uppercase text-slate-400", key: "step" }, `ส่วนที่ ${index + 1}`),
        h("h3", { className: "font-display text-xl font-black leading-snug text-ink", key: "title" }, section.title),
      ]),
    ]),
    h("ul", { className: "space-y-3 text-sm leading-7 text-slate-600", key: "items" },
      asArray(section.content, ["ยังไม่มีข้อมูลในส่วนนี้"]).map((item) =>
        h("li", { className: "lesson-section-item", key: item }, [
          h("span", { className: "lesson-dot", "aria-hidden": "true", key: "dot" }),
          h("span", { key: "text" }, item),
        ])
      )
    ),
  ]);
}

function getLessonSection(lesson, title) {
  return asArray(lesson).find((section) => section.title === title)?.content || [];
}

function formatList(items) {
  return asArray(items, ["ยังไม่มีข้อมูลในส่วนนี้"]).map((item, index) => `${index + 1}. ${item}`).join("\n");
}

function safeFilename(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9ก-๙]+/gi, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || "lesson";
}

function buildLessonPlanText({ form, lesson, selectedUnit }) {
  const lines = [
    "ชื่อระบบ: MKL Digital Lesson Builder ระบบช่วยออกแบบการจัดการเรียนรู้ดิจิทัลด้วย AI",
    `รายวิชา: ${form.subject}`,
    `ระดับชั้น: ${form.gradeLevel}`,
    `หน่วยการเรียนรู้: หน่วยที่ ${selectedUnit.unitNumber} ${form.learningUnit}`,
    `หัวข้อที่เรียน: ${form.lessonTopic}`,
    `ภาคเรียน: ${selectedUnit.semester}`,
    `เวลาเรียน: ${selectedUnit.totalHours} ชั่วโมง`,
    "",
    "จุดประสงค์การเรียนรู้",
    formatList(getLessonSection(lesson, "จุดประสงค์การเรียนรู้")),
    "",
    "ขั้นนำเข้าสู่บทเรียน",
    formatList(getLessonSection(lesson, "ขั้นนำเข้าสู่บทเรียน")),
    "",
    "ขั้นสอน",
    formatList(getLessonSection(lesson, "ขั้นสอน")),
    "",
    "ขั้นสรุป",
    formatList(getLessonSection(lesson, "ขั้นสรุป")),
    "",
    "กิจกรรมการเรียนรู้",
    formatList(getLessonSection(lesson, "กิจกรรมการเรียนรู้")),
    "",
    "สื่อการสอน",
    formatList(getLessonSection(lesson, "สื่อการสอน")),
    "",
    "ใบงานตัวอย่าง",
    formatList(getLessonSection(lesson, "ใบงานตัวอย่าง")),
    "",
    "การวัดและประเมินผล",
    formatList(getLessonSection(lesson, "การวัดและประเมินผล")),
  ];

  return lines.join("\n");
}

function buildWorksheetText({ form, selectedUnit }) {
  const safeUnit = normalizeUnitFrame(selectedUnit);
  const vocabulary = safeUnit.vocabulary.slice(0, 6);
  const patterns = safeUnit.speakingFocus.slice(0, 3);
  const exercises = safeUnit.worksheetIdeas;

  return [
    `ชื่อใบงาน: ใบงานภาษาอังกฤษ เรื่อง ${form.lessonTopic}`,
    "",
    "คำชี้แจง",
    `ให้นักเรียนทบทวนคำศัพท์และประโยคสั้น ๆ จากหน่วยการเรียนรู้ ${form.learningUnit} แล้วทำกิจกรรมตามลำดับ หากยังอ่านไม่ได้คล่อง ครูสามารถอ่านนำและให้นักเรียนพูดตามก่อนทำใบงาน`,
    "",
    "คำศัพท์สำคัญ",
    vocabulary.map((word, index) => `${index + 1}. ${word}`).join("\n"),
    "",
    "รูปประโยคตัวอย่าง",
    patterns.map((pattern, index) => `${index + 1}. ${pattern}`).join("\n"),
    "",
    "กิจกรรม/แบบฝึกหัด",
    exercises.map((item, index) => `${index + 1}. ${item}`).join("\n"),
    "",
    "เฉลยสำหรับครู",
    "1. คำตอบของกิจกรรมจับคู่หรือเลือกคำศัพท์ให้พิจารณาจากคำศัพท์สำคัญในบทเรียน",
    `2. ประโยคคำตอบควรใช้รูปประโยคตัวอย่าง เช่น ${patterns.join(" / ")}`,
    "3. หากนักเรียนสะกดคำยังไม่ครบถ้วน ให้ครูให้คะแนนจากความเข้าใจคำศัพท์ การเลือกภาพถูกต้อง และความกล้าพูดประกอบ",
    "4. สำหรับคำตอบแบบวาดภาพหรือเขียนประโยคสั้น ๆ ครูสามารถรับคำตอบที่สอดคล้องกับหัวข้อและใช้คำศัพท์เป้าหมายได้",
  ].join("\n");
}

function downloadTextFile(filename, text) {
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function App() {
  const embeddedTemplates = readEmbeddedTemplates();
  const [templates, setTemplates] = useState(embeddedTemplates || fallbackTemplates);
  const [form, setForm] = useState(defaultForm);
  const [lesson, setLesson] = useState(() => buildLesson(defaultForm, embeddedTemplates || fallbackTemplates));
  const [exportNotice, setExportNotice] = useState("");
  const [dataLoadError, setDataLoadError] = useState("");

  useEffect(() => {
    const currentEmbeddedTemplates = readEmbeddedTemplates();
    if (currentEmbeddedTemplates) {
      setTemplates(currentEmbeddedTemplates);
      setLesson(buildLesson(defaultForm, currentEmbeddedTemplates));
      return;
    }

    fetch("./data/lessonTemplates.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`โหลดข้อมูลหลักสูตรไม่สำเร็จ (${response.status})`);
        }
        return response;
      })
      .then((response) => response.json())
      .then((data) => {
        setTemplates(data);
        setLesson(buildLesson(defaultForm, data));
      })
      .catch((error) => {
        console.error("ไม่สามารถโหลดข้อมูลหลักสูตรได้", error);
        setDataLoadError("ไม่สามารถโหลดข้อมูลหลักสูตรได้ กรุณาตรวจสอบว่าไฟล์ data/lessonTemplates.json และ data/lessonTemplates.js ถูกอัปโหลดไปพร้อมกับเว็บไซต์");
        setTemplates(fallbackTemplates);
        setLesson(buildLesson(defaultForm, fallbackTemplates));
      });
  }, []);

  const topicOptions = useMemo(() => {
    return normalizeUnitFrame(templates?.lessonFrames?.[form.learningUnit]).topics;
  }, [templates, form.learningUnit]);

  function updateField(key, value) {
    setForm((current) => {
      const next = { ...current, [key]: value };
      if (key === "learningUnit" && templates) {
        next.lessonTopic = normalizeUnitFrame(templates.lessonFrames?.[value]).topics[0] || "หัวข้อบทเรียนตัวอย่าง";
      }
      return next;
    });
  }

  function generateLesson(event) {
    event.preventDefault();
    setLesson(buildLesson(form, templates));
    window.requestAnimationFrame(() => {
      document.querySelector("#lesson-result")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  async function copyLessonPlan() {
    const text = buildLessonPlanText({ form, lesson, selectedUnit });
    try {
      await navigator.clipboard.writeText(text);
      setExportNotice("คัดลอกแผนการสอนเรียบร้อยแล้ว");
    } catch {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      textArea.remove();
      setExportNotice("คัดลอกแผนการสอนเรียบร้อยแล้ว");
    }
  }

  function downloadLessonPlan() {
    const text = buildLessonPlanText({ form, lesson, selectedUnit });
    downloadTextFile(`แผนการสอน-${safeFilename(form.learningUnit)}-${safeFilename(form.lessonTopic)}.txt`, text);
    setExportNotice("ดาวน์โหลดแผนการสอนเป็นไฟล์ .txt แล้ว");
  }

  function downloadWorksheet() {
    const text = buildWorksheetText({ form, selectedUnit });
    downloadTextFile(`ใบงาน-${safeFilename(form.learningUnit)}-${safeFilename(form.lessonTopic)}.txt`, text);
    setExportNotice("ดาวน์โหลดใบงานตัวอย่างเป็นไฟล์ .txt แล้ว");
  }

  const lessonFrames = templates?.lessonFrames || fallbackTemplates.lessonFrames;
  const fieldOptions = templates?.fieldOptions || fallbackTemplates.fieldOptions;
  const fallbackLearningUnits = asArray(Object.keys(lessonFrames), [defaultForm.learningUnit]);
  const options = {
    gradeLevels: asArray(fieldOptions.gradeLevels, [defaultForm.gradeLevel]),
    subjects: asArray(fieldOptions.subjects, [defaultForm.subject]),
    learningUnits: asArray(fieldOptions.learningUnits, fallbackLearningUnits),
    studentLevels: asArray(fieldOptions.studentLevels, [defaultForm.studentLevel]),
    targetSkills: asArray(fieldOptions.targetSkills, [defaultForm.targetSkill]),
    activityTypes: asArray(fieldOptions.activityTypes, [defaultForm.activityType]),
  };
  const selectedUnit = normalizeUnitFrame(lessonFrames[form.learningUnit]);
  const semesterOneHours = Object.values(lessonFrames)
    .map((unit) => normalizeUnitFrame(unit))
    .filter((unit) => unit.semester === "ภาคเรียนที่ 1")
    .reduce((sum, unit) => sum + Number(unit.totalHours || 0), 0);
  const semesterTwoHours = Object.values(lessonFrames)
    .map((unit) => normalizeUnitFrame(unit))
    .filter((unit) => unit.semester === "ภาคเรียนที่ 2")
    .reduce((sum, unit) => sum + Number(unit.totalHours || 0), 0);
  const yearlyHours = semesterOneHours + semesterTwoHours;

  return h("main", { className: "app-shell min-h-screen px-4 py-5 sm:px-6 lg:px-8" }, [
    dataLoadError ? h("section", { className: "mx-auto mb-4 max-w-7xl rounded-3xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm font-bold leading-6 text-amber-800 shadow-soft", key: "data-warning" }, dataLoadError) : null,
    h("section", { className: "platform-hero mx-auto max-w-7xl overflow-hidden shadow-paper", key: "hero" }, [
      h("div", { className: "platform-nav", key: "nav" }, [
        h("div", { className: "brand-mark", key: "mark" }, "MKL"),
        h("div", { className: "min-w-0", key: "identity" }, [
          h("p", { className: "text-sm font-black text-ink", key: "name" }, "MKL Digital Lesson Builder"),
          h("p", { className: "text-xs font-bold text-slate-500", key: "school" }, "โรงเรียนบ้านหมากหุ่งขี้เหล็ก"),
        ]),
        h("span", { className: "ml-auto hidden rounded-full bg-white/75 px-4 py-2 text-sm font-extrabold text-ink shadow-soft sm:inline-flex", key: "tag" }, "AI ผู้ช่วยครู"),
      ]),
      h("div", { className: "grid gap-8 p-5 pt-3 sm:p-8 lg:grid-cols-[1fr_0.9fr] lg:p-10", key: "hero-content" }, [
        h("div", { className: "flex flex-col justify-center", key: "copy" }, [
          h("div", { className: "mb-5 flex flex-wrap items-center gap-3", key: "badges" }, [
            h("span", { className: "lesson-badge bg-mint/80", key: "school" }, "โรงเรียนบ้านหมากหุ่งขี้เหล็ก"),
            h("span", { className: "lesson-badge bg-white/80", key: "scope" }, "ภาษาอังกฤษพื้นฐาน ป.4"),
          ]),
          h("p", { className: "text-sm font-black uppercase text-slate-500", key: "tagline" }, "AI ผู้ช่วยครูในการออกแบบการเรียนรู้"),
          h("h1", { className: "mt-3 break-words font-display text-4xl font-black leading-tight text-ink sm:text-5xl lg:text-6xl", key: "title" }, "MKL Digital Lesson Builder"),
          h("p", { className: "mt-4 text-xl font-extrabold text-slate-700", key: "subtitle" }, "ระบบช่วยออกแบบการจัดการเรียนรู้ดิจิทัลด้วย AI"),
          h("p", { className: "mt-5 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg", key: "description" }, "แพลตฟอร์มต้นแบบสำหรับครูประถมศึกษา ช่วยออกแบบแผนการสอน ใบงาน สื่อการสอน และเอกสารประกอบอย่างเป็นระบบ ใช้งานง่าย และเหมาะกับบริบทโรงเรียนไทย"),
          h("div", { className: "mt-7 flex flex-col gap-3 sm:flex-row", key: "actions" }, [
            h("a", { className: "primary-action", href: "#builder", key: "start" }, "เริ่มสร้างแผนการสอน"),
            h("a", { className: "secondary-action", href: "#lesson-result", key: "sample" }, "ดูตัวอย่างผลลัพธ์"),
          ]),
          h("div", { className: "curriculum-totals", key: "totals" }, [
            h("div", { key: "year" }, [
              h("span", { key: "label" }, "เวลาเรียนทั้งปี"),
              h("strong", { key: "value" }, `${yearlyHours} ชั่วโมง`),
            ]),
            h("div", { key: "s1" }, [
              h("span", { key: "label" }, "ภาคเรียนที่ 1"),
              h("strong", { key: "value" }, `${semesterOneHours} ชั่วโมง`),
            ]),
            h("div", { key: "s2" }, [
              h("span", { key: "label" }, "ภาคเรียนที่ 2"),
              h("strong", { key: "value" }, `${semesterTwoHours} ชั่วโมง`),
            ]),
          ]),
        ]),
        h("div", { className: "feature-grid", key: "features" }, [
          h("article", { className: "feature-card bg-peach/75", key: "f1" }, [
            h("span", { className: "feature-icon", key: "icon" }, h(ClassroomIcon, { type: "book" })),
            h("h3", { key: "title" }, "สร้างแผนการสอน"),
            h("p", { key: "copy" }, "จัดโครงสร้างบทเรียนครบถ้วนตามหน่วยการเรียนรู้"),
          ]),
          h("article", { className: "feature-card bg-butter/75", key: "f2" }, [
            h("span", { className: "feature-icon", key: "icon" }, h(ClassroomIcon, { type: "paper" })),
            h("h3", { key: "title" }, "สร้างใบงาน"),
            h("p", { key: "copy" }, "เตรียมแบบฝึกหัดที่เหมาะกับผู้เรียนพื้นฐานอ่อน"),
          ]),
          h("article", { className: "feature-card bg-skysoft/75", key: "f3" }, [
            h("span", { className: "feature-icon", key: "icon" }, h(ClassroomIcon, { type: "cards" })),
            h("h3", { key: "title" }, "แนะนำสื่อการสอน"),
            h("p", { key: "copy" }, "ระบุสื่อและบัตรภาพที่นำไปใช้ในห้องเรียนได้ทันที"),
          ]),
          h("article", { className: "feature-card bg-mint/75", key: "f4" }, [
            h("span", { className: "feature-icon", key: "icon" }, h(ClassroomIcon, { type: "clipboard" })),
            h("h3", { key: "title" }, "ดาวน์โหลดเอกสาร"),
            h("p", { key: "copy" }, "บันทึกแผนการสอนและใบงานเป็นไฟล์ข้อความภาษาไทย"),
          ]),
        ]),
      ]),
    ]),

    h("section", { id: "builder", className: "mx-auto mt-6 grid max-w-7xl gap-6 lg:grid-cols-2", key: "builder" }, [
      h("form", { className: "paper-panel min-w-0 rounded-[2rem] p-5 shadow-paper sm:p-7", onSubmit: generateLesson, key: "form" }, [
        h("div", { className: "mb-6 flex items-start gap-3", key: "form-header" }, [
          h(TextIcon, { tone: "bg-butter", key: "icon" }, "✎"),
          h("div", { key: "text" }, [
          h("h2", { className: "font-display text-2xl font-black text-ink", key: "title" }, "แบบฟอร์มสร้างแผนการสอน"),
          h("p", { className: "mt-1 text-sm leading-6 text-slate-500", key: "copy" }, "เลือกข้อมูลจากโครงสร้างหลักสูตรภาษาอังกฤษ ป.4 เพื่อสร้างแผนการสอนที่เหมาะกับระดับผู้เรียน"),
          ]),
        ]),
        h("div", { className: "grid gap-4 sm:grid-cols-2", key: "fields" }, [
          h(SelectField, { id: "grade-level", label: fieldLabels.gradeLevel, value: form.gradeLevel, options: options.gradeLevels, disabled: true, onChange: (value) => updateField("gradeLevel", value), key: "grade" }),
          h(SelectField, { id: "subject", label: fieldLabels.subject, value: form.subject, options: options.subjects, disabled: true, onChange: (value) => updateField("subject", value), key: "subject" }),
          h(SelectField, { id: "learning-unit", label: fieldLabels.learningUnit, value: form.learningUnit, options: options.learningUnits, onChange: (value) => updateField("learningUnit", value), key: "unit" }),
          h(SelectField, { id: "lesson-topic", label: fieldLabels.lessonTopic, value: form.lessonTopic, options: topicOptions, onChange: (value) => updateField("lessonTopic", value), key: "topic" }),
          h(SelectField, { id: "student-level", label: fieldLabels.studentLevel, value: form.studentLevel, options: options.studentLevels, onChange: (value) => updateField("studentLevel", value), key: "level" }),
          h(SelectField, { id: "target-skill", label: fieldLabels.targetSkill, value: form.targetSkill, options: options.targetSkills, onChange: (value) => updateField("targetSkill", value), key: "skill" }),
          h("div", { className: "sm:col-span-2", key: "activity" }, h(SelectField, { id: "activity-type", label: fieldLabels.activityType, value: form.activityType, options: options.activityTypes, onChange: (value) => updateField("activityType", value) })),
        ]),
        h("button", { className: "primary-action mt-6 w-full border-0 sm:w-auto", type: "submit", key: "button" }, "สร้างแผนการสอน"),
      ]),

      h("aside", { className: "paper-panel min-w-0 rounded-[2rem] p-5 shadow-paper sm:p-7", key: "template" }, [
        h("div", { className: "mb-5 flex items-start gap-3", key: "header" }, [
          h(TextIcon, { tone: "bg-lilac", key: "icon" }, h(ClassroomIcon, { type: "clipboard" })),
          h("div", { key: "text" }, [
            h("h2", { className: "font-display text-2xl font-black text-ink", key: "title" }, "ภาพรวมหน่วยการเรียนรู้"),
            h("p", { className: "mt-1 text-sm leading-6 text-slate-500", key: "copy" }, "ตรวจสอบข้อมูลหลักของหน่วยก่อนสร้างแผนการสอน"),
          ]),
        ]),
        h("div", { className: "curriculum-panel", key: "panel" }, [
          h("div", { className: "curriculum-block bg-mint/40", key: "year-summary" }, [
            h("span", { key: "label" }, "โครงสร้างเวลาเรียนหลักสูตร"),
            h("p", { key: "value" }, `รวม ${yearlyHours} ชั่วโมงต่อปีการศึกษา แบ่งเป็นภาคเรียนที่ 1 จำนวน ${semesterOneHours} ชั่วโมง และภาคเรียนที่ 2 จำนวน ${semesterTwoHours} ชั่วโมง`),
          ]),
          h("div", { className: "curriculum-row", key: "semester" }, [
            h("span", { key: "label" }, "ภาคเรียน"),
            h("strong", { key: "value" }, selectedUnit.semester),
          ]),
          h("div", { className: "curriculum-row", key: "hours" }, [
            h("span", { key: "label" }, "เวลาเรียนรวม"),
            h("strong", { key: "value" }, `${selectedUnit.totalHours} ชั่วโมง`),
          ]),
          h("div", { className: "curriculum-block", key: "topics" }, [
            h("span", { key: "label" }, "หัวข้อในหน่วยนี้"),
            h("div", { className: "curriculum-chips", key: "chips" }, asArray(selectedUnit.topics, fallbackUnitFrame.topics).map((topic) => h("span", { key: topic }, topic))),
          ]),
          h("div", { className: "curriculum-block", key: "vocabulary" }, [
            h("span", { key: "label" }, "คำศัพท์สำคัญ"),
            h("p", { key: "value" }, asArray(selectedUnit.vocabulary, fallbackUnitFrame.vocabulary).slice(0, 8).join(", ")),
          ]),
          h("div", { className: "curriculum-block", key: "patterns" }, [
            h("span", { key: "label" }, "รูปประโยคตัวอย่าง"),
            h("p", { key: "value" }, asArray(selectedUnit.speakingFocus, fallbackUnitFrame.speakingFocus).slice(0, 4).join(" / ")),
          ]),
        ]),
      ]),
    ]),

    h("section", { id: "lesson-result", className: "mx-auto mt-6 max-w-7xl lesson-plan-card shadow-paper", key: "result" }, [
      h("div", { className: "watercolor-band h-3", key: "band" }),
      h("div", { className: "p-5 sm:p-7 lg:p-8", key: "result-inner" }, [
        h("div", { className: "lesson-plan-hero", key: "result-header" }, [
          h("div", { className: "min-w-0", key: "text" }, [
            h("div", { className: "mb-4 flex flex-wrap gap-2", key: "badges" }, [
              h("span", { className: "lesson-badge bg-mint/80", key: "prototype" }, "ต้นแบบนวัตกรรมการศึกษา"),
              h("span", { className: "lesson-badge bg-white/75", key: "grade" }, `${form.gradeLevel} • ${form.subject}`),
            ]),
            h("p", { className: "text-sm font-extrabold uppercase text-slate-500", key: "eyebrow" }, "ผลลัพธ์แผนการสอน"),
            h("h2", { className: "mt-2 break-words font-display text-3xl font-black leading-tight text-ink sm:text-4xl", key: "title" }, form.lessonTopic),
            h("p", { className: "mt-3 max-w-3xl text-sm leading-7 text-slate-600", key: "description" }, "แผนบทเรียนภาษาอังกฤษอย่างง่ายสำหรับนักเรียนไทย ป.4 ที่ต้องการพื้นฐานคำศัพท์ ประโยคสั้น และความมั่นใจในการสื่อสาร"),
          ]),
          h("div", { className: "lesson-summary-panel", key: "summary" }, [
            h("div", { className: "lesson-summary-row", key: "unit" }, [
              h("span", { key: "label" }, "หน่วยการเรียนรู้"),
            h("strong", { key: "value" }, `หน่วยที่ ${selectedUnit.unitNumber} ${form.learningUnit}`),
            ]),
            h("div", { className: "lesson-summary-row", key: "topic" }, [
              h("span", { key: "label" }, "หัวข้อที่เรียน"),
              h("strong", { key: "value" }, form.lessonTopic),
            ]),
            h("div", { className: "lesson-summary-row", key: "semester" }, [
              h("span", { key: "label" }, "ภาคเรียน"),
              h("strong", { key: "value" }, selectedUnit.semester),
            ]),
            h("div", { className: "lesson-summary-row", key: "hours" }, [
              h("span", { key: "label" }, "เวลาเรียนรวม"),
              h("strong", { key: "value" }, `${selectedUnit.totalHours} ชั่วโมง`),
            ]),
          ]),
        ]),
        h("div", { className: "lesson-export-panel", key: "export-actions" }, [
          h("button", { className: "lesson-export-button bg-mint/80", onClick: copyLessonPlan, type: "button", key: "copy" }, [
            h("span", { "aria-hidden": "true", key: "icon" }, "⧉"),
            h("span", { key: "text" }, "คัดลอกแผนการสอน"),
          ]),
          h("button", { className: "lesson-export-button bg-skysoft/80", onClick: downloadLessonPlan, type: "button", key: "lesson-download" }, [
            h("span", { "aria-hidden": "true", key: "icon" }, "⇩"),
            h("span", { key: "text" }, "ดาวน์โหลดแผนการสอน"),
          ]),
          h("button", { className: "lesson-export-button bg-butter/80", onClick: downloadWorksheet, type: "button", key: "worksheet-download" }, [
            h("span", { "aria-hidden": "true", key: "icon" }, "✎"),
            h("span", { key: "text" }, "ดาวน์โหลดใบงานตัวอย่าง"),
          ]),
          exportNotice ? h("p", { className: "lesson-export-notice", key: "notice" }, exportNotice) : null,
        ]),
        h("div", { className: "mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4", key: "mini-stats" }, [
          h("div", { className: "lesson-mini-stat bg-peach/70", key: "level" }, [
            h("span", { key: "label" }, "ระดับผู้เรียน"),
            h("strong", { key: "value" }, form.studentLevel),
          ]),
          h("div", { className: "lesson-mini-stat bg-skysoft/70", key: "skill" }, [
            h("span", { key: "label" }, "ทักษะที่เน้น"),
            h("strong", { key: "value" }, form.targetSkill),
          ]),
          h("div", { className: "lesson-mini-stat bg-butter/70", key: "activity" }, [
            h("span", { key: "label" }, "รูปแบบกิจกรรม"),
            h("strong", { key: "value" }, form.activityType),
          ]),
          h("div", { className: "lesson-mini-stat bg-lilac/70", key: "sections" }, [
            h("span", { key: "label" }, "องค์ประกอบแผน"),
            h("strong", { key: "value" }, "8 ส่วน"),
          ]),
        ]),
        h("div", { className: "mt-6 grid gap-4 lg:grid-cols-2", key: "cards" },
          asArray(lesson).map((section, index) => h(LessonSectionCard, { section, index, key: section.title }))
        ),
      ]),
    ]),
  ]);
}

function SelectField({ id, label, value, options, disabled = false, onChange }) {
  const safeOptions = asArray(options, [value || "ยังไม่มีตัวเลือก"]);
  return h("div", { className: "block" }, [
    h("label", { className: "field-label", htmlFor: id, key: "label" }, label),
    h(
      "select",
      {
        id,
        className: `field-control ${disabled ? "cursor-not-allowed opacity-70" : ""}`,
        value,
        disabled,
        onChange: (event) => onChange(event.target.value),
        key: "select",
      },
      safeOptions.map((option) => h("option", { value: option, key: option }, option))
    ),
  ]);
}

class AppErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    console.error("เกิดข้อผิดพลาดในการแสดงผลระบบ", error);
  }

  render() {
    if (this.state.hasError) {
      return h("main", { className: "flex min-h-screen items-center justify-center p-6" },
        h("section", { className: "paper-panel max-w-xl rounded-[2rem] p-8 text-center shadow-paper" }, [
          h("h1", { className: "font-display text-3xl font-black text-ink", key: "title" }, "ไม่สามารถแสดงผลระบบได้ครบถ้วน"),
          h("p", { className: "mt-3 leading-7 text-slate-600", key: "copy" }, "ระบบพบข้อมูลหลักสูตรบางส่วนไม่สมบูรณ์ กรุณาตรวจสอบไฟล์ข้อมูลหลักสูตร หรือรีเฟรชหน้าเว็บอีกครั้ง"),
        ])
      );
    }

    return this.props.children;
  }
}

const rootNode = document.getElementById("root");

if (rootNode) {
  createRoot(rootNode).render(h(AppErrorBoundary, null, h(App)));
} else {
  document.body.innerHTML = '<main class="flex min-h-screen items-center justify-center p-6"><section class="paper-panel max-w-xl rounded-[2rem] p-8 text-center shadow-paper"><h1 class="font-display text-3xl font-black text-ink">ไม่พบพื้นที่แสดงผลของระบบ</h1><p class="mt-3 leading-7 text-slate-600">กรุณาตรวจสอบไฟล์ index.html ให้มีส่วนแสดงผลหลักของเว็บไซต์</p></section></main>';
}
