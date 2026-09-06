const { calculateMatchingScore } = require('../utils/matching');

const GEMINI_KEYS = () => (process.env.GEMINI_API_KEY || '').split(',').map(s=>s.trim()).filter(Boolean);
const GEMINI_MODELS = () => (process.env.GEMINI_MODEL || 'gemini-2.0-flash,gemini-2.0-flash-lite,gemini-1.5-flash,gemini-3-flash-preview').split(',').map(s=>s.trim()).filter(Boolean);
const TIMEOUT_MS = () => parseInt(process.env.AI_TIMEOUT_MS || '8000', 10);

function getModel() { return GEMINI_KEYS().length ? true : null; }

function withTimeout(promise, ms) {
  return Promise.race([
    promise,
    new Promise((_, rej) => setTimeout(() => rej(new Error('AI timeout')), ms)),
  ]);
}

async function geminiGenerate(prompt, extraMs = 0) {
  const keys = GEMINI_KEYS();
  const models = GEMINI_MODELS();
  if (!keys.length) throw new Error('No key');
  let lastErr = null;
  for (const key of keys) {
    for (const model of models) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
        const res = await withTimeout(
          fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'X-goog-api-key': key },
            body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
          }),
          TIMEOUT_MS() + extraMs
        );
        if (!res.ok) {
          const t = await res.text().catch(() => '');
          if (res.status === 429 || res.status === 503) { lastErr = new Error(`Gemini ${model} ${res.status}`); continue; }
          throw new Error(`Gemini ${res.status} ${t.slice(0, 200)}`);
        }
        const data = await res.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
        if (text) return text;
        lastErr = new Error('Empty response');
      } catch (e) {
        if (e.message.includes('429') || e.message.includes('503')) { lastErr = e; continue; }
        throw e;
      }
    }
  }
  throw lastErr || new Error('All keys/models failed');
}

const cache = new Map();

async function aiMatch(candidateSkills, jobRequirements) {
  if (!candidateSkills || !jobRequirements) return null;
  if (!getModel()) return null;
  const cacheKey = JSON.stringify([candidateSkills, jobRequirements].map((a) => [...a].sort()));
  if (cache.has(cacheKey)) return cache.get(cacheKey);
  const prompt = `Bạn là hệ thống matching tuyển dụng IT.\nCandidate skills: ${JSON.stringify(candidateSkills)}\nJob requirements: ${JSON.stringify(jobRequirements)}\nNhiệm vụ: so khớp ngữ nghĩa (MySQL ~ SQL là cùng họ, Java != JavaScript, typo Reac ~ React).\nTrả về DUY NHẤT JSON (không markdown): {"score": 0-100, "matched": ["skill"], "missing": ["skill"], "reason": "1 câu tiếng Việt giải thích"}`;
  try {
    const text = (await geminiGenerate(prompt)).replace(/```json|```/g, '').trim();
    const json = JSON.parse(text.match(/\{[\s\S]*\}/)[0]);
    const out = {
      score: Math.max(0, Math.min(100, parseInt(json.score, 10) || 0)),
      matchedSkills: Array.isArray(json.matched) ? json.matched : [],
      missingSkills: Array.isArray(json.missing) ? json.missing : jobRequirements,
      reason: json.reason || '',
      source: 'ai',
    };
    cache.set(cacheKey, out);
    return out;
  } catch { return null; }
}

async function aiMatchingScore(candidateSkills, jobRequirements) {
  const ai = await aiMatch(candidateSkills, jobRequirements);
  if (ai) return ai;
  const fallback = calculateMatchingScore(candidateSkills, jobRequirements);
  return { ...fallback, reason: 'Tính bằng alias+fuzzy (không có AI key hoặc AI lỗi)', source: 'fallback' };
}

async function suggestJobsAI(candidateSkills, jobs) {
  if (!getModel() || !jobs || jobs.length === 0) return null;
  const jobBrief = jobs.slice(0, 20).map((j, i) => `${i}. ${j.title} @${j.company} [${(j.requirements || j.tags || []).join(', ')}]`).join('\n');
  const prompt = `Candidate skills: ${JSON.stringify(candidateSkills)}\nJobs:\n${jobBrief}\nChọn 3 job phù hợp nhất, trả JSON duy nhất: {"picks":[{"index":0,"score":90,"reason":"..."}]}`;
  try {
    const text = (await geminiGenerate(prompt, 2000)).replace(/```json|```/g, '').trim();
    const json = JSON.parse(text.match(/\{[\s\S]*\}/)[0]);
    return json.picks || null;
  } catch { return null; }
}

