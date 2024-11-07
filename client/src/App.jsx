import './App.css';
import { Route, Routes, useLocation } from 'react-router-dom';
import { Toaster } from 'sonner';
import Home from './components/pages/Home';
import SignUp from './components/pages/SignUp';
import SignIn from './components/pages/SignIn';
import Navbar from './components/layout/Navbar';
import { useEffect, useState } from 'react';
import DesignEdit from './components/pages/designs/DesignEdit';



function App() {

  const location = useLocation();
  const [shouldRenderNav, setShouldRenderNav] = useState(false)

  useEffect(() => {
    const routesNotIncludeNavbar = ['/sign-in', '/sign-up', '/designs'];
    if (routesNotIncludeNavbar.some((route) => location.pathname.includes(route))) {
      setShouldRenderNav(false)
    }
    else {
      setShouldRenderNav(true);
    }
  }, [location.pathname]);

  return (
    <main>
      {shouldRenderNav && <Navbar />}
      <Toaster duration={1500} position="bottom-right" richColors theme='light' />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/designs/:id" element={<DesignEdit />} />
      </Routes>
    </main>
  );
}

export default App;
