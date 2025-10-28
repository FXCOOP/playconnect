import { PrismaClient, AgeBand, InterestCategory, DayOfWeek, SlotType, Role } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { latLngToCell } from 'h3-js';

const prisma = new PrismaClient();

// ========================================
// Seed Data: Curated Interests
// ========================================

const CURATED_INTERESTS = [
  // Sports
  { name: 'Soccer', slug: 'soccer', category: InterestCategory.SPORTS, iconName: 'Trophy' },
  { name: 'Basketball', slug: 'basketball', category: InterestCategory.SPORTS, iconName: 'Basketball' },
  { name: 'Swimming', slug: 'swimming', category: InterestCategory.SPORTS, iconName: 'Waves' },
  { name: 'Dance', slug: 'dance', category: InterestCategory.SPORTS, iconName: 'Music' },
  { name: 'Gymnastics', slug: 'gymnastics', category: InterestCategory.SPORTS, iconName: 'Activity' },
  { name: 'Martial Arts', slug: 'martial-arts', category: InterestCategory.SPORTS, iconName: 'Shield' },

  // Arts
  { name: 'Drawing', slug: 'drawing', category: InterestCategory.ARTS, iconName: 'Pencil' },
  { name: 'Painting', slug: 'painting', category: InterestCategory.ARTS, iconName: 'Palette' },
  { name: 'Crafts', slug: 'crafts', category: InterestCategory.ARTS, iconName: 'Scissors' },
  { name: 'Pottery', slug: 'pottery', category: InterestCategory.ARTS, iconName: 'Circle' },
  { name: 'Theater', slug: 'theater', category: InterestCategory.ARTS, iconName: 'Drama' },

  // Music
  { name: 'Piano', slug: 'piano', category: InterestCategory.MUSIC, iconName: 'Music' },
  { name: 'Guitar', slug: 'guitar', category: InterestCategory.MUSIC, iconName: 'Music2' },
  { name: 'Singing', slug: 'singing', category: InterestCategory.MUSIC, iconName: 'Mic' },
  { name: 'Drums', slug: 'drums', category: InterestCategory.MUSIC, iconName: 'Drum' },

  // STEM
  { name: 'Lego Building', slug: 'lego', category: InterestCategory.STEM, iconName: 'Blocks' },
  { name: 'Robotics', slug: 'robotics', category: InterestCategory.STEM, iconName: 'Bot' },
  { name: 'Coding', slug: 'coding', category: InterestCategory.STEM, iconName: 'Code' },
  { name: 'Science Experiments', slug: 'science', category: InterestCategory.STEM, iconName: 'Flask' },
  { name: 'Math Puzzles', slug: 'math', category: InterestCategory.STEM, iconName: 'Calculator' },

  // Games
  { name: 'Board Games', slug: 'board-games', category: InterestCategory.GAMES, iconName: 'Gamepad2' },
  { name: 'Video Games', slug: 'video-games', category: InterestCategory.GAMES, iconName: 'Gamepad' },
  { name: 'Chess', slug: 'chess', category: InterestCategory.GAMES, iconName: 'Crown' },
  { name: 'Card Games', slug: 'card-games', category: InterestCategory.GAMES, iconName: 'Spade' },

  // Outdoor
  { name: 'Hiking', slug: 'hiking', category: InterestCategory.OUTDOOR, iconName: 'Mountain' },
  { name: 'Biking', slug: 'biking', category: InterestCategory.OUTDOOR, iconName: 'Bike' },
  { name: 'Camping', slug: 'camping', category: InterestCategory.OUTDOOR, iconName: 'Tent' },
  { name: 'Nature Exploration', slug: 'nature', category: InterestCategory.OUTDOOR, iconName: 'TreePine' },
  { name: 'Playground', slug: 'playground', category: InterestCategory.OUTDOOR, iconName: 'Play' },

  // Reading
  { name: 'Reading', slug: 'reading', category: InterestCategory.READING, iconName: 'Book' },
  { name: 'Storytelling', slug: 'storytelling', category: InterestCategory.READING, iconName: 'BookOpen' },
  { name: 'Comics', slug: 'comics', category: InterestCategory.READING, iconName: 'BookMarked' },

  // Social
  { name: 'Playdates', slug: 'playdates', category: InterestCategory.SOCIAL, iconName: 'Users' },
  { name: 'Pretend Play', slug: 'pretend-play', category: InterestCategory.SOCIAL, iconName: 'Drama' },
  { name: 'Dolls & Action Figures', slug: 'dolls', category: InterestCategory.SOCIAL, iconName: 'Smile' },

  // Other
  { name: 'Animals', slug: 'animals', category: InterestCategory.OTHER, iconName: 'Paw' },
  { name: 'Cooking', slug: 'cooking', category: InterestCategory.OTHER, iconName: 'ChefHat' },
  { name: 'Gardening', slug: 'gardening', category: InterestCategory.OTHER, iconName: 'Flower' },
];

