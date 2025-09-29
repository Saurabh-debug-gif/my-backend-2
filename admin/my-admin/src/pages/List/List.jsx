import React, { useState, useEffect } from "react";
import "./List.css"; // Make sure List.css is in the same folder
import axios from "axios";
import { toast } from "react-toastify";

const List = ({url}) => {
  const [list, setList] = useState([]);

  const fetchList = async () => {
    const response = await axios.get(`${url}/api/medicine/list`);
    if (response.data.success) {
      setList(response.data.data);
    } else {
      toast.error("Failed to fetch medicines");
    }
  }

const removeMedicine = async (medicineid) => {
  try {
    const response = await axios.post(`${url}/api/medicine/remove`, { id: medicineid });

    if (response.data.success) {
      toast.success("Medicine removed");
      fetchList();
    } else {
      toast.error(response.data.message || "Failed to remove medicine");
    }
  } catch (error) {
    toast.error("Error removing medicine");
    console.error(error);
  }
};


  useEffect(() => {
    fetchList();
  }, []);

  return (
    <div className='list add flex-col'>
      <p>All Medicines List</p>
      <div className="list-table">
        <div className="list-table-format">
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b>Action</b>
        </div>
        {list.map((item, index) =>{
          return(
            <div key={index} className='list-table-format'> 
              <img src={`${url}/images/`+item.image} alt="" />
              <p>{item.name}</p>
              <p>{item.category}</p>
              <p>${item.price}</p>
              <p onClick={() => removeMedicine(item._id)} className='cursor'>X</p>
          </div>
          )
        })}
      </div>
    </div>
  );
};

export default List;
