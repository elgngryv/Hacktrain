export type Difficulty = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
export interface ObjectiveInput { skillCode: string; description: string }
export interface TaskInput { id?: string; title: string; instructions: string; difficulty: Difficulty; objectives: ObjectiveInput[] }
export interface TopicInput { title: string; tasks: TaskInput[] }
export interface CourseSummary { id: string; title: string; description: string; difficulty: Difficulty; status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'; version: number; createdAt: string }
export interface Course extends CourseSummary { topics: TopicInput[] }
export interface CourseAssignment { id: string; groupId: string }
export const difficultyNames: Record<Difficulty, string> = { BEGINNER: 'Başlanğıc', INTERMEDIATE: 'Orta', ADVANCED: 'İrəli' };
export const statusNames = { DRAFT: 'Qaralama', PUBLISHED: 'Yayımlanıb', ARCHIVED: 'Arxivdə' };
export function courseUpdate(course: Course) {
  return { version: course.version, title: course.title.trim(), description: course.description.trim(), difficulty: course.difficulty,
    topics: course.topics.map(topic => ({ title: topic.title.trim(), tasks: topic.tasks.map(task => ({ title: task.title.trim(), instructions: task.instructions.trim(), difficulty: task.difficulty, objectives: task.objectives.map(objective => ({ skillCode: objective.skillCode.trim(), description: objective.description.trim() })) })) })) };
}
