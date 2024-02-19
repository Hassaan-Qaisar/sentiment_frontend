import React, { useState } from "react";

export const ApiTest = () => {
  const [inputText, setInputText] = useState(""); // State to store user input
  const [sentiments, setSentiments] = useState([]); // State to store sentiment results

  const handleInputChange = (event) => {
    setInputText(event.target.value); // Update inputText state as user types
  };

  const fetchData = async () => {
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
    }
  };

  const renderSentiments = () => {
    return (
      <ul>
        {sentiments.map((sentiment, index) => (
          <li key={index}>{sentiment}</li>
        ))}
      </ul>
    );
  };

  return (
    <div className="container">
      <textarea
        value={inputText}
        onChange={handleInputChange}
        placeholder="Enter one or more texts (separated by line breaks)"
      />
      <button onClick={fetchData}>Fetch Sentiments</button>
      {renderSentiments()}
    </div>
  );
};
