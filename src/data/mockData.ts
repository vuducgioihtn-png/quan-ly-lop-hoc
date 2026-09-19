import { User, ClassRoom, AttendanceRecord, Homework, HomeworkSubmission, StudyMaterial, AppNotification, StudentBadge } from '../types';

export const INITIAL_USERS: User[] = [
  {
    id: 'admin-1',
    name: 'Quản trị viên (Thầy David)',
    englishName: 'David Admin',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    role: 'admin',
    email: 'admin@starkids.edu.vn',
    password: 'starkids2026',
    phone: '0909 888 777',
    status: 'approved',
    registeredAt: '2025-11-01',
    levelTitle: 'School Principal & Director'
  },
  {
    id: 'teacher-1',
    name: 'Cô Emily (Thu Hương)',
    englishName: 'Teacher Emily',
    avatar: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&auto=format&fit=crop&q=80',
    role: 'teacher',
    email: 'emily.teacher@starkids.edu.vn',
    password: 'starkids2026',
    phone: '0912 345 678',
    status: 'approved',
    registeredAt: '2026-01-10',
    levelTitle: 'Lead ESL Teacher'
  },
  {
    id: 'teacher-2',
    name: 'Thầy Michael Jenkins',
    englishName: 'Teacher Michael',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    role: 'teacher',
    email: 'michael.j@starkids.edu.vn',
    password: 'starkids2026',
    phone: '0933 456 789',
    status: 'approved',
    registeredAt: '2026-01-15',
    levelTitle: 'Native Speaking Specialist'
  },
  {
    id: 'teacher-3',
    name: 'Cô Sarah Nguyễn',
    englishName: 'Teacher Sarah',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    role: 'teacher',
    email: 'sarah.nguyen@starkids.edu.vn',
    password: 'starkids2026',
    phone: '0981 234 567',
    status: 'approved',
    registeredAt: '2026-02-01',
    levelTitle: 'Phonics & Grammar Coach'
  },
  {
    id: 'stu-1',
    name: 'Nguyễn Minh Khôi',
    englishName: 'Tommy',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    role: 'student',
    email: 'tommy.khoi@gmail.com',
    password: 'starkids2026',
    grade: 3,
    classId: 'class-3',
    status: 'approved',
    registeredAt: '2026-02-15',
    parentName: 'Nguyễn Thu Hà',
    parentPhone: '0988 123 456',
    parentEmail: 'thuha.mom@gmail.com',
    parentPassword: 'starkids2026',
    parentRelationship: 'Mẹ',
    birthDate: '2017-05-12',
    schoolName: 'Tiểu học Thôn 16',
    address: 'Số nhà 28, Ngõ 3, Thôn 16',
    commitmentAccepted: true,
    commitmentDate: '2026-02-15',
    studentSignedName: 'Nguyễn Minh Khôi',
    parentSignedName: 'Nguyễn Thu Hà',
    locationName: 'Nhà văn hóa Thôn 16',
    stars: 175,
    levelTitle: 'Super Explorer',
    isAdmin: true,
    adminRoleTitle: 'Cán sự lớp kiêm Admin Học sinh'
  },
  {
    id: 'stu-2',
    name: 'Trần Bảo An',
    englishName: 'Lily',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    role: 'student',
    email: 'lily.baoan@gmail.com',
    password: 'starkids2026',
    grade: 1,
    classId: 'class-1',
    status: 'approved',
    registeredAt: '2026-03-01',
    parentName: 'Trần Tuấn Minh',
    parentPhone: '0977 456 789',
    parentEmail: 'tuanminh.dad@gmail.com',
    parentPassword: 'starkids2026',
    parentRelationship: 'Ba',
    birthDate: '2019-08-20',
    schoolName: 'Tiểu học Thôn 16',
    address: 'Đội 2, Thôn 16',
    commitmentAccepted: true,
    commitmentDate: '2026-03-01',
    studentSignedName: 'Trần Bảo An',
    parentSignedName: 'Trần Tuấn Minh',
    locationName: 'Nhà văn hóa Thôn 16',
    stars: 120,
    levelTitle: 'Little Star'
  },
  {
    id: 'stu-3',
    name: 'Lê Tuấn Kiệt',
    englishName: 'Lucas',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    role: 'student',
    email: 'lucas.kiet@gmail.com',
    password: 'starkids2026',
    grade: 3,
    classId: 'class-3',
    status: 'approved',
    registeredAt: '2026-02-10',
    parentName: 'Lê Văn Hoàng',
    parentPhone: '0903 111 222',
    parentEmail: 'vanhoang.dad@gmail.com',
    parentPassword: 'starkids2026',
    stars: 195,
    levelTitle: 'Grammar Master'
  },
  {
    id: 'stu-4',
    name: 'Vũ Mai Chi',
    englishName: 'Mia',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    role: 'student',
    email: 'mia.maichi@gmail.com',
    password: 'starkids2026',
    grade: 2,
    classId: 'class-2',
    status: 'approved',
    registeredAt: '2026-02-20',
    parentName: 'Vũ Quốc Bảo',
    parentPhone: '0918 999 888',
    parentEmail: 'quocbao.dad@gmail.com',
    parentPassword: 'starkids2026',
    stars: 140,
    levelTitle: 'Phonics Hero'
  },
  {
    id: 'stu-5',
    name: 'Đặng Hoàng Nam',
    englishName: 'Leo',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    role: 'student',
    email: 'leo.nam@gmail.com',
    password: 'starkids2026',
    grade: 5,
    classId: 'class-5',
    status: 'approved',
    registeredAt: '2026-01-15',
    parentName: 'Đặng Tuấn Anh',
    parentPhone: '0945 666 777',
    parentEmail: 'tuananh.dad@gmail.com',
    parentPassword: 'starkids2026',
    stars: 210,
    levelTitle: 'English Champion'
  },
  {
    id: 'stu-6',
    name: 'Phạm Gia Hân',
    englishName: 'Emma',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80',
    role: 'student',
    email: 'emma.hannie@gmail.com',
    password: 'starkids2026',
    grade: 4,
    classId: 'class-4',
    status: 'approved',
    registeredAt: '2026-02-28',
    parentName: 'Phạm Thùy Linh',
    parentPhone: '0932 555 444',
    parentEmail: 'thuylinh.mom@gmail.com',
    parentPassword: 'starkids2026',
    stars: 155,
    levelTitle: 'Reading Wizard'
  },
  {
    id: 'stu-pending',
    name: 'Bùi Đức Anh',
    englishName: 'Alex',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    role: 'student',
    email: 'alex.ducanh@gmail.com',
    password: 'starkids2026',
    grade: 3,
    classId: 'class-3',
    status: 'pending',
    registeredAt: '2026-09-16',
    parentName: 'Bùi Văn Hùng',
    parentPhone: '0961 888 999',
    parentEmail: 'vanhung.dad@gmail.com',
    parentPassword: 'starkids2026',
    stars: 10,
    levelTitle: 'New Adventurer'
  },
  {
    id: 'parent-1',
    name: 'Chị Nguyễn Thu Hà',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    role: 'parent',
    email: 'thuha.mom@gmail.com',
    password: 'starkids2026',
    phone: '0988 123 456',
    status: 'approved',
    studentId: 'stu-1', // Linked to Tommy
    registeredAt: '2026-02-15'
  }
];

