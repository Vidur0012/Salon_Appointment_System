import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Button  } from 'react-bootstrap';
import { MDBInput} from 'mdbreact';
import { Modal } from 'react-bootstrap';
import Auth from '../Auth/auth';



function OwnerLogin({ setCust }) {
    const history = useHistory()
    const [show,setShow] = useState(false);
    const [header,setHeader] = useState("");
    const [msg,setMsg] = useState("");
    const [owner, setOwner] = useState({
        email: "",
        password: ""
    })
    const style = {
        backgroundPosition: "center" , 
        backgroundRepeat: "no-repeat",  
        backgroundSize: "cover",
        height:"100vh" ,
        backgroundImage: "url('/img/bg1.jpg')"
    }

    function handlechange(e) {
        const { name, value } = e.target;

        setOwner(
            {
                ...owner,
                [name]: value
            }
        )
    }

    async function login() {

        const { email, password } = owner;
        if (email && password) {
            var res = await fetch("http://localhost:9700/owner/ownerLogin", {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            })

            res = await res.json();

            if (res.wentWrong) {
                // alert(res.message);

                setHeader("Something Wrong");
                setMsg(res.message);
                setShow(true);
            }
            else {
                if (res.stat) {
                    localStorage.setItem("owner", JSON.stringify(res.owner));
                    localStorage.setItem("shop", JSON.stringify(res.shop));
                    Auth.setAuth(true);
                    // alert(res.message);
                    setHeader("Success");
                    setMsg(res.message);
                    setShow(true);

                    setCust(res.owner);
                   
                    if(res.shop.verified === "pending")
                        history.push('/verification');
                    else if(res.shop.verified === "Accept")
                        history.push('/ownerHome');
                    else
                        history.push('/verificationReject');

                }
                else {
                    setHeader("Invalid");
                    setMsg(res.message);
                    setShow(true);
                }
            }
        }
        else {
            setHeader("Invalid");
            setMsg("Input fields can't be blank.");
            setShow(true);
        }

    }

    return (
        <div style={style} className="main">
        <div  className='d-flex justify-content-center'>
            
            <div className='col-lg-5 bg-white' style={{borderRadius:"25px",boxShadow:"3px 3px rgb(33,37,41)"}}>
            <div className='mt-4 text-black'>
                        <h1 >Owner SignIn</h1>

                </div>
            
                <div className="form-group col-auto">
                    <MDBInput containerClass="text-left text-dark" label="Email Address" icon='user' type="text" name="email" value={owner.email} onChange={handlechange}  />
                </div>
                <div className="form-group col-auto">
                    <MDBInput containerClass="text-left text-dark" icon='unlock' label="Password" type='password' name="password" value={owner.password} onChange={handlechange} />
                    </div>
                <br />

                <Button  variant="blue" style={{borderRadius:"20px"}} className='col-6 text-white' onClick={login}>Log in</Button>
                <Modal
                    size="md"
                    show={show}
                    onHide={() => setShow(false)}
                    
                >
                    <Modal.Header closeButton>
                    <Modal.Title id="example-modal-sizes-title-sm">
                        {header}
                    </Modal.Title>
                    </Modal.Header>
                    <Modal.Body className='bg-light'>{msg}</Modal.Body>
                    <Modal.Footer>
                        <Button style={{borderRadius:"20px"}} onClick={()=>setShow(false)}>Close</Button>
                    </Modal.Footer>
                </Modal>
                
                <p className="text-right text-dark">
                    <br/>
                    Sign Up From <a href='/ownerregister'>Here</a>
                </p>
            
            </div>

     </div>
     </div>

        
    )
}

export default OwnerLogin;
