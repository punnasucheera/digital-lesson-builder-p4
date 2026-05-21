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

const subjectOptions = [
  "ภาษาอังกฤษพื้นฐาน",
  "ภาษาอังกฤษ",
  "English",
  "Basic English",
  "ศิลปะ",
  "การป้องกันการทุจริต",
  "การงานอาชีพ",
  "วิทยาศาสตร์",
  "คณิตศาสตร์",
  "สังคมศึกษา",
  "ภาษาไทย",
];

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
    subjects: subjectOptions,
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
  "ข้อมูลพื้นฐาน": { icon: "clipboard", tone: "bg-mint" },
  "คำศัพท์สำคัญประจำบทเรียน": { icon: "cards", tone: "bg-butter" },
  "จุดประสงค์การเรียนรู้": { icon: "star", tone: "bg-peach" },
  "กระบวนการจัดการเรียนรู้แบบ 2W3P": { icon: "book", tone: "bg-skysoft" },
  "กระบวนการจัดการเรียนรู้": { icon: "book", tone: "bg-skysoft" },
  "ตัวอย่างบทสนทนา": { icon: "cards", tone: "bg-peach" },
  "สื่อ/อุปกรณ์": { icon: "cards", tone: "bg-peach" },
  "ใบงานตัวอย่าง": { icon: "paper", tone: "bg-butter" },
  "การวัดและประเมินผล": { icon: "clipboard", tone: "bg-mint" },
  "ข้อเสนอแนะสำหรับครู": { icon: "star", tone: "bg-lilac" },
};

function isEnglishSubject(subject) {
  return ["ภาษาอังกฤษ", "ภาษาอังกฤษพื้นฐาน", "English", "Basic English"].includes(String(subject || "").trim());
}

const vocabularyMeanings = {
  hello: "สวัสดี", hi: "สวัสดี", goodbye: "ลาก่อน", teacher: "ครู", friend: "เพื่อน", name: "ชื่อ",
  apple: "แอปเปิล", ball: "ลูกบอล", cat: "แมว", dog: "สุนัข", elephant: "ช้าง", fish: "ปลา",
  book: "หนังสือ", pencil: "ดินสอ", ruler: "ไม้บรรทัด", eraser: "ยางลบ", chair: "เก้าอี้", desk: "โต๊ะเรียน",
  father: "พ่อ", mother: "แม่", brother: "พี่ชายหรือน้องชาย", sister: "พี่สาวหรือน้องสาว", grandfather: "ปู่หรือตา", grandmother: "ย่าหรือยาย",
  red: "สีแดง", blue: "สีน้ำเงิน", yellow: "สีเหลือง", green: "สีเขียว", black: "สีดำ", white: "สีขาว",
  one: "หนึ่ง", two: "สอง", three: "สาม", four: "สี่", five: "ห้า", ten: "สิบ", twenty: "ยี่สิบ",
  bird: "นก", cow: "วัว", pig: "หมู", chicken: "ไก่", rabbit: "กระต่าย", duck: "เป็ด", horse: "ม้า",
  wake: "ตื่นนอน", eat: "กิน", study: "เรียน", play: "เล่น", sleep: "นอน", wash: "ล้าง",
  rice: "ข้าว", milk: "นม", water: "น้ำ", egg: "ไข่", banana: "กล้วย", bread: "ขนมปัง", juice: "น้ำผลไม้",
  classroom: "ห้องเรียน", library: "ห้องสมุด", canteen: "โรงอาหาร", playground: "สนามเด็กเล่น", office: "ห้องสำนักงาน", toilet: "ห้องน้ำ", garden: "สวน",
  run: "วิ่ง", jump: "กระโดด", swim: "ว่ายน้ำ", sing: "ร้องเพลง", dance: "เต้น", draw: "วาดภาพ", read: "อ่าน",
  sunny: "แดดออก", rainy: "ฝนตก", cloudy: "มีเมฆมาก", windy: "ลมแรง", hot: "ร้อน", cold: "หนาว",
  happy: "มีความสุข", sad: "เศร้า", tired: "เหนื่อย", fine: "สบายดี", hungry: "หิว", sleepy: "ง่วง",
  yes: "ใช่", no: "ไม่ใช่", please: "กรุณา", thank: "ขอบคุณ", sorry: "ขอโทษ", listen: "ฟัง", look: "ดู", write: "เขียน", stand: "ยืน", sit: "นั่ง",
};

const topicVocabularyExtras = {
  "Hello and Goodbye": ["hello", "hi", "goodbye", "teacher", "friend", "name"],
  "My Name Is...": ["hello", "name", "friend", "teacher", "hi", "goodbye"],
  "Nice to Meet You": ["hello", "friend", "name", "teacher", "hi", "goodbye"],
  "A-Z Letter Names": ["apple", "ball", "cat", "dog", "elephant", "fish"],
  "Beginning Sounds": ["apple", "ball", "book", "cat", "dog", "desk", "fish"],
  "My ABC Words": ["apple", "ball", "cat", "dog", "fish", "book", "pencil", "desk"],
  "Classroom Objects": ["book", "pencil", "ruler", "eraser", "chair", "desk"],
  "Classroom Commands": ["stand", "sit", "listen", "look", "read", "write"],
  "Polite Classroom English": ["please", "thank", "sorry", "yes", "no", "teacher"],
  "Family Members": ["father", "mother", "brother", "sister", "grandfather", "grandmother"],
  "This Is My...": ["father", "mother", "brother", "sister", "grandfather", "grandmother"],
  "My Family Tree": ["father", "mother", "brother", "sister", "grandfather", "grandmother"],
  "Basic Colors": ["red", "blue", "yellow", "green", "black", "white"],
  "Numbers 1-20": ["one", "two", "three", "four", "five", "ten", "twenty"],
  "How Many?": ["one", "two", "three", "four", "five", "ten", "twenty"],
  "Pet Animals": ["dog", "cat", "bird", "rabbit", "fish"],
  "Farm Animals": ["cow", "pig", "chicken", "duck", "horse"],
  "Animal Actions": ["run", "jump", "swim", "walk", "play"],
  "Morning Routine": ["wake", "wash", "eat", "study", "play", "sleep"],
  "After School": ["play", "read", "draw", "eat", "sleep"],
  "My Day": ["wake", "eat", "study", "play", "sleep", "wash"],
  "Food Words": ["rice", "milk", "water", "egg", "banana", "bread", "chicken", "juice"],
  "I Like / I Don't Like": ["rice", "milk", "banana", "bread", "juice", "egg"],
  "My Lunchbox": ["rice", "egg", "milk", "water", "banana", "bread"],
  "Places at School": ["classroom", "library", "canteen", "playground", "office", "toilet", "garden"],
  "Where Is It?": ["classroom", "library", "canteen", "playground", "office", "toilet"],
  "School Map": ["classroom", "library", "canteen", "playground", "office", "garden"],
  "Things I Can Do": ["run", "jump", "swim", "sing", "dance", "draw", "read"],
  "Sports and Hobbies": ["run", "swim", "sing", "dance", "draw", "read", "play"],
  "Can / Can't": ["run", "jump", "swim", "sing", "dance", "draw"],
  "Today's Weather": ["sunny", "rainy", "cloudy", "windy", "hot", "cold"],
  "How Do You Feel?": ["happy", "sad", "tired", "fine", "hungry", "sleepy"],
  "Weather and Feelings": ["sunny", "rainy", "cloudy", "happy", "sad", "tired"],
  "Review Greetings": ["hello", "hi", "goodbye", "name", "friend", "thank"],
  "Ask and Answer": ["yes", "no", "please", "thank", "name", "friend"],
  "Short Role Play": ["hello", "name", "please", "thank", "yes", "no", "goodbye"],
};

function uniqueItems(items) {
  return [...new Set(asArray(items).map((item) => String(item).trim()).filter(Boolean))];
}

function makeVocabularyItems(unitFrame, topic) {
  return uniqueItems([...(topicVocabularyExtras[topic] || []), ...unitFrame.vocabulary]).map((word) => {
    const key = String(word).toLowerCase();
    const article = /^[aeiou]/i.test(key) ? "an" : "a";
    const example = key === "hello" || key === "hi" ? `${word}. My name is Somchai.`
      : key === "goodbye" ? "Goodbye, teacher."
        : key === "please" ? "Please listen."
          : key === "thank" ? "Thank you, teacher."
            : `This is ${article} ${word}.`;
    return { word, meaning: vocabularyMeanings[key] || "คำศัพท์สำคัญในหัวข้อนี้", example };
  });
}

function makeSentenceFrames(speakingFocus) {
  return uniqueItems([...asArray(speakingFocus, fallbackUnitFrame.speakingFocus), "This is ___.", "I like ___.", "I can ___.", "It is ___."]).slice(0, 7);
}