export const INITIAL_CLASSES: ClassRoom[] = [
  {
    id: 'class-1',
    name: 'Starters 1A (Khối Lớp 1)',
    grade: 1,
    teacherName: 'Cô Emily (Thu Hương)',
    roomNumber: 'Phòng 102 - Tầng 1',
    scheduleDescription: 'Thứ 2 & Thứ 4 (17:00 - 18:30)',
    daysOfWeek: [1, 3],
    timeSlot: '17:00 - 18:30',
    color: 'from-amber-400 to-orange-500',
    currentUnit: 'Unit 3: My Colorful Toys',
    studentCount: 12
  },
  {
    id: 'class-2',
    name: 'Starters 2B (Khối Lớp 2)',
    grade: 2,
    teacherName: 'Cô Emily (Thu Hương)',
    roomNumber: 'Phòng 104 - Tầng 1',
    scheduleDescription: 'Thứ 3 & Thứ 5 (17:30 - 19:00)',
    daysOfWeek: [2, 4],
    timeSlot: '17:30 - 19:00',
    color: 'from-emerald-400 to-teal-500',
    currentUnit: 'Unit 4: Family & Pets',
    studentCount: 14
  },
  {
    id: 'class-3',
    name: 'Movers 3A (Khối Lớp 3)',
    grade: 3,
    teacherName: 'Cô Emily (Thu Hương)',
    roomNumber: 'Phòng 201 - Tầng 2',
    scheduleDescription: 'Thứ 2 & Thứ 4 (18:30 - 20:00)',
    daysOfWeek: [1, 3],
    timeSlot: '18:30 - 20:00',
    color: 'from-blue-500 to-indigo-600',
    currentUnit: 'Unit 4: Wild Animals & Safari',
    studentCount: 15
  },
  {
    id: 'class-4',
    name: 'Movers 4A (Khối Lớp 4)',
    grade: 4,
    teacherName: 'Cô Sarah Johnson',
    roomNumber: 'Phòng 203 - Tầng 2',
    scheduleDescription: 'Thứ 3 & Thứ 6 (18:00 - 19:30)',
    daysOfWeek: [2, 5],
    timeSlot: '18:00 - 19:30',
    color: 'from-purple-500 to-pink-500',
    currentUnit: 'Unit 5: In Town & Directions',
    studentCount: 16
  },
  {
    id: 'class-5',
    name: 'Flyers 5A (Khối Lớp 5)',
    grade: 5,
    teacherName: 'Thầy David Miller',
    roomNumber: 'Phòng 301 - Tầng 3',
    scheduleDescription: 'Thứ 7 & Chủ Nhật (09:00 - 10:30)',
    daysOfWeek: [6, 0],
    timeSlot: '09:00 - 10:30',
    color: 'from-rose-500 to-red-600',
    currentUnit: 'Unit 6: Wonders of the World',
    studentCount: 18
  }
];

