# Frontend Patterns (React 18 + Redux Toolkit + RTK Query)

## Components

**Location:** `frontend/src/components/<domain>/<ComponentName>/`  
**Naming:** PascalCase + `.jsx`  
**Example:** `StudentList.jsx`, `StudentForm.jsx`

### Folder Structure

```
StudentList/
  ├── StudentList.jsx          ← main component
  ├── StudentListRow.jsx       ← sub-component
  ├── StudentListFilters.jsx   ← sub-component
  └── index.js                 ← barrel export: export { default } from './StudentList'
```

### Template: List Component

```jsx
// components/student/StudentList/StudentList.jsx
import { useState } from 'react';
import { useGetStudentsQuery } from '../../../store/api/studentApi';
import { usePermission } from '../../../hooks/usePermission';
import StudentListRow from './StudentListRow';
import StudentListFilters from './StudentListFilters';
import {
  Table,
  Pagination,
  SearchBar,
  Spinner,
  EmptyState,
  Button,
} from '../../common';

const StudentList = () => {
  const [filters, setFilters] = useState({
    page: 1,
    limit: 20,
    search: '',
    classId: null,
    status: null,
  });

  // Fetch data with RTK Query (never in presentational components)
  const { data, isLoading, isError, error } = useGetStudentsQuery(filters);
  const { can } = usePermission();

  if (isLoading) return <Spinner />;
  if (isError)
    return (
      <EmptyState message={error?.data?.message || 'Failed to load students'} />
    );

  return (
    <div className="space-y-4">
      {/* Header with search and add button */}
      <div className="flex justify-between items-center">
        <SearchBar
          placeholder="Search students..."
          onSearch={(q) =>
            setFilters((f) => ({ ...f, search: q, page: 1 }))
          }
        />
        {can('CREATE_STUDENT') && (
          <Button to="/students/new" variant="primary">
            Add Student
          </Button>
        )}
      </div>

      {/* Filters */}
      <StudentListFilters
        onFilter={(newFilters) =>
          setFilters((prev) => ({ ...prev, ...newFilters, page: 1 }))
        }
      />

      {/* Table */}
      <Table columns={['Roll', 'Name', 'Class', 'Status', 'Actions']}>
        {data?.data.map((student) => (
          <StudentListRow key={student._id} student={student} />
        ))}
      </Table>

      {/* Pagination */}
      <Pagination
        total={data?.pagination.total}
        page={filters.page}
        limit={filters.limit}
        onChange={(page) => setFilters((f) => ({ ...f, page }))}
      />
    </div>
  );
};

export default StudentList;
```

### Template: Form Component

```jsx
// components/student/StudentForm/StudentForm.jsx
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useCreateStudentMutation, useUpdateStudentMutation } from '../../../store/api/studentApi';
import { Button, Input, Select, TextArea, Spinner } from '../../common';
import PersonalInfoStep from './PersonalInfoStep';
import ContactInfoStep from './ContactInfoStep';

const StudentForm = ({ student = null, onSuccess }) => {
  const [createStudent, { isLoading: isCreating }] = useCreateStudentMutation();
  const [updateStudent, { isLoading: isUpdating }] = useUpdateStudentMutation();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: student || {},
  });

  const onSubmit = async (data) => {
    try {
      if (student) {
        await updateStudent({ id: student._id, ...data }).unwrap();
        toast.success('Student updated');
      } else {
        await createStudent(data).unwrap();
        toast.success('Student created');
        reset();
      }
      onSuccess?.();
    } catch (err) {
      toast.error(err?.data?.message || 'Something went wrong');
    }
  };

  const isLoading = isCreating || isUpdating;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <PersonalInfoStep register={register} errors={errors} />
      <ContactInfoStep register={register} errors={errors} />

      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? <Spinner size="sm" /> : student ? 'Update' : 'Create'}
      </Button>
    </form>
  );
};

export default StudentForm;
```

### Component Rules

