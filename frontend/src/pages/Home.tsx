import React from "react"
import { Link } from "react-router-dom";

const Home : React.FC = () => {
  return(
    <div style={{backgroundImage: "url('images/newspaper.jpg')", height: "90vh", paddingTop: 256, background: `linear-gradient(#fffc, #fffc), url('images/newspaper.jpg') no-repeat center`}}>
      <p style={{fontSize: 128, textAlign: "center", textTransform: "uppercase", letterSpacing: 20, fontWeight: 100}}>News</p>
      <p className="text-center" style={{fontFamily: "Archivo", fontSize: 14, textTransform: "uppercase"}}>Your #1 Most Reliable, Credible and Trusted Source of Information</p>
      <div className="mx-auto col-3 text-center mt-5">
        <Link to="/articles" className="no-decor btn-2">Enter</Link>
      </div>
    </div>
  )
}

export default Home;