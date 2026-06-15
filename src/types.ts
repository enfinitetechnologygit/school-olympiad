export interface School {
  id: string; // SCH-XXXX (Approved) or RQ-XXXX (Pending)
  name: string;
  principalName: string;
  coordinatorName: string;
  mobile: string;
  email: string;
  address: string;
  city: string;
  state: string;
  boardType: string;
  totalStudents: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
  password?: string;
  preExamDate?: string;
  preExamTime?: string;
  preExamDuration?: string;
  passingMarks?: Record<string, number>;
}

export interface Student {
  id: string; // ENO-2026-XXXX
  name: string;
  classLevel: string; // "Class 5" to "Class 12"
  gender: string;
  dob: string;
  mobile: string;
  parentName: string;
  parentMobile: string;
  email: string;
  password?: string;
  schoolId: string; // References School.id
  schoolName: string;
  paymentStatus: 'PENDING' | 'COMPLETED';
  paymentId?: string;
  paymentAmount?: number;
  paymentDate?: string;
  qualificationStatus: 'TBD' | 'QUALIFIED' | 'NOT_QUALIFIED';
  admitCardGenerated: boolean;
  admitCardNumber?: string;
  stage1AdmitNumber?: string;
  stage2AdmitNumber?: string;
  stage1AdmitReleased?: boolean;
  stage2AdmitReleased?: boolean;
  score?: number;
  examCenterId?: string;
}

export interface Question {
  id: string;
  question: string;
  options: string[];
  correctOption: number; // 0-3
}

export interface MockExam {
  id: string;
  title: string;
  classGroup: string; // "5-6" | "7-8" | "9-10" | "11-12"
  durationMinutes: number;
  totalQuestions: number;
  questions: Question[];
  isActive: boolean;
}

export interface StudentExamAttempt {
  id: string;
  studentId: string;
  examId: string;
  examTitle: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  attemptedAt: string;
  timeSpentSeconds: number;
  answers: Record<string, number>; // questionId -> option index
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  audience: 'ALL' | 'SCHOOLS' | 'STUDENTS';
  postedBy: string;
}

export interface ExamCenter {
  id: string;
  name: string;
  city: string;
  capacity: number;
  allocatedStudentsCount: number;
}

export const EXAM_PATTERN = [
  { section: "Computer Fundamentals", weightage: "20%" },
  { section: "Programming & Logic", weightage: "25%" },
  { section: "AI & Modern Technology", weightage: "25%" },
  { section: "Cyber Security", weightage: "15%" },
  { section: "Reasoning & Problem Solving", weightage: "15%" }
];