- ✅ One component per file
- ✅ Component folder contains component + sub-components + barrel export
- ✅ Files under ~150 lines — split if longer
- ✅ Fetch data in page/parent level only
- ✅ Use `useGetXQuery()` for data fetching (RTK Query)
- ✅ Show loading, error, empty states
- ✅ Use `usePermission()` to check access
- ✅ Use React Hook Form for form inputs
- ✅ Use `toast.error()` / `toast.success()` for notifications
- ❌ Never use `useEffect` + axios in presentational components
- ❌ Never prop drill more than 2 levels (use store or context)
- ❌ Never disable error boundaries

## RTK Query API Slices

**Location:** `frontend/src/store/api/<domain>Api.js`  
**Naming:** camelCase + `Api.js`  
**Example:** `studentApi.js`, `feeApi.js`

### Template

```javascript
// store/api/studentApi.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.REACT_APP_API_URL,
  prepareHeaders: (headers) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

export const studentApi = createApi({
  reducerPath: 'studentApi',
  baseQuery,
  tagTypes: ['Student'],
  endpoints: (builder) => ({
    // GET /api/v1/students?page=1&limit=20
    getStudents: builder.query({
      query: (params) => ({
        url: '/students',
        params,
      }),
      providesTags: ['Student'],
    }),

    // GET /api/v1/students/:id
    getStudentById: builder.query({
      query: (id) => `/students/${id}`,
      providesTags: (result, error, id) => [{ type: 'Student', id }],
    }),

    // POST /api/v1/students
    createStudent: builder.mutation({
      query: (body) => ({
        url: '/students',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Student'],
    }),

    // PUT /api/v1/students/:id
    updateStudent: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/students/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Student', id }],
    }),

    // DELETE /api/v1/students/:id
    deleteStudent: builder.mutation({
      query: (id) => ({
        url: `/students/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Student'],
    }),

    // GET /api/v1/students/:id/attendance
    getStudentAttendance: builder.query({
      query: (id) => `/students/${id}/attendance`,
      providesTags: (result, error, id) => [{ type: 'StudentAttendance', id }],
    }),
  }),
});

export const {
  useGetStudentsQuery,
  useGetStudentByIdQuery,
  useGetStudentAttendanceQuery,
  useCreateStudentMutation,
  useUpdateStudentMutation,
  useDeleteStudentMutation,
} = studentApi;
```

### RTK Query Rules

- ✅ One API file per domain
- ✅ Use `tagTypes` for cache invalidation
- ✅ `query` hooks provide data, `mutation` hooks for mutations
- ✅ Invalidate tags after mutations to refresh data
- ✅ Auto-generated hooks: `useGetXQuery`, `useCreateXMutation`
- ❌ Never hardcode URLs (use `process.env.REACT_APP_API_URL`)

## Custom Hooks

**Location:** `frontend/src/hooks/use<Name>.js`  
**Naming:** camelCase, starts with `use`  
**Example:** `usePermission.js`, `useAuth.js`

### Template: usePermission

```javascript
// hooks/usePermission.js
import { useSelector } from 'react-redux';
import { PERMISSIONS } from '../utils/permissions';

export const usePermission = () => {
  const { user } = useSelector((state) => state.auth);

  const can = (action) => {
    if (!user) return false;
    const rolePermissions = PERMISSIONS[user.role] || [];
    return rolePermissions.includes(action);
  };

  const canAny = (...actions) => actions.some(can);
  const canAll = (...actions) => actions.every(can);

  return { can, canAny, canAll, role: user?.role };
};
```

### Template: useAuth

```javascript
// hooks/useAuth.js
import { useSelector } from 'react-redux';

export const useAuth = () => {
  const { user, isAuthenticated, loading } = useSelector((state) => state.auth);

  return {
    user,
    isAuthenticated,
    loading,
    isAdmin: user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN',
    isSuperAdmin: user?.role === 'SUPER_ADMIN',
  };
};
```

### Hook Rules

- ✅ Hook name starts with `use`
- ✅ Encapsulates logic for reuse across components
- ✅ Return object of functions/values
- ✅ Can use other hooks
- ❌ Don't overuse — simple logic stays in components

## Redux Slices (UI State Only)

**Location:** `frontend/src/store/slices/<name>Slice.js`  
**Naming:** camelCase + `Slice.js`

```javascript
// store/slices/uiSlice.js
import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    sidebarOpen: true,
    activeModal: null,
    theme: 'light',
    confirmDialog: null,
  },
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    openModal: (state, action) => {
      state.activeModal = action.payload;
    },
    closeModal: (state) => {
      state.activeModal = null;
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
    },
    showConfirm: (state, action) => {
      state.confirmDialog = action.payload;
    },
    hideConfirm: (state) => {
      state.confirmDialog = null;
    },
  },
});

