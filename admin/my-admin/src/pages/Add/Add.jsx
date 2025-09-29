import React, { useState } from "react";
import "./Add.css";
import assets from "../../assets/assets";
import axios from "axios";
import { toast } from "react-toastify";

const Add = ({url}) => {

  const [image, setImage] = useState(null);
  const [data, setData] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
  });

  // Handle input changes
  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  // Submit form
  const onSubmitHandler = async (event) => {
    event.preventDefault();

    if (!image) {
      toast.error("Please upload an image");
      return;
    }

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("category", data.category);
    formData.append("price", data.price);
    formData.append("image", image);

    try {
      const response = await axios.post(`${url}/api/medicine/add`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.success) {
        toast.success(response.data.message || "Product added successfully ✅");
        setData({
          name: "",
          description: "",
          category: "",
          price: "",
        });
        setImage(null);
      } else {
        toast.error(response.data.message || "Failed to add product ❌");
      }
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      toast.error("Server error ❌");
    }
  };

  return (
    <div className="add">
      <form className="flex-col" onSubmit={onSubmitHandler}>
        {/* Image upload */}
        <div className="add-img-upload flex-col">
          <p>Upload Image</p>
          <label htmlFor="image">
            <img
              src={image ? URL.createObjectURL(image) : assets.upload_area}
              alt="upload"
            />
          </label>
          <input
            onChange={(e) => setImage(e.target.files[0])}
            type="file"
            id="image"
            hidden
            required
          />
        </div>

        {/* Product Name */}
        <div className="add-product-name flex-col">
          <p>Product name</p>
          <input
            onChange={onChangeHandler}
            value={data.name}
            type="text"
            name="name"
            placeholder="Type here"
            required
          />
        </div>

        {/* Description */}
        <div className="add-product-description flex-col">
          <p>Product description</p>
          <textarea
            onChange={onChangeHandler}
            value={data.description}
            name="description"
            rows="6"
            placeholder="Write content here"
            required
          ></textarea>
        </div>

        {/* Category + Price */}
        <div className="add-category-price">
          <div className="add-category flex-col">
            <p>Product category</p>
            <select
              onChange={onChangeHandler}
              name="category"
              value={data.category}
              required
            >
              <option value="">Select category</option>
              <option value="Analgesics">Analgesics</option>
              <option value="Antibiotics">Antibiotics</option>
              <option value="Antivirals">Antivirals</option>
              <option value="Antifungals">Antifungals</option>
              <option value="Antipyretics">Antipyretics</option>
              <option value="Antihistamines">Antihistamines</option>
              <option value="Hormones & Hormone Modulators">
                Hormones & Hormone Modulators
              </option>
              <option value="Vaccines & Immunomodulators">
                Vaccines & Immunomodulators
              </option>
            </select>
          </div>

          <div className="add-price flex-col">
            <p>Product price</p>
            <input
              onChange={onChangeHandler}
              value={data.price}
              type="number"
              name="price"
              placeholder="₹1000"
              required
            />
          </div>
        </div>

        {/* Submit */}
        <button type="submit" className="add-btn">
          ADD
        </button>
      </form>
    </div>
  );
};

export default Add;