// ========================================
// Helper: Calculate Age Band
// ========================================

function calculateAgeBand(birthYear: number, birthMonth: number): { ageInMonths: number; ageBand: AgeBand } {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  const ageInMonths = (currentYear - birthYear) * 12 + (currentMonth - birthMonth);

  let ageBand: AgeBand;
  if (ageInMonths <= 12) ageBand = AgeBand.INFANT_0_12M;
  else if (ageInMonths <= 24) ageBand = AgeBand.TODDLER_13_24M;
  else if (ageInMonths <= 47) ageBand = AgeBand.TODDLER_2_3Y;
  else if (ageInMonths <= 71) ageBand = AgeBand.PRESCHOOL_4_5Y;
  else if (ageInMonths <= 107) ageBand = AgeBand.SCHOOL_AGE_6_8Y;
  else if (ageInMonths <= 155) ageBand = AgeBand.SCHOOL_AGE_9_12Y;
  else ageBand = AgeBand.TEEN_13_PLUS;

  return { ageInMonths, ageBand };
}

// ========================================
// Seed Families
// ========================================

const FAMILIES = [
  {
    user: {
      name: 'Sarah Johnson',
      email: 'sarah.johnson@example.com',
      role: Role.PARENT,
    },
    household: {
      city: 'San Francisco',
      state: 'CA',
      country: 'US',
      postalCode: '94102',
      latitude: 37.7749,
      longitude: -122.4194,
      languages: ['en'],
      hasPets: true,
      petTypes: ['dog'],
      screenTimePolicy: 'limited',
    },
    children: [
      {
        firstName: 'Emma',
        birthYear: 2019,
        birthMonth: 3,
        pronouns: 'she/her',
        interests: ['drawing', 'reading', 'dolls', 'animals'],
        allergies: ['peanuts'],
      },
      {
        firstName: 'Liam',
        birthYear: 2021,
        birthMonth: 7,
        pronouns: 'he/him',
        interests: ['lego', 'playground', 'video-games'],
        allergies: [],
      },
    ],
  },
  {
    user: {
      name: 'Michael Chen',
      email: 'michael.chen@example.com',
      role: Role.PARENT,
    },
    household: {
      city: 'San Francisco',
      state: 'CA',
      country: 'US',
      postalCode: '94110',
      latitude: 37.7599,
      longitude: -122.4148,
      languages: ['en', 'zh'],
      hasPets: false,
      petTypes: [],
      screenTimePolicy: 'moderate',
    },
    children: [
      {
        firstName: 'Sophia',
        birthYear: 2018,
        birthMonth: 9,
        pronouns: 'she/her',
        interests: ['piano', 'reading', 'math', 'chess'],
        allergies: [],
      },
    ],
  },
  {
    user: {
      name: 'Jessica Martinez',
      email: 'jessica.martinez@example.com',
      role: Role.PARENT,
    },
    household: {
      city: 'San Francisco',
      state: 'CA',
      country: 'US',
      postalCode: '94103',
      latitude: 37.7726,
      longitude: -122.4099,
      languages: ['en', 'es'],
      hasPets: true,
      petTypes: ['cat'],
      screenTimePolicy: 'limited',
    },
    children: [
      {
        firstName: 'Noah',
        birthYear: 2019,
        birthMonth: 1,
        pronouns: 'he/him',
        interests: ['soccer', 'lego', 'science', 'board-games'],
        allergies: [],
      },
      {
        firstName: 'Olivia',
        birthYear: 2020,
        birthMonth: 11,
        pronouns: 'she/her',
        interests: ['dance', 'drawing', 'crafts'],
        allergies: ['dairy'],
      },
    ],
  },
  {
    user: {
      name: 'David Williams',
      email: 'david.williams@example.com',
      role: Role.PARENT,
    },
    household: {
      city: 'San Francisco',
      state: 'CA',
      country: 'US',
      postalCode: '94107',
      latitude: 37.7609,
      longitude: -122.3971,
      languages: ['en'],
      hasPets: false,
      petTypes: [],
      screenTimePolicy: 'moderate',
    },
    children: [
      {
        firstName: 'Ava',
        birthYear: 2018,
        birthMonth: 5,
        pronouns: 'she/her',
        interests: ['swimming', 'painting', 'nature', 'animals'],
        allergies: [],
      },
    ],
  },
  {
    user: {
      name: 'Emily Brown',
      email: 'emily.brown@example.com',
      role: Role.PARENT,
    },
    household: {
      city: 'San Francisco',
      state: 'CA',
      country: 'US',
      postalCode: '94109',
      latitude: 37.7937,
      longitude: -122.4255,
      languages: ['en'],
      hasPets: true,
      petTypes: ['dog', 'cat'],
      screenTimePolicy: 'unrestricted',
    },
    children: [
      {
        firstName: 'Mason',
        birthYear: 2019,
        birthMonth: 8,
        pronouns: 'he/him',
        interests: ['basketball', 'video-games', 'robotics', 'coding'],
        allergies: [],
      },
    ],
  },
  {
    user: {
      name: 'Amanda Taylor',
      email: 'amanda.taylor@example.com',
      role: Role.PARENT,
    },
    household: {
      city: 'San Francisco',
      state: 'CA',
      country: 'US',
      postalCode: '94117',
      latitude: 37.7699,
      longitude: -122.4469,
      languages: ['en'],
      hasPets: false,
      petTypes: [],
      screenTimePolicy: 'limited',
    },
    children: [
      {
        firstName: 'Isabella',
        birthYear: 2020,
        birthMonth: 2,
        pronouns: 'she/her',
        interests: ['dance', 'singing', 'theater', 'dolls'],
        allergies: [],
      },
      {
        firstName: 'Ethan',
        birthYear: 2018,
        birthMonth: 12,
        pronouns: 'he/him',
        interests: ['soccer', 'hiking', 'biking', 'camping'],
        allergies: ['gluten'],
      },
    ],
  },
  {
    user: {
      name: 'Jennifer Davis',
      email: 'jennifer.davis@example.com',
      role: Role.PARENT,
    },
    household: {
      city: 'San Francisco',
      state: 'CA',
      country: 'US',
      postalCode: '94115',
      latitude: 37.7864,
      longitude: -122.4364,
      languages: ['en', 'fr'],
      hasPets: false,
      petTypes: [],
      screenTimePolicy: 'moderate',
    },
    children: [
      {
        firstName: 'Mia',
        birthYear: 2019,
        birthMonth: 6,
        pronouns: 'she/her',
        interests: ['reading', 'storytelling', 'crafts', 'playground'],
        allergies: [],
      },
    ],
  },
  {
    user: {
      name: 'Robert Anderson',
      email: 'robert.anderson@example.com',
      role: Role.PARENT,
    },
    household: {
      city: 'San Francisco',
      state: 'CA',
      country: 'US',
      postalCode: '94112',
      latitude: 37.7200,
      longitude: -122.4431,
      languages: ['en'],
      hasPets: true,
      petTypes: ['dog'],
      screenTimePolicy: 'limited',
    },
    children: [
      {
        firstName: 'Lucas',
        birthYear: 2018,
        birthMonth: 4,
        pronouns: 'he/him',
        interests: ['lego', 'robotics', 'science', 'chess'],
        allergies: [],
      },
      {
        firstName: 'Charlotte',
        birthYear: 2021,
        birthMonth: 9,
        pronouns: 'she/her',
        interests: ['playground', 'dolls', 'pretend-play'],
        allergies: [],
      },
    ],
  },
  {
    user: {
      name: 'Lisa Wilson',
      email: 'lisa.wilson@example.com',
      role: Role.PARENT,
    },
    household: {
      city: 'San Francisco',
      state: 'CA',
      country: 'US',
      postalCode: '94108',
      latitude: 37.7924,
      longitude: -122.4078,
      languages: ['en'],
      hasPets: false,
      petTypes: [],
      screenTimePolicy: 'moderate',
    },
    children: [
      {
        firstName: 'Amelia',
        birthYear: 2019,
        birthMonth: 10,
        pronouns: 'she/her',
        interests: ['gymnastics', 'dance', 'painting', 'animals'],
        allergies: [],
      },
    ],
  },
  {
    user: {
      name: 'James Moore',
      email: 'james.moore@example.com',
      role: Role.PARENT,
    },
    household: {
      city: 'San Francisco',
      state: 'CA',
      country: 'US',
      postalCode: '94121',
      latitude: 37.7766,
      longitude: -122.4934,
      languages: ['en'],
      hasPets: true,
      petTypes: ['dog'],
      screenTimePolicy: 'unrestricted',
    },
    children: [
      {
        firstName: 'Benjamin',
        birthYear: 2020,
        birthMonth: 4,
        pronouns: 'he/him',
        interests: ['basketball', 'swimming', 'video-games', 'board-games'],
        allergies: [],
      },
      {
        firstName: 'Harper',
        birthYear: 2018,
        birthMonth: 7,
        pronouns: 'she/her',
        interests: ['reading', 'crafts', 'cooking', 'gardening'],
        allergies: ['eggs'],
      },
    ],
  },
];

