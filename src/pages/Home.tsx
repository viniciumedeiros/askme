import { FormEvent, useState } from "react";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";

import { illustrationImg, googleIconImg } from "../assets";

import "../styles/auth.scss";

import { Button, Logo, FooterAuthPage } from "../components";

import { useAuth } from "../hooks/useAuth";

import { database } from "../services/firebase";

export function Home(): JSX.Element {
  const history = useHistory();
  const { user, signInWithGoogle } = useAuth();

  const [roomCode, setRoomCode] = useState("");

  async function handleCreateRoom() {
    if (!user) {
      await signInWithGoogle();
    }

    history.push("/rooms/new");
  }

  async function handleJoinRoom(event: FormEvent): Promise<void> {
    event.preventDefault();

    if (roomCode.trim() === "") {
      toast.error("Enter the room code!");
      return;
    }

    const roomRef = await database.ref(`rooms/${roomCode}`).get();

    if (!roomRef.exists()) {
      toast.error("Room not found!");
      return;
    }

    if (roomRef.val().endedAt) {
      toast.error("The room has already been closed by the administrator!");
      return;
    }

    history.push(`/rooms/${roomCode}`);
  }

  return (
    <div id="page-auth">
      <aside>
        <img src={illustrationImg} alt="Illustration" />
        <strong>Create live Q&amp;A rooms</strong>
        <p>Ask your audience doubts in real-time</p>
      </aside>
      <main>
        <div className="main-content">
          <Logo />

          <button
            className="create-room"
            type="button"
            onClick={handleCreateRoom}
          >
            {!user && <img src={googleIconImg} alt="Google" />}
            {user ? "Create new room" : "Create your room with Google"}
          </button>
          <div className="separator">or enter a room</div>
          <form onSubmit={handleJoinRoom}>
            <input
              type="text"
              placeholder="Enter the room code"
              id="room-code"
              value={roomCode}
              onChange={(event) => setRoomCode(event.target.value)}
            />
            <Button type="submit" id="join-to-room">
              Enter the room
            </Button>
          </form>
          <FooterAuthPage />
        </div>
      </main>
    </div>
  );
}
