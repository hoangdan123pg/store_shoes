import { BrowserRouter, Routes, Route } from 'react-router-dom';

import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import HomePageLayOut from './layouts/HomePageLayOut';
import { ContextProvider } from './context/Context';
import MyAccount from './pages/MyAccount';
import CartPage from './pages/CartPage';
import RegisterPage from './pages/RegisterPage';
import ProductPage from './pages/ProductPage';
import CollectionPage from './pages/CollectionPage';

import AdminLayout from './layouts/admin/LayoutAdmin';
import ManagerProduct from './pages/admin/ManagerProduct';
import OrderManager from './pages/admin/ManagerOrder';

function App() {
  return (
    <>
      <ContextProvider>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={
              <HomePageLayOut>
                <HomePage />
              </HomePageLayOut>} />

            <Route path='/my-account/:option?' element={
              <HomePageLayOut>
                <MyAccount />
              </HomePageLayOut>} />

            <Route path='/cart' element={
              <HomePageLayOut>
                <CartPage />
              </HomePageLayOut>} />

            <Route path='/register&login' element={
              <HomePageLayOut>
                <RegisterPage />
              </HomePageLayOut>} />

            <Route path='/product/:name?' element={
              <HomePageLayOut>
                <ProductPage />
              </HomePageLayOut>} />

            <Route path='/collections/:category?' element={
              <MainLayout>
                <CollectionPage />
              </MainLayout>} />
            {/* Admin */}

            <Route path='/admin/manager-product/:page?' element={
              <AdminLayout>
                <ManagerProduct />
              </AdminLayout>} />

            <Route path='/admin/manager-order/:page?' element={
              <AdminLayout>
                <OrderManager />
              </AdminLayout>} />
          </Routes>



        </BrowserRouter>
      </ContextProvider>
    </>
  );
}

export default App;