export const INITIAL_ATTENDANCE: AttendanceRecord[] = [
  {
    id: 'att-1',
    classId: 'class-3',
    date: '2026-09-15',
    studentId: 'stu-1',
    studentName: 'Nguyễn Minh Khôi',
    englishName: 'Tommy',
    status: 'present',
    note: 'Phát âm đuôi -s/es rất chuẩn, tích cực giơ tay +3 sao ⭐',
    checkInTime: '18:25',
    recordedBy: 'Cô Emily'
  },
  {
    id: 'att-2',
    classId: 'class-3',
    date: '2026-09-15',
    studentId: 'stu-3',
    studentName: 'Lê Tuấn Kiệt',
    englishName: 'Lucas',
    status: 'present',
    note: 'Làm bài tập khởi động rất nhanh và chính xác!',
    checkInTime: '18:20',
    recordedBy: 'Cô Emily'
  },
  {
    id: 'att-3',
    classId: 'class-3',
    date: '2026-09-13',
    studentId: 'stu-1',
    studentName: 'Nguyễn Minh Khôi',
    englishName: 'Tommy',
    status: 'present',
    note: 'Tập trung nghe giảng, nhớ từ vựng tốt',
    checkInTime: '18:28',
    recordedBy: 'Cô Emily'
  },
  {
    id: 'att-4',
    classId: 'class-3',
    date: '2026-09-10',
    studentId: 'stu-1',
    studentName: 'Nguyễn Minh Khôi',
    englishName: 'Tommy',
    status: 'late',
    note: 'Đến trễ 5 phút do trời mưa, sau đó học bài rất ngoan',
    checkInTime: '18:35',
    recordedBy: 'Cô Emily'
  },
  {
    id: 'att-5',
    classId: 'class-3',
    date: '2026-09-08',
    studentId: 'stu-1',
    studentName: 'Nguyễn Minh Khôi',
    englishName: 'Tommy',
    status: 'present',
    note: 'Đạt danh hiệu Ngôi sao phát âm trong ngày ⭐',
    checkInTime: '18:22',
    recordedBy: 'Cô Emily'
  },
  {
    id: 'att-6',
    classId: 'class-3',
    date: '2026-09-03',
    studentId: 'stu-1',
    studentName: 'Nguyễn Minh Khôi',
    englishName: 'Tommy',
    status: 'excused',
    note: 'Phụ huynh xin phép nghỉ về quê có việc gia đình',
    checkInTime: '-',
    recordedBy: 'Cô Emily'
  },
  {
    id: 'att-7',
    classId: 'class-1',
    date: '2026-09-15',
    studentId: 'stu-2',
    studentName: 'Trần Bảo An',
    englishName: 'Lily',
    status: 'present',
    note: 'Hát bài ABC rất to và tự tin!',
    checkInTime: '16:55',
    recordedBy: 'Cô Emily'
  }
];

