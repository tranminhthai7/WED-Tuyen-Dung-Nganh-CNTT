const { calculateMatchingScore } = require('../utils/matching');

const GEMINI_KEY = () => process.env.GEMINI_API_KEY || '';
const GEMINI_BASE = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent';
const TIMEOUT_MS = () => parseInt(process.env.AI_TIMEOUT_MS || '8000', 10);

function getModel() { return GEMINI_KEY() ? true : null; }

function withTimeout(promise, ms) {
  return Promise.race([
    promise,
    new Promise((_, rej) => setTimeout(() => rej(new Error('AI timeout')), ms)),
  ]);
}

async function geminiGenerate(prompt, extraMs = 0) {
  const key = GEMINI_KEY();
  if (!key) throw new Error('No key');
  const res = await withTimeout(
    fetch(`${GEMINI_BASE}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-goog-api-key': key },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
    }),
    TIMEOUT_MS() + extraMs
  );
  if (!res.ok) {
    const t = await res.text().catch(() => '');
    throw new Error(`Gemini ${res.status} ${t.slice(0, 200)}`);
  }
  const data = await res.json();
  return data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
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
  const prompt = `Từ mô tả ngắn: "${quickPrompt}"\nSinh tin tuyển dụng IT, trả JSON duy nhất: {"title":"...","description":"mô tả 2-3 câu","requirements":["skill1","skill2",...],"salary":"vd 15-25 triệu"}`;
  try {
    const text = (await geminiGenerate(prompt, 2000)).replace(/```json|```/g, '').trim();
    return JSON.parse(text.match(/\{[\s\S]*\}/)[0]);
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