function makeDialogue(topic, vocabularyItems) {
  const firstWord = vocabularyItems[0]?.word || "book";
  const secondWord = vocabularyItems[1]?.word || "friend";
  if (topic.includes("Name") || topic.includes("Hello") || topic.includes("Greeting") || topic.includes("Meet")) {
    return ["Student A: Hello.", "Student B: Hello.", "Student A: What is your name?", "Student B: My name is Somchai.", "Student A: Nice to meet you.", "Student B: Nice to meet you too.", "แบบง่ายสำหรับผู้เรียนพื้นฐานอ่อน: Hello. / My name is ___. / Goodbye."];
  }
  if (topic.includes("Like") || topic.includes("Food") || topic.includes("Lunchbox")) {
    return ["Student A: Do you like rice?", "Student B: Yes, I do.", "Student A: Do you like milk?", "Student B: No, I don't.", "Student A: What food do you like?", "Student B: I like banana.", "แบบง่ายสำหรับผู้เรียนพื้นฐานอ่อน: I like ___. / I don't like ___."];
  }
  if (topic.includes("Where") || topic.includes("School") || topic.includes("Places")) {
    return ["Student A: Where is the library?", "Student B: It is here.", "Student A: Where is the canteen?", "Student B: It is there.", "แบบง่ายสำหรับผู้เรียนพื้นฐานอ่อน: library, here. / canteen, there."];
  }
  if (topic.includes("Can") || topic.includes("Activities")) {
    return ["Student A: Can you run?", "Student B: Yes, I can.", "Student A: Can you swim?", "Student B: No, I can't.", "Student A: What can you do?", "Student B: I can draw.", "แบบง่ายสำหรับผู้เรียนพื้นฐานอ่อน: I can ___. / I can't ___."];
  }
  if (topic.includes("Weather") || topic.includes("Feel")) {
    return ["Student A: How is the weather?", "Student B: It is sunny.", "Student A: How do you feel?", "Student B: I am happy.", "แบบง่ายสำหรับผู้เรียนพื้นฐานอ่อน: It is ___. / I am ___."];
  }
  return [`Student A: What is this?`, `Student B: It is ${firstWord}.`, `Student A: Do you like ${secondWord}?`, `Student B: Yes, I do.`, `แบบง่ายสำหรับผู้เรียนพื้นฐานอ่อน: ${firstWord}. / This is ${firstWord}.`];
}

function makeActivityCard({ title, objective, teacherActions, materials, steps, teacherTalk, studentActions, expected }) {
  return {
    type: "activity",
    title,
    objective: asArray(objective, ["นักเรียนปฏิบัติกิจกรรมตามเป้าหมายของบทเรียนได้"]),
    teacherActions: asArray(teacherActions, ["ครูสาธิตกิจกรรมและคอยช่วยนักเรียนทีละขั้น"]),
    materials: asArray(materials, ["บัตรภาพ", "บัตรคำศัพท์", "กระดาน"]),
    steps: asArray(steps, ["ครูสาธิตกิจกรรม", "นักเรียนปฏิบัติตามขั้นตอน", "ครูสังเกตและให้ความช่วยเหลือ"]),
    teacherTalk: asArray(teacherTalk, ["ลองทำทีละขั้นนะคะ/ครับ"]),
    studentActions: asArray(studentActions, ["นักเรียนฟังคำสั่งและปฏิบัติกิจกรรม"]),
    expected: asArray(expected, ["นักเรียนเข้าใจเนื้อหาและมีความมั่นใจมากขึ้น"]),
  };
}

