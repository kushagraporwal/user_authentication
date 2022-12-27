import logo from './logo.svg';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import User from './components/User';
import Logout from './components/Logout';
import Update from './components/Update';

function App() {
  return (
    <>
      <p></p>
      <Routes>
      <Route exact path="/" element={<Register/>}/>
      <Route exact path="/login" element={<Login/>}/>
      <Route exact path="/user/:userid" element={<User/>}/>
      <Route exact path="/logout" element={<Logout/>}/>
      <Route exact path="/update/:userid" element={<Update/>}/>
      </Routes>
    </>
  );
}

export default App;
