import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from '@/pages/auth/Login';
import { OrgSignup } from '@/pages/auth/CreateOrg';
import { Dashboard } from '@/pages/Dashboard';
import { Leaves } from '@/pages/Leaves';
import { Holidays } from '@/pages/Holidays';
import { Organization } from '@/pages/Organization';
import { ProtectedRoute } from '@/components/ui/ProtectedRoute';
import { SetPassword } from '@/pages/auth/SetPassword';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import type { Dispatch } from '@/store';
import { LeaveTypes } from './pages/LeaveTypes';
import { LeaveRequests } from '@/pages/LeaveRequests';

function App() {
  const dispatch = useDispatch<Dispatch>();
  useEffect(() => {
    dispatch.auth.rehydrateAuth();
  }, [dispatch]);
  
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<OrgSignup />} />
        <Route path="/set-password/:token" element={<SetPassword />} />
        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/leaves"
          element={
            <ProtectedRoute>
              <Leaves />
            </ProtectedRoute>
          }
        />
        <Route
          path="/leave-requests"
          element={
            <ProtectedRoute>
              <LeaveRequests />
            </ProtectedRoute>
          }
        />
        <Route
          path="/leave-types"
          element={
            <ProtectedRoute>
              <LeaveTypes />
            </ProtectedRoute>
          }
        />
         <Route
          path="/holidays"
          element={
            <ProtectedRoute>
              <Holidays />
            </ProtectedRoute>
          }
        />
        <Route
          path="/organization"
          element={
            <ProtectedRoute>
              <Organization />
            </ProtectedRoute>
          }
        />

        {/* Redirect root to dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* 404 */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;