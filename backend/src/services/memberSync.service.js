const { User, Member } = require('../models');

const syncUsersToMembers = async () => {
  try {
    console.log('🔄 Starting user-to-member database synchronization...');
    const users = await User.findAll();
    let syncedCount = 0;
    let createdCount = 0;

    for (const user of users) {
      // Find matching member by name, university and entry year
      let member = await Member.findOne({
        where: {
          name: user.name,
          university: user.university || null,
          entryYear: user.entryYear ? parseInt(user.entryYear, 10) : null,
        },
      });

      if (member) {
        // Sync fields from user to member if empty or changed
        let changed = false;
        const fields = [
          'gender',
          'origin',
          'university',
          'major',
          'educationLevel',
          'entryYear',
          'duration',
          'scholarshipType',
        ];

        fields.forEach((field) => {
          if (user[field] !== null && user[field] !== undefined && member[field] !== user[field]) {
            member[field] = user[field];
            changed = true;
          }
        });

        if (!member.isActive) {
          member.isActive = true;
          changed = true;
        }

        if (changed) {
          await member.save();
          syncedCount++;
        }
      } else {
        // Create new member record
        await Member.create({
          name: user.name,
          gender: user.gender,
          origin: user.origin,
          university: user.university,
          major: user.major,
          educationLevel: user.educationLevel,
          entryYear: user.entryYear,
          duration: user.duration,
          scholarshipType: user.scholarshipType,
          category: 'mahasiswa', // default category
          sourceSheet: 'Portal Perluni', // indicates portal registration
          isActive: true,
        });
        createdCount++;
      }
    }

    console.log(`✅ User-to-member sync completed. Updated: ${syncedCount}, Created: ${createdCount}`);
  } catch (error) {
    console.error('❌ Failed to run user-to-member database synchronization:', error);
  }
};

module.exports = {
  syncUsersToMembers,
};
