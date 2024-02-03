import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Modal from "react-modal";
import { TailSpin } from 'react-loader-spinner';

function App() {
  const [imageUrl, setImageUrl] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);

  const ImageModal = ({ imageUrl, closeModal }) => (
    <Modal
      isOpen={!!imageUrl}
      onRequestClose={closeModal}
      contentLabel="Image Modal"
    >
      <button onClick={closeModal}>Close Modal</button>
      <img src={imageUrl} alt="Modal Image" />
    </Modal>
  );

  const openModal = (url) => {
    setImageUrl(url);
    setLoading(false);
  };

  const closeModal = () => {
    setInputValue(null);
    setImageUrl(null);
  };

  const handleChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      setLoading(true);
      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_OPEN_AI_KEY}`,
        },
        body: JSON.stringify({
          model: "dall-e-3",
          prompt: inputValue,
          n: 1,
          size: "1024x1024",
        }),
      };

      fetch("https://api.openai.com/v1/images/generations", requestOptions)
        .then((response) => response.json())
        .then((data) => {
          openModal(data.data[0].url);
        })
        .catch((error) => {
          console.error('Error:', error);
          setLoading(false);
        });
    }
  };

  return (
    <>
      <h1>@LuisiitoDev - DALLE</h1>
      <div className="card">
        <div className="relative text-gray-600 focus-within:text-gray-400">
          <input
            value={inputValue}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            type="search"
            className="py-2 text-sm text-white bg-gray-800 rounded-md pl-10 focus:outline-none focus:bg-white focus:text-gray-900"
            placeholder="Press enter to search"
          />
        </div>
      </div>
      { loading && <TailSpin color="#00BFFF" height={80} width={80} />}
      {/* Modal for displaying images */}
      <ImageModal imageUrl={imageUrl} closeModal={closeModal} />
    </>
  );
}

export default App;
