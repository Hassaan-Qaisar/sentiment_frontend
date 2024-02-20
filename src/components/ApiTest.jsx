import React, { useState } from "react";

export const ApiTest = () => {
  const [inputText, setInputText] = useState(""); // State to store user input
  const [loading, setLoading] = useState(false);
  const [sentiments, setSentiments] = useState([]); // State to store sentiment results
  const [error, setError] = useState(false); // State to store sentiment results

  const handleInputChange = (event) => {
    setInputText(event.target.value); // Update inputText state as user types
  };

  const fetchData = async () => {
    setError(false)
    setSentiments([])
    if (inputText === "") {
      setError(true)
      return;
    }

    setLoading(true);
    try {
      // Replace the URL with your Flask API endpoint
      const response = await fetch(
        "https://deploy-check-azure.vercel.app/api/batch_sentiment",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(inputText.split("\n")), // Send input text as an array of lines
        }
      );

      if (response.ok) {
        const data = await response.json();
        setSentiments(data);
      } else {
        throw new Error("Failed to fetch data");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false); // Set loading to false after fetching data
    }
  };

  const renderSentiments = () => {
    if (loading) {
      return <p>Loading...</p>; // Display loading indicator while fetching data
    }

    if (sentiments.length > 0) {
      return (
        <ul>
          {sentiments.map((sentiment, index) => (
            <li key={index}>{sentiment}</li>
          ))}
        </ul>
      );
    }

    return null; // Don't render anything if no sentiment results are available
  };

  return (
    <div className="container">
      <textarea
        value={inputText}
        onChange={handleInputChange}
        placeholder="Enter one or more texts (separated by line breaks)"
      />
      <button onClick={fetchData}>Fetch Sentiments</button>
      {error && <p>No input text</p>}
      {renderSentiments()}
    </div>
  );
};
