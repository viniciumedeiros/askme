import { FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import { useAuth } from "../hooks/useAuth";

import illustrationImg from "../assets/images/illustration.svg";

import "../styles/auth.scss";

import { Button, Logo, FooterAuthPage } from "../components";

import { database } from "../services/firebase";

export function NewRoom(): JSX.Element {
  const { user } = useAuth();

  const [newRoom, setNewRoom] = useState("");

  async function handleCreateRoom(event: FormEvent) {
    event.preventDefault();

    if (!user) {
      toast.error("You must be logged in to create a room!");
      return;
    }

    if (newRoom.trim() === "") {
      toast.error("Enter the room name!");
      return;
    }

    if (newRoom.length < 3) {
      toast.error("Minimum of 3 characters!");
      return;
    }

    if (newRoom.length >= 20) {
      toast.error("Maximum of 20 characters!");
      return;
    }

    const roomRef = database.ref("rooms");

    const firebaseRoom = await roomRef.push({
      title: newRoom,
      authorId: user.id,
    });

    window.location.href = `/admin/rooms/${firebaseRoom.key}`;
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
          <h2>Create a new room</h2>
          <form onSubmit={handleCreateRoom}>
            <input
              type="text"
              placeholder="Room name"
              onChange={(event) => setNewRoom(event.target.value)}
              value={newRoom}
            />
            <Button type="submit">Create room</Button>
          </form>
          <p>
            Want to join an existing room? <Link to="/">click here</Link>
          </p>
          <FooterAuthPage />
        </div>
      </main>
    </div>
  );
}
