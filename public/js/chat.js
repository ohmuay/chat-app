const socket = io();

//Elements
const $messageForm = document.querySelector("form")
const $messageFormInput = $messageForm.querySelector("input")
const $messageFormButton = $messageForm.querySelector("button")

const $sendLocationButton = document.querySelector("#location")

const $messageTemplate = document.querySelector("#message-template").innerHTML
const $locationTemplate = document.querySelector("#location-message-template").innerHTML
const $sideBarTemplate = document.querySelector("#side-bar").innerHTML

const $messages = document.querySelector("#messages")
const $location = document.querySelector("#location-url")
const $side = document.querySelector("#side")

const {username , room} =  Qs.parse(location.search,{ignoreQueryPrefix:true})



socket.on("message", (message) => {
  const html = Mustache.render($messageTemplate,
    {
    username:message.username,
    message:message.text,
    createdAt:moment(message.createdAt).format('h:mm a')
  })
  $messages.insertAdjacentHTML("beforeend",html)

  // console.log(text);
});


socket.on("roomData",({room,users})=>{
  const html = Mustache.render($sideBarTemplate,{
    room,
    users
  })

  $side.innerHTML = html
})


socket.on("sendLocationMessage",(location)=>{
  const html = Mustache.render($locationTemplate,{
    username:location.username,
    url:location.url,
    createdAt:moment(location.createdAt).format('h:mm a')
  })
  $messages.insertAdjacentHTML("beforeend",html)
})









$messageForm.addEventListener("submit", (e) => {
  e.preventDefault();
  $messageFormButton.setAttribute("disabled","disabled")

  const msg = $messageFormInput.value;
  socket.emit("submission", msg,()=>{
    $messageFormButton.removeAttribute("disabled")
  });
  $messageFormInput.value = ''
  $messageFormInput.focus()
  
});

$sendLocationButton.addEventListener("click", () => {
  if (!navigator.geolocation) {
    return alert("Your browser does not support geolocation");
  }
  $sendLocationButton.setAttribute("disabled","disabled")
  navigator.geolocation.getCurrentPosition((location) => {

    socket.emit("sendLocation",{
      latitude: location.coords.latitude,
      longtitude: location.coords.longitude,
    },(acknowledgement)=>{
        $sendLocationButton.removeAttribute("disabled")
        console.log(acknowledgement);
    });
  });
});

socket.emit("join",{username,room},(error)=>{
  if(error){
    alert(error)
    location.href = '/'
  }
})