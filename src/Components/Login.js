import React, { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";

function Login() {
  const [hide, setHide] = useState(false);
  const username = useRef("");
  const password = useRef("");
  const navigate = useNavigate();

  const onSubmit = (e) => {
    e.preventDefault();
    console.log(username.current.value);
    console.log(password.current.value);
    navigate("/Dashboard");
  };
  const onSubmitForgotPass = (e) => {
    setHide(!hide);
  };
  return (
    <>
      <div className="bg d-flex align-items-center">
        <div className="container w-75">
          <div className=" row">
            <div className="col-sm-9 col-md-7 col-lg-5 mx-auto">
              <div className="card border-0 shadow rounded-0 my-5">
                <div className="card-body p-3 p-sm-5">
                  <div className="text-center">
                    <img
                      src="1cloudhub-small-logo.jfif"
                      alt="Svasti Logo"
                      className="login_logo "
                    />
                  </div>
                  {!hide && (
                    <h5 className="card-title text-center mt-2 mb-2 fw-light fs-5 font ">
                      Sign In
                    </h5>
                  )}

                  {!hide && (
                    <>
                      <form onSubmit={onSubmit}>
                        <div className="">
                          <input
                            type="text"
                            ref={username}
                            className="form-control  mb-3"
                            id="floatingInput"
                            placeholder="Username"
                            required={true}
                          />
                        </div>
                        <div className="">
                          <input
                            ref={password}
                            type="password"
                            className="form-control mb-3"
                            placeholder="Password"
                            required={true}
                          />
                        </div>
                        <div className="d-flex justify-content-between">
                          <div className=" ">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              value=""
                              id="rememberPasswordCheck"
                            />{" "}
                            <span className="font--size fw-normal">
                              Remember Me
                            </span>
                          </div>
                          <div>
                            <span className="font--size fw-normal cursor-pointer">
                              <a
                                className="hover"
                                onClick={() => setHide(!hide)}
                              >
                                forgot password?
                              </a>
                            </span>
                          </div>
                        </div>
                        <div className="text-center mt-3">
                          {/* <Link to="/Dashboard"> */}
                          <button
                            type="submit"
                            className="form-control btn-clr"
                          >
                            Submit
                          </button>
                          {/* </Link> */}
                        </div>
                        <br />
                      </form>
                    </>
                  )}
                  {hide && (
                    <>
                      <h5 className="card-title text-center mt-2 mb-2 fw-light fs-5 font ">
                        Forgot Password
                      </h5>
                      <div className="d-flex flex-row-reverse">
                        <span
                          className="font--size cursor-pointer"
                          onClick={() => setHide(!hide)}
                        >
                          Go Back
                        </span>
                        <IoIosArrowBack
                          title="Go back"
                          className="mb-2  rounded  cursor-pointer"
                          onClick={() => setHide(!hide)}
                        />{" "}
                      </div>

                      <form onSubmit={onSubmitForgotPass}>
                        <div className="">
                          <input
                            type="text"
                            className="form-control  mb-3"
                            placeholder="enter email Id or username"
                          />
                        </div>

                        <div className="text-center mt-3">
                          <button className="form-control btn-clr">
                            Send Link
                          </button>
                        </div>
                        <br />
                      </form>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
