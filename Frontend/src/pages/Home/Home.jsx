import { useState } from "react";
import "./Home.css";
import MedicineDisplay from "../../components/MedicineDisplay/MedicineDisplay";
import ExploreType from "../../components/ExploreType/ExploreType";
import AppDownload from "../../components/AppDownload/AppDownload";


const Home = () => {
  const [category, setCategory] = useState("All");

  return (
    <div>
      {/* Explore Type Section */}
      <section id="explore-type">
        <ExploreType category={category} setCategory={setCategory} />
      </section>

      {/* Medicine Display */}
      <MedicineDisplay category={category} />

      {/* Mobile App Section */}
      <section id="app-download">
        <AppDownload />
      </section>
    </div>
  );
};

export default Home;
