import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice.js';
import uiReducer from './slices/uiSlice.js';
import studentReducer from './slices/studentSlice.js';
import teacherReducer from './slices/teacherSlice.js';
import feeReducer from './slices/feeSlice.js';
import gradeReducer from './slices/gradeSlice.js';
import attendanceReducer from './slices/attendanceSlice.js';
import examReducer from './slices/examSlice.js';
import notificationReducer from './slices/notificationSlice.js';

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
import { paymentApi } from './api/paymentApi.js';
import { communicationApi } from './api/communicationApi.js';
import { financeApi } from './api/financeApi.js';
import { analyticsApi } from './api/analyticsApi.js';
import { settingsApi } from './api/settingsApi.js';
import { userApi } from './api/userApi.js';
import { hrApi } from './api/hrApi.js';
import { hostelApi } from './api/hostelApi.js';
import { libraryApi } from './api/libraryApi.js';
import { admissionApi } from './api/admissionApi.js';
import { disciplineApi } from './api/disciplineApi.js';
import { alumniApi } from './api/alumniApi.js';
import { parentPortalApi } from './api/parentPortalApi.js';

const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
    student: studentReducer,
    teacher: teacherReducer,
    fee: feeReducer,
    grade: gradeReducer,
    attendance: attendanceReducer,
    exam: examReducer,
    notification: notificationReducer,
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
    [paymentApi.reducerPath]: paymentApi.reducer,
    [communicationApi.reducerPath]: communicationApi.reducer,
    [financeApi.reducerPath]: financeApi.reducer,
    [analyticsApi.reducerPath]: analyticsApi.reducer,
    [settingsApi.reducerPath]: settingsApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [hrApi.reducerPath]: hrApi.reducer,
    [hostelApi.reducerPath]: hostelApi.reducer,
    [libraryApi.reducerPath]: libraryApi.reducer,
    [admissionApi.reducerPath]: admissionApi.reducer,
    [disciplineApi.reducerPath]: disciplineApi.reducer,
    [alumniApi.reducerPath]: alumniApi.reducer,
    [parentPortalApi.reducerPath]: parentPortalApi.reducer,
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
      .concat(paymentApi.middleware)
      .concat(communicationApi.middleware)
      .concat(financeApi.middleware)
      .concat(analyticsApi.middleware)
      .concat(settingsApi.middleware)
      .concat(userApi.middleware)
      .concat(hrApi.middleware)
      .concat(hostelApi.middleware)
      .concat(libraryApi.middleware)
      .concat(admissionApi.middleware)
      .concat(disciplineApi.middleware)
      .concat(alumniApi.middleware)
      .concat(parentPortalApi.middleware),
});

export default store;
