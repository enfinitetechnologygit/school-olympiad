import { School, Student, MockExam, StudentExamAttempt, Announcement, ExamCenter, ExamSchedule } from "../src/types";

function loadFallbackData<T>(filename: string, defaultValue: T): T {
  // Local JSON files are disabled; always return the default in-memory value
  return defaultValue;
}

export function saveFallbackData<T>(filename: string, data: T) {
  // Local JSON files are disabled; do not save data to files
}

export const defaultSchools: School[] = [];

export let schools: School[] = loadFallbackData("db_schools.json", defaultSchools);

export const defaultStudents: Student[] = [];

export let students: Student[] = loadFallbackData("db_students.json", defaultStudents);

export const defaultMockExams: MockExam[] = [];

export let mockExams: MockExam[] = loadFallbackData("db_mock_exams.json", defaultMockExams);

export const defaultExamAttempts: StudentExamAttempt[] = [];

export let examAttempts: StudentExamAttempt[] = loadFallbackData("db_exam_attempts.json", defaultExamAttempts);

export const defaultAnnouncements: Announcement[] = [];

export let announcements: Announcement[] = loadFallbackData("db_announcements.json", defaultAnnouncements);

export const defaultHeaderAnnouncement = { text: "" };
export let headerAnnouncement = loadFallbackData("db_header_announcement.json", defaultHeaderAnnouncement);

export const defaultSliderImages: string[] = [];
export let sliderImages = loadFallbackData("db_slider_images.json", defaultSliderImages);


export const defaultExamCenters: ExamCenter[] = [];

export let examCenters: ExamCenter[] = loadFallbackData("db_exam_centers.json", defaultExamCenters);

export const defaultExamSchedule: ExamSchedule = {};
export let examSchedule: ExamSchedule = loadFallbackData("db_exam_schedule.json", defaultExamSchedule);

// --- MONGODB CONNECTIVITY SYSTEM & SEEDING ---


// Mock items store for offline fallback
export const defaultMockItems: any[] = [];

export let mockItems = loadFallbackData("db_mock_items.json", defaultMockItems);
