const express = require('express');
const router = express.Router();
const Skill = require('../models/Skill');
const mongoose = require('mongoose');
const { authenticate, requireRole } = require('../middlewares/auth.middleware');

const defaultSkills = [
  // Frontend
  { name: 'React', category: 'Frontend' },
  { name: 'Angular', category: 'Frontend' },
  { name: 'Vue', category: 'Frontend' },
  { name: 'JavaScript', category: 'Frontend' },
  { name: 'TypeScript', category: 'Frontend' },
  { name: 'Next.js', category: 'Frontend' },
  { name: 'HTML', category: 'Frontend' },
  { name: 'CSS', category: 'Frontend' },
  { name: 'Tailwind CSS', category: 'Frontend' },

  // Backend
  { name: 'Node.js', category: 'Backend' },
  { name: 'Express.js', category: 'Backend' },
  { name: 'Golang', category: 'Backend' },
  { name: 'Java', category: 'Backend' },
  { name: 'Spring Boot', category: 'Backend' },
  { name: 'Python', category: 'Backend' },
  { name: 'Django', category: 'Backend' },
  { name: 'C#', category: 'Backend' },
  { name: '.NET', category: 'Backend' },
  { name: 'PHP', category: 'Backend' },

  // Database
  { name: 'MongoDB', category: 'Database' },
  { name: 'MySQL', category: 'Database' },
  { name: 'PostgreSQL', category: 'Database' },
  { name: 'Redis', category: 'Database' },
  { name: 'SQL Server', category: 'Database' },

  // DevOps & Cloud
  { name: 'AWS', category: 'DevOps' },
  { name: 'Azure', category: 'DevOps' },
  { name: 'Docker', category: 'DevOps' },
  { name: 'Kubernetes', category: 'DevOps' },
  { name: 'CI/CD', category: 'DevOps' },
  { name: 'Git', category: 'DevOps' },

  // Mobile
  { name: 'Swift', category: 'Mobile' },
  { name: 'iOS', category: 'Mobile' },
  { name: 'Kotlin', category: 'Mobile' },
  { name: 'Android', category: 'Mobile' },
  { name: 'Flutter', category: 'Mobile' },
  { name: 'React Native', category: 'Mobile' },

  // Design
  { name: 'Figma', category: 'Design' },
  { name: 'UI Design', category: 'Design' },
  { name: 'UX Research', category: 'Design' },
  { name: 'Design System', category: 'Design' },
  { name: 'Wireframing', category: 'Design' },
];

const isDatabaseReady = () => mongoose.connection.readyState === 1;

router.get('/', async (req, res) => {
  try {
    if (isDatabaseReady()) {
      let dbSkills = await Skill.find().sort({ category: 1, name: 1 });
      if (dbSkills.length === 0) {
        // Seed standard skills if empty
        await Skill.insertMany(defaultSkills);
        dbSkills = await Skill.find().sort({ category: 1, name: 1 });
      }
      return res.status(200).json({
        message: 'Lấy danh mục kỹ năng thành công',
        skills: dbSkills,
      });
    }

    // Demo fallback
    return res.status(200).json({
      message: 'Lấy danh mục kỹ năng thành công (Demo)',
      skills: defaultSkills.map((s, idx) => ({ ...s, _id: `skill-${idx}` })),
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Lỗi server khi lấy kỹ năng',
      error: error.message,
    });
  }
});

router.post('/', authenticate, requireRole('admin'), async (req, res) => {
  try {
    const { name, category } = req.body;
    if (!name) return res.status(400).json({ message: 'Thiếu tên kỹ năng' });
    if (!isDatabaseReady()) return res.json({ message: 'Demo: đã thêm (giả lập)', skill: { _id: `skill-${Date.now()}`, name, category: category || 'Other' } });
    const s = await Skill.create({ name: name.trim(), category: category || 'Other' });
    return res.status(201).json({ message: 'Đã thêm kỹ năng', skill: s });
  } catch (e) { return res.status(e.code === 11000 ? 409 : 500).json({ message: e.code === 11000 ? 'Kỹ năng đã tồn tại' : e.message }); }
});
router.put('/:id', authenticate, requireRole('admin'), async (req, res) => {
  try {
    if (!isDatabaseReady()) return res.json({ message: 'Demo: đã sửa' });
    const s = await Skill.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!s) return res.status(404).json({ message: 'Không tìm thấy' });
    return res.json({ message: 'Đã cập nhật', skill: s });
  } catch (e) { return res.status(500).json({ message: e.message }); }
});
router.delete('/:id', authenticate, requireRole('admin'), async (req, res) => {
  try {
    if (!isDatabaseReady()) return res.json({ message: 'Demo: đã xóa' });
    const s = await Skill.findByIdAndDelete(req.params.id);
    if (!s) return res.status(404).json({ message: 'Không tìm thấy' });
    return res.json({ message: 'Đã xóa kỹ năng' });
  } catch (e) { return res.status(500).json({ message: e.message }); }
});

module.exports = router;
