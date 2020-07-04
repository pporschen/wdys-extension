const style = `#overlay {
    height: 100vh;
    width: 100vw;
    background-color: #ffffff;
    position: fixed;
    top: 0;
    margin: 0;
    z-index: 1;
    display: none;
    opacity: 0;
    -webkit-animation: flash 1s;
    animation: flash 1s;
    animation-fill-mode: initial;
  }
  
  @-webkit-keyframes flash {
    0% {
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  }
  @keyframes flash {
    0% {
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  }`

  export default style;