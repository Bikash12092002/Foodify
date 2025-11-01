import React from 'react'
import { assets } from '../../assets/assets'
import './Footer.css'

const Footer = () => {
  return (
    <div className='footer' id='footer'>
      <div className="footer-content">
        <div className="footer-content-left">
            {/* <img src={assets.logo} alt="" /> */}
            <img className='logo' src={assets.logo2} alt="" />
            <p>Foodify appears to be an app focused on connecting small restaurants with local food 
              influencers to boost traffic and sales, leveraging AI-driven matchmaking. It aims to help 
              restaurants, particularly those struggling, find visibility and increase online orders.</p>
            <div className="footer-social-icons">
                <a href="https://www.facebook.com/share/1PoZ3wbPMK/" target='_blank' ><img src={assets.facebook_icon} alt='' /></a>
                <a href="https://x.com/BikashB20846264" target='_blank'><img src={assets.twitter_icon} alt="" /></a>
                <a href="https://www.linkedin.com/in/bikash-kumar-barik-56b5a3385/ "  target='_blank'><img src={assets.linkedin_icon} alt="" /></a>
            </div>
        </div>
       <div className="footer-content-right">
            <h2>GET IN TOUCH</h2>
            <form action="https://api.web3forms.com/submit" method="POST">
              <input type="hidden" name="access_key" value="2ce53d29-89e4-4a82-8dce-3b653f92110b"></input>
              <input type="text" name="name" id="name" placeholder="Your Name" required></input>
              <input type="email" name="email" id="email" placeholder="Your Email" required></input>
              <textarea name="message" rows="6" id="msg" placeholder="Your Message"></textarea>
              <button type="submit" class="btn btn2" id="btn" onClick="send()">Submit</button>          
            </form>
        </div>
      </div>
      <hr />
      <p className="footer-copyright">Copyright 2025 © Foodify.com - All Right Reserved.</p>
    </div>
  )
}

export default Footer
