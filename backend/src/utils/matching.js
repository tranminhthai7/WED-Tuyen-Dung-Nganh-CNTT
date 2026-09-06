/** Levenshtein distance - fuzzy match cho typo Reac ~ React */
function levenshtein(a, b) {
  const m = a.length, n = b.length;
  const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) for (let j = 1; j <= n; j++) {
    dp[i][j] = a[i - 1] === b[j - 1] ? dp[i - 1][j - 1] : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
  }
  return dp[m][n];
}
/** Alias groups: họ skill cùng nghĩa */
const ALIAS_GROUPS = {
  sql: ['sql', 'mysql', 'postgresql', 'postgres', 'mssql', 'sqlite', 'mariadb', 'oracle sql'],
  javascript: ['javascript', 'js', 'ecmascript', 'es6'],
  typescript: ['typescript', 'ts'],
  react: ['react', 'reactjs', 'react.js', 'next.js', 'nextjs', 'next js'],
  node: ['node', 'nodejs', 'node.js', 'express', 'expressjs', 'nestjs', 'nest.js'],
  python: ['python', 'django', 'flask', 'fastapi'],
  java: ['java', 'spring', 'spring boot', 'springboot'],
  cpp: ['c++', 'cpp'],
  csharp: ['c#', 'csharp', 'c sharp', '.net', 'dotnet'],
  golang: ['go', 'golang'],
  devops: ['docker', 'kubernetes', 'k8s'],
  aws: ['aws', 'amazon web services', 'ec2', 's3'],
  design: ['figma', 'ui design', 'ux design', 'ui/ux'],
};

const variantToCanon = new Map();
Object.entries(ALIAS_GROUPS).forEach(([canon, variants]) => {
  variantToCanon.set(canon, canon);
  variants.forEach((v) => variantToCanon.set(v.toLowerCase().trim(), canon));
});
function canonical(s) { const n = s.toLowerCase().trim(); return variantToCanon.get(n) || n; }

/** So khớp 1 cặp skill: alias === , nếu không thì fuzzy <=2 cho typo ngắn */
function skillsMatch(a, b) {
  const ca = canonical(a), cb = canonical(b);
  if (ca === cb) return true;
  const na = a.toLowerCase().trim(), nb = b.toLowerCase().trim();
  // Nếu 1 trong 2 là câu dài (AI cũ sinh) mà chứa keyword của cái còn lại -> cho khớp
  // VD: "Có kiến thức cơ bản về Java" chứa "java" -> khớp, nhưng "java" != "javascript" vẫn chặn
  const LONG = 18; // ngưỡng câu
  if (na.length > LONG || nb.length > LONG) {
    const shortSkill = na.length < nb.length ? na : nb;
    const longSentence = na.length >= nb.length ? na : nb;
    // shortSkill phải là 1 skill ngắn gọn (1-3 từ) mới cho substring
    if (shortSkill.split(/\s+/).length <= 3 && shortSkill.length <= 20) {
      // khớp nguyên từ (word boundary) để tránh java trong javascript
      const re = new RegExp(`\\b${shortSkill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
      if (re.test(longSentence)) return true;
      // cũng thử canonical: nếu longSentence chứa variant nào của cùng họ -> khớp
      const canonShort = canonical(shortSkill);
      for (const [variant, canon] of variantToCanon.entries()) {
        if (canon === canonShort) {
          const rv = new RegExp(`\\b${variant.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
          if (rv.test(longSentence)) return true;
        }
      }
    }
  }
  // chỉ fuzzy khi cùng họ alias hoặc độ dài gần nhau (tránh Java vs JavaScript)
  if (Math.abs(a.length - b.length) > 2) return false;
  // không cho Java khớp JavaScript dù distance ngắn theo tỷ lệ
  if (na.length <= 4 || nb.length <= 4) return na === nb;
  return levenshtein(na, nb) <= 2;
}

const calculateMatchingScore = (candidateSkills, jobRequirements) => {
  if (!candidateSkills || candidateSkills.length === 0 || !jobRequirements || jobRequirements.length === 0) {
    return { score: 0, missingSkills: jobRequirements || [], matchedSkills: [] };
  }
  const matched = []; const missing = [];
  jobRequirements.forEach((req) => {
    const has = candidateSkills.some((cand) => skillsMatch(cand, req) || canonical(cand) === canonical(req));
    if (has) matched.push(req); else missing.push(req);
  });
  const score = Math.round((matched.length / jobRequirements.length) * 100);
  return { score, missingSkills: missing, matchedSkills: matched };
};

module.exports = { calculateMatchingScore, canonical, ALIAS_GROUPS, skillsMatch, levenshtein };