export const INITIAL_HOMEWORK: Homework[] = [
  {
    id: 'hw-1',
    classId: 'class-3',
    className: 'Movers 3A (Khối Lớp 3)',
    grade: 3,
    title: 'Unit 4: Animal Safari Challenge',
    unit: 'Unit 4 - Wild Animals',
    description: 'Các con hãy chọn tên con vật đúng và hoàn thành các câu miêu tả sau nhé!',
    assignedDate: '2026-09-15',
    dueDate: '2026-09-18',
    points: 10,
    questions: [
      {
        id: 'q1',
        question: 'Which animal has a very long neck and eats leaves on tall trees?',
        type: 'multiple-choice',
        options: ['Giraffe 🦒', 'Elephant 🐘', 'Tiger 🐯', 'Penguin 🐧'],
        correctAnswer: 'Giraffe 🦒'
      },
      {
        id: 'q2',
        question: 'Monkeys love eating sweet yellow _______.',
        type: 'multiple-choice',
        options: ['bananas 🍌', 'apples 🍎', 'carrots 🥕', 'candies 🍬'],
        correctAnswer: 'bananas 🍌'
      },
      {
        id: 'q3',
        question: 'What sound does a lion make?',
        type: 'multiple-choice',
        options: ['Roar! 🦁', 'Meow! 🐱', 'Oink! 🐷', 'Ribbit! 🐸'],
        correctAnswer: 'Roar! 🦁'
      },
      {
        id: 'q4',
        question: 'A kangaroo carries its baby in a _______.',
        type: 'multiple-choice',
        options: ['pouch', 'pocket', 'box', 'backpack'],
        correctAnswer: 'pouch'
      },
      {
        id: 'q5',
        question: 'Is a dolphin a fish or a mammal?',
        type: 'multiple-choice',
        options: ['Mammal (Động vật có vú)', 'Fish (Cá)', 'Bird (Chim)', 'Reptile (Bò sát)'],
        correctAnswer: 'Mammal (Động vật có vú)'
      }
    ]
  },
  {
    id: 'hw-2',
    classId: 'class-3',
    className: 'Movers 3A (Khối Lớp 3)',
    grade: 3,
    title: 'Unit 3: My Busy School Day',
    unit: 'Unit 3 - Daily Routines',
    description: 'Bài tập ôn tập về các môn học yêu thích và thời gian biểu hàng ngày.',
    assignedDate: '2026-09-10',
    dueDate: '2026-09-13',
    points: 10,
    questions: [
      {
        id: 'q2-1',
        question: 'What subject do we sing songs and play the piano in?',
        type: 'multiple-choice',
        options: ['Music 🎵', 'Math ➗', 'English 📚', 'Science 🔬'],
        correctAnswer: 'Music 🎵'
      },
      {
        id: 'q2-2',
        question: 'I brush my teeth _______ I go to bed.',
        type: 'multiple-choice',
        options: ['before', 'after', 'during', 'while'],
        correctAnswer: 'before'
      }
    ]
  },
  {
    id: 'hw-3',
    classId: 'class-1',
    className: 'Starters 1A (Khối Lớp 1)',
    grade: 1,
    title: 'Unit 3: Colors & Cute Toys',
    unit: 'Unit 3 - Colors & Toys',
    description: 'Bé hãy chọn đúng màu sắc cho các món đồ chơi đáng yêu nhé!',
    assignedDate: '2026-09-14',
    dueDate: '2026-09-17',
    points: 10,
    questions: [
      {
        id: 'q3-1',
        question: 'What color is the sun? ☀️',
        type: 'multiple-choice',
        options: ['Yellow 🟡', 'Blue 🔵', 'Green 🟢', 'Black ⚫'],
        correctAnswer: 'Yellow 🟡'
      },
      {
        id: 'q3-2',
        question: 'The toy car is red. 🚗 Chọn màu Red:',
        type: 'multiple-choice',
        options: ['Red 🔴', 'White ⚪', 'Purple 🟣', 'Orange 🟠'],
        correctAnswer: 'Red 🔴'
      }
    ]
  }
];

