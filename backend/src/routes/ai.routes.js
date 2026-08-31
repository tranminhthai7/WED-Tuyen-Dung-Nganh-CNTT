const express = require('express');
const router = express.Router();
const { authenticate } = require('../middlewares/auth.middleware');
const { aiMatchingScore, suggestJobsAI, generateJDAi, coverLetterAI, getModel } = require('../services/ai.service');
const { getJobs, getJobBySlug } = require('../services/job.service');
const { getUserProfile } = require('../services/auth.service');

// POST /api/ai/match  { candidateSkills, jobRequirements }
router.post('/match', async (req, res) => {
  try {
    const { candidateSkills, jobRequirements } = req.body;
    if (!Array.isArray(candidateSkills) || !Array.isArray(jobRequirements)) {
      return res.status(400).json({ message: 'Thiếu candidateSkills / jobRequirements' });
    }
    const r = await aiMatchingScore(candidateSkills, jobRequirements);
    return res.json({ message: 'AI matching', ...r, hasAI: !!getModel() });
  } catch (e) { return res.status(500).json({ message: e.message }); }
});

// POST /api/ai/suggest-jobs  (auth candidate)
router.post('/suggest-jobs', authenticate, async (req, res) => {
  try {
    const profile = await getUserProfile(req.user.id);
    const skills = profile.skills || [];
    const allJobs = await getJobs(skills);
    if (!getModel()) {
      // fallback: sắp theo matching cũ
      const sorted = [...allJobs].sort((a, b) => (b.matchingScore || 0) - (a.matchingScore || 0)).slice(0, 3).map((j) => ({ job: j, score: j.matchingScore, reason: j.missingSkills?.length ? `Thiếu: ${j.missingSkills.join(', ')}` : 'Khớp tốt', source: 'fallback' }));
      return res.json({ message: 'Gợi ý (fallback)', picks: sorted, hasAI: false });
    }
    const picks = await suggestJobsAI(skills, allJobs);
    if (!picks) {
      const sorted = [...allJobs].sort((a, b) => (b.matchingScore || 0) - (a.matchingScore || 0)).slice(0, 3).map((j) => ({ job: j, score: j.matchingScore, reason: 'Fallback', source: 'fallback' }));
      return res.json({ message: 'Gợi ý (AI lỗi - fallback)', picks: sorted, hasAI: true });
    }
    const out = picks.map((p) => ({ job: allJobs[p.index] || allJobs[0], score: p.score, reason: p.reason, source: 'ai' })).filter((x) => x.job);
    return res.json({ message: 'Gợi ý AI', picks: out, hasAI: true });
  } catch (e) { return res.status(500).json({ message: e.message }); }
});

// POST /api/ai/generate-jd  { prompt }
router.post('/generate-jd', authenticate, async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ message: 'Thiếu prompt' });
    const jd = await generateJDAi(prompt);
    if (!jd) return res.status(503).json({ message: 'AI chưa cấu hình (thiếu GEMINI_API_KEY) hoặc lỗi - hãy nhập tay', hasAI: !!getModel() });
    return res.json({ message: 'Đã sinh JD bằng AI', jd, hasAI: true });
  } catch (e) { return res.status(500).json({ message: e.message }); }
});

// POST /api/ai/cover-letter  { jobSlug }
router.post('/cover-letter', authenticate, async (req, res) => {
  try {
    const { jobSlug } = req.body;
    const profile = await getUserProfile(req.user.id);
    const job = jobSlug ? await getJobBySlug(jobSlug, profile.skills) : null;
    if (!job) return res.status(404).json({ message: 'Không tìm thấy job' });
    const text = await coverLetterAI(job, profile);
    if (!text) return res.status(503).json({ message: 'AI chưa cấu hình', hasAI: !!getModel() });
    return res.json({ message: 'Cover letter AI', text, hasAI: true });
  } catch (e) { return res.status(500).json({ message: e.message }); }
});

router.get('/status', (req, res) => res.json({ hasAI: !!getModel(), timeout: process.env.AI_TIMEOUT_MS || 4000 }));

module.exports = router;
