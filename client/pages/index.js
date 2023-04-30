import { useEffect, useState, useRef  } from "react";
import io from "socket.io-client";

const socket = io.connect("https://anonymouschatbackend-production.up.railway.app"); // we can use this variable to emit or listen to an event

function formatAMPM(date) {
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0'+minutes : minutes;
  var strTime = hours + ':' + minutes + ' ' + ampm;
  return strTime;
}


export default function Home() {
  const [message, setMessage] = useState("");
  const [allMessages, setAllMessages] = useState([]);
  const containerRef = useRef(null);

  const sendMessage = (e) => {
    if (message !== ""){
      // Emiting ===> Sending (to Backend) 1
      socket.emit("send_message", { message, user: "user1", time : formatAMPM(new Date) });
  
      let data = { message, user: "user1" , time : formatAMPM(new Date)};
  
      // Pushing the message I send
      setAllMessages([...allMessages, data]);
  
      setMessage("");
      // e.preventDefault();
    }
  };



  useEffect(() => {
    // Listening ===> Reciving (from Backend) 4
    socket.on("recive_message", (data) => {
      data.user = "user2";

      // Pushing the message I recived
      setAllMessages([...allMessages, data]);
    });

    containerRef.current.scrollTop = containerRef.current.scrollHeight;
  }, [socket, allMessages]);



  return (
    <div className="max-w-[1200px] mx-auto ">
      {/* Message Form */}
      

      {/* All messages */}
      <div ref={containerRef} className="max-w-7xl p-10 text-white flex flex-col gap-1 message-container text-[14.2px] font-sans overflow-y-auto shadow-[0px_4px_16px_rgba(17,17,26,0.1),_0px_8px_24px_rgba(17,17,26,0.1),_0px_16px_56px_rgba(17,17,26,0.1)] rounded-lg mx-4 mt-5 chatbox">
        {allMessages?.map((ele, i) => {
          return (
            <p
              className={` relative text-clip break-words w-fit max-w-[400px] px-5 py-1 rounded-b-[7.5px] text-md shadow flex flex-col
              ${
                ele.user === "user1"
                  ? `bg-[#166958] self-end  ${
                      i === 0 || allMessages[i - 1]["user"] !== ele.user
                        ? "rounded-l-[7.5px] make_triangle_block_right"
                        : "rounded-[7.5px]"
                    }`
                  : `bg-[#202c33] ${
                      i === 0 || allMessages[i - 1]["user"] !== ele.user
                        ? "rounded-r-[7.5px] make_triangle_block_left"
                        : "rounded-[7.5px]"
                    }`
              } 
              
              `}
              key={i}
            >
              {ele?.message}
              <div className="text-[9px] w-fit mt-2 self-end">
                {ele?.time}
              </div>
            </p>
          );
        })}
      </div>


      <div className="h-[45px] flex my-5 mx-auto w-fit gap-5 ">
        <input
          type="text"
          placeholder="Enter your message"
          value={message}
          onChange={(event) => {
            setMessage(event.target.value);
          }}
          onKeyPress={(event) => {
            event.key === "Enter" && sendMessage()
          }}
          className=" py-2 px-5 rounded-full border-black focus:outline-none  sm:w-[450px] lg:w-[600px] shadow-black/40 shadow"
        />

        <button
          onClick={sendMessage}
          className="bg-[#166958] py-2 px-7 sm:px-10 shadow-black/40 shadow font-semibold text-base transition-all duration-200 hover:shadow-none   text-white leading-4 rounded-full"
        >
          Send 
        </button>
      </div>
    </div>
  );
}
