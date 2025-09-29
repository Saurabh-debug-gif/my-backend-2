import React from 'react'
import "./AppDownload.css"
import play_store from "../../assets/play_store.png"
import app_store from "../../assets/app_store.png"

const AppDownload = () => {
  return (
    <div className="app-download" id="app-download">
      <p>Get the best healthcare services at your fingertips. Download the App now!
      <br />Clitoria Life Science</p>
      <div className="app-download-platforms">
        <img src={play_store} alt="Play Store" />
        <img src={app_store} alt="App Store" />
      </div>
    </div>
  )
}

export default AppDownload
