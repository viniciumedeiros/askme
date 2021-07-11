import { useState, useEffect } from "react";
import { useParams, useHistory, Link } from "react-router-dom";

import { useTheme, useAuth, useRoom } from "../hooks";

import { database } from "../services/firebase";

import {
  closeImg,
  deleteImg,
  trashRedImg,
  checkImg,
  answerImg,
} from "../assets";

import {
  Logo,
  Question,
  RoomCode,
  ToggleThemeButton,
  Button,
  ModalRemove,
  NoQuestionsAuthPage,
} from "../components";

import "../styles/room.scss";

type RoomParams = { id: string };

export function AdminRoom(): JSX.Element {
  const history = useHistory();
  const params = useParams<RoomParams>();
  const roomId = params.id;

  const { currentTheme } = useTheme();
  const { user } = useAuth();
  const { titleRoom, roomAuthorId, questions } = useRoom(roomId);
  const [modalRemoveQuestionOpen, setModalRemoveQuestionOpen] = useState("");
  const [modalRemoveRoomOpen, setModalRemoveRoomOpen] = useState(false);

  async function handleEndRoom() {
    await database.ref(`rooms/${roomId}`).update({
      endedAt: new Date(),
    });

    window.location.href = "/";
  }

  function handleRequestDeleteQuestion(questionId: string) {
    setModalRemoveQuestionOpen(questionId);
  }

  async function handleDeleteQuestion() {
    await database
      .ref(`rooms/${roomId}/questions/${modalRemoveQuestionOpen}`)
      .remove();
    setModalRemoveQuestionOpen("");
  }

  async function handleCheckQuestionAsAnswered(
    questionId: string,
    wasAnswered: boolean
  ) {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      wasAnswered: !wasAnswered,
    });
  }

  async function handleHighlightQuestion(
    questionId: string,
    isHighlighted: boolean
  ) {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isHighlighted: !isHighlighted,
    });
  }

  useEffect(() => {
    if (user?.id && roomAuthorId) {
      if (user?.id !== roomAuthorId) {
        history.replace(`/rooms/${roomId}`);
      }
    }

    if (!user?.id && roomAuthorId) {
      history.replace(`/rooms/${roomId}`);
    }
  }, [history, roomAuthorId, roomId, user]);

  return (
    <div id="page-room">
      <ModalRemove
        title="Delete question"
        description="Are you sure you want to delete this question?"
        buttonText="Yes, delete"
        iconSrc={trashRedImg}
        isOpen={Boolean(modalRemoveQuestionOpen)}
        handleRemove={handleDeleteQuestion}
        setIsOpen={() =>
          setModalRemoveQuestionOpen(
            modalRemoveQuestionOpen ? "" : modalRemoveQuestionOpen
          )
        }
      />

      <ModalRemove
        title="Close room"
        description="Are you sure you want to close this room?"
        buttonText="Yes, close"
        iconSrc={closeImg}
        isOpen={modalRemoveRoomOpen}
        handleRemove={handleEndRoom}
        setIsOpen={() => setModalRemoveRoomOpen(!modalRemoveRoomOpen)}
      />

      <header>
        <div className="content">
          <Logo />
          <div>
            <RoomCode code={roomId} />
            <Button isOutlined onClick={() => setModalRemoveRoomOpen(true)}>
              Close room
            </Button>
            <Link className="see-how-mobile" to={`/rooms/${roomId}`}>
              View as a participant
            </Link>
          </div>
        </div>
      </header>

      <main>
        <div className="room-title">
          <div>
            <h1 className={currentTheme === "dark" ? "dark" : ""}>
              {titleRoom}
            </h1>
            <span>{questions.length} questions</span>
          </div>
          <Link className="see-how" to={`/rooms/${roomId}`}>
            View as a participant
          </Link>
        </div>

        <div className="toggleThemeContainer">
          <ToggleThemeButton />
        </div>

        <div className="question-list">
          {questions.length >= 1 ? (
            questions.map((question) => (
              <Question
                content={question.content}
                userName={user?.name}
                isHighlighted={question.isHighlighted}
                wasAnswered={question.wasAnswered}
                author={question.author}
                key={question.id}
              >
                {question.likeCount > 0 && (
                  <button type="button" className="counterLikesAdm">
                    <span>{question.likeCount} like(s)</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() =>
                    handleCheckQuestionAsAnswered(
                      question.id,
                      question.wasAnswered
                    )
                  }
                >
                  <img src={checkImg} alt="Mark question as answered" />
                </button>

                {!question.wasAnswered && (
                  <button
                    type="button"
                    onClick={() =>
                      handleHighlightQuestion(
                        question.id,
                        question.isHighlighted
                      )
                    }
                  >
                    <img src={answerImg} alt="Highlight the question" />
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => handleRequestDeleteQuestion(question.id)}
                >
                  <img src={deleteImg} alt="Remove question" />
                </button>
              </Question>
            ))
          ) : (
            <NoQuestionsAuthPage />
          )}
        </div>
      </main>
    </div>
  );
}
