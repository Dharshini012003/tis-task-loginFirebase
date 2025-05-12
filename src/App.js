import logo from './logo.svg';
import './App.css';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import { BrowserRouter,Route,Routes} from 'react-router-dom';
import DashBoard from './pages/DashBoard';
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <div className="App">
   <BrowserRouter>
   <div>
        <ToastContainer theme='dark' position='top-center' />
       <Routes>
          <Route path="/" element={<RegisterPage />}/>
          <Route path="/login" element={<LoginPage />}/>
          <Route path="/dashboard" element={<DashBoard/>}/>
          {/* <Route path="/SocialMedia" element={<SocialMedia/>}/> */}
          {/* <Route path="/" element={<h1>Home</h1>}/> */}
       </Routes>
       </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
