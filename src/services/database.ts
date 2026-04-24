// src/services/database.ts
import { db } from "./firebase";
import {
  collection,
  getDocs,
  setDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";

export interface TeacherData {
  id: string;
  name: string;
  code: string;
  email?: string;
  subject: string;
  subjects: string[];
  color: string;
  minHours: number;
  maxHours: number;
  wantsLongLunch: boolean;
}


export interface ClassSession {
  id: string;
  teacherId: string | null;
  subject: string;
  day: string;
  startTime: string;
  endTime: string;
  room: string;
  courseId: string;
  year: number;
}

const TEACHERS = "teachers";
const GRADES = "grades";

export async function salvarProfessor(professor: TeacherData) {
  await setDoc(doc(db, TEACHERS, professor.id), professor);
}

export async function buscarProfessores(): Promise<TeacherData[]> {
  const snapshot = await getDocs(collection(db, TEACHERS));
  return snapshot.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  })) as TeacherData[];
}

export async function excluirProfessor(id: string) {
  await deleteDoc(doc(db, TEACHERS, id));
}

export async function salvarGrade(lista: ClassSession[]) {
  await Promise.all(
    lista.map((item) => setDoc(doc(db, GRADES, item.id), item))
  );
}

export async function buscarGrades(): Promise<ClassSession[]> {
  const snapshot = await getDocs(collection(db, GRADES));
  return snapshot.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  })) as ClassSession[];
}