export const OLYMPIAD_SYLLABUS: Record<string, {
  title: string;
  description: string;
  modules: Array<{ name: string; topics: string[] }>;
}> = {
  '5-6': {
    title: 'Group 1 Syllabus (Classes 5th–6th)',
    description: 'Introduction to foundational computer science, basic coding concepts, internet skills and early logical tools.',
    modules: [
      {
        name: 'Computer Fundamentals',
        topics: ['Parts of Computer', 'Input & Output Devices', 'Hardware & Software', 'Types of Computers', 'Operating System Basics']
      },
      {
        name: 'Digital Skills',
        topics: ['MS Paint', 'MS Word Basics', 'Internet Basics', 'Email Introduction']
      },
      {
        name: 'Coding Basics',
        topics: ['Introduction to Coding', 'Block-Based Programming', 'Scratch Basics', 'Simple Algorithms', 'Flowcharts']
      },
      {
        name: 'Logical Reasoning',
        topics: ['Patterns', 'Puzzle Solving', 'Number Series', 'Logical Thinking']
      },
      {
        name: 'Cyber Safety',
        topics: ['Safe Internet Usage', 'Password Safety', 'Digital Etiquette']
      },
      {
        name: 'Modern Technology',
        topics: ['Introduction to Artificial Intelligence', 'Smart Devices', 'Robots Around Us', 'Voice Assistants']
      }
    ]
  },
  '7-8': {
    title: 'Group 2 Syllabus (Classes 7th–8th)',
    description: 'Transitioning to structured programming logic, office tools, and core internet of things/machine learning topics.',
    modules: [
      {
        name: 'Computer Fundamentals',
        topics: ['Memory & Storage', 'Computer Generations', 'Operating Systems', 'File Management']
      },
      {
        name: 'Productivity Tools',
        topics: ['MS Word', 'PowerPoint', 'Excel Basics', 'Internet Research']
      },
      {
        name: 'Programming Concepts',
        topics: ['Scratch Programming', 'Python Basics', 'Variables & Data Types', 'Loops & Conditions']
      },
      {
        name: 'Logical & Computational Thinking',
        topics: ['Algorithms', 'Flowcharts', 'Problem Solving', 'Data Interpretation']
      },
      {
        name: 'Cyber Security',
        topics: ['Cyberbullying Awareness', 'Online Privacy', 'Malware Basics', 'Secure Browsing']
      },
      {
        name: 'Modern Technology',
        topics: ['Artificial Intelligence Basics', 'Machine Learning Introduction', 'Internet of Things (IoT)', 'Robotics Basics']
      }
    ]
  },
  '9-10': {
    title: 'Group 3 Syllabus (Classes 9th–10th)',
    description: 'High school computer science principles covering database fundamentals, full Python lists / dicts, and emerging sciences.',
    modules: [
      {
        name: 'Computer Science Fundamentals',
        topics: ['Computer Architecture', 'Networking Basics', 'Cloud Computing', 'Database Basics']
      },
      {
        name: 'Programming',
        topics: ['Python Programming', 'Functions', 'Lists & Dictionaries', 'File Handling', 'Basic Web Development']
      },
      {
        name: 'Artificial Intelligence & Data Science',
        topics: ['AI Concepts', 'Machine Learning Basics', 'Data Analysis Basics', 'Generative AI']
      },
      {
        name: 'Cyber Security',
        topics: ['Ethical Hacking Basics', 'Cyber Threats', 'Phishing & Scams', 'Digital Security']
      },
      {
        name: 'Emerging Technologies',
        topics: ['Blockchain Basics', 'AR/VR', 'Robotics', 'Drone Technology']
      },
      {
        name: 'Logical Reasoning',
        topics: ['Algorithms', 'Pseudocode', 'Analytical Thinking', 'Case Study Questions']
      }
    ]
  },
  '11-12': {
    title: 'Group 4 Syllabus (Classes 11th–12th)',
    description: 'Advanced algorithms, structured Object-Oriented programming architectures, database normalizations, cloud ecosystems, and tech entrepreneurship.',
    modules: [
      {
        name: 'Advanced Computer Science',
        topics: ['Computer Networks', 'Data Structures Basics', 'Database Management', 'Cloud Technologies']
      },
      {
        name: 'Programming & Development',
        topics: ['Advanced Python', 'Object-Oriented Programming', 'APIs Basics', 'Website Development Concepts']
      },
      {
        name: 'Artificial Intelligence & Future Tech',
        topics: ['Machine Learning Concepts', 'Generative AI', 'AI Ethics', 'Neural Networks Introduction', 'Automation Systems']
      },
      {
        name: 'Cyber Security & Ethical Hacking',
        topics: ['Cyber Attacks', 'Network Security', 'Encryption Basics', 'Ethical Hacking Concepts']
      },
      {
        name: 'Emerging Technologies',
        topics: ['Blockchain', 'Quantum Computing', 'AR/VR', 'Internet of Things', 'Space Technology']
      },
      {
        name: 'Innovation & Entrepreneurship',
        topics: ['Startup Ecosystem', 'Product Development', 'Technology Business Ideas', 'Digital Innovation']
      }
    ]
  }
};

export interface DBUser {
  id?: number;
  email: string;
  password?: string;
  name: string;
  role: 'admin' | 'school' | 'student';
  createdAt?: string;
}

export interface DBItem {
  id?: number;
  name: string;
  description: string;
  price: number;
  category: string;
  createdAt?: string;
}

export interface ExamSchedule {
  preExamDate?: string;
  preExamTime?: string;
  preExamDuration?: string;
  mainExamDate?: string;
  mainExamTime?: string;
  mainExamDuration?: string;
}


