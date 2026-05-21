const { MemberAudit } = require('../models');

const snapshotMember = (member) => {
  if (!member) return null;

  return {
    id: member.id,
    name: member.name,
    gender: member.gender,
    origin: member.origin,
    university: member.university,
    major: member.major,
    educationLevel: member.educationLevel,
    entryYear: member.entryYear,
    duration: member.duration,
    hospital: member.hospital,
    scholarshipType: member.scholarshipType,
    remarks: member.remarks,
    category: member.category,
    sourceSheet: member.sourceSheet,
    isActive: member.isActive,
  };
};

const computeChangedFields = (beforeData, afterData) => {
  if (!beforeData && afterData) {
    return Object.keys(afterData);
  }

  if (!beforeData || !afterData) {
    return [];
  }

  return Object.keys(afterData).filter((key) => JSON.stringify(beforeData[key]) !== JSON.stringify(afterData[key]));
};

const logMemberAudit = async ({ action, memberBefore, memberAfter, actorId, req }) => {
  const beforeData = snapshotMember(memberBefore);
  const afterData = snapshotMember(memberAfter);
  const changedFields = computeChangedFields(beforeData, afterData);

  await MemberAudit.create({
    memberId: memberAfter?.id || memberBefore?.id,
    action,
    changedFields,
    beforeData,
    afterData,
    actorId: actorId || null,
    ipAddress: req?.ip || req?.headers['x-forwarded-for'] || null,
    userAgent: req?.headers['user-agent'] || null,
  });
};

module.exports = {
  logMemberAudit,
};