export const {
  toggleSidebar,
  openModal,
  closeModal,
  setTheme,
  showConfirm,
  hideConfirm,
} = uiSlice.actions;

export default uiSlice.reducer;
```

### Slice Rules

- ✅ Slices store **UI state only** (modals, sidebar, theme, tabs)
- ✅ Never store server data in slices (use RTK Query)
- ✅ Slices have `.actions` exported
- ❌ Don't mix server state with UI state

## Pages

**Location:** `frontend/src/pages/<domain>/<PageName>.jsx`  
**Naming:** PascalCase + `.jsx`

```jsx
// pages/students/StudentsPage.jsx
import { PageHeader } from '../../components/layout/PageHeader';
import { RoleGuard } from '../../components/auth/RoleGuard';
import { StudentList } from '../../components/student/StudentList';

const StudentsPage = () => (
  <RoleGuard allowed={['SUPER_ADMIN', 'ADMIN', 'PRINCIPAL', 'VICE_PRINCIPAL', 'TEACHER']}>
    <PageHeader
      title="Students"
      breadcrumb={['Home', 'Students']}
      description="Manage student records"
    />
    <StudentList />
  </RoleGuard>
);

export default StudentsPage;
```

### Page Rules

- ✅ Pages are thin wrappers that compose components
- ✅ Pages include `RoleGuard` for access control
- ✅ Pages wrap content in `PageHeader`
- ✅ Pages don't contain heavy logic
- ❌ Don't put UI components in pages

## Common Components (Shared UI)

**Location:** `frontend/src/components/common/`

Common UI atoms used across the app:

- `Button.jsx` — with variants: primary, secondary, danger, disabled
- `Input.jsx` — text input with validation errors
- `Select.jsx` — dropdown
- `TextArea.jsx` — multi-line text
- `Table.jsx` — data table with sorting/filtering
- `Pagination.jsx` — page navigation
- `SearchBar.jsx` — search input with debounce
- `Modal.jsx` — dialog
- `Spinner.jsx` — loading indicator
- `EmptyState.jsx` — no data message
- `Card.jsx` — container
- `Badge.jsx` — status badge
- `Avatar.jsx` — user profile picture
- `Toast.jsx` — notifications (use `react-hot-toast`)

### Usage

```jsx
import { Button, Input, Spinner, EmptyState, Table } from '../../common';

<Button variant="primary" size="lg">Click me</Button>
<Input placeholder="Name" error={errors.name?.message} {...register('name')} />
<Spinner />
<EmptyState message="No data" />
<Table columns={['Name', 'Email', 'Actions']}>
  {items.map(item => <tr key={item.id}>...</tr>)}
</Table>
```

## Layout Components

**Location:** `frontend/src/components/layout/`

- `AppLayout.jsx` — main wrapper with header, sidebar, content
- `Sidebar.jsx` — navigation menu
- `Navbar.jsx` — top bar with user menu
- `PageHeader.jsx` — page title + breadcrumb + description
- `Footer.jsx` — footer

### Usage

```jsx
import { AppLayout } from '../../components/layout';

<AppLayout>
  <PageHeader title="Students" breadcrumb={['Home', 'Students']} />
  <StudentList />
</AppLayout>
```

## Auth Components

**Location:** `frontend/src/components/auth/`

- `RoleGuard.jsx` — wrap page/component to enforce roles
- `ProtectedRoute.jsx` — React Router wrapper for protected pages
- `LoginForm.jsx` — login UI
- `MFASetup.jsx` — TOTP setup

### Usage

```jsx
<RoleGuard allowed={['ADMIN', 'PRINCIPAL']}>
  <SensitiveData />
</RoleGuard>
```

---

**End of Frontend Patterns**
