import React, { useState } from "react";
import Particles from "react-particles-js";
import FaceRecognition from "./components/FaceRecognition/FaceRecognition";
import ImageLinkForm from "./components/ImageLinkForm/ImageLinkForm";
import "./App.css";

const particlesOptions = {
  particles: {
    number: {
      value: 100,
      density: {
        enable: true,
        value_area: 800,
        isSignedIn: "false"
      }
    }
  }
};

const App = () => {
  const [box, setBox] = useState({})
  const [imageUrl, setImageUrl] = useState("")
  const [input, setInput] = useState("")


  const calculateFaceBox = response => {
    console.log(response)
    const clarifaiFace =
      response.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById("inputimage");
    const width = Number(image.width);
    const height = Number(image.height);

    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - clarifaiFace.right_col * width,
      bottomRow: height - clarifaiFace.bottom_row * height
    };
  };


  const onInputChange = event => {
    setInput(event.target.value);
  };

  const getClarifaiData = async () => {
    const response = await fetch("https://enigmatic-wildwood-25695.herokuapp.com/imageurl", {
      method: "post",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        input: input
      })
    })
    return await response.json()
  }

  const onButtonSubmit = async () => {
    setImageUrl(input);
    const clarifaiData = await getClarifaiData()
    const faceBox = calculateFaceBox(clarifaiData)
    setBox(faceBox)
  }

  return (
    <div className="App">
      <Particles className="particles" params={particlesOptions}/>
      <div>
        <ImageLinkForm
          onInputChange={onInputChange}
          onButtonSubmit={onButtonSubmit}
        />
        <FaceRecognition box={box} imageUrl={imageUrl}/>
      </div>
    </div>

  )
}

export default App;
