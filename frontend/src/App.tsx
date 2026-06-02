import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { Footer } from "./components/Footer";
import { Navbar } from "./components/Navbar";
import { Sidebar } from "./components/Sidebar";
import { Toaster } from "./components/ui/sonner";
import { AlertsPage } from "./pages/AlertsPage";
import { CategoriesPage } from "./pages/CategoriesPage";
import { DashboardPage } from "./pages/DashboardPage";
import { FavoritesPage } from "./pages/FavoritesPage";
import { HomePage } from "./pages/HomePage";
import { ProductDetailPage } from "./pages/ProductDetailPage";
import { StoresPage } from "./pages/StoresPage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { AdminPage } from "./pages/AdminPage";
import { AdminUsersPage } from "./pages/AdminUsersPage";
import { ProfilePage } from "./pages/ProfilePage";
import { AdminProductsPage } from "./pages/AdminProductsPage";
import { AdminRoute } from "./components/AdminRoute";
import { AppErrorBoundary } from "./components/AppErrorBoundary";
import { ProtectedRoute } from "./components/ProtectedRoute";

function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-white flex flex-col">
      <Navbar />
      <div className="flex min-w-0 flex-1">
        {!isHome && <Sidebar />}
        <main
          className={
            isHome ? "min-w-0 flex-1 flex flex-col" : "min-w-0 flex-1 p-3 sm:p-4 md:p-6 lg:p-8"
          }
        >
          {children}
        </main>
      </div>
      <Footer />
      <Toaster />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <AppErrorBoundary>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/product/:id" element={<ProductDetailPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/alerts" element={<AlertsPage />} />
            <Route path="/favorites" element={<FavoritesPage />} />
            <Route path="/stores" element={<StoresPage />} />
            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminPage />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <AdminRoute>
                  <AdminUsersPage />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/products"
              element={
                <AdminRoute>
                  <AdminProductsPage />
                </AdminRoute>
              }
            />
          </Routes>
        </AppErrorBoundary>
      </Layout>
    </BrowserRouter>
  );
}
