import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebaseconfig";
import { addDetail } from "../utils";
import { ThreeDots } from "react-loader-spinner";
import { useSelector } from "react-redux";
import App1 from "../qr-code";

function Logger() {
  let [id1,setId1]=useState();
  const idRef = useRef();
  const placeRef = useRef();
  const dateRef = useRef();
  const [error, setError] = useState();
  const [adding, setAdding] = useState(false);
  const walletUser = useSelector((state) => state.walletUser);
  const user = useSelector((store) => store.user);
  const addOnBlockchain = async () => {
    const id = id1;
    // console.log("id");
    const place = "Dwarka,New";
    const date = new Date();
    const timeStamp = Date.parse(date) / 1000;
    if (id.length == 0 || place.length == 0 || date.length == 0) return;
    const docRef = doc(db, `orders`, id);
    const docSnap = await getDoc(docRef);
    // console.log(docSnap.data());
    if (docSnap.exists()) {
      let order = docSnap.data();
      setAdding(true);
      await addDetail(order.timeStamp, place, timeStamp);
      setAdding(false);
    } else {
      setError("No Such Order Exist !");
      setTimeout(() => setError(""), 5000);
    }
  };

  return (
    <div
      className="py-4 w-screen scrollbar-hide  h-screen
    px-4 md:px-16 gap-4 flex justify-center items-center"
    >
    <App1 setId={(id)=>{
            setId1(id);
          }}/>
      <div
        className="w-[600px] h-[400px] bg-gradient-to-b 
       from-[#232f3e] to-[#131921] shadow-lg  shadow-gray-300/90 rounded-md p-4"
      >
        <p className="text-center text-[20px] text-white font-black tracking-wide py-4">
          Details Form
        </p>
        <div className="flex justify-center items-center w-full flex-wrap gap-6">
          <input
            type="text"
            value={id1}
            placeholder="Enter The Order Id"
            className="px-2 py-2 w-full outline-none rounded-md   shadow-sm shadow-gray-500"
            readonly
          />
          {error?.length > 0 ? (
            <div className="text-red-500 -my-4">{error}</div>
          ) : null}

          {adding && (
            <div className="bg-orange-600 px-4 py-2 rounded-md my-4 flex justify-center items-center">
              <ThreeDots height="24" width="152" radius="1" color="#FFFFFF" />
            </div>
          )}
          {!adding && (
            <motion.button
              disabled={!walletUser}
              onClick={addOnBlockchain}
              whileTap={{ scale: 0.96 }}
              className="bg-orange-600 px-4 py-2 rounded-md
         text-white my-4"
            >
              {" "}
              {walletUser ? "Add On BlockChain" : "Connect To Wallet !"}
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Logger;