const activityLibrary = {
  english: {
    vocabulary: {
      beginner: [
        {
          id: "picture-quick-guess",
          name: "Picture Quick Guess",
          stage: "Warm-up",
          progression: "attention-recall",
          objective: "นักเรียนดูภาพและนึกถึงคำศัพท์เดิมก่อนเริ่มบทเรียน",
          materials: ["บัตรภาพ {wordList}", "กระดาน", "แม่เหล็กหรือเทปติดภาพ"],
          teacherActions: ["ครูชูบัตรภาพทีละใบโดยยังไม่บอกคำศัพท์", "ครูถามสั้น ๆ และรับคำตอบทั้งภาษาไทยหรือ English words", "ครูพูดคำศัพท์ที่ถูกต้องช้า ๆ แล้วให้ทั้งห้องพูดตาม"],
          procedure: ["ครูถือบัตรภาพขึ้นมา 1 ใบแล้วให้เด็กมองเงียบ ๆ 5 วินาที", "ครูถามว่า “What do you see?” หรือ “ใครเคยเห็นภาพนี้บ้าง”", "นักเรียนตอบได้เป็นคำไทย คำอังกฤษ หรือชี้ภาพ", "ครูเฉลยคำศัพท์และติดภาพบนกระดาน", "นักเรียนพูดคำศัพท์ตามครูพร้อมกัน 2 รอบ"],
          teacherTalk: ["Look at the picture.", "What do you see?", "You can answer in Thai or English.", "Repeat after me."],
          studentAction: ["นักเรียนมองภาพ", "นักเรียนยกมือตอบหรือพูดคำศัพท์ที่รู้", "นักเรียนพูดคำศัพท์ตามครูพร้อมกัน"],
          expected: ["นักเรียนสนใจบทเรียนจากภาพใกล้ตัว", "นักเรียนพื้นฐานอ่อนกล้าตอบด้วยคำสั้น ๆ ก่อน"],
          worksheetType: "picture-word-preview",
        },
        {
          id: "picture-word-sentence-modeling",
          name: "Picture-Word-Sentence Modeling",
          stage: "Presentation",
          progression: "teacher-modeling",
          objective: "นักเรียนเข้าใจความหมาย ออกเสียงคำศัพท์ และเห็นตัวอย่างประโยคจากครู",
          materials: ["บัตรภาพ", "บัตรคำศัพท์ {wordList}", "แถบประโยค {sentenceFrame}"],
          teacherActions: ["ครูติดภาพและบัตรคำคู่กันบนกระดาน", "ครูออกเสียงคำช้า ๆ พร้อมชี้รูปปาก", "ครูเขียนหรือชูแถบประโยคแล้วเปลี่ยนคำศัพท์ในช่องว่าง"],
          procedure: ["ครูชูบัตรภาพและพูดคำศัพท์ 2 รอบ", "นักเรียนพูดตามพร้อมกันทั้งห้อง", "ครูติดบัตรคำใต้ภาพและบอกความหมายไทยสั้น ๆ", "ครูอ่านประโยคตัวอย่างจากแถบประโยค", "ครูเปลี่ยนบัตรภาพแล้วให้นักเรียนพูดประโยคใหม่ตามครู"],
          teacherTalk: ["Listen first.", "Repeat after me.", "This is the word.", "Now change the word."],
          studentAction: ["นักเรียนฟังเสียงคำศัพท์", "นักเรียนพูดตามเป็นกลุ่ม", "นักเรียนดูภาพและคำคู่กัน", "นักเรียนพูดประโยคตามตัวอย่าง"],
          expected: ["นักเรียนเห็นความสัมพันธ์ระหว่างภาพ คำ และประโยค", "นักเรียนออกเสียงได้มั่นใจขึ้นเพราะมีครูสาธิตชัดเจน"],
          worksheetType: "trace-and-match",
        },
        {
          id: "listen-point",
          name: "Listen and Point",
          stage: "Practice",
          progression: "controlled-listening",
          objective: "นักเรียนฟังคำศัพท์แล้วชี้ภาพให้ถูกต้อง",
          materials: ["บัตรภาพ {wordList}", "บัตรคำศัพท์", "กระดาน"],
          teacherActions: ["ครูติดบัตรภาพ 5-6 ใบบนกระดาน", "ครูพูดคำศัพท์ทีละคำอย่างช้าและชัด", "ครูสุ่มนักเรียนออกมาชี้ภาพหน้าชั้นโดยเริ่มจากคนที่พร้อม"],
          procedure: ["ครูติดบัตรภาพบนกระดานให้มองเห็นชัดเจน", "ครูพูดคำศัพท์หนึ่งคำแล้วหยุดรอ", "นักเรียนชี้ภาพพร้อมกันจากที่นั่ง", "ครูเรียกนักเรียนที่พร้อมออกมาชี้ภาพ", "ทั้งห้องพูดคำศัพท์ตามครูอีก 1 รอบ"],
          teacherTalk: ["Listen carefully.", "Point to {firstWord}.", "Very good.", "Try again."],
          studentAction: ["นักเรียนฟังคำศัพท์ก่อน", "นักเรียนชี้ภาพที่ตรงกับคำ", "นักเรียนพูดคำศัพท์ตามครูพร้อมกัน"],
          expected: ["นักเรียนจำคำศัพท์จากภาพได้", "นักเรียนที่ยังไม่กล้าพูดสามารถตอบด้วยการชี้ภาพก่อนได้"],
          worksheetType: "matching",
        },
        {
          id: "repeat-change",
          name: "Repeat and Change",
          stage: "Practice",
          progression: "controlled-speaking",
          objective: "นักเรียนพูดประโยคสั้น ๆ โดยเปลี่ยนคำศัพท์ในช่องว่างได้",
          materials: ["แถบประโยค {sentenceFrame}", "บัตรคำศัพท์", "บัตรภาพ"],
          teacherActions: ["ครูติดแถบประโยคบนกระดาน", "ครูอ่านนำและชี้ทีละคำ", "ครูเปลี่ยนบัตรภาพเพื่อให้เด็กเปลี่ยนคำในประโยค"],
          procedure: ["ครูติดแถบประโยคบนกระดานและอ่านนำ 1 รอบ", "นักเรียนพูดตามพร้อมกัน 2 รอบ", "ครูเปลี่ยนบัตรภาพหรือบัตรคำทีละใบ", "นักเรียนพูดประโยคใหม่โดยใช้คำบนบัตร", "ครูให้แถวซ้ายและแถวขวาพูดสลับกัน"],
          teacherTalk: ["Repeat after me.", "Change the word.", "Say it together.", "Try again slowly."],
          studentAction: ["นักเรียนดูแถบประโยค", "นักเรียนพูดตามครูพร้อมกัน", "นักเรียนเปลี่ยนคำศัพท์ตามบัตรภาพ", "นักเรียนพูดเป็นกลุ่มเล็กตามแถว"],
          expected: ["นักเรียนใช้ sentence frame ได้แม้ยังต้องดูบัตรช่วย", "นักเรียนเริ่มพูดประโยคเองได้จากรูปแบบซ้ำ ๆ"],
          worksheetType: "fill-in-the-blank",
        },
        {
          id: "guided-pair-drill",
          name: "Guided Pair Drill",
          stage: "Practice",
          progression: "supported-pair-practice",
          objective: "นักเรียนถาม-ตอบกับเพื่อนโดยดูบัตรช่วยได้",
          materials: ["บัตรบทสนทนา", "บัตรภาพ", "บัตรคำถามและคำตอบ"],
          teacherActions: ["ครูเลือกนักเรียน 1 คนมาสาธิตหน้าชั้น", "ครูให้ทั้งห้องพูดบทสนทนาพร้อมกันก่อน", "ครูเดินฟังทีละคู่และช่วยบอกคำที่เด็กนึกไม่ออก"],
          procedure: ["ครูสาธิตกับนักเรียน 1 คนหน้าชั้นเรียน", "นักเรียนจับคู่และรับบัตรภาพคนละ 1 ใบ", "ทั้งห้องอ่านบทสนทนาตามครู 1 รอบ", "นักเรียนฝึกเป็นคู่ 3 นาที", "นักเรียนสลับบทบาทถามและตอบ"],
          teacherTalk: ["Work in pairs.", "Ask your friend.", "Answer with a short sentence.", "You can look at the card."],
          studentAction: ["นักเรียนจับคู่กับเพื่อน", "นักเรียนคนหนึ่งถามและอีกคนตอบ", "นักเรียนใช้บัตรช่วยเมื่อลืมคำศัพท์", "นักเรียนสลับบทบาทกับเพื่อน"],
          expected: ["นักเรียนพูดโต้ตอบสั้น ๆ ได้", "ผู้เรียนพื้นฐานอ่อนตอบเป็นคำเดี่ยวก่อน แล้วค่อยเพิ่มเป็นประโยคได้"],
          worksheetType: "dialogue-practice",
        },
        {
          id: "mini-communication-task",
          name: "Mini Communication Task",
          stage: "Production",
          progression: "freer-communication",
          objective: "นักเรียนใช้คำศัพท์และประโยคสั้น ๆ คุยกับเพื่อนได้",
          materials: ["บัตรภาพ 2 ใบต่อคู่", "บัตร sentence frames", "บัตรคำศัพท์"],
          teacherActions: ["ครูจัดมุมบัตรภาพไว้หน้าห้อง", "ครูให้แต่ละคู่เลือกบัตรภาพ 2 ใบ", "ครูปล่อยให้เด็กลองพูดเองก่อน แล้วค่อยช่วยเมื่อเด็กติด"],
          procedure: ["ครูสาธิตบทสนทนากับนักเรียน 1 คนหน้าชั้นเรียน", "นักเรียนจับคู่และเลือกบัตรภาพ 2 ใบ", "นักเรียนใช้กรอบประโยค {sentenceFrame} พูดกับเพื่อน", "นักเรียนสลับบทบาทถาม-ตอบ", "คู่ที่พร้อมออกมาพูดหน้าชั้น 1 รอบ"],
          teacherTalk: ["Work in pairs.", "Speak slowly.", "You can look at the sentence card.", "If you need help, raise your hand."],
          studentAction: ["นักเรียนเลือกบัตรภาพเอง", "นักเรียนถาม-ตอบกับเพื่อนตามกรอบประโยค", "นักเรียนพูดช้า ๆ และชี้บัตรภาพประกอบ", "นักเรียนพื้นฐานอ่อนพูดคำเดี่ยวก่อน แล้วค่อยพูดประโยค"],
          expected: ["นักเรียนใช้ภาษาอังกฤษในสถานการณ์ง่าย ๆ ได้", "นักเรียนมีความมั่นใจเพราะมีบัตรภาพและกรอบประโยคช่วย"],
          worksheetType: "speaking-card",
        },
        {
          id: "exit-picture-say",
          name: "Exit Picture Say",
          stage: "Wrap-up",
          progression: "quick-review",
          objective: "นักเรียนทบทวนคำศัพท์หรือประโยคก่อนจบบทเรียนได้",
          materials: ["บัตรภาพ", "บัตรคำศัพท์", "ประโยคบนกระดาน"],
          teacherActions: ["ครูชูบัตรภาพแบบเร็วทีละใบ", "ครูให้ตัวช่วยด้วยเสียงต้นคำเมื่อนักเรียนตอบไม่ได้", "ครูให้เด็กเลือกพูดคำศัพท์ 1 คำหรือประโยค 1 ประโยคก่อนจบคาบ"],
          procedure: ["ครูชูบัตรภาพทีละใบและให้นักเรียนตอบพร้อมกัน", "ครูลบคำบางคำจากประโยคบนกระดาน", "นักเรียนช่วยกันเติมคำจากบัตรภาพ", "นักเรียนเลือกพูดคำศัพท์หรือประโยคกับครู", "ครูชมและจดคำที่ควรทบทวนคาบถัดไป"],
          teacherTalk: ["What is this?", "Say one word.", "Complete the sentence.", "Good try."],
          studentAction: ["นักเรียนตอบคำศัพท์พร้อมกัน", "นักเรียนช่วยเติมคำในประโยค", "นักเรียนพูดกับครูแบบสั้น ๆ ก่อนจบคาบ"],
          expected: ["ครูเห็นคำศัพท์ที่นักเรียนจำได้ทันที", "นักเรียนจบบทเรียนด้วยความสำเร็จเล็ก ๆ"],
          worksheetType: "exit-ticket",
        },
      ],
    },
  },
  general: {
    core: {
      beginner: [
        {
          id: "look-think-answer",
          name: "ดูภาพ คิดคำตอบ",
          stage: "Warm-up",
          progression: "attention-recall",
          objective: "นักเรียนสังเกตภาพหรือของจริงแล้วตอบคำถามจากสิ่งที่เห็นได้",
          materials: ["ภาพประกอบ", "ของจริงที่เกี่ยวกับหัวข้อ", "กระดาน"],
          teacherActions: ["ครูถือภาพหรือของจริงขึ้นมา", "ครูถามคำถามสั้น ๆ จากสิ่งที่เด็กเห็น", "ครูเขียนคำตอบสำคัญ 2-3 คำบนกระดาน"],
          procedure: ["ครูถือภาพหรือของจริงให้ทุกคนมองเห็น", "นักเรียนดูเงียบ ๆ 10 วินาที", "ครูถามว่า “นักเรียนเห็นอะไร” หรือ “สิ่งนี้ใช้ทำอะไร”", "นักเรียนตอบทีละคนหรือพร้อมกัน", "ครูสรุปคำตอบสำคัญบนกระดาน"],
          teacherTalk: ["ดูภาพก่อน ยังไม่ต้องรีบตอบ", "เห็นอะไรบ้าง", "ใครมีคำตอบอีกบ้าง"],
          studentAction: ["นักเรียนมองภาพหรือของจริง", "นักเรียนยกมือตอบ", "นักเรียนฟังคำตอบของเพื่อน"],
          expected: ["นักเรียนเริ่มสนใจหัวข้อ", "ครูเห็นพื้นความรู้เดิมของนักเรียน"],
          worksheetType: "short-answer",
        },
        {
          id: "teacher-demo-follow",
          name: "ครูทำให้ดู เด็กทำตาม",
          stage: "Practice",
          progression: "guided-practice",
          objective: "นักเรียนทำงานตามตัวอย่างทีละขั้นได้",
          materials: ["ตัวอย่างงาน", "ใบงาน", "ดินสอหรืออุปกรณ์ตามรายวิชา"],
          teacherActions: ["ครูทำตัวอย่างหน้าชั้นให้ดูช้า ๆ", "ครูหยุดรอหลังแต่ละขั้น", "ครูเดินดูโต๊ะที่ทำช้าก่อน"],
          procedure: ["ครูโชว์ตัวอย่างที่ทำเสร็จแล้ว 1 ชิ้น", "ครูทำขั้นที่ 1 บนกระดานหรือหน้าชั้น", "นักเรียนทำขั้นเดียวกันในใบงาน", "ครูทำขั้นต่อไปและให้นักเรียนทำตาม", "นักเรียนจับคู่ตรวจงานเบื้องต้น"],
          teacherTalk: ["ดูครูก่อนนะคะ/ครับ", "ทำข้อแรกพร้อมกัน", "ใครยังไม่เสร็จไม่เป็นไร ครูรอ", "ลองตรวจคำตอบกับเพื่อนข้าง ๆ"],
          studentAction: ["นักเรียนดูตัวอย่าง", "นักเรียนทำตามทีละขั้น", "นักเรียนยกมือถามเมื่อทำไม่ทัน", "นักเรียนช่วยเพื่อนตรวจงาน"],
          expected: ["นักเรียนทำงานได้ถูกขั้นตอน", "นักเรียนที่เรียนช้าตามเพื่อนได้มากขึ้น"],
          worksheetType: "guided-task",
        },
        {
          id: "small-group-share",
          name: "ช่วยกันทำ ช่วยกันเล่า",
          stage: "Production",
          progression: "small-group-output",
          objective: "นักเรียนช่วยกันสรุปคำตอบหรือทำชิ้นงานกลุ่มเล็กได้",
          materials: ["กระดาษกลุ่ม", "สีหรือดินสอ", "บัตรคำถาม"],
          teacherActions: ["ครูแบ่งกลุ่ม 3-4 คน", "ครูแจกหน้าที่ง่าย ๆ ให้แต่ละคน", "ครูเดินฟังและถามนำเมื่อกลุ่มติดขัด"],
          procedure: ["ครูแบ่งนักเรียนเป็นกลุ่มเล็ก", "นักเรียนเลือกคนวาด คนเขียน และคนพูด", "กลุ่มช่วยกันทำงาน 5-7 นาที", "ตัวแทนกลุ่มยืนที่โต๊ะแล้วเล่าให้เพื่อนฟังสั้น ๆ", "ครูชมจุดที่ทำได้ดีและเติมคำตอบที่ยังขาด"],
          teacherTalk: ["คนหนึ่งวาด คนหนึ่งเขียน คนหนึ่งช่วยพูดนะคะ/ครับ", "คุยกันเบา ๆ ในกลุ่ม", "เล่าสั้น ๆ ก็ได้ ไม่ต้องยาว"],
          studentAction: ["นักเรียนแบ่งหน้าที่", "นักเรียนช่วยกันทำงาน", "นักเรียนเล่าคำตอบของกลุ่มแบบสั้น ๆ"],
          expected: ["นักเรียนทุกคนมีบทบาทในกลุ่ม", "นักเรียนกล้าพูดจากงานที่ตนเองช่วยทำ"],
          worksheetType: "group-summary",
        },
        {
          id: "quick-exit-ticket",
          name: "Exit Ticket สั้น ๆ",
          stage: "Wrap-up",
          progression: "lesson-review",
          objective: "นักเรียนสรุปสิ่งที่เรียนรู้ก่อนจบบทเรียนได้",
          materials: ["กระดาษแผ่นเล็ก", "กระดาน", "ดินสอ"],
          teacherActions: ["ครูชี้คำสำคัญบนกระดานทีละคำ", "ครูถามสรุปด้วยคำถามสั้น ๆ", "ครูให้นักเรียนเขียนหรือพูดคำตอบ 1 ข้อก่อนออกจากห้อง"],
          procedure: ["ครูถามว่า “วันนี้เราได้เรียนอะไรบ้าง”", "นักเรียนตอบสั้น ๆ ทีละคนหรือพร้อมกัน", "นักเรียนเขียนคำสำคัญ 1 คำ วาดภาพ 1 ภาพ หรือพูดสรุป 1 ประโยค", "ครูตรวจเร็ว ๆ และชมความพยายาม", "ครูบอกงานสั้น ๆ สำหรับทบทวน"],
          teacherTalk: ["วันนี้เราได้เรียนอะไรบ้าง", "เลือกเขียน 1 คำ หรือวาด 1 ภาพก็ได้", "ขอบคุณที่ตั้งใจเรียน"],
          studentAction: ["นักเรียนตอบคำถามสรุป", "นักเรียนทำ exit ticket", "นักเรียนส่งคำตอบก่อนออกจากห้อง"],
          expected: ["ครูตรวจความเข้าใจท้ายคาบได้ทันที", "นักเรียนสรุปบทเรียนด้วยภาษาของตนเองได้"],
          worksheetType: "exit-ticket",
        },
      ],
    },
  },
};

