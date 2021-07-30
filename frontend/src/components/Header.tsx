import React from "react"
import { Link } from "react-router-dom"

const Header : React.FC = () => {
  return(
    <div className="d-flex p-4" style={{boxShadow: "1px 3px 5px 1px #9E9E9E55", height: "10vh"}}>
      <h1 style={{fontWeight: 900}}>News</h1>
      <nav className="d-flex mx-5" style={{flexGrow: 1}}>
        <Link to="/articles" className="text-uppercase mx-3 my-auto no-decor p-1">Articles</Link>
        <Link to="/tags" className="text-uppercase mx-3 my-auto no-decor p-1">Tags</Link>
        <Link to="" className="text-uppercase mx-3 my-auto no-decor p-1">Authors</Link>
      </nav>
      <div>
        <Link to="/register" className="mx-3 text-decoration-none text-dark btn-1" style={{fontWeight: "bold"}}>Register</Link>
        <Link to="/login" className="mx-3 text-decoration-none text-dark btn-1" style={{fontWeight: "bold"}}>Login</Link>
      </div>
    </div>
  )
}

export default Header