export const INITIAL_SUBMISSIONS: HomeworkSubmission[] = [
  {
    id: 'sub-1',
    homeworkId: 'hw-2',
    classId: 'class-3',
    className: 'Movers 3A (Khối Lớp 3)',
    studentId: 'stu-1',
    studentName: 'Nguyễn Minh Khôi',
    englishName: 'Tommy',
    submittedAt: '2026-09-12 19:40',
    answers: {
      'q2-1': 'Music 🎵',
      'q2-2': 'before'
    },
    score: 10,
    starsAwarded: 5,
    teacherFeedback: 'Tuyệt vời lắm Tommy! Con trả lời đúng hết 100% và nộp bài rất sớm. Cô tặng con 5 sao vàng!',
    feedbackSticker: 'super-star',
    status: 'graded',
    gradedAt: '2026-09-13 09:15'
  },
  {
    id: 'sub-2',
    homeworkId: 'hw-2',
    classId: 'class-3',
    className: 'Movers 3A (Khối Lớp 3)',
    studentId: 'stu-3',
    studentName: 'Lê Tuấn Kiệt',
    englishName: 'Lucas',
    submittedAt: '2026-09-12 20:15',
    answers: {
      'q2-1': 'Music 🎵',
      'q2-2': 'before'
    },
    score: 10,
    starsAwarded: 5,
    teacherFeedback: 'Excellent work Lucas! Good job on daily routine prepositions.',
    feedbackSticker: 'champion',
    status: 'graded',
    gradedAt: '2026-09-13 09:20'
  },
  {
    id: 'sub-3',
    homeworkId: 'hw-3',
    classId: 'class-1',
    className: 'Starters 1A (Khối Lớp 1)',
    studentId: 'stu-2',
    studentName: 'Trần Bảo An',
    englishName: 'Jenny',
    submittedAt: '2026-09-17 10:30',
    answers: {
      'q3-1': 'Yellow 🟡',
      'q3-2': 'Red 🔴'
    },
    score: 10,
    starsAwarded: 5,
    status: 'submitted' // Needs teacher grading!
  },
  {
    id: 'sub-4',
    homeworkId: 'hw-1',
    classId: 'class-3',
    className: 'Movers 3A (Khối Lớp 3)',
    studentId: 'stu-1',
    studentName: 'Nguyễn Minh Khôi',
    englishName: 'Tommy',
    submittedAt: '2026-09-16 21:05',
    answers: {
      'q1': 'Giraffe 🦒',
      'q2': 'bananas 🍌',
      'q3': 'Roar! 🦁',
      'q4': 'pouch',
      'q5': 'Mammal (Động vật có vú)'
    },
    score: 10,
    starsAwarded: 5,
    status: 'submitted' // Needs teacher grading!
  }
];

