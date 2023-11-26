'use client';
import React, { useState, useEffect } from 'react';
import { questions, choices, users } from "@/lib/db/schema";
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import { Loader2 } from 'lucide-react';


export default function Page() {
  interface Choice {
    question_id: number;
    choice: string;
    score: number;
  }
  interface Question {
    id: number;
    questions: string;
    category: number;
  }

  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [choices, setChoices] = useState<Choice[]>([]);
  const [activeQuestion, setActiveQuestion] = useState(0);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState<number>(0);
  const [sumCat1, setSumCat1] = useState(0);
  const [sumCat2, setSumCat2] = useState(0);
  const [sumCat3, setSumCat3] = useState(0);
  const [countCat1, setCountCat1] = useState(0);
  const [countCat2, setCountCat2] = useState(0);
  const [countCat3, setCountCat3] = useState(0);
  const [avgCat1, setAvgCat1] = useState(0);
  const [avgCat2, setAvgCat2] = useState(0);
  const [avgCat3, setAvgCat3] = useState(0);
  const [avg, setAvg] = useState(0);

  const [showFinalPage, setShowFinalPage] = useState(false);
  const [insertData, setInsertData] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const questionsResponse = await fetch('/api/questions', {cache: 'no-cache'});
        const choicesResponse = await fetch('/api/choices', {cache: 'no-cache'});
        const questionsData = await questionsResponse.json();
        const choicesData = await choicesResponse.json();
        setQuestions(questionsData);
        setChoices(choicesData);
        setLoading(false); // Set loading to false when data is loaded
      } catch (error: any) {
        console.error('Error fetching data:', error);
        setLoading(false); // Set loading to false in case of an error
      }
    };

    fetchData();
  }, []);
  
  if (loading) {
    return <Loader2 className='spin' />;
  }
  const currentQuestion = questions[activeQuestion];
  const currentCategory = currentQuestion.category;
  const currentChoices = choices?.filter(choice => choice.question_id === currentQuestion.id);

  const handleNextQuestion = (index: number) => {
    // Check if an answer is selected before proceeding to the next question
    if (selectedAnswerIndex !== 0) {
      // Get the selected choice
      const selectedChoice = choices.filter((choice) => choice.question_id === currentQuestion.id)[index];
        // Update the sum variables based on the category
      if (currentCategory === 1) {
        setSumCat1((prevSum) => Number(prevSum) + Number(selectedChoice.score));
        setCountCat1((prevCount) => Number(prevCount) + 1);
      } else if (currentCategory === 2) {
        setSumCat2((prevSum) => Number(prevSum) + Number(selectedChoice.score));
        setCountCat2((prevCount) => Number(prevCount) + 1);
      } else if (currentCategory === 3) {
        setSumCat3((prevSum) => Number(prevSum) + Number(selectedChoice.score));
        setCountCat3((prevCount) => Number(prevCount) + 1);
      }
      // Update state to move to the next question
      if (activeQuestion !== questions.length - 1) {
        setActiveQuestion((prev) => prev + 1);
      } else {
        setActiveQuestion(0);
        setAvgCat1(sumCat1 / countCat1 ?? 0);
        setAvgCat2(sumCat2 / countCat2 ?? 0);
        setAvgCat3(sumCat3 / countCat3 ?? 0);
        setShowFinalPage(true);   
      }
      // Reset selected answer for the new question
      setSelectedAnswerIndex(0);
      
    } else {
      // Provide some feedback to the user (e.g., show an error message)
      console.log('Please select an answer before moving to the next question.');
    }
  };

  const handleAnswerSelection = (index: number) => {
      // Get the current question and its category  
    setSelectedAnswerIndex(index);
  };

  const insertDataToDatabase = async () => {
    try {

      const response = await fetch('/api/insertData', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          avgCat1: avgCat1,
          avgCat2: avgCat2,
          avgCat3: avgCat3,
        }),
      });

      const data = await response.json();
      console.log(data);
      if (!response.ok) {
        throw new Error('Error inserting data'); 
      }
  
    } catch (error: any) {
      console.error('Error inserting data:', error.message);
    }  
  }
      


  return (
    <div>
    <div className="w-screen min-h-screen bg-gradient-to-r from-green-300 via-blue-500 to-purple-600">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="flex flex-col items-center text-center">
          {!showFinalPage ? (
            <>
              <h1>Questionnaire</h1>
              <h2>
                Question: {activeQuestion + 1}
                <span>/{questions.length}</span>
              </h2>
              <p>{currentQuestion.questions}</p>
              <div>
                {choices.length > 0 &&
                  currentChoices.map((choice, index) => (
                    <div key={index}>
                      <input
                        type="radio"
                        id={`choice${index}`}
                        name="choices"
                        checked={selectedAnswerIndex === index}
                        onChange={() => handleAnswerSelection(index)}
                      />
                      <label htmlFor={`choice${index}`}>{choice.choice}</label>
                    </div>
                  ))}
              </div>
              <button onClick={() => handleNextQuestion(selectedAnswerIndex)}>Next</button>
            </>
          ): ( 
            <div>
              
              <h2>Category 1 point: {avgCat1}</h2>
              <h2>Category 2 point: {avgCat2}</h2>
              <h2>Category 3 point: {avgCat3}</h2>
              <h2>Average point: {avg}</h2>
              <button onClick={insertDataToDatabase}>Submit</button>
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
  );
}