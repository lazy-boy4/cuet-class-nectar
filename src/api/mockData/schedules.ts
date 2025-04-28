
import { Schedule } from "@/types";

export const mockSchedules: Schedule[] = [
  {
    id: "schedule-1",
    classId: "class-1",
    dayOfWeek: "Monday", // Mapped from day
    day: "Monday", // Kept for backwards compatibility
    startTime: "09:00",
    endTime: "10:30",
    roomNumber: "CSE-301", // Mapped from room
    room: "CSE-301", // Kept for backwards compatibility
  },
  {
    id: "schedule-2",
    classId: "class-1",
    dayOfWeek: "Wednesday", // Mapped from day
    day: "Wednesday", // Kept for backwards compatibility
    startTime: "09:00",
    endTime: "10:30",
    roomNumber: "CSE-301", // Mapped from room
    room: "CSE-301", // Kept for backwards compatibility
  },
  {
    id: "schedule-3",
    classId: "class-2",
    dayOfWeek: "Monday", // Mapped from day
    day: "Monday", // Kept for backwards compatibility
    startTime: "11:00",
    endTime: "12:30",
    roomNumber: "CSE-302", // Mapped from room
    room: "CSE-302", // Kept for backwards compatibility
  },
  {
    id: "schedule-4",
    classId: "class-2",
    dayOfWeek: "Thursday", // Mapped from day
    day: "Thursday", // Kept for backwards compatibility
    startTime: "11:00",
    endTime: "12:30",
    roomNumber: "CSE-Lab-1", // Mapped from room
    room: "CSE-Lab-1", // Kept for backwards compatibility
  },
  {
    id: "schedule-5",
    classId: "class-3",
    dayOfWeek: "Tuesday", // Mapped from day
    day: "Tuesday", // Kept for backwards compatibility
    startTime: "09:00",
    endTime: "10:30",
    roomNumber: "EEE-201", // Mapped from room
    room: "EEE-201", // Kept for backwards compatibility
  },
  {
    id: "schedule-6",
    classId: "class-3",
    dayOfWeek: "Friday", // Mapped from day
    day: "Friday", // Kept for backwards compatibility
    startTime: "09:00",
    endTime: "10:30",
    roomNumber: "EEE-201", // Mapped from room
    room: "EEE-201", // Kept for backwards compatibility
  },
  {
    id: "schedule-7",
    classId: "class-4",
    dayOfWeek: "Tuesday", // Mapped from day
    day: "Tuesday", // Kept for backwards compatibility
    startTime: "11:00",
    endTime: "12:30",
    roomNumber: "EEE-202", // Mapped from room
    room: "EEE-202", // Kept for backwards compatibility
  },
  {
    id: "schedule-8",
    classId: "class-4",
    dayOfWeek: "Thursday", // Mapped from day
    day: "Thursday", // Kept for backwards compatibility
    startTime: "14:00",
    endTime: "15:30",
    roomNumber: "EEE-Lab-1", // Mapped from room
    room: "EEE-Lab-1", // Kept for backwards compatibility
  },
];
