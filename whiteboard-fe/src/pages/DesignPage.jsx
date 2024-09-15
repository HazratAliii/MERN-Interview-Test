import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import axios from "axios";
import SingleDesign from "../components/SingleDesign";
import { useNavigate } from "react-router-dom";

function DesignPage() {
  const [designs, setDesigns] = useState([]);
  const navigate = useNavigate();

  // Fetch all designs from the backend
  useEffect(() => {
    const fetchDesigns = async () => {
      try {
        const response = await axios.get("https://whiteboard-api-self.vercel.app/api");
        setDesigns(response.data);
      } catch (error) {
        console.error("Error fetching designs:", error);
      }
    };

    fetchDesigns();
  }, []);

  // Delete a design
  const deleteDesign = async (id) => {
    try {
      await axios.delete(`https://whiteboard-api-self.vercel.app/api/${id}`);
      setDesigns(designs.filter((design) => design._id !== id));
    } catch (error) {
      console.error("Error deleting design:", error);
    }
  };
 
  // Edit a design
  const editDesign = (id) => {
    console.log("Edit design", id);
    navigate(`/edit/${id}`);
  };

  return (
    <>
      <Navbar />
      <h1 className="text-2xl text-center my-8">Your Designs</h1>
      <div className="flex flex-wrap gap-8 justify-center">
        {designs.length > 0 ? (
          designs.map((design, index) => (
            <div key={index} className="flex flex-col items-center">
              <SingleDesign designData={design} />
              <div className="mt-4 flex flex-col items-center gap-2">
                <h3 className="text-lg font-semibold">{design.name}</h3>
                <div className="flex gap-4">
                  <button
                    className="px-4 py-2 bg-red-500 text-white rounded-md"
                    onClick={() => deleteDesign(design._id)}
                  >
                    Delete
                  </button>
                  <button
                    className="px-4 py-2 bg-blue-500 text-white rounded-md"
                    onClick={() => editDesign(design._id)}
                  >
                    Edit
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No data available</p>
        )}
      </div>
    </>
  );
}

export default DesignPage;
