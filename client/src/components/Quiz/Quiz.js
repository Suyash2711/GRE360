import React, { useState, useRef, useEffect } from "react";
import Data from "./questions.json";
import styles from "./Quiz.module.css";
import axios from "axios";
import TestFooter from "../Footer/TestFooter";
import {
  PieChart,
  Pie,
  Legend,
  Tooltip,
  Radar,
  PolarRadiusAxis,
  PolarAngleAxis,
  RadarChart,
  PolarGrid,
  Cell,
} from "recharts";
import { Navigate, Link } from "react-router-dom";

export default function Quiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [score, setScore] = useState(0);
  const [score_2, setScore_2] = useState(0);
  const [sectionC, setSectionC] = useState(0);
  const [current_section, set_current_section] = useState("");
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [timer, setTimer] = useState("00:00:00");
  const [data, setData] = useState("");
  const [ml_predict, set_ml_Predict] = useState([]);
  const [total, setTotal] = useState(0);

  async function predict(query) {
    var payload = {
      data: query,
    };
    console.log(payload);
    await axios
      .post("http://localhost:7000/predict", payload)
      .then(function (response) {
        console.log(response);
        set_ml_Predict(response.data);
        localStorage.setItem("Chance", response.data[0]);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  const data01 = [
    {
      name: "Verbal",
      value: (score / 5) * 120,
    },
    {
      name: "Math",
      value: (score_2 / 5) * 120,
    },
    {
      name: "Writing",
      value: 5,
    },
  ];

  let cal_score = score * 24;
  let calc_score_2 = score_2 * 24;
  let cal_score_3 = 3 * 24;

  const data_radar = [
    {
      subject: "Verbal",
      A: 120,
      B: cal_score,
      fullMark: 120,
    },
    {
      subject: "Math",
      A: 120,
      B: calc_score_2,
      fullMark: 120,
    },
    {
      subject: "Writing",
      A: 120,
      B: cal_score_3,
      fullMark: 120,
    },
  ];

  useEffect(() => {
    const getUserData = async () => {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      try {
        const { data } = await axios.get(
          `http://localhost:5000/api/user/userDetails/${localStorage.getItem(
            "userId"
          )}`,
          config
        );
        setData(data);
      } catch (error) {
        console.log(error);
      }
    };

    getUserData();
  }, []);

  const questions = [1, 2, 3, 4, 5];

  const COLORS = ["#7A4069", "#CA4E79", "#FFC18E"];

  let active = true;
  const myContainer = useRef(null);
  const Ref = useRef(null);

  const options = ["section_1", "section_2", "results"];
  let selectedSection = options[sectionC];

  const getTimeRemaining = (e) => {
    const total = Date.parse(e) - Date.parse(new Date());
    const seconds = Math.floor((total / 1000) % 60);
    const minutes = Math.floor((total / 1000 / 60) % 60);
    const hours = Math.floor((total / 1000 / 60 / 60) % 24);
    return {
      total,
      hours,
      minutes,
      seconds,
    };
  };

  const startTimer = (e) => {
    let { total, hours, minutes, seconds } = getTimeRemaining(e);
    if (total >= 0) {
      setTimer(
        (hours > 9 ? hours : "0" + hours) +
          ":" +
          (minutes > 9 ? minutes : "0" + minutes) +
          ":" +
          (seconds > 9 ? seconds : "0" + seconds)
      );
    }
  };

  const clearTimer = (e) => {
    setTimer("00:10:00");

    // If you try to remove this line the
    // updating of timer Variable will be
    // after 1000ms or 1sec
    if (Ref.current) clearInterval(Ref.current);
    const id = setInterval(() => {
      startTimer(e);
    }, 1000);
    Ref.current = id;
  };

  const getDeadTime = () => {
    let deadline = new Date();

    // This is where you need to adjust if
    // you entend to add more time
    deadline.setSeconds(deadline.getSeconds() + 600);
    return deadline;
  };

  useEffect(() => {
    clearTimer(getDeadTime());
  }, []);

  const onClickReset = () => {
    clearTimer(getDeadTime());
  };

  const handleAnswerOptionClick = (isCorrect) => {
    if (isCorrect && selectedSection === "section_1") {
      setScore(score + 1);
    }

    if (isCorrect && selectedSection === "section_2") {
      setScore_2(score_2 + 1);
    }

    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < 5) {
      setCurrentQuestion(nextQuestion);
      setTotalQuestions(totalQuestions + 1);
    } else {
      setCurrentQuestion(0);
      setSectionC(sectionC + 1);
      setTotalQuestions(totalQuestions + 1);
    }
  };

  return (
    <>
      <TestFooter />
      <div className={`${styles.app} row`}>
        {/* <Navbar /> */}
        {selectedSection === "section_1" ? (
          <>
            <div className={`${styles.box} col-md-9`}>
              <div className={`${styles.timer}`}>
                <div>
                  <h5>Time Left : </h5>
                </div>
                <div className={styles.timer_content}>{timer}</div>
              </div>
              <div className={`${styles.question_section}`}>
                <div className={`${styles.section_count}`}>
                  <button>{Data.section_1[currentQuestion].section}</button>
                </div>
                <div className={`${styles.question_count}`}>
                  <div className={`${styles.total_q}`}>
                    Total Number of questions done - <b>{totalQuestions}</b>
                  </div>
                  <span className={`${styles.q_no}`}>
                    Question {currentQuestion + 1}/{Data.section_1.length}
                  </span>
                  <div className={`${styles.Qimage}`}>
                    <img
                      src={require(`../quizAssests/${Data.section_1[currentQuestion].image}`)}
                      alt="Question"
                    />
                  </div>
                </div>
                <div className={`${styles.question_text}`}>
                  {Data.section_1[currentQuestion].questionText}
                </div>
              </div>
              <div className={`${styles.answer_section}`}>
                {Data.section_1[currentQuestion].answerOptions.map(
                  (answerOption) => (
                    <button
                      onClick={() =>
                        handleAnswerOptionClick(answerOption.isCorrect)
                      }
                      className={`${styles.options}`}
                    >
                      {answerOption.answerText}
                    </button>
                  )
                )}
              </div>
            </div>
            <div className={`${styles.q_box_box} col-md-3`}>
              {questions.map((question) => (
                <div className={`${styles.q_box} `} ref={myContainer}>
                  {question}
                </div>
              ))}
            </div>
          </>
        ) : null}
        {selectedSection === "section_2" ? (
          <>
            <div className={`${styles.box} col-md-9`}>
              <div className={`${styles.question_section}`}>
                <div className={`${styles.section_count}`}>
                  {Data.section_2[currentQuestion].section}
                </div>
                <div className={`${styles.question_count}`}>
                  <div className={`${styles.total_q}`}>
                    Total Number of questions done - <b>{totalQuestions}</b>
                  </div>
                  <span className={`${styles.q_no}`}>
                    Question {currentQuestion + 1}/{Data.section_2.length}
                  </span>
                  <div className={`${styles.Qimage}`}>
                    <img
                      src={require(`../quizAssests/${Data.section_2[currentQuestion].image}`)}
                      alt="Question"
                    />
                  </div>
                </div>
                <div className={`${styles.question_text}`}>
                  {Data.section_2[currentQuestion].questionText}
                </div>
              </div>
              <div className={`${styles.answer_section}`}>
                {Data.section_2[currentQuestion].answerOptions.map(
                  (answerOption) => (
                    <button
                      onClick={() =>
                        handleAnswerOptionClick(answerOption.isCorrect)
                      }
                      className={`${styles.options}`}
                    >
                      {answerOption.answerText}
                    </button>
                  )
                )}
              </div>
            </div>
            <div className={`${styles.q_box_box} col-md-3`}>
              {questions.map((question) => (
                <div className={`${styles.q_box} `}>{question}</div>
              ))}
            </div>
          </>
        ) : null}
        {selectedSection === "results" ? (
          <div className={`${styles.results}`}>
            <h1 className={`${styles.name}`}>
              {data.data.name}\
              <button
                className={`${styles.list_btn}`}
                onClick={() => {
                  // predict([data.data.])
                  console.log(cal_score + calc_score_2 + cal_score_3);
                  predict([
                    cal_score + calc_score_2 + cal_score_3,
                    data.data.toefl,
                    1,
                    data.data.sop,
                    data.data.lor,
                    data.data.cgpa,
                    data.data.research,
                  ]);
                }}
              >
                <Link to="/dashboard">List</Link>
              </button>
            </h1>
            <div className={`${styles.grid}`}>
              <div className={`${styles.b_box}`}>
                SOP Score: {data.data.sop}/5
              </div>
              <div className={`${styles.b_box}`}>
                LOR Score: {data.data.lor}/5
              </div>
              <div className={`${styles.b_box}`}>
                Research Score: {data.data.research}/5
              </div>
              <div className={`${styles.b_box}`}>
                Toefl Score: {data.data.toefl}/120
              </div>
              <div className={`${styles.b_box}`}>CGPA: {data.data.cgpa}/10</div>
            </div>
            <div className="row">
              <div className="col-md-6">
                <div className={`${styles.score_analysis}`}>
                  <div className={`${styles.sub_heading1}`}>
                    Score Distribution
                  </div>
                  <PieChart
                    className={`${styles.pie}`}
                    width={500}
                    height={250}
                  >
                    <Legend />
                    <Tooltip />
                    <Pie
                      data={data01}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={90}
                      innerRadius={50}
                      fill="#8884d8"
                    >
                      {data01.map((entry, index) => (
                        <Cell fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                  </PieChart>
                </div>
              </div>
              <div className="col-md-6">
                <div className={`${styles.score_analysis2}`}>
                  <div className={`${styles.sub_heading2}`}>
                    Score Comparision
                  </div>
                  <RadarChart
                    outerRadius={100}
                    width={500}
                    height={250}
                    className={`${styles.radar}`}
                    data={data_radar}
                  >
                    <Tooltip />
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" />
                    <PolarRadiusAxis angle={30} domain={[0, 120]} />
                    <Radar
                      name="Total"
                      dataKey="A"
                      stroke="#FFC18E"
                      fill="#FFC18E"
                      fillOpacity={0.6}
                    />
                    <Radar
                      name="Score"
                      dataKey="B"
                      stroke="#CA4E79"
                      fill="#CA4E79"
                      fillOpacity={0.6}
                    />
                    <Legend />
                  </RadarChart>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </>
  );
}