export const INITIAL_MATERIALS: StudyMaterial[] = [
  {
    id: 'mat-1',
    title: 'Flashcard 3D: Wild Safari Animals (Động vật hoang dã)',
    unit: 'Unit 4',
    grade: 3,
    classId: 'class-3',
    type: 'flashcard',
    description: 'Thẻ từ vựng sinh động có phát âm chuẩn bản xứ, hình minh họa vui nhộn giúp bé ghi nhớ nhanh.',
    downloadCount: 48,
    uploadedAt: '2026-09-14',
    tags: ['Vocabulary', 'Flashcard', 'Animals'],
    vocabItems: [
      { en: 'Giraffe', vi: 'Hươu cao cổ', phonetic: '/dʒɪˈrɑːf/', icon: '🦒' },
      { en: 'Elephant', vi: 'Con voi', phonetic: '/ˈel.ɪ.fənt/', icon: '🐘' },
      { en: 'Lion', vi: 'Sư tử', phonetic: '/ˈlaɪ.ən/', icon: '🦁' },
      { en: 'Monkey', vi: 'Con khỉ', phonetic: '/ˈmʌŋ.ki/', icon: '🐒' },
      { en: 'Zebra', vi: 'Ngựa vằn', phonetic: '/ˈzeb.rə/', icon: '🦓' },
      { en: 'Hippo', vi: 'Hà mã', phonetic: '/ˈhɪp.oʊ/', icon: '🦛' }
    ]
  },
  {
    id: 'mat-2',
    title: 'Audio Luyện Nghe: Conversation at the Zoo (Giọng Anh - Mỹ chuẩn)',
    unit: 'Unit 4',
    grade: 3,
    classId: 'class-3',
    type: 'audio',
    description: 'File nghe bài đàm thoại giữa bạn Tim và cô hướng dẫn viên sở thú, tốc độ vừa phải cho học sinh lớp 3.',
    fileSize: '3.4 MB',
    downloadCount: 35,
    uploadedAt: '2026-09-14',
    tags: ['Listening', 'Audio', 'Pronunciation']
  },
  {
    id: 'mat-3',
    title: 'Phiếu Bài Tập Tô Màu & Nối Từ: Colorful Animals Worksheet (PDF)',
    unit: 'Unit 4',
    grade: 3,
    classId: 'class-3',
    type: 'pdf',
    description: 'Phiếu học tập in màu siêu đẹp, bé vừa tô màu vừa luyện viết từ vựng tiếng Anh theo nét.',
    fileSize: '1.8 MB',
    downloadCount: 62,
    uploadedAt: '2026-09-12',
    tags: ['Worksheet', 'Printable', 'Writing']
  },
  {
    id: 'mat-4',
    title: 'Video Bài Hát Vui Nhộn: The Animal Boogie & Dance Along',
    unit: 'Unit 4',
    grade: 3,
    classId: 'class-3',
    type: 'video',
    description: 'Bài hát vận động theo nhịp điệu tiếng Anh sôi nổi, kích thích phản xạ nghe nói tự nhiên.',
    fileSize: '15.2 MB',
    downloadCount: 89,
    uploadedAt: '2026-09-10',
    tags: ['Song', 'Video', 'Kinesthetic']
  },
  {
    id: 'mat-5',
    title: 'Tài liệu Starters Lớp 1: Flashcard 10 Màu Sắc & Đồ Chơi',
    unit: 'Unit 3',
    grade: 1,
    classId: 'class-1',
    type: 'flashcard',
    description: 'Thẻ từ vựng cho bé lớp 1 làm quen với Red, Blue, Yellow, Green, Ball, Doll, Robot, Car.',
    downloadCount: 76,
    uploadedAt: '2026-09-11',
    tags: ['Starters', 'Colors', 'Grade 1'],
    vocabItems: [
      { en: 'Red', vi: 'Màu đỏ', phonetic: '/red/', icon: '🔴' },
      { en: 'Blue', vi: 'Màu xanh dương', phonetic: '/bluː/', icon: '🔵' },
      { en: 'Yellow', vi: 'Màu vàng', phonetic: '/ˈjel.oʊ/', icon: '🟡' },
      { en: 'Green', vi: 'Màu xanh lá', phonetic: '/ɡriːn/', icon: '🟢' },
      { en: 'Teddy Bear', vi: 'Gấu bông', phonetic: '/ˈted.i ˌbeər/', icon: '🧸' },
      { en: 'Toy Car', vi: 'Ô tô đồ chơi', phonetic: '/tɔɪ kɑːr/', icon: '🚗' }
    ]
  }
];

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-1',
    targetRole: 'all',
    classId: 'class-3',
    title: '⏰ Nhắc nhở lịch học tối nay!',
    message: 'Lớp Movers 3A có buổi học lúc 18:30 hôm nay (Phòng 201). Chủ đề: Safari Animals. Các con nhớ mang sách nhé!',
    type: 'schedule',
    createdAt: '2026-09-17 08:00',
    read: false
  },
  {
    id: 'notif-2',
    targetRole: 'parent',
    targetUserId: 'stu-1',
    title: '📝 Đã có kết quả bài tập Unit 3!',
    message: 'Cô Emily đã chấm bài tập Unit 3 của bé Tommy (Minh Khôi): 10/10 ⭐ (Khen ngợi nỗ lực tuyệt vời).',
    type: 'homework',
    createdAt: '2026-09-16 19:30',
    read: false
  },
  {
    id: 'notif-3',
    targetRole: 'parent',
    targetUserId: 'stu-1',
    title: '✅ Thông báo điểm danh buổi học 15/09',
    message: 'Bé Tommy (Minh Khôi) đã có mặt đúng giờ (18:25). Ghi chú của cô giáo: Phát âm đuôi -s/es rất chuẩn, tích cực phát biểu.',
    type: 'attendance',
    createdAt: '2026-09-15 18:30',
    read: true
  },
  {
    id: 'notif-4',
    targetRole: 'teacher',
    title: '👤 Học sinh mới đăng ký cần duyệt',
    message: 'Bé Bùi Đức Anh (Alex - Lớp 3) vừa đăng ký vào lớp Movers 3A. Cô Emily vui lòng xem và duyệt tài khoản nhé.',
    type: 'announcement',
    createdAt: '2026-09-16 10:15',
    read: false
  },
  {
    id: 'notif-5',
    targetRole: 'student',
    targetUserId: 'stu-1',
    title: '🏆 Chúc mừng Tommy lọt Top 2 Bảng Vàng!',
    message: 'Bạn đã đạt 175 Sao Vàng ⭐ và nhận huy hiệu "Grammar Explorer". Hãy cố gắng đạt mốc 200 sao nhé!',
    type: 'award',
    createdAt: '2026-09-15 20:10',
    read: false
  }
];

export const STUDENT_BADGES: StudentBadge[] = [
  {
    id: 'badge-1',
    name: 'Chuyên Cần Vàng',
    icon: '🎯',
    description: 'Tham gia đầy đủ 100% các buổi học trong tháng không vắng buổi nào',
    rarity: 'epic'
  },
  {
    id: 'badge-2',
    name: 'Bậc Thầy Từ Vựng',
    icon: '📖',
    description: 'Ghi nhớ và phát âm chuẩn trên 50 từ vựng tiếng Anh',
    rarity: 'rare'
  },
  {
    id: 'badge-3',
    name: 'Chiến Binh Bài Tập',
    icon: '⭐',
    description: 'Hoàn thành bài tập về nhà đúng hạn 5 lần liên tiếp',
    rarity: 'common'
  },
  {
    id: 'badge-4',
    name: 'Ngôi Sao Sáng Tạo',
    icon: '🎨',
    description: 'Thuyết trình hoặc vẽ tranh chủ đề tiếng Anh xuất sắc',
    rarity: 'rare'
  },
  {
    id: 'badge-5',
    name: 'Vua Thính Giác',
    icon: '🎧',
    description: 'Đạt điểm tối đa trong phần thi kỹ năng Listening',
    rarity: 'epic'
  }
];
