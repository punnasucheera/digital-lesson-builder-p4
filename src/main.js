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
  const unitFrame = templates.lessonFrames[form.learningUnit];
  const activityFrame = templates.activityTemplates[form.activityType];
  const vocabularyLimit = form.studentLevel === "Very Basic" ? 4 : 6;
  const vocabulary = unitFrame.vocabulary.slice(0, vocabularyLimit);
  const topic = form.lessonTopic || unitFrame.topics[0];
  const speakingFocus = unitFrame.speakingFocus.slice(0, form.studentLevel === "Growing Confidence" ? 5 : 4);

  return [
    {
      title: "จุดประสงค์การเรียนรู้",
      content: [
        `นักเรียนเข้าใจและใช้คำศัพท์พื้นฐานเกี่ยวกับหัวข้อ “${topic}” ได้อย่างเหมาะสมกับระดับชั้น`,
        `นักเรียนฝึกพูดประโยคภาษาอังกฤษสั้น ๆ ได้ เช่น ${speakingFocus.slice(0, 2).join(" / ")}`,
        `นักเรียนมีส่วนร่วมในกิจกรรม ${form.activityType} โดยใช้บัตรภาพ การพูดซ้ำ และการช่วยเหลือจากครู`,
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
        "ครูทบทวนคำศัพท์เป้าหมายโดยชี้ภาพเร็ว ๆ และให้นักเรียนตอบพร้อมกัน",
        "ครูให้คำชมและชวนให้นักเรียนพูดซ้ำอีกครั้ง เพื่อสร้างความมั่นใจในการใช้ภาษาอังกฤษ",
      ],
    },
    {
      title: "กิจกรรมการเรียนรู้",
      content: [
        activityFrame.classroomActivity,
        ...unitFrame.classroomActivities.slice(0, 2),
      ],
    },
    {
      title: "สื่อการสอน",
      content: [
        ...unitFrame.media,
        `คำศัพท์ที่เน้น: ${vocabulary.join(", ")}`,
        `รูปประโยคที่ใช้ฝึกพูด: ${speakingFocus.join(" / ")}`,
      ],
    },
    {
      title: "ใบงานตัวอย่าง",
      content: unitFrame.worksheetIdeas,
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
      section.content.map((item) =>
        h("li", { className: "lesson-section-item", key: item }, [
          h("span", { className: "lesson-dot", "aria-hidden": "true", key: "dot" }),
          h("span", { key: "text" }, item),
        ])
      )
    ),
  ]);
}

