'use client';
import React, { useState, useEffect } from 'react';
import { questions, choices, users } from "@/lib/db/schema";
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";


export default function Page() {

  const [sumCat1, setSumCat1] = useState(0);
  const [sumCat2, setSumCat2] = useState(0);
  const [sumCat3, setSumCat3] = useState(0);
  const [activeQuestion, setActiveQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [checked, setChecked] = useState(false);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [choices, setChoices] = useState([]);

  useEffect(() => {
    fetch('/api/questions')
      .then((res) => res.json())
      .then((data) => setQuestions(data))
      .catch((error) => console.error('Error fetching questions:', error));

    fetch('/api/choices')
      .then((res) => res.json())
      .then((data) => setChoices(data))
      .catch((error) => console.error('Error fetching choices:', error));  
  }, []);

  const currentQuestion = questions[activeQuestion];
  const currentChoices = choices.filter(choice => choice.question_id === currentQuestion.id);

  const handleNextQuestion = () => {
    // Check if an answer is selected before proceeding to the next question
    if (selectedAnswerIndex !== null) {
      // Update state to move to the next question
      setActiveQuestion((prevIndex) => prevIndex + 1);
      // Reset selected answer for the new question
      setSelectedAnswerIndex(null);
    } else {
      // Provide some feedback to the user (e.g., show an error message)
      console.log('Please select an answer before moving to the next question.');
    }
  };

  const handleAnswerSelection = (index) => {
    // Update state when the user selects an answer
    setSelectedAnswerIndex(index);
  };

  return (
    <div>
      <div className="w-screen min-h-screen bg-gradient-to-r from-green-300 via-blue-500 to-purple-600">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="flex flex-col items-center text-center">
            {questions.length > 0 && (
              <>
                <h1>Questionnaire</h1>
                <h2>Question: {activeQuestion + 1}<span>/{questions.length}</span></h2>
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
                <button onClick={handleNextQuestion}>Next</button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}