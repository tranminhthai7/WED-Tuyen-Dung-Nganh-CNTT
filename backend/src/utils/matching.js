const calculateMatchingScore = (candidateSkills, jobRequirements) => {
  if (!candidateSkills || candidateSkills.length === 0 || !jobRequirements || jobRequirements.length === 0) {
    // If no candidate skills or no job requirements, return 0 match
    return {
      score: 0,
      missingSkills: jobRequirements || [],
      matchedSkills: [],
    };
  }

  const normCandidate = candidateSkills.map((s) => s.toLowerCase().trim());
  const normJob = jobRequirements.map((s) => s.toLowerCase().trim());

  const matched = [];
  const missing = [];

  jobRequirements.forEach((reqSkill, index) => {
    const normReq = normJob[index];
    // Check if candidate has this skill
    const hasSkill = normCandidate.some(
      (candSkill) => candSkill === normReq || candSkill.includes(normReq) || normReq.includes(candSkill)
    );

    if (hasSkill) {
      matched.push(reqSkill);
    } else {
      missing.push(reqSkill);
    }
  });

  const score = Math.round((matched.length / jobRequirements.length) * 100);

  return {
    score,
    missingSkills: missing,
    matchedSkills: matched,
  };
};

module.exports = { calculateMatchingScore };
