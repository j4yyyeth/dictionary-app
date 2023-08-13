"use client";

import { useState } from "react";
import axios from "axios";
import { BsFillSunFill } from "react-icons/bs";
import { BsFillMoonFill } from "react-icons/bs";

const sunIcon = <BsFillSunFill />;
const moonIcon = <BsFillMoonFill />;

interface wordData {
  meanings: [
    {
      partOfSpeech: string;
      definitions: [{ definition: string }];
    }
  ];
}

const Home = () => {
  const [word, setWord] = useState("");
  const [apiData, setApiData] = useState<wordData>();
  const [errMessage, setErrMessage] = useState("");
  const [theme, setTheme] = useState("light");
  const [image, setImage] = useState<React.ReactElement>(moonIcon);
  const [submitted, setSubmitted] = useState<Boolean>();

  const initialColor = "text-blue";

  const toggleTheme = () => {
    theme === "light" ? setTheme("dark") : setTheme("light");
    theme === "light" ? setImage(sunIcon) : setImage(moonIcon);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.get(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
      );
      setErrMessage("");
      const meanings = await response.data[0].meanings;
      setApiData(meanings);
      setSubmitted(true);
    } catch (err: any) {
      console.log(err);
      setErrMessage(err.response.data.title);
    }
  };

  return (
    <div
      className={`${
        theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-black"
      } min-h-screen transition-all duration-300 p-4 md:p-8 flex flex-col items-center justify-start gap-4`}
    >
      <div className="w-full flex justify-between items-center">
        <button onClick={toggleTheme} className="p-2 text-xl">
          {image}
        </button>
        <form onSubmit={handleSubmit} className="flex gap-4">
          <input
            type="text"
            value={word}
            onChange={(e) => {
              setSubmitted(false);
              setWord(e.target.value);
              setApiData(undefined);
            }}
            placeholder="Enter Word ..."
            className="p-2 rounded-lg border-2 focus:outline-none focus:border-blue-500 text-black flex-grow"
          />
          <button
            type="submit"
            className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Search
          </button>
        </form>
      </div>
      {submitted ? (
        <h1 className="text-4xl font-bold text-blue-500 mt-6 bg-gradient-to-r from-blue-300 to-blue-100 py-2 px-4 rounded-lg hover:bg-blue-300 animate-pulse">
          {word.toLocaleUpperCase()}
        </h1>
      ) : (
        <h1 className="text-4xl font-bold text-blue-500 mt-6 bg-gradient-to-r from-blue-300 to-blue-100 py-2 px-4 rounded-lg hover:bg-blue-300 animate-pulse">
          Enter a Word ...
        </h1>
      )}
      {/* @ts-ignore */}
      {apiData?.map((meaning: any, i: number) => (
        <div
          key={i}
          className="w-full max-w-md rounded-lg p-4 border-2 border-gray-300 dark:border-gray-700"
        >
          <h2 className="script text-2xl font-semibold mb-2 text-blue-500">
            {meaning.partOfSpeech}
          </h2>
          <ul className="list-disc pl-6 space-y-2">
            {meaning.definitions.map((definition: any, j: number) => (
              <li key={j}>{definition.definition}</li>
            ))}
          </ul>
          {meaning.synonyms.length > 0 && (
            <div className="pl-6 mt-2">
              <p className="font-semibold">Synonym(s):</p>
              <ul className="list-disc ml-4 space-y-1">
                {meaning.synonyms.map((synonym: any, k: number) => (
                  <li key={k}>{synonym}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ))}
      <h1
        className={`text-red-500 mt-4 ${
          theme === "dark" ? "text-white" : "text-black"
        }`}
      >
        {errMessage}
      </h1>
    </div>
  );
};

export default Home;
