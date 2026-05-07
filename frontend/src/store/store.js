import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice.js';
import { authApi } from './api/authApi.js';
import { studentApi } from './api/studentApi.js';
import { teacherApi } from './api/teacherApi.js';
import { classApi } from './api/classApi.js';
import { attendanceApi } from './api/attendanceApi.js';
import { feeApi } from './api/feeApi.js';
import { gradeApi } from './api/gradeApi.js';
import { reportApi } from './api/reportApi.js';
import { subjectApi } from './api/subjectApi.js';
import { examApi } from './api/examApi.js';
import { assignmentApi } from './api/assignmentApi.js';
import { timetableApi } from './api/timetableApi.js';
import { transportApi } from './api/transportApi.js';

const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
    [studentApi.reducerPath]: studentApi.reducer,
    [teacherApi.reducerPath]: teacherApi.reducer,
    [classApi.reducerPath]: classApi.reducer,
    [attendanceApi.reducerPath]: attendanceApi.reducer,
    [feeApi.reducerPath]: feeApi.reducer,
    [gradeApi.reducerPath]: gradeApi.reducer,
    [reportApi.reducerPath]: reportApi.reducer,
    [subjectApi.reducerPath]: subjectApi.reducer,
    [examApi.reducerPath]: examApi.reducer,
    [assignmentApi.reducerPath]: assignmentApi.reducer,
    [timetableApi.reducerPath]: timetableApi.reducer,
    [transportApi.reducerPath]: transportApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['auth/loginSuccess'],
      },
    })
      .concat(authApi.middleware)
      .concat(studentApi.middleware)
      .concat(teacherApi.middleware)
      .concat(classApi.middleware)
      .concat(attendanceApi.middleware)
      .concat(feeApi.middleware)
      .concat(gradeApi.middleware)
      .concat(reportApi.middleware)
      .concat(subjectApi.middleware)
      .concat(examApi.middleware)
      .concat(assignmentApi.middleware)
      .concat(timetableApi.middleware)
      .concat(transportApi.middleware)
});

export default store;