function App() {
  const [templates, setTemplates] = useState(null);
  const [form, setForm] = useState({
    gradeLevel: "Grade 4",
    subject: "Fundamental English",
    learningUnit: "Hello English!",
    lessonTopic: "Hello and Goodbye",
    studentLevel: "Basic",
    targetSkill: "Speaking",
    activityType: "Pair Practice",
  });
  const [lesson, setLesson] = useState(null);

  useEffect(() => {
    fetch("./data/lessonTemplates.json")
      .then((response) => response.json())
      .then((data) => {
        setTemplates(data);
        setLesson(buildLesson(form, data));
      });
  }, []);

  const topicOptions = useMemo(() => {
    if (!templates) return [];
    return templates.lessonFrames[form.learningUnit]?.topics || [];
  }, [templates, form.learningUnit]);

  function updateField(key, value) {
    setForm((current) => {
      const next = { ...current, [key]: value };
      if (key === "learningUnit" && templates) {
        next.lessonTopic = templates.lessonFrames[value].topics[0];
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

  if (!templates) {
    return h(
      "main",
      { className: "flex min-h-screen items-center justify-center p-6" },
      h("div", { className: "paper-panel rounded-[2rem] p-8 text-center shadow-paper" }, [
        h("p", { className: "font-display text-2xl font-black text-ink", key: "title" }, "กำลังเตรียมระบบช่วยออกแบบแผนการจัดการเรียนรู้..."),
        h("p", { className: "mt-2 text-sm text-slate-500", key: "copy" }, "กำลังโหลดแม่แบบบทเรียนที่แก้ไขได้"),
      ])
    );
  }

  const options = templates.fieldOptions;
  const selectedUnit = templates.lessonFrames[form.learningUnit];

  return h("main", { className: "min-h-screen px-4 py-5 sm:px-6 lg:px-8" }, [
    h("section", { className: "mx-auto max-w-7xl overflow-hidden rounded-[2.2rem] paper-panel shadow-paper", key: "hero" }, [
      h("div", { className: "watercolor-band h-3", key: "band" }),
      h("div", { className: "grid gap-8 p-5 sm:p-8 lg:grid-cols-[1.05fr_0.95fr] lg:p-10", key: "hero-content" }, [
        h("div", { className: "flex flex-col justify-center", key: "copy" }, [
          h("div", { className: "mb-5 flex flex-wrap items-center gap-3", key: "badges" }, [
            h("span", { className: "rounded-full bg-white/70 px-4 py-2 text-sm font-bold text-ink shadow-soft", key: "scope" }, "ป.4 ภาษาอังกฤษพื้นฐาน"),
            h("span", { className: "rounded-full bg-mint/80 px-4 py-2 text-sm font-bold text-ink shadow-soft", key: "json" }, "แม่แบบ JSON ที่แก้ไขได้"),
          ]),
          h("h1", { className: "break-words font-display text-3xl font-black leading-tight text-ink sm:text-5xl lg:text-6xl", key: "title" }, "Digital Lesson Builder ระบบช่วยออกแบบแผนการจัดการเรียนรู้"),
          h("p", { className: "mt-5 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg", key: "description" }, "ต้นแบบที่เป็นมิตรสำหรับคุณครูประถมศึกษา ช่วยเปลี่ยนหัวข้อภาษาอังกฤษ ป.4 ให้เป็นแผนการจัดการเรียนรู้ที่มีจุดประสงค์ กิจกรรม ใบงาน การประเมินผล และสื่อการสอนครบถ้วน"),
          h("div", { className: "mt-7 flex flex-col gap-3 sm:flex-row", key: "actions" }, [
            h("a", { className: "inline-flex min-h-12 items-center justify-center rounded-2xl bg-ink px-6 font-bold text-white shadow-soft transition hover:-translate-y-0.5", href: "#builder", key: "start" }, "เริ่มออกแบบแผน"),
            h("a", { className: "inline-flex min-h-12 items-center justify-center rounded-2xl bg-white/80 px-6 font-bold text-ink shadow-soft transition hover:-translate-y-0.5", href: "#lesson-result", key: "sample" }, "ดูตัวอย่างแผน"),
          ]),
        ]),
        h("div", { className: "relative flex min-h-[260px] items-center justify-center", key: "art" }, [
          h("img", { className: "w-full max-w-[460px] drop-shadow-2xl", src: "./public/lesson-stickers.svg", alt: "ภาพประกอบเครื่องเขียนในห้องเรียนโทนพาสเทล", key: "img" }),
        ]),
      ]),
    ]),

    h("section", { id: "builder", className: "mx-auto mt-6 grid max-w-7xl gap-6 lg:grid-cols-2", key: "builder" }, [
      h("form", { className: "paper-panel min-w-0 rounded-[2rem] p-5 shadow-paper sm:p-7", onSubmit: generateLesson, key: "form" }, [
        h("div", { className: "mb-6 flex items-start gap-3", key: "form-header" }, [
          h(TextIcon, { tone: "bg-butter", key: "icon" }, "✎"),
          h("div", { key: "text" }, [
          h("h2", { className: "font-display text-2xl font-black text-ink", key: "title" }, "แบบฟอร์มออกแบบแผนการจัดการเรียนรู้"),
          h("p", { className: "mt-1 text-sm leading-6 text-slate-500", key: "copy" }, "เลือกข้อมูลจากโครงสร้างหลักสูตรภาษาอังกฤษ ป.4 ทั้ง 2 ภาคเรียน เหมาะสำหรับผู้เรียนพื้นฐานอ่อน"),
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
        h("button", { className: "mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-2xl bg-ink px-6 font-bold text-white shadow-soft transition hover:-translate-y-0.5 sm:w-auto", type: "submit", key: "button" }, "สร้างแผนการจัดการเรียนรู้"),
      ]),

      h("aside", { className: "paper-panel min-w-0 rounded-[2rem] p-5 shadow-paper sm:p-7", key: "template" }, [
        h("div", { className: "mb-5 flex items-start gap-3", key: "header" }, [
          h(TextIcon, { tone: "bg-lilac", key: "icon" }, "{ }"),
          h("div", { key: "text" }, [
            h("h2", { className: "font-display text-2xl font-black text-ink", key: "title" }, "ตัวอย่างแม่แบบบทเรียน"),
            h("p", { className: "mt-1 text-sm leading-6 text-slate-500", key: "copy" }, "แผนการจัดการเรียนรู้สร้างจากโครงสร้าง JSON ที่คุณครูสามารถแก้ไขได้"),
          ]),
        ]),
        h("pre", { className: "max-h-[420px] overflow-auto rounded-3xl bg-white/70 p-4 text-xs leading-6 text-slate-600 shadow-inner" }, JSON.stringify({
          ขอบเขตต้นแบบ: templates.prototypeScope,
          หน่วยการเรียนรู้ที่เลือก: templates.lessonFrames[form.learningUnit],
          รูปแบบกิจกรรมที่เลือก: templates.activityTemplates[form.activityType],
        }, null, 2)),
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
            h("p", { className: "text-sm font-extrabold uppercase text-slate-500", key: "eyebrow" }, "การ์ดแผนการจัดการเรียนรู้"),
            h("h2", { className: "mt-2 break-words font-display text-3xl font-black leading-tight text-ink sm:text-4xl", key: "title" }, form.lessonTopic),
            h("p", { className: "mt-3 max-w-3xl text-sm leading-7 text-slate-600", key: "description" }, "แผนบทเรียนภาษาอังกฤษอย่างง่ายสำหรับนักเรียนไทย ป.4 ที่ต้องการพื้นฐานคำศัพท์ ประโยคสั้น และความมั่นใจในการสื่อสาร"),
          ]),
          h("div", { className: "lesson-summary-panel", key: "summary" }, [
            h("div", { className: "lesson-summary-row", key: "unit" }, [
              h("span", { key: "label" }, "Unit"),
              h("strong", { key: "value" }, `${selectedUnit.unitNumber}. ${form.learningUnit}`),
            ]),
            h("div", { className: "lesson-summary-row", key: "topic" }, [
              h("span", { key: "label" }, "Topic"),
              h("strong", { key: "value" }, form.lessonTopic),
            ]),
            h("div", { className: "lesson-summary-row", key: "semester" }, [
              h("span", { key: "label" }, "Semester"),
              h("strong", { key: "value" }, selectedUnit.semester),
            ]),
            h("div", { className: "lesson-summary-row", key: "hours" }, [
              h("span", { key: "label" }, "Total Hours"),
              h("strong", { key: "value" }, `${selectedUnit.totalHours} ชั่วโมง`),
            ]),
          ]),
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
          lesson.map((section, index) => h(LessonSectionCard, { section, index, key: section.title }))
        ),
      ]),
    ]),
  ]);
}

function SelectField({ id, label, value, options, disabled = false, onChange }) {
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
      options.map((option) => h("option", { value: option, key: option }, option))
    ),
  ]);
}

createRoot(document.getElementById("root")).render(h(App));