activityLibrary.english.speaking = activityLibrary.english.vocabulary;
activityLibrary.english.listening = activityLibrary.english.vocabulary;
activityLibrary.english.reading = activityLibrary.english.vocabulary;
activityLibrary.english.writing = activityLibrary.english.vocabulary;

function normalizeSkillKey(skill) {
  const value = String(skill || "").toLowerCase();
  if (value.includes("พูด") || value.includes("speaking")) return "speaking";
  if (value.includes("ฟัง") || value.includes("listening")) return "listening";
  if (value.includes("อ่าน") || value.includes("reading")) return "reading";
  if (value.includes("เขียน") || value.includes("writing")) return "writing";
  if (value.includes("ศัพท์") || value.includes("vocabulary")) return "vocabulary";
  return "vocabulary";
}

function normalizeLevelKey(studentLevel) {
  const value = String(studentLevel || "").toLowerCase();
  if (value.includes("อ่อน") || value.includes("beginner")) return "beginner";
  if (value.includes("มั่นใจ") || value.includes("advanced")) return "beginner";
  return "beginner";
}

function getActivities({ subject, skill, studentLevel, stage }) {
  const subjectKey = isEnglishSubject(subject) ? "english" : "general";
  const skillKey = normalizeSkillKey(skill);
  const levelKey = normalizeLevelKey(studentLevel);
  const subjectLibrary = activityLibrary?.[subjectKey] || activityLibrary.general;
  const skillLibrary = subjectLibrary?.[skillKey] || subjectLibrary?.vocabulary || subjectLibrary?.core || {};
  const activities = asArray(skillLibrary?.[levelKey], asArray(skillLibrary?.beginner, []));

  return activities.filter((activity) => !stage || activity?.stage === stage);
}

function fillActivityText(value, context) {
  const vocabularyWords = asArray(context.vocabularyWords, ["hello"]);
  const sentenceFrames = asArray(context.sentenceFrames, ["This is ___."]);
  return String(value || "")
    .replaceAll("{topic}", context.topic || "หัวข้อบทเรียน")
    .replaceAll("{firstWord}", vocabularyWords[0] || "hello")
    .replaceAll("{wordList}", vocabularyWords.slice(0, 6).join(", ") || "hello, teacher")
    .replaceAll("{sentenceFrame}", sentenceFrames[0] || "This is ___.");
}

function fillActivityList(items, context) {
  return asArray(items, ["ครูสาธิตกิจกรรมและให้นักเรียนทำตามทีละขั้น"]).map((item) => fillActivityText(item, context));
}

function expandActivityTemplate(activity, context, number) {
  const template = activity || {};
  return makeActivityCard({
    title: `กิจกรรมที่ ${number} : ${template.name || "กิจกรรมฝึกปฏิบัติ"}`,
    objective: fillActivityList([template.objective], context),
    teacherActions: fillActivityList(template.teacherActions, context),
    materials: fillActivityList(template.materials, context),
    steps: fillActivityList(template.procedure, context),
    teacherTalk: fillActivityList(template.teacherTalk, context),
    studentActions: fillActivityList(template.studentAction, context),
    expected: fillActivityList(template.expected, context),
  });
}