async function generateJDAi(quickPrompt) {
  if (!getModel()) return null;
  const KNOWN_SKILLS = ['React','Angular','Vue','JavaScript','TypeScript','Next.js','HTML','CSS','Tailwind CSS','Node.js','Express.js','Golang','Go','Java','Spring Boot','Python','Django','MongoDB','MySQL','PostgreSQL','Redis','AWS','Docker','Kubernetes','Git','Flutter','React Native','Figma','UI Design','SQL','REST API','Microservices'];
  function cleanReq(raw) {
    if (!raw || typeof raw !== 'string') return null;
    let s = raw.trim();
    for (const k of KNOWN_SKILLS) {
      if (s.toLowerCase().includes(k.toLowerCase())) return k;
    }
    s = s.replace(/^(có|kiến thức|kỹ năng|hiểu biết|thành thạo|sử dụng|kinh nghiệm).*?(về|với)\s*/i, '').trim();
    const words = s.split(/\s+/).slice(0, 3).join(' ');
    if (words.length < 2 || words.length > 30) return null;
    return words.charAt(0).toUpperCase() + words.slice(1);
  }
  const prompt = `Từ mô tả ngắn: "${quickPrompt}"
Sinh tin tuyển dụng IT, trả JSON duy nhất KHÔNG markdown: {"title":"tên vị trí ngắn gọn","description":"mô tả công việc 80-120 từ, 4-6 câu về vai trò, nhiệm vụ chính và môi trường làm việc","requirements":["keyword1","keyword2",...],"salary":"vd 15-25 triệu","location":"địa điểm","mode":"On-site|Remote|Hybrid","level":"Intern|Fresher|Junior|Middle|Senior","quantity":2,"deadline":"2026-10-15","details":["câu yêu cầu chi tiết 1","câu yêu cầu chi tiết 2",...]}
QUY TẮC BẮT BUỘC:
- description: 80-120 từ, tự nhiên, tiếng Việt, KHÔNG được cụt lủn
- requirements: CHỈ 1-3 từ là TÊN KỸ NĂNG (vd: Java, Spring Boot, MySQL), 4-6 phần tử, lấy từ: ${KNOWN_SKILLS.join(', ')} — TUYỆT ĐỐI KHÔNG viết câu dài
- location: 1 địa điểm VN (Hồ Chí Minh, Hà Nội, Đà Nẵng, Remote). Nếu prompt có "HCM"/"Hà Nội"/"Remote" thì dùng đúng, không có thì mặc định "Hồ Chí Minh"
- mode: chọn 1 trong On-site/Remote/Hybrid
- level: suy từ prompt (ví dụ "2 năm" -> Junior, "senior"/"3+ năm" -> Senior)
- quantity: số người tuyển (mặc định 2)
- deadline: hạn nộp dạng YYYY-MM-DD (mặc định +30 ngày)
- details: 3-5 câu đầy đủ tự nhiên như "Có kiến thức cơ bản về ngôn ngữ lập trình Java"`;
  try {
    const text = (await geminiGenerate(prompt, 2000)).replace(/```json|```/g, '').trim();
    const jd = JSON.parse(text.match(/\{[\s\S]*\}/)[0]);
    if (Array.isArray(jd.requirements)) {
      const cleaned = jd.requirements.map(cleanReq).filter(Boolean);
      jd.requirements = [...new Set(cleaned)].slice(0, 8);
      if (jd.requirements.length === 0) jd.requirements = ['Java', 'Spring Boot', 'MySQL'];
    }
    const validModes = ['On-site','Remote','Hybrid'];
    const validLevels = ['Intern','Fresher','Junior','Middle','Senior'];
    if (typeof jd.location !== 'string' || !jd.location.trim()) jd.location = 'Hồ Chí Minh';
    else jd.location = jd.location.trim().slice(0, 40);
    if (!validModes.includes(jd.mode)) jd.mode = 'On-site';
    if (!validLevels.includes(jd.level)) jd.level = 'Junior';
    jd.quantity = parseInt(jd.quantity, 10); if (!jd.quantity || jd.quantity < 1 || jd.quantity > 50) jd.quantity = 2;
    if (typeof jd.deadline !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(jd.deadline)) { const d = new Date(); d.setDate(d.getDate()+30); jd.deadline = d.toISOString().slice(0,10); }
    if (Array.isArray(jd.details) && jd.details.length > 0) {
      const bullet = jd.details.filter(s => typeof s === 'string' && s.trim()).map(s => `• ${s.trim()}`).join('\n');
      jd.description = `${(jd.description || '').trim()}\n\nYêu cầu chi tiết:\n${bullet}`;
      delete jd.details;
    }
    return jd;
  } catch { return null; }
}

async function coverLetterAI(job, candidate) {
  if (!getModel()) return null;
  const prompt = `Viết cover letter tiếng Việt 120-180 từ cho ứng viên ${candidate?.name || ''} (kỹ năng: ${(candidate?.skills || []).join(', ')}) ứng tuyển "${job.title} @ ${job.company}" yêu cầu ${(job.requirements || job.tags || []).join(', ')}. Trả về text thuần, không JSON.`;
  try {
    return (await geminiGenerate(prompt, 2000)).trim();
  } catch { return null; }
}

module.exports = { aiMatchingScore, aiMatch, suggestJobsAI, generateJDAi, coverLetterAI, getModel };
