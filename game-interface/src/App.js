import React, { useState, useEffect } from "react";
import { Container, Title, TextInput, Button, Select } from "@mantine/core";
import initialQuestions from "./questions.json";
import { MantineProvider } from "@mantine/core";
import '@mantine/core/styles.css';

const API_URL = "http://localhost:3001/api";

function App() {
  const [questions, setQuestions] = useState(initialQuestions.questions);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch(`${API_URL}/questions`);
        const data = await response.json();
        setQuestions(data.questions);
      } catch (error) {
        console.error("Error fetching questions:", error.message);
      }
    };

    fetchQuestions();
  }, []);

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      {
        question: "",
        options: ["", "", "", ""],
        correct_answer_index: 0,
      },
    ]);
  };

  const handleDeleteQuestion = (index) => {
    const updatedQuestions = [...questions];
    updatedQuestions.splice(index, 1);
    setQuestions(updatedQuestions);
  };

  const handleInputChange = (index, field, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index][field] = value;
    setQuestions(updatedQuestions);
  };

  const handleOptionChange = (index, optionIndex, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].options[optionIndex] = value;
    setQuestions(updatedQuestions);
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`${API_URL}/save-questions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ questions }),
      });

      const result = await response.json();
      if (result.success) {
        console.log("Questions saved successfully");
      } else {
        console.error("Failed to save questions");
      }
    } catch (error) {
      console.error("Error saving questions:", error.message);
    }
  };

  return (
    <MantineProvider>
      <Container>
        <Title order={1}>Question Editor</Title>
        <br></br>
        {questions.map((question, index) => (
          <div key={index} style={{ marginBottom: "20px" }}>
            <Title order={2} style={{ marginBottom: "10px" }}>
              Question {index + 1}
            </Title>
            <TextInput
              label="Question"
              value={question.question}
              onChange={(e) =>
                handleInputChange(index, "question", e.target.value)
              }
            />
            <br />
            <Title order={3} style={{ marginBottom: "5px" }}>
              Options:
            </Title>
            {question.options.map((option, optionIndex) => (
              <div key={optionIndex} style={{ marginBottom: "10px" }}>
                <TextInput
                  label={`Option ${optionIndex + 1}`}
                  value={option}
                  onChange={(e) =>
                    handleOptionChange(index, optionIndex, e.target.value)
                  }
                />
              </div>
            ))}
            <Select
              label="Correct Answer Index"
              data={question.options.map((_, i) => `${i}`)}
              value={`${question.correct_answer_index}`}
              onChange={(value) =>
                handleInputChange(
                  index,
                  "correct_answer_index",
                  parseInt(value, 10)
                )
              }
            />

            <Button
              onClick={() => handleDeleteQuestion(index)}
              style={{ marginTop: "10px" }}
            >
              Delete Question
            </Button>
            <hr />
          </div>
        ))}
        <Button onClick={handleAddQuestion} style={{ marginTop: "20px" }}>
          Add Question
        </Button>
        <Button color="green" onClick={handleSave} style={{ marginTop: "10px" , marginLeft :"10px" }}>
          Save
        </Button>
      </Container>
    </MantineProvider>
  );
}

export default App;
