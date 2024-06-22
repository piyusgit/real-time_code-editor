import React from "react";
import { v4 as uuidV4 } from "uuid";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const [roomId, setRoomId] = useState("");
  const [username, setUsername] = useState("");
  const handleNewRoom = (e) => {
    e.preventDefault();

    const id = uuidV4();
    setRoomId(id);
    toast.success("New Room Created");
    console.log(id);
  };

  //Join Handler
  const handleJoin = () => {
    if (!roomId || !username) {
      toast.error("ROOM ID & username is required");
      return;
    }

    //Redirect
    navigate(`/editor/${roomId}`, {
      state: {
        username,
      },
    });
  };

  const handleEnter = (e) => {
    // e.preventDefault();
    console.log("event", e.code);
    if (e.code === "Enter") {
      handleJoin();
    }
  };

  return (
    <div className="homePageWrapper">
      <div className="formWrapper">
        <img src="/code-sync.png" alt="code-sync-logo" />
        <h4 className="mainLabel">Paste invitation ROOM ID</h4>

        <div className="inputGroup">
          <input
            type="text"
            className="inputBox"
            placeholder="ROOM ID"
            onChange={(e) => setRoomId(e.target.value)}
            value={roomId}
            onKeyUp={handleEnter}
          />

          <input
            type="text"
            className="inputBox"
            placeholder="USERNAME"
            onChange={(e) => setUsername(e.target.value)}
            value={username}
            onKeyUp={handleEnter}
          />

          <button className="btn joinBtn" onClick={handleJoin}>
            JOIN
          </button>
          <span className="createInfo">
            If you don't have an invite then create &nbsp;{" "}
            <a onClick={handleNewRoom} href="" className="createNewBtn">
              new room
            </a>
          </span>
        </div>
      </div>
      <footer>
        <h4>
          {" "}
          Built with ❤️ by <a href="https://github.com/piyusgit">Piyush</a>
        </h4>
      </footer>
    </div>
  );
};

export default Home;
