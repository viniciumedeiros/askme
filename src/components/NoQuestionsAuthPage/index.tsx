import { noQuestions } from "../../assets";
import "./styles.scss";

export function NoQuestionsAuthPage(): JSX.Element {
  return (
    <div className="no-questions">
      <img src={noQuestions} alt="" />
      <h3>No questions around here...</h3>
      <span>
        Send this room code to your friends and start answering questions!
      </span>
    </div>
  );
}