function buildLesson(form, templates) {
  const safeForm = { ...defaultForm, ...form };
  const lessonFrames = templates?.lessonFrames || {};
  const activityTemplates = templates?.activityTemplates || {};
  const unitFrame = normalizeUnitFrame(lessonFrames[safeForm.learningUnit]);
  const activityFrame = normalizeActivityFrame(activityTemplates[safeForm.activityType]);
  const topics = asArray(unitFrame.topics, fallbackUnitFrame.topics);
  const topic = safeForm.lessonTopic || topics[0] || "หัวข้อบทเรียนตัวอย่าง";
  const vocabularyItems = makeVocabularyItems(unitFrame, topic);
  const vocabularyWords = vocabularyItems.map((item) => item.word);
  const sentenceFrames = makeSentenceFrames(unitFrame.speakingFocus);
  const dialogue = makeDialogue(topic, vocabularyItems);
  const practiceActivity = safeForm.activityType || "ฝึกสนทนาเป็นคู่";
  const activityContext = { topic, vocabularyWords, sentenceFrames };
  let activityNumber = 1;
  const selectActivityCards = (stage, limit = 1) => {
    const selectedActivities = getActivities({
      subject: safeForm.subject,
      skill: safeForm.targetSkill,
      studentLevel: safeForm.studentLevel,
      stage,
    }).slice(0, limit);
    return selectedActivities.map((activity) => expandActivityTemplate(activity, activityContext, activityNumber++));
  };
  const basicInfo = [
    `รายวิชา: ${safeForm.subject}`,
    `ระดับชั้น: ${safeForm.gradeLevel}`,
    `หน่วยการเรียนรู้: หน่วยที่ ${unitFrame.unitNumber} ${safeForm.learningUnit}`,
    `หัวข้อการเรียน: ${topic}`,
    `ภาคเรียน: ${unitFrame.semester}`,
    `เวลาเรียน: ${unitFrame.totalHours} ชั่วโมง`,
    `ระดับผู้เรียน: ${safeForm.studentLevel}`,
    `ทักษะที่เน้น: ${safeForm.targetSkill}`,
    `รูปแบบกิจกรรม: ${practiceActivity}`,
  ];

  if (!isEnglishSubject(safeForm.subject)) {
    return [
      {
        title: "ข้อมูลพื้นฐาน",
        content: basicInfo,
      },
      {
        title: "จุดประสงค์การเรียนรู้",
        content: [
          `นักเรียนสามารถอธิบายความรู้สำคัญของหัวข้อ “${topic}” ด้วยภาษาของตนเองได้อย่างเหมาะสมกับระดับชั้น`,
          `นักเรียนสามารถปฏิบัติกิจกรรมการเรียนรู้ตามขั้นตอนที่ครูกำหนด โดยใช้สื่อหรือใบงานประกอบการเรียนได้`,
          `นักเรียนสามารถสรุปสิ่งที่เรียนรู้ แลกเปลี่ยนความคิดเห็นกับเพื่อน และแสดงพฤติกรรมการเรียนรู้ที่รับผิดชอบ`,
        ],
      },
      {
        title: "กระบวนการจัดการเรียนรู้",
        content: [
          `ขั้นนำเข้าสู่บทเรียน: ครูถือภาพหรือของจริงที่เกี่ยวกับ “${topic}” ขึ้นมา 1 ชิ้น แล้วถามนักเรียนสั้น ๆ ว่า “นักเรียนเคยเห็นสิ่งนี้ไหม” หรือ “สิ่งนี้ใช้ทำอะไร” นักเรียนตอบได้ทั้งคำสั้น ๆ หรือยกมือชี้ภาพ`,
          `ครูเขียนคำตอบของนักเรียน 2-3 คำบนกระดาน แล้วบอกว่า “วันนี้เราจะลองเรียนเรื่องนี้จากของใกล้ตัวของเรา” จากนั้นครูบอกเป้าหมายบทเรียนด้วยประโยคสั้น ๆ`,
          ...selectActivityCards("Warm-up", 1),
          `ขั้นจัดกิจกรรมการเรียนรู้ / ขั้นสอน: ครูใช้ภาพ ตัวอย่างจริง หรือแผนผังง่าย ๆ อธิบายหัวข้อ “${topic}” ทีละจุด หลังอธิบาย 1 จุด ครูหยุดถามนักเรียน 1 คำถาม เพื่อเช็กว่าเด็กตามทันหรือไม่`,
          ...selectActivityCards("Practice", 1),
          ...selectActivityCards("Production", 1),
          `ขั้นสรุปบทเรียน: ครูชี้คำสำคัญบนกระดานทีละคำ แล้วถามว่า “วันนี้เราได้เรียนอะไรบ้าง” นักเรียนตอบสั้น ๆ ได้ทีละคนหรือพร้อมกันทั้งห้อง`,
          `นักเรียนทำ exit ticket แบบเร็ว เช่น เขียนคำสำคัญ 1 คำ วาดภาพ 1 ภาพ หรือพูดสรุป 1 ประโยคก่อนออกจากห้อง`,
          ...selectActivityCards("Wrap-up", 1),
          `ครูเฉลยหรือสรุปความเข้าใจที่ถูกต้องบนกระดาน ชมเชยความพยายาม และมอบหมายใบงานหรือภาระงานสั้น ๆ ที่สอดคล้องกับหัวข้อ “${topic}”`,
        ],
      },
      {
        title: "สื่อ/อุปกรณ์",
        content: [
          "ภาพประกอบหรือบัตรภาพที่เกี่ยวข้องกับหัวข้อ",
          "ใบงานหนึ่งหน้า สำหรับสำรวจ ตอบคำถาม และสรุปความเข้าใจ",
          "กระดานและปากกา สำหรับเขียนคำสำคัญ แผนผัง หรือขั้นตอนกิจกรรม",
          "สิ่งของจริงหรือสื่อในห้องเรียนที่หาได้ง่ายในบริบทโรงเรียนประถม",
        ],
      },
      {
        title: "ใบงานตัวอย่าง",
        content: [
          `ชื่อใบงาน: ใบงานเรื่อง ${topic}`,
          "คำชี้แจง: ให้นักเรียนอ่านคำถาม สังเกตภาพหรือข้อมูล แล้วตอบด้วยข้อความสั้น ๆ หรือวาดภาพประกอบตามที่ครูกำหนด",
          "กิจกรรมที่ 1: เขียนคำสำคัญจากบทเรียน 3 คำ และอธิบายความหมายสั้น ๆ",
          "กิจกรรมที่ 2: ตอบคำถามจากสถานการณ์หรือภาพประกอบ 3 ข้อ",
          "กิจกรรมที่ 3: สรุปสิ่งที่ได้เรียนรู้ 1 ประโยค หรือวาดภาพสรุปความเข้าใจ",
          "เฉลยสำหรับครู: ตรวจจากความถูกต้องของแนวคิด ความเชื่อมโยงกับบทเรียน และความพยายามในการอธิบาย ไม่จำเป็นต้องใช้ถ้อยคำเหมือนกันทุกคน",
        ],
      },
      {
        title: "การวัดและประเมินผล",
        content: [
          "สิ่งที่ประเมิน: ความเข้าใจเนื้อหา การมีส่วนร่วม การทำงานตามขั้นตอน และการสรุปความรู้",
          "วิธีประเมิน: ใช้การสังเกตระหว่างกิจกรรม ตรวจใบงาน และฟังการนำเสนอหรือคำตอบสั้น ๆ ของนักเรียน",
          "Checklist แบบง่าย: 1 = ต้องช่วยมาก, 2 = ทำได้เมื่อมีตัวอย่าง, 3 = ทำได้ด้วยตนเอง สำหรับรายการ เข้าใจเนื้อหา, ทำกิจกรรม, สื่อสารความคิด, รับผิดชอบงาน",
        ],
      },
      {
        title: "ข้อเสนอแนะสำหรับครู",
        content: [
          "ควรใช้คำสั่งสั้น ชัดเจน และสาธิตตัวอย่างก่อนให้นักเรียนลงมือทำ เพื่อลดความสับสนของผู้เรียนระดับประถมศึกษา",
          "สำหรับนักเรียนที่ต้องการความช่วยเหลือ ให้จับคู่กับเพื่อนที่พร้อมช่วยอ่านคำถามหรืออธิบายขั้นตอน โดยเน้นบรรยากาศช่วยเหลือกัน",
          "ควรแบ่งกิจกรรมเป็นช่วงสั้น ๆ และให้คำชมระหว่างทาง เพื่อรักษาความสนใจและความมั่นใจของนักเรียน",
        ],
      },
    ];
  }

  return [
    {
      title: "ข้อมูลพื้นฐาน",
      content: basicInfo,
    },
    {
      title: "คำศัพท์สำคัญประจำบทเรียน",
      content: [
        ...vocabularyItems.map((item) => `${item.word} = ${item.meaning}`),
      ],
    },
    {
      title: "จุดประสงค์การเรียนรู้",
      content: [
        `เมื่อจบบทเรียน นักเรียนสามารถบอกความหมายของคำศัพท์เกี่ยวกับ “${topic}” ได้อย่างน้อย ${Math.min(6, vocabularyItems.length)} คำ โดยดูจากบัตรภาพหรือสิ่งของจริง`,
        `นักเรียนสามารถออกเสียงคำศัพท์สำคัญ เช่น ${vocabularyWords.slice(0, 5).join(", ")} ได้ชัดเจนขึ้น โดยครูเน้นเสียงต้นคำและจังหวะการออกเสียงอย่างช้า ๆ`,
        `นักเรียนสามารถใช้รูปประโยคสั้น ๆ ในสถานการณ์ใกล้ตัวได้ เช่น ${sentenceFrames.slice(0, 3).join(" / ")}`,
        `นักเรียนสามารถร่วมกิจกรรม ${practiceActivity} กับเพื่อนอย่างสุภาพ กล้าลองพูด และรับฟังเพื่อนในชั้นเรียน`,
      ],
    },
    {
      title: "กระบวนการจัดการเรียนรู้แบบ 2W3P",
      content: [
        `Warm-up (ขั้นนำเข้าสู่บทเรียน): ครูถือบัตรภาพขึ้นมา 1 ใบโดยยังไม่บอกคำศัพท์ แล้วถามว่า “What do you see?” นักเรียนตอบได้ทั้งภาษาไทยหรือคำอังกฤษสั้น ๆ ครูรับคำตอบและชี้ภาพซ้ำเพื่อดึงความสนใจ`,
        `ครูทำท่าทางประกอบคำศัพท์ 2-3 คำ เช่น ชี้ตัวเอง ชี้เพื่อน หรือชี้ภาพ แล้วให้นักเรียนเดาคำจากท่าทางก่อน ครูไม่รีบเฉลย เพื่อให้เด็กกล้าตอบ`,
        `ครูพูดว่า “วันนี้เราจะฟัง ดูภาพ และพูดตามครูทีละนิด ถ้าตอบได้แค่คำเดียวก็ใช้ได้ค่ะ/ครับ” จากนั้นให้นักเรียนปรบมือ 1 ครั้งเมื่อเห็นภาพที่รู้จัก`,
        ...selectActivityCards("Warm-up", 1),
        `Presentation (ขั้นนำเสนอ): ครูชูบัตรภาพทีละใบ พูดคำศัพท์ช้า ๆ 2 รอบ เช่น ${vocabularyWords[0] || "hello"} แล้วให้นักเรียนพูดตามพร้อมกัน ครูชี้ที่ปากของตนเองเพื่อให้เด็กดูรูปปาก`,
        `ครูติดบัตรคำใต้ภาพ แล้วพูดความหมายไทยสั้น ๆ จากนั้นใช้คำในประโยคตัวอย่าง เช่น ${vocabularyItems[0]?.example || "This is a book."} นักเรียนพูดตามทั้งห้องก่อน แล้วครูสุ่ม 2-3 คนพูดเดี่ยว`,
        `ครูเขียนรูปประโยคบนกระดาน: ${sentenceFrames.slice(0, 3).join(" / ")} แล้วขีดเส้นใต้ช่องว่าง ครูสาธิตการเปลี่ยนคำด้วยบัตรภาพ เช่น เปลี่ยนภาพแล้วพูดประโยคใหม่`,
        `ถ้านักเรียนออกเสียงยาก ครูแบ่งคำเป็นช่วงสั้น ๆ ให้พูดตาม เช่น ครูพูดครึ่งคำก่อน แล้วค่อยรวมเป็นคำเต็ม ครูใช้คำชมสั้น ๆ เช่น Good try. Try again. เพื่อให้เด็กไม่กลัวผิด`,
        ...selectActivityCards("Presentation", 1),
        "Practice (ขั้นฝึกปฏิบัติ): ครูพานักเรียนฝึกใช้คำศัพท์และรูปประโยคอย่างเป็นขั้นตอน จากการฟังและชี้ภาพ ไปสู่การพูดตามและฝึกกับเพื่อน โดยครูยังคอยช่วยเหลือใกล้ชิด",
        ...selectActivityCards("Practice", 3),
        `กิจกรรมจากโครงสร้างหลักสูตร: ${unitFrame.classroomActivities[0] || activityFrame.classroomActivity}`,
        "Production (ขั้นนำไปใช้): นักเรียนใช้ภาษาอย่างอิสระมากขึ้นผ่านกิจกรรมสื่อสาร โดยครูจัดคู่หรือกลุ่มเล็กเพื่อให้เด็กได้พูดหลายครั้งในบรรยากาศเป็นกันเอง",
        ...selectActivityCards("Production", 1),
        `Wrap-up (ขั้นสรุป): ครูชูบัตรภาพแบบเร็วทีละใบ ให้นักเรียนตอบพร้อมกัน ถ้าตอบไม่ได้ครูพูดเสียงต้นคำให้ เช่น “h...” แล้วให้นักเรียนลองตอบอีกครั้ง`,
        `ครูลบคำบางคำออกจากประโยคบนกระดาน เช่น ${sentenceFrames[0] || "This is ___."} แล้วให้นักเรียนช่วยกันเติมคำจากบัตรภาพ`,
        `ก่อนจบคาบ นักเรียนเลือกพูดคำศัพท์ 1 คำ หรือประโยค 1 ประโยคกับครูที่หน้าประตู สำหรับเด็กที่ยังไม่พร้อมให้ชี้ภาพและพูดคำเดียวก่อน`,
        ...selectActivityCards("Wrap-up", 1),
      ],
    },
    {
      title: "ตัวอย่างบทสนทนา",
      content: [
        ...dialogue,
        `Question patterns: ${sentenceFrames.filter((frame) => frame.includes("?")).join(" / ") || "What is this? / Do you like ___?"}`,
        `Answer patterns: ${sentenceFrames.filter((frame) => !frame.includes("?")).slice(0, 4).join(" / ")}`,
      ],
    },
    {
      title: "สื่อ/อุปกรณ์",
      content: [
        `Flashcards: บัตรคำศัพท์ชุด ${vocabularyWords.join(", ")} ขนาดใหญ่พอให้นักเรียนหลังห้องมองเห็น`,
        `Picture cards: บัตรภาพตรงกับคำศัพท์ทุกคำ ใช้สำหรับชี้ภาพ จับคู่ และฝึกถาม-ตอบ`,
        `Word cards และ sentence strips: บัตรคำและแถบประโยค ${sentenceFrames.slice(0, 3).join(" / ")} สำหรับติดบนกระดานและให้เด็กเปลี่ยนคำในช่องว่าง`,
        `PowerPoint: สไลด์ภาพทีละคำ พร้อมคำศัพท์และประโยคตัวอย่าง ใช้เฉพาะภาพชัด ๆ ไม่ใส่ข้อความมากเกินไป`,
        `Worksheet: ใบงานหนึ่งหน้า มีจับคู่ภาพ เติมคำ และเขียนประโยคสั้น ๆ ตามระดับผู้เรียน`,
        `Board writing: เขียน Unit, Topic, Words, Pattern และตัวอย่างบทสนทนาไว้เป็นมุมอ้างอิงตลอดคาบ`,
        `Classroom objects หรือสิ่งของใกล้ตัว: ใช้ของจริงในห้องเรียนหรือภาพจากบริบทโรงเรียนชนบท เพื่อช่วยให้นักเรียนเข้าใจโดยไม่ต้องแปลทุกคำ`,
        `เพลงหรือวิดีโอสั้น: ใช้ได้เมื่อเกี่ยวข้องกับหัวข้อและมีจังหวะช้า เช่น chant คำศัพท์ 30-60 วินาที เพื่อทบทวนก่อนฝึกพูด`,
      ],
    },
    {
      title: "ใบงานตัวอย่าง",
      content: [
        `ชื่อใบงาน: English Practice Worksheet - ${topic}`,
        `คำชี้แจงสำหรับนักเรียน: ให้นักเรียนดูภาพ อ่านคำศัพท์ตามครู แล้วทำกิจกรรมทีละข้อ หากอ่านยังไม่คล่องให้ฟังครูอ่านก่อนและพูดตาม`,
        `ตอนที่ 1 จับคู่คำศัพท์กับความหมายหรือภาพ: ใช้คำว่า ${vocabularyWords.slice(0, 6).join(", ")} โดยให้นักเรียนลากเส้นจากคำไปยังภาพที่ถูกต้อง`,
        `ตอนที่ 2 เติมคำในประโยค: ครูให้ประโยค ${sentenceFrames[0] || "This is ___."} จำนวน 4 ข้อ และมีคลังคำศัพท์ให้เลือก เพื่อลดความยากสำหรับผู้เรียนพื้นฐานอ่อน`,
        `ตอนที่ 3 ฝึกเขียนหรือพูด: ให้นักเรียนเลือกคำศัพท์ 1 คำ วาดภาพประกอบ และเขียนประโยคสั้น ๆ 1 ประโยค เช่น ${vocabularyItems[0]?.example || "This is a book."}`,
        `เฉลยสำหรับครู: คำตอบพิจารณาจากการจับคู่ภาพถูกต้อง การเลือกคำศัพท์ตรงกับประโยค และการใช้รูปประโยคที่สื่อความหมายได้ หากสะกดผิดเล็กน้อยแต่สื่อสารได้ ให้ครูให้คำแนะนำเพิ่มเติมแทนการหักคะแนนทั้งหมด`,
        ...unitFrame.worksheetIdeas,
      ],
    },
    {
      title: "การวัดและประเมินผล",
      content: [
        `สิ่งที่ประเมิน: ความเข้าใจคำศัพท์ การออกเสียง การใช้ประโยคสั้น ๆ การร่วมกิจกรรมคู่หรือกลุ่ม และความกล้าลองสื่อสารภาษาอังกฤษ`,
        `วิธีประเมินระหว่างเรียน: ครูใช้การสังเกตขณะนักเรียนทำ Listen and Point, Repeat and Change และ Mini Communication Task โดยบันทึกนักเรียนที่ต้องการความช่วยเหลือเพิ่มเติม`,
        `จุดสังเกตของครู: นักเรียนชี้ภาพถูกต้องหรือไม่ พูดคำศัพท์ตามได้หรือไม่ ใช้ประโยคจากบัตรช่วยได้หรือไม่ ฟังเพื่อนและรอคิวพูดได้หรือไม่`,
        `Checklist แบบง่าย: 1 = ต้องช่วยมาก, 2 = ทำได้เมื่อมีบัตรช่วย, 3 = ทำได้ด้วยตนเอง สำหรับรายการ คำศัพท์, การออกเสียง, ประโยค, การมีส่วนร่วม`,
        `การประเมินท้ายบทเรียน: ให้นักเรียนพูดคำศัพท์ 3 คำ และเลือกใช้ประโยค 1 ประโยคจาก ${sentenceFrames.slice(0, 2).join(" หรือ ")} ครูให้คะแนนแบบให้กำลังใจและจดคำที่ควรทบทวนในคาบถัดไป`,
        activityFrame.assessment,
        ...unitFrame.assessmentIdeas.slice(0, 2),
      ],
    },
    {
      title: "ข้อเสนอแนะสำหรับครู",
      content: [
        `สำหรับผู้เรียนพื้นฐานอ่อน ให้ลดภาระภาษาโดยเริ่มจากการฟังและชี้ภาพก่อน แล้วจึงพูดคำเดี่ยว จากนั้นค่อยเพิ่มเป็นประโยคสั้น ๆ ไม่ควรให้เด็กอ่านประโยคยาวทันที`,
        `การจัดการชั้นเรียนควรใช้คู่ช่วยคู่ โดยจับคู่นักเรียนที่มั่นใจกับนักเรียนที่ยังไม่มั่นใจ และกำหนดเวลาแต่ละกิจกรรมสั้น ๆ ชัดเจน เช่น 3 นาทีสำหรับฝึกคู่ และ 2 นาทีสำหรับนำเสนอ`,
        `การช่วยออกเสียงควรใช้วิธีครูพูดต้นแบบ เด็กพูดตามพร้อมกัน แบ่งคำเป็นช่วงสั้น ๆ และให้กำลังใจด้วยคำว่า Good try. Try again. Excellent. หลีกเลี่ยงการตำหนิเมื่อนักเรียนออกเสียงผิด`,
        `หากสื่อดิจิทัลไม่พร้อม ครูสามารถใช้บัตรภาพวาดเอง กระดานดำ สิ่งของจริงในห้องเรียน และการทำท่าทางแทน PowerPoint ได้ โดยยังคงลำดับ 2W3P เหมือนเดิม`,
        `ควรปิดบทเรียนด้วยความสำเร็จเล็ก ๆ เช่น ให้นักเรียนทุกคนพูดได้อย่างน้อย 1 คำหรือ 1 ประโยค เพื่อสร้างเจตคติที่ดีต่อภาษาอังกฤษ`,
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
  const isVocabularySection = section.title === "คำศัพท์สำคัญประจำบทเรียน";
  const renderActivityList = (title, items, ordered = false) =>
    h("div", { className: "activity-detail", key: title }, [
      h("h5", { key: "heading" }, title),
      h(ordered ? "ol" : "ul", { key: "list" },
        asArray(items, ["ยังไม่มีข้อมูลในส่วนนี้"]).map((item, itemIndex) =>
          h("li", { key: `${title}-${itemIndex}` }, item)
        )
      ),
    ]);
  const renderContent = (item, itemIndex) => {
    if (item && typeof item === "object" && item.type === "activity") {
      return h("div", { className: "activity-card", key: `${section.title}-activity-${itemIndex}` }, [
        h("h4", { key: "title" }, item.title),
        renderActivityList("จุดประสงค์", item.objective),
        renderActivityList("ครูทำอะไร", item.teacherActions),
        renderActivityList("สื่อ/อุปกรณ์", item.materials),
        renderActivityList("ขั้นตอนกิจกรรม", item.steps, true),
        renderActivityList("คำพูด/คำสั่งของครู", item.teacherTalk),
        renderActivityList("สิ่งที่นักเรียนปฏิบัติ", item.studentActions),
        renderActivityList("ผลลัพธ์ที่คาดหวัง", item.expected),
      ]);
    }

    return h("li", { className: "lesson-section-item", key: `${section.title}-${itemIndex}` }, [
      h("span", { className: "lesson-dot", "aria-hidden": "true", key: "dot" }),
      h("span", { key: "text" }, item),
    ]);
  };

  return h("article", { className: "lesson-section-card", key: section.title }, [
    h("div", { className: "mb-4 flex items-center gap-3", key: "heading" }, [
      h(TextIcon, { tone: meta.tone, key: "icon" }, h(ClassroomIcon, { type: meta.icon })),
      h("div", { key: "heading-text" }, [
        h("h3", { className: "font-display text-xl font-black leading-snug text-ink", key: "title" }, section.title),
      ]),
    ]),
    isVocabularySection
      ? h("div", { className: "vocabulary-chip-list", key: "vocab" },
        asArray(section.content, ["ยังไม่มีข้อมูลในส่วนนี้"]).map((item, itemIndex) =>
          h("span", { className: "vocabulary-chip", key: `${section.title}-${itemIndex}` }, item)
        )
      )
      : h("div", { className: "space-y-3 text-sm leading-7 text-slate-600", key: "items" },
        asArray(section.content, ["ยังไม่มีข้อมูลในส่วนนี้"]).map(renderContent)
      ),
  ]);
}

function getLessonSection(lesson, title) {
  return asArray(lesson).find((section) => section.title === title)?.content || [];
}

function formatList(items) {
  return asArray(items, ["ยังไม่มีข้อมูลในส่วนนี้"]).map((item) => {
    if (item && typeof item === "object" && item.type === "activity") {
      return [
        item.title,
        "จุดประสงค์",
        ...asArray(item.objective).map((line) => `- ${line}`),
        "ครูทำอะไร",
        ...asArray(item.teacherActions).map((line) => `- ${line}`),
        "สื่อ/อุปกรณ์",
        ...asArray(item.materials).map((line) => `- ${line}`),
        "ขั้นตอนกิจกรรม",
        ...asArray(item.steps).map((line, index) => `${index + 1}. ${line}`),
        "คำพูด/คำสั่งของครู",
        ...asArray(item.teacherTalk).map((line) => `- “${line.replace(/^“|”$/g, "")}”`),
        "สิ่งที่นักเรียนปฏิบัติ",
        ...asArray(item.studentActions).map((line) => `- ${line}`),
        "ผลลัพธ์ที่คาดหวัง",
        ...asArray(item.expected).map((line) => `- ${line}`),
      ].join("\n");
    }
    return `• ${item}`;
  }).join("\n");
}

function safeFilename(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9ก-๙]+/gi, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || "lesson";
}

function buildLessonPlanText({ form, lesson, selectedUnit }) {
  const safeLesson = asArray(lesson);
  const lines = [
    `รายวิชา: ${form.subject}`,
    `ระดับชั้น: ${form.gradeLevel}`,
    `หน่วยการเรียนรู้: หน่วยที่ ${selectedUnit.unitNumber} ${form.learningUnit}`,
    `หัวข้อการเรียน: ${form.lessonTopic}`,
    `ภาคเรียน: ${selectedUnit.semester}`,
    `เวลาเรียน: ${selectedUnit.totalHours} ชั่วโมง`,
    `ระดับผู้เรียน: ${form.studentLevel}`,
    `ทักษะที่เน้น: ${form.targetSkill}`,
    `รูปแบบกิจกรรม: ${form.activityType}`,
  ];

  safeLesson.forEach((section) => {
    lines.push("", section.title, formatList(section.content));
  });

  return lines.join("\n");
}

function buildWorksheetText({ form, selectedUnit }) {
  const safeUnit = normalizeUnitFrame(selectedUnit);
  const topic = form.lessonTopic || safeUnit.topics[0] || "หัวข้อบทเรียนตัวอย่าง";

  if (!isEnglishSubject(form.subject)) {
    return [
      `ชื่อใบงาน: ใบงานเรื่อง ${topic}`,
      "",
      "คำชี้แจง",
      `ให้นักเรียนทบทวนเนื้อหาจากหน่วยการเรียนรู้ ${form.learningUnit} แล้วทำกิจกรรมตามลำดับ ใบงานนี้ออกแบบสำหรับ ${form.gradeLevel} รายวิชา ${form.subject} ระดับผู้เรียน ${form.studentLevel}`,
      "",
      "คำสำคัญประจำบทเรียน",
      "1. แนวคิดสำคัญของบทเรียน",
      "2. ตัวอย่างหรือสถานการณ์ใกล้ตัว",
      "3. วิธีอธิบายคำตอบด้วยภาษาของตนเอง",
      "",
      "กิจกรรม/แบบฝึกหัด",
      "1. เขียนคำสำคัญจากบทเรียน 3 คำ พร้อมอธิบายสั้น ๆ",
      "2. ดูภาพหรือสถานการณ์ที่ครูกำหนด แล้วตอบคำถาม 3 ข้อ",
      "3. สรุปสิ่งที่ได้เรียนรู้ 1 ประโยค หรือวาดภาพสรุปความเข้าใจ",
      "4. แลกเปลี่ยนคำตอบกับเพื่อน 1 คน แล้วปรับคำตอบของตนเองให้ชัดเจนขึ้น",
      "",
      "เฉลยสำหรับครู",
      "1. พิจารณาคำตอบจากความเข้าใจที่สอดคล้องกับหัวข้อ ไม่จำเป็นต้องใช้ถ้อยคำเหมือนตัวอย่าง",
      "2. ให้คะแนนจากความถูกต้องของแนวคิด การอธิบายเหตุผล และความพยายามในการทำงาน",
      "3. หากนักเรียนตอบสั้นมาก ให้ครูถามต่อด้วยคำถามนำ เช่น เพราะอะไร หรือยกตัวอย่างได้ไหม",
    ].join("\n");
  }

  const vocabularyItems = makeVocabularyItems(safeUnit, topic);
  const vocabulary = vocabularyItems.slice(0, 8);
  const patterns = makeSentenceFrames(safeUnit.speakingFocus).slice(0, 4);
  const exercises = safeUnit.worksheetIdeas;

  return [
    `ชื่อใบงาน: ใบงานภาษาอังกฤษ เรื่อง ${topic}`,
    "",
    "คำชี้แจง",
    `ให้นักเรียนทบทวนคำศัพท์และประโยคสั้น ๆ จากหน่วยการเรียนรู้ ${form.learningUnit} แล้วทำกิจกรรมตามลำดับ หากยังอ่านไม่คล่อง ครูสามารถอ่านนำ ชี้ภาพ และให้นักเรียนพูดตามก่อนทำใบงานได้ ใบงานนี้ออกแบบสำหรับ ${form.gradeLevel} รายวิชา ${form.subject} ระดับผู้เรียน ${form.studentLevel}`,
    "",
    "คำศัพท์สำคัญ",
    vocabulary.map((item, index) => `${index + 1}. ${item.word} = ${item.meaning}`).join("\n"),
    "",
    "รูปประโยคตัวอย่าง",
    patterns.map((pattern, index) => `${index + 1}. ${pattern}`).join("\n"),
    "",
    "กิจกรรม/แบบฝึกหัด",
    [
      `1. จับคู่คำศัพท์กับภาพ: ให้นักเรียนจับคู่คำศัพท์ ${vocabulary.slice(0, 6).map((item) => item.word).join(", ")} กับภาพที่ครูเตรียมไว้`,
      `2. เติมคำในประโยค: ให้นักเรียนเลือกคำศัพท์จากคลังคำมาเติมในรูปประโยค ${patterns[0] || "This is ___."} จำนวน 4 ข้อ`,
      `3. อ่านแล้ววงคำตอบ: ครูเขียนประโยคสั้น ๆ 3 ประโยค นักเรียนวงคำศัพท์ที่ตรงกับภาพ เช่น ${vocabulary[0]?.example || "This is a book."}`,
      `4. วาดและเขียน: ให้นักเรียนเลือกคำศัพท์ 1 คำ วาดภาพประกอบ และเขียนประโยคสั้น ๆ 1 ประโยคตามกรอบที่กำหนด`,
      ...exercises.map((item, index) => `${index + 5}. ${item}`),
    ].join("\n"),
    "",
    "เฉลยสำหรับครู",
    `1. คำตอบของกิจกรรมจับคู่ให้พิจารณาจากความหมายของคำศัพท์ เช่น ${vocabulary.slice(0, 4).map((item) => `${item.word} = ${item.meaning}`).join(", ")}`,
    `2. ประโยคคำตอบควรใช้รูปประโยคตัวอย่าง เช่น ${patterns.join(" / ")}`,
    "3. กิจกรรมเติมคำให้ตรวจว่าคำศัพท์สัมพันธ์กับภาพและรูปประโยค หากสะกดผิดเล็กน้อยแต่สื่อความหมายได้ ให้ครูเขียนคำที่ถูกต้องให้ดูและให้นักเรียนอ่านซ้ำ",
    "4. กิจกรรมวาดและเขียนสามารถรับคำตอบที่สอดคล้องกับหัวข้อ ใช้คำศัพท์เป้าหมาย และนักเรียนสามารถอธิบายภาพของตนเองด้วยคำหรือประโยคสั้น ๆ ได้",
    "5. สำหรับผู้เรียนพื้นฐานอ่อน ครูอาจให้คะแนนจากการชี้ภาพถูกต้อง การอ่านตามครู และความพยายามในการพูด มากกว่าความสมบูรณ์ของการเขียน",
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

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildLessonPlanHtml({ form, lesson, selectedUnit }) {
  const sections = asArray(lesson);
  const renderHtmlItem = (item) => {
    if (item && typeof item === "object" && item.type === "activity") {
      const list = (title, values, tag = "ul") => `
        <div class="activity-detail">
          <h4>${escapeHtml(title)}</h4>
          <${tag}>${asArray(values, ["ยังไม่มีข้อมูลในส่วนนี้"]).map((line) => `<li>${escapeHtml(line)}</li>`).join("")}</${tag}>
        </div>`;
      return `<li class="activity-card">
        <h3>${escapeHtml(item.title)}</h3>
        ${list("จุดประสงค์", item.objective)}
        ${list("ครูทำอะไร", item.teacherActions)}
        ${list("สื่อ/อุปกรณ์", item.materials)}
        ${list("ขั้นตอนกิจกรรม", item.steps, "ol")}
        ${list("คำพูด/คำสั่งของครู", item.teacherTalk)}
        ${list("สิ่งที่นักเรียนปฏิบัติ", item.studentActions)}
        ${list("ผลลัพธ์ที่คาดหวัง", item.expected)}
      </li>`;
    }
    return `<li>${escapeHtml(item)}</li>`;
  };
  const sectionHtml = sections.map((section, index) => `
    <section class="lesson-section">
      <h2>${escapeHtml(section.title)}</h2>
      <ul>
        ${asArray(section.content, ["ยังไม่มีข้อมูลในส่วนนี้"]).map(renderHtmlItem).join("")}
      </ul>
    </section>
  `).join("");

  return `<!doctype html>
  <html lang="th">
    <head>
      <meta charset="UTF-8" />
      <title>แผนการสอน ${escapeHtml(form.lessonTopic)}</title>
      <style>
        body { font-family: "Noto Sans Thai", Tahoma, sans-serif; color: #243044; line-height: 1.7; padding: 32px; }
        h1 { font-size: 24px; margin: 0 0 8px; }
        .meta { border: 1px solid #d8e4f0; border-radius: 14px; padding: 16px; margin: 16px 0 22px; background: #f8fbff; }
        .lesson-section { page-break-inside: avoid; border: 1px solid #d8e4f0; border-radius: 14px; padding: 16px 18px; margin-bottom: 16px; }
        .lesson-section h2 { font-size: 18px; margin: 0 0 10px; color: #39415a; }
        .activity-card { list-style: none; border: 1px solid #d8e4f0; border-radius: 12px; padding: 14px; margin: 12px 0; background: #fbfdff; }
        .activity-card h3 { margin: 0 0 10px; font-size: 16px; color: #39415a; }
        .activity-detail h4 { margin: 10px 0 4px; font-size: 14px; color: #52606f; }
        li { margin-bottom: 8px; }
        @media print { body { padding: 0; } .lesson-section { break-inside: avoid; } }
      </style>
    </head>
    <body>
      <h1>แผนการจัดการเรียนรู้</h1>
      <div class="meta">
        <div>รายวิชา: ${escapeHtml(form.subject)}</div>
        <div>ระดับชั้น: ${escapeHtml(form.gradeLevel)}</div>
        <div>หน่วยการเรียนรู้: หน่วยที่ ${escapeHtml(selectedUnit.unitNumber)} ${escapeHtml(form.learningUnit)}</div>
        <div>หัวข้อการเรียน: ${escapeHtml(form.lessonTopic)}</div>
        <div>ภาคเรียน: ${escapeHtml(selectedUnit.semester)} | เวลาเรียน: ${escapeHtml(selectedUnit.totalHours)} ชั่วโมง</div>
        <div>ระดับผู้เรียน: ${escapeHtml(form.studentLevel)} | ทักษะที่เน้น: ${escapeHtml(form.targetSkill)} | รูปแบบกิจกรรม: ${escapeHtml(form.activityType)}</div>
      </div>
      ${sectionHtml}
    </body>
  </html>`;
}

function downloadWordFile(filename, html) {
  const blob = new Blob(["\ufeff", html], { type: "application/msword;charset=utf-8" });
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

  function downloadLessonPdf() {
    const html = buildLessonPlanHtml({ form, lesson, selectedUnit });
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      setExportNotice("ไม่สามารถเปิดหน้าพิมพ์ PDF ได้ กรุณาอนุญาต popup ในเบราว์เซอร์");
      return;
    }
    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    setExportNotice("เปิดหน้าพิมพ์แล้ว สามารถเลือกบันทึกเป็น PDF ได้");
  }

  function downloadLessonWord() {
    const html = buildLessonPlanHtml({ form, lesson, selectedUnit });
    downloadWordFile(`แผนการสอน-${safeFilename(form.learningUnit)}-${safeFilename(form.lessonTopic)}.doc`, html);
    setExportNotice("ดาวน์โหลดแผนการสอนเป็นไฟล์ Word แล้ว");
  }

  function downloadWorksheet() {
    const text = buildWorksheetText({ form, selectedUnit });
    downloadTextFile(`ใบงาน-${safeFilename(form.learningUnit)}-${safeFilename(form.lessonTopic)}.txt`, text);
    setExportNotice("ดาวน์โหลดใบงานเป็นไฟล์ .txt แล้ว");
  }

  const lessonFrames = templates?.lessonFrames || fallbackTemplates.lessonFrames;
  const fieldOptions = templates?.fieldOptions || fallbackTemplates.fieldOptions;
  const fallbackLearningUnits = asArray(Object.keys(lessonFrames), [defaultForm.learningUnit]);
  const options = {
    gradeLevels: asArray(fieldOptions.gradeLevels, [defaultForm.gradeLevel]),
    subjects: uniqueItems([...subjectOptions, ...asArray(fieldOptions.subjects, [defaultForm.subject])]),
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
          h(SelectField, { id: "subject", label: fieldLabels.subject, value: form.subject, options: options.subjects, onChange: (value) => updateField("subject", value), key: "subject" }),
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
            h("p", { className: "mt-3 max-w-3xl text-sm leading-7 text-slate-600", key: "description" }, "แผนบทเรียนภาษาอังกฤษแบบ 2W3P สำหรับนักเรียนไทย ป.4 มีขั้นตอนสอน คำพูดครู กิจกรรมฝึกปฏิบัติ ใบงาน สื่อ และการประเมินที่นำไปใช้ในห้องเรียนได้ทันที"),
          ]),
          h("div", { className: "lesson-summary-panel", key: "summary" }, [
            h("div", { className: "lesson-summary-row", key: "unit" }, [
              h("span", { key: "label" }, "หน่วยการเรียนรู้"),
            h("strong", { key: "value" }, `หน่วยที่ ${selectedUnit.unitNumber} ${form.learningUnit}`),
            ]),
            h("div", { className: "lesson-summary-row", key: "topic" }, [
              h("span", { key: "label" }, "หัวข้อการเรียน"),
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
          h("button", { className: "lesson-export-button bg-skysoft/80", onClick: downloadLessonPdf, type: "button", key: "lesson-pdf" }, [
            h("span", { "aria-hidden": "true", key: "icon" }, "⇩"),
            h("span", { key: "text" }, "ดาวน์โหลดแผน (PDF)"),
          ]),
          h("button", { className: "lesson-export-button bg-lilac/80", onClick: downloadLessonWord, type: "button", key: "lesson-word" }, [
            h("span", { "aria-hidden": "true", key: "icon" }, "W"),
            h("span", { key: "text" }, "ดาวน์โหลดแผน (Word)"),
          ]),
          h("button", { className: "lesson-export-button bg-butter/80", onClick: downloadWorksheet, type: "button", key: "worksheet-download" }, [
            h("span", { "aria-hidden": "true", key: "icon" }, "✎"),
            h("span", { key: "text" }, "ดาวน์โหลดใบงาน"),
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
            h("strong", { key: "value" }, `${asArray(lesson).length} ส่วน`),
          ]),
        ]),
        h("div", { className: "lesson-section-stack mt-6", key: "cards" },
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
