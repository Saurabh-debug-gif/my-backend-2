import React from 'react'
import { NavLink } from 'react-router-dom'
import './Sidebar.css'
import assets from '../../assets/assets'

const Sidebar = () => {
  return (
    <div className="sidebar">

      {/* Sidebar Menu */}
      <div className="sidebar-options">
        <NavLink 
          to="/add" 
          className={({ isActive }) => isActive ? "sidebar-option active" : "sidebar-option"}
        >
          <img src={assets.add_icon} alt="Add" />
          <p>Add Medicine</p>
        </NavLink>

        <NavLink 
          to="/list" 
          className={({ isActive }) => isActive ? "sidebar-option active" : "sidebar-option"}
        >
          <img src={assets.list_icon || assets.order_icon} alt="List" />
          <p>List Medicine</p>
        </NavLink>

        <NavLink 
          to="/orders" 
          className={({ isActive }) => isActive ? "sidebar-option active" : "sidebar-option"}
        >
          <img src={assets.order_icon} alt="Orders" />
          <p>Orders</p>
        </NavLink>
      </div>
    </div>
  )
}

export default Sidebar
