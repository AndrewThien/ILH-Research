'use client';
import React, { useState, useEffect } from 'react';
import { questions, choices, users } from "@/lib/db/schema";
import { Home, RotateCcw, Loader2, Send, ArrowBigLeftDash, ArrowBigRightDash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from "next/link";
import toast from "react-hot-toast";

function LoadingPage() {
  return (
    <div>
      <div className="w-screen min-h-screen bg-gradient-to-r from-green-300 via-blue-500 to-purple-600">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="flex flex-col items-center text-center">
          <div className="flex items-center text-2xl">
              <h1>Questions are loading ...</h1>  
              <Loader2 className="h-10 w-10 animate-spin ml-2" /> 
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

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
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState<number | null>(null);
  const [sumCat1, setSumCat1] = useState(0);
  const [sumCat2, setSumCat2] = useState(0);
  const [sumCat3, setSumCat3] = useState(0);
  const [countCat1, setCountCat1] = useState(0);
  const [countCat2, setCountCat2] = useState(0);
  const [countCat3, setCountCat3] = useState(0);
  const [avgCat1, setAvgCat1] = useState(0);
  const [avgCat2, setAvgCat2] = useState(0);
  const [avgCat3, setAvgCat3] = useState(0);
  const [answeredScore, setSelectedAnswerScore] = useState(0);

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

  useEffect(() => {
    if (showFinalPage) {
      setActiveQuestion(0);
      setAvgCat1(sumCat1 / countCat1 || 0);
      setAvgCat2(sumCat2 / countCat2 || 0); 
      setAvgCat3(sumCat3 / countCat3 || 0);
    } 
  }, [activeQuestion, questions.length, sumCat1, countCat1, sumCat2, countCat2, sumCat3, countCat3]);

  if (loading) {
    return <LoadingPage />;
  }
  const currentQuestion = questions[activeQuestion];
  const currentCategory = currentQuestion.category;
  const currentChoices = choices?.filter(choice => choice.question_id === currentQuestion.id);

  const handleNextQuestion = (index: number | null) => {
    // Check if an answer is selected before proceeding to the next question
    if (selectedAnswerIndex !== null) {
      // Get the selected choice
      const selectedChoice = choices.filter((choice) => choice.question_id === currentQuestion.id)[index];
        // Update the sum variables based on the category
        if (currentCategory === 1) {
          setSumCat1((prevSum) => Number(prevSum) + Number(selectedChoice.score));
          setSelectedAnswerScore((prevScore) => selectedChoice.score)
          setCountCat1((prevCount) => Number(prevCount) + 1);
        } else if (currentCategory === 2) {
          setSumCat2((prevSum) => Number(prevSum) + Number(selectedChoice.score));
          setSelectedAnswerScore((prevScore) => selectedChoice.score)
          setCountCat2((prevCount) => Number(prevCount) + 1);
        } else if (currentCategory === 3) {
          setSumCat3((prevSum) => Number(prevSum) + Number(selectedChoice.score));
          setSelectedAnswerScore((prevScore) => selectedChoice.score)
          setCountCat3((prevCount) => Number(prevCount) + 1);
        }
      // Update state to move to the next question
      if (activeQuestion !== questions.length - 1) {
        setActiveQuestion((prev) => prev + 1);
      } 

      if (activeQuestion === questions.length -1) {
        setShowFinalPage(true);
      }
      // Reset selected answer for the new question
      setSelectedAnswerIndex(null);
    } else {
      toast.error('Please select an answer before moving to the next question.');
    }
  };


  const handleAnswerSelection = (index: number) => {
      // Get the current question and its category  
    setSelectedAnswerIndex(index);
  };

  const handlePreviousQuestion = () => {
    // Check if there's a previous question to go back to
    if (activeQuestion > 0) {
      // Update the state to move to the previous question
      setActiveQuestion((prev) => prev - 1);
      // Update the sum variables based on the category (subtracting instead of adding)
      if (currentCategory === 1) {
        setSumCat1((prevSum) => Number(prevSum) - Number(answeredScore));
        setCountCat1((prevCount) => Number(prevCount) - 1);
      } else if (currentCategory === 2) {
        setSumCat2((prevSum) => Number(prevSum) - Number(answeredScore));
        setCountCat2((prevCount) => Number(prevCount) - 1);
      } else if (currentCategory === 3) {
        setSumCat3((prevSum) => Number(prevSum) - Number(answeredScore));
        setCountCat3((prevCount) => Number(prevCount) - 1);
      }
    } else {
      toast.error('Cannot go back further. This is the first question.');
    }
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
            <div className="items-center text-xl gap-2 mb-5 ml-2">
              <h1 className='underline text-2xl'>Research Questionnaire</h1>
              <h2>
                Question: {activeQuestion + 1}
                <span>/{questions.length}</span>
              </h2>
              </div>
              <div className='text-2xl text-slate-950 gap-2 mb-5 ml-2'>
              <p>{currentQuestion.questions}</p>
              </div>
              <div className='text-xl text-slate-950 gap-2 mb-5 ml-2'>
                {choices.length > 0 &&
                  currentChoices.map((choice, index) => (
                    <div key={index} className="flex items-center mb-2">
                      <input
                        type="radio"
                        id={`choice${index}`}
                        name="choices"
                        checked={selectedAnswerIndex === index}
                        onChange={() => handleAnswerSelection(index)}
                        style={{ transform: 'scale(1.3)' }}
                      />
                      <label htmlFor={`choice${index}`} className="ml-2">{choice.choice}</label>
                    </div>
                  ))}
              </div>
              <div>
              <div className='flex ml-5 gap-1 mb-3'>
              <Button onClick={handlePreviousQuestion} > <ArrowBigLeftDash className="mr-2" /> Previous </Button>
              <Button onClick={() => handleNextQuestion(selectedAnswerIndex)}>Next <ArrowBigRightDash className="ml-2" /></Button>
              </div>
              <div>
                <Link href='/'>
                <Button className="mr-1">Home <Home className="ml-2" /></Button>
                </Link>
                <Link href='questionaire'>
                <Button> Restart <RotateCcw className="ml-2" /></Button>
                </Link>
              </div>
              </div>
            </>
          ): ( 
            <div className='items-center text-xl gap-2 mb-5 ml-2'>
              
              <h1>Many thanks for answering my questionnaire</h1>
              <h1>Please click Submit button to send your answer. Otherwise, you can re-do the questionnaire again</h1>
              <div className='flex mt-5 gap-5 justify-center'>
              <Link href='questionaire'>
                <Button> Restart <RotateCcw className="ml-2" /></Button>
                </Link>
              <Link href='/'>
              <Button onClick={insertDataToDatabase}>Submit <Send className="ml-2" /></Button>
              </Link>
            </div>
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
  );
}