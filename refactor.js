const fs = require('fs');
const path = require('path');

const translateMap = {
  "Mengapa Saya Menonton Begitu Banyak Pornografi?": "Why do I watch so much pornography?",
  "Mari kita pelajari bersama tentang dampak dan cara mengatasi kecanduan pornografi": "Let's learn together about the impact and how to overcome pornography addiction",
  "Pornografi melepaskan sejumlah besar bahan kimia yang disebut dopamin. Dopaminlah yang membuat kita merasa baik. Dopamin membuat kita merasa hidup.": "Pornography releases large amounts of a chemical called dopamine. Dopamine is what makes us feel good. Dopamine makes us feel alive.",
  "Saya butuh pelepasan": "I need a release",
  "Namun pornografi melepaskan lebih banyak dopamin daripada yang bisa ditangani oleh otak kita, membuat otak kita mati rasa dan kurang sensitif dari waktu ke waktu.": "However, pornography releases more dopamine than our brains can handle, making our brains numb and less sensitive over time.",
  "Saya butuh perasaan itu": "I need that feeling",
  "Semakin banyak pornografi yang kamu tonton, semakin banyak dopamin yang dibutuhkan otak kamu untuk merasa baik. Inilah sebabnya pornografi tidak memuaskanmu seperti dulu.": "The more pornography you watch, the more dopamine your brain needs to feel good. This is why pornography is not as satisfying as it used to be.",
  "Saya butuh lebih banyak": "I need more",
  "Semua ini terjadi tanpa sadar dan membuat Anda merasa hampa, stres, dan kesepian.": "All this happens unconsciously and leaves you feeling empty, stressed, and lonely.",
  "Pornografi itu seperti obat.": "Pornography is like a drug.",
  "Kembali": "Back",
  "Lanjutkan": "Continue",
  "Pada usia berapa kamu pertama kali menonton pornografi?": "At what age did you first watch pornography?",
  "10 tahun atau lebih muda": "10 years old or younger",
  "11 - 12 tahun": "11 - 12 years old",
  "13 - 14 tahun": "13 - 14 years old",
  "15 - 16 tahun": "15 - 16 years old",
  "17 - 18 tahun": "17 - 18 years old",
  "19 tahun atau lebih tua": "19 years old or older",
  "Apakah kamu merasa perlu menonton materi yang lebih ekstrem untuk merasa puas?": "Do you feel the need to watch more extreme material to feel satisfied?",
  "Apakah frekuensi atau durasi menonton pornografi kamu meningkat seiring waktu?": "Has the frequency or duration of your pornography viewing increased over time?",
  "Apakah kamu menonton pornografi untuk menghindari perasaan stres?": "Do you watch pornography to escape feeling stressed?",
  "Apakah kamu menonton pornografi untuk menghindari perasaan marah?": "Do you watch pornography to escape feeling angry?",
  "Apakah kamu menonton pornografi untuk menghindari perasaan sedih?": "Do you watch pornography to escape feeling sad?",
  "Apakah kamu menonton pornografi untuk menghindari perasaan sakit?": "Do you watch pornography to escape feeling pain?",
  "Apakah kamu pernah mencoba mengurangi menonton pornografi sebelumnya?": "Have you ever tried to reduce watching pornography before?",
  "Ya": "Yes",
  "Tidak": "No"
};

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  let originalContent = content;

  // Translate text
  for (const [id, en] of Object.entries(translateMap)) {
    content = content.replace(new RegExp(id, 'g'), en);
  }
  
  // Replace Pertanyaan X / 8 -> Question X / 8
  content = content.replace(/Pertanyaan (\d+) \/ 8/g, 'Question $1 / 8');

  // If it's a question page, import Button
  if (filePath.includes('question-')) {
    if (!content.includes('import Button from "@/components/Button"')) {
      content = content.replace('import Link from "next/link";', 'import Link from "next/link";\nimport Button from "@/components/Button";');
    }

    // Replace the Link + Continue button logic
    const linkButtonRegex = /<Link href="([^"]+)">\s*<button className="[^"]+">\s*Continue\s*<\/button>\s*<\/Link>/g;
    content = content.replace(linkButtonRegex, '<Button href="$1">Continue</Button>');

    // Replace disabled Continue button logic
    const disabledButtonRegex = /<button\s*disabled\s*className="w-full bg-gray-300 text-white font-bold text-lg rounded-2xl py-4 cursor-not-allowed"\s*>\s*Continue\s*<\/button>/g;
    // We should use Button here too.
    content = content.replace(disabledButtonRegex, '<Button disabled className="!bg-gray-300 !hover:bg-gray-300 !active:bg-gray-300 cursor-not-allowed">Continue</Button>');
  }

  // Same for main onboarding page if needed, but only question pages specifically asked to change button.
  // Wait, I will just apply the button change to main page too if possible, but the prompt says "change all the button on question pages".
  
  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log('Updated', filePath);
  }
}

const glob = require('fs');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = dir + '/' + file;
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else { 
      if (file.endsWith('.tsx')) results.push(file);
    }
  });
  return results;
}

const files = walk('app/onboarding');
files.forEach(processFile);
