import React, { useEffect, useState, useContext } from 'react';
import {useNavigate, useParams, useLocation, NavLink} from 'react-router-dom'

const User = () => {

  const history= useNavigate();
  const location = useLocation();
  const {userid}= useParams();
  console.log("userid is "+ userid);
  const [userdata, setdata]= useState({});
  const [advt, setadvt] = useState({
    title:"", description:"", budget:0, link:""});

    let name, value;
    const handleinput= (e) =>{
        name= e.target.name;
        value= e.target.value;
        setadvt({...advt, [name]:value});
    }

  const callinfo = async()=>{
    try{
        console.log('welcome');
        const res= await fetch(`/${userid}/info`,{
            method: "GET",
            headers: {
                Accept: "application/json",
                "Content-Type":"application/json"
            },
            credentials: "include"
        });
        const data= await res.json();
        if(data=="-2")
        {
            window.alert('You must be logged in first');
            history('/login');
        }
        else
        {
          console.log(data);
        setdata(data);
        }
    }
    catch(err){
        console.log(err);
    }
}
const username= userdata.username;
const name1= userdata.name;
const email= userdata.email;
const password= userdata.password;

const send =async(e)=>{
  e.preventDefault();
  const {title, description, budget, link}= advt;
  try{
    if(title===""||description===""||budget==" "||link==="")
        {
            window.alert("Data is empty");
        }
        else{
    console.log("advt is "+ advt);
    const res= await fetch('https://ad-check.herokuapp.com/createad',{
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type":"application/json"
        },
        body: JSON.stringify({
          title:title,
          description:description,
          budget:budget,
          link:link,
          check:"OK"
        })
    });
    const data= await res.json();
    console.log('req is');
    console.log(data);
    if(data=="-8")
    {
        window.alert('Invalid data');
    }
    else
    {
        window.alert('Ad added successfully!');
    }
    console.log(data);
    window.location.reload();
    setadvt({title:"",description:"",budget: 0, link:"",});
  }
}
catch(err){
    console.log(err);
}
}

useEffect(() => {
  callinfo();
},[]);

  return (
  <div>
  <div className='container'>
    <div style={{maxWidth: '600px', width: '90%', border: '5px solid black', marginLeft: 'auto', marginRight: 'auto', marginTop: '50px', backgroundColor: '#F9F4D1', padding: '20px', borderRadius: '10px', boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px'}}>
    <h1 style={{textAlign: 'center'}}>User Information</h1>

    <form method="POST" className="validated-form" noValidate>

    <div class="mb-3">
    <label for="username" className="form-label">Username</label>
        <h2>{username}</h2>
    </div>

    <div class="mb-3">
    <label for="username" className="form-label">Name</label>
        <h2>{name1}</h2>
    </div>

    <div class="mb-3">
    <label for="username" className="form-label">Email</label>
        <h2>{email}</h2>
    </div>
    
    <button type="button" class="btn btn-warning" style={{display: 'block', marginLeft: 'auto', marginRight: 'auto', marginTop: '20px'}}>
      <NavLink className="nav-link" to={`/update/${userdata._id}`} style={{color: 'white', textAlign: 'center', marginLeft: 'auto', marginRight: 'auto'}}>Update</NavLink>
      </button>
      <button type="button" class="btn btn-danger" style={{display: 'block', marginLeft: 'auto', marginRight: 'auto', marginTop: '20px'}}>
      <NavLink className="nav-link" to="/logout" style={{color: 'white', textAlign: 'center', marginLeft: 'auto', marginRight: 'auto'}}>Logout</NavLink>
      </button>

    </form>
    </div>
    </div>
  </div>
  )
};

export default User;