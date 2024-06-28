import React, { Component } from "react";
import { Link, Navigate } from "react-router-dom";
import Cookies from "js-cookie";
import logo from "../components/logo.jpg";
import "./index.css";

class NavBar1 extends Component {
    constructor(props) {
        super(props);
        this.state = {
            token: Cookies.get("jwtToken") || "",
        };
    }

    logOutClick = () => {
        Cookies.remove("jwtToken");
        this.setState({ token: "" });
        this.props.onTokenChange(undefined);
    };

    render() {
        const { token } = this.state;
        if (token === "") {
            return <Navigate to="/" />;
        }

        return (
            <nav className="nav-header">
                <div className="nav-content">
                    <div className="nav-bar-large-container">
                        <Link to="/" onClick={() => window.scrollTo(0, 0)}>
                            <img
                                src={logo}
                                style={{ width: "60px", height: "50px" }}
                                alt="immg"
                                className="immg"
                            />
                        </Link>
                        <ul className="nav-menu">
                            <li className="nav-menu-item">
                                <Link to="/business" className="nav-link" onClick={() => window.scrollTo(0, 0)}>
                                    Business
                                </Link>
                            </li>
                            <li className="nav-menu-item">
                                <Link to="/financial" className="nav-link" onClick={() => window.scrollTo(0, 0)}>
                                    Financial
                                </Link>
                            </li>
                            <li className="nav-menu-item">
                                <Link to="/legal" className="nav-link">
                                    Legal
                                </Link>
                            </li>
                            <li className="nav-menu-item">
                                <Link to="/">
                                    <button
                                        style={{ width: "fit-content", borderRadius: "5px" }}
                                        onClick={this.logOutClick}
                                    >
                                        Logout
                                    </button>
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        );
    }
}

export default NavBar1;
