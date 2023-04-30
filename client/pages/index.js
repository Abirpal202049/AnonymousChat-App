import { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io.connect("http://localhost:3001"); // we can use this variable to emit or listen to an event

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

// console.log(formatAMPM(new Date));


export default function Home() {
  const [message, setMessage] = useState("");
  const [allMessages, setAllMessages] = useState([]);

  const sendMessage = (e) => {
    // Emiting ===> Sending (to Backend) 1
    socket.emit("send_message", { message, user: "user1", time : formatAMPM(new Date) });

    let data = { message, user: "user1" , time : formatAMPM(new Date)};
    setAllMessages([...allMessages, data]);

    setMessage("");
    e.preventDefault();
  };

  useEffect(() => {
    // Listening ===> Reciving (from Backend) 4
    socket.on("recive_message", (data) => {
      // console.log("Data : ", data);
      data.user = "user2";
      setAllMessages([...allMessages, data]);
    });
  }, [socket, allMessages]);

  // console.log(allMessages);

  return (
    <div className="max-w-[1200px] mx-auto">
      {/* Message Form */}
      <form onSubmit={sendMessage} className="h-[45px] flex my-5 mx-auto  w-fit gap-5">
        <input
          type="text"
          placeholder="Enter your message"
          value={message}
          onChange={(event) => {
            setMessage(event.target.value);
          }}
          className="border py-2 px-5 rounded-md border-black focus:outline-none w-[600px]"
        />

        <button
          type="submit"
          className="bg-[#166958] py-2 px-10 rounded font-semibold text-base shadow transition-all duration-200 hover:shadow-none hover:bg-green-700  text-white leading-4"
        >
          Send Message
        </button>
      </form>

      {/* All messages */}
      <div className="max-w-7xl mx-auto p-10 text-white flex flex-col gap-1 message-container text-[14.2px] font-sans">
        {allMessages?.map((ele, i) => {
          let d = allMessages[0].user;
          {/* console.log("User Detail : ", d); */}
          return (
            <div
              className={`relative text-clip break-words w-fit max-w-[400px] px-5 py-1 rounded-b-[7.5px] text-md   shadow flex flex-col
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
            </div>
          );
        })}
      </div>

      
    </div>
  );
}