// ========================================
// Admin User
// ========================================

const ADMIN_USER = {
  name: 'Admin User',
  email: 'admin@playconnect.app',
  role: Role.ADMIN,
};

// ========================================
// Main Seed Function
// ========================================

async function main() {
  console.log('🌱 Starting PlayConnect database seed...\n');

  // Clear existing data
  console.log('🗑️  Clearing existing data...');
  await prisma.auditEvent.deleteMany();
  await prisma.report.deleteMany();
  await prisma.message.deleteMany();
  await prisma.proposal.deleteMany();
  await prisma.groupMember.deleteMany();
  await prisma.group.deleteMany();
  await prisma.match.deleteMany();
  await prisma.availabilitySlot.deleteMany();
  await prisma.childInterest.deleteMany();
  await prisma.interest.deleteMany();
  await prisma.child.deleteMany();
  await prisma.household.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.verificationToken.deleteMany();
  await prisma.user.deleteMany();
  console.log('✅ Existing data cleared\n');

  // Seed interests
  console.log('🎨 Seeding interests...');
  const interests: Record<string, string> = {};
  for (const interest of CURATED_INTERESTS) {
    const created = await prisma.interest.create({
      data: {
        ...interest,
        isApproved: true,
        isCustom: false,
      },
    });
    interests[interest.slug] = created.id;
  }
  console.log(`✅ Created ${CURATED_INTERESTS.length} interests\n`);

  // Seed admin user
  console.log('👤 Seeding admin user...');
  const hashedPassword = await bcrypt.hash('admin123', 10);
  await prisma.user.create({
    data: {
      ...ADMIN_USER,
      password: hashedPassword,
      emailVerified: new Date(),
    },
  });
  console.log('✅ Admin user created (email: admin@playconnect.app, password: admin123)\n');

  // Seed families
  console.log('👨‍👩‍👧‍👦 Seeding families...');
  let totalChildren = 0;

  for (const family of FAMILIES) {
    // Create user
    const password = await bcrypt.hash('password123', 10);
    const user = await prisma.user.create({
      data: {
        ...family.user,
        password,
        emailVerified: new Date(),
      },
    });

    // Calculate H3 index for household location
    const h3Index = latLngToCell(
      family.household.latitude,
      family.household.longitude,
      7 // Resolution 7 (~5km hexagons)
    );

    // Create household
    const household = await prisma.household.create({
      data: {
        userId: user.id,
        ...family.household,
        h3Index,
      },
    });

    // Create children
    for (const childData of family.children) {
      const { ageInMonths, ageBand } = calculateAgeBand(childData.birthYear, childData.birthMonth);

      const child = await prisma.child.create({
        data: {
          householdId: household.id,
          firstName: childData.firstName,
          birthYear: childData.birthYear,
          birthMonth: childData.birthMonth,
          ageInMonths,
          ageBand,
          pronouns: childData.pronouns,
          allergies: childData.allergies,
          bio: `Hi! I'm ${childData.firstName} and I love making new friends!`,
        },
      });

      // Add interests
      for (const interestSlug of childData.interests) {
        if (interests[interestSlug]) {
          await prisma.childInterest.create({
            data: {
              childId: child.id,
              interestId: interests[interestSlug],
              level: 'intermediate',
            },
          });
        }
      }

      // Add availability slots (weekday afternoons + Saturday mornings)
      const weekdaySlots = [DayOfWeek.TUESDAY, DayOfWeek.THURSDAY, DayOfWeek.FRIDAY];
      for (const day of weekdaySlots) {
        await prisma.availabilitySlot.create({
          data: {
            childId: child.id,
            type: SlotType.RECURRING,
            dayOfWeek: day,
            startTime: '15:00',
            endTime: '18:00',
            notes: 'After school',
          },
        });
      }

      // Saturday morning slot
      await prisma.availabilitySlot.create({
        data: {
          childId: child.id,
          type: SlotType.RECURRING,
          dayOfWeek: DayOfWeek.SATURDAY,
          startTime: '09:00',
          endTime: '12:00',
          notes: 'Weekend morning',
        },
      });

      totalChildren++;
    }

    console.log(`  ✅ ${user.name} (${family.children.length} children)`);
  }

  console.log(`\n✅ Created ${FAMILIES.length} families with ${totalChildren} children\n`);

  // Create a sample interest circle
  console.log('🔵 Creating sample interest circle...');
  const legoGroup = await prisma.group.create({
    data: {
      name: 'Lego Builders Club',
      description: 'For kids who love building with Lego! We meet weekly for collaborative building sessions.',
      visibility: 'PUBLIC',
      interestId: interests['lego'],
      minAgeBand: AgeBand.PRESCHOOL_4_5Y,
      maxAgeBand: AgeBand.SCHOOL_AGE_9_12Y,
      inviteCode: 'LEGO2024',
    },
  });

  // Add some children to the group
  const legoFans = await prisma.child.findMany({
    where: {
      interests: {
        some: {
          interest: {
            slug: 'lego',
          },
        },
      },
    },
    include: {
      household: {
        include: {
          user: true,
        },
      },
    },
    take: 3,
  });

  for (const child of legoFans) {
    await prisma.groupMember.create({
      data: {
        groupId: legoGroup.id,
        userId: child.household.userId,
        childId: child.id,
        role: 'MEMBER',
      },
    });
  }

  console.log(`✅ Created "Lego Builders Club" group with ${legoFans.length} members\n`);

  console.log('✨ Seed completed successfully!\n');
  console.log('📝 Demo Credentials:');
  console.log('   Admin: admin@playconnect.app / admin123');
  console.log('   Parent: sarah.johnson@example.com / password123');
  console.log('   Parent: michael.chen@example.com / password123');
  console.log('   (All parent accounts use password: password123)\n');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
