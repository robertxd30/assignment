import React, { useState } from "react";
import { UserInterface } from "../Interfaces/UserInterface";
import axios from "axios";
import { BACKEND_API_URL } from "../constants";
import { useAtom } from "jotai";
import { userAtom } from "../atoms";

function UserItem(props: UserInterface) {
  const [isSelected, setIsSelected] = useState(false);
  const [users, setUsers] = useAtom(userAtom);
  const [toggleName, setToggleName] = useState(false);
  const [userName, setUserName] = useState(props.name);
  const [toggleEmail, setToggleEmail] = useState(false);
  const [userEmail, setUserEmail] = useState(props.email);

  const deleteUser = () => {
    let config = {
      method: "delete",
      url: `${BACKEND_API_URL}/user/${props._id}`,
    };
    axios(config)
      .then(function (response) {
        console.log(JSON.stringify(response.data));
        setUsers(users.filter((user) => user._id != props._id));
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const saveUser = () => {
    let config = {
      method: "put",
      url: `${BACKEND_API_URL}/user/${props._id}`,
      data: {
        name: userName,
        email: userEmail,
      },
    };
    axios(config)
      .then(function (response) {
        setUsers(users.map((user, i) =>
          user._id === props._id ? { _id : user._id, name: props.name, email:props.email } : user
        ))
        setToggleName(false);
        setToggleEmail(false);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  return (
    <tr>
      <td>
        <div className="flex items-center ml-1">
          <input
            id="link-checkbox"
            type="checkbox"
            checked={isSelected}
            onChange={(e) => setIsSelected(e.target.checked)}
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
          />
          <label className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"></label>
        </div>
      </td>
      <td onDoubleClick={(e) => setToggleName(true)}>
        {!toggleName ? (
          <span>{userName}</span>
        ) : (
          <input
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
          ></input>
        )}
      </td>
      <td onDoubleClick={(e) => setToggleEmail(true)}>
        {" "}
        {!toggleEmail ? (
          <span>{userEmail}</span>
        ) : (
          <input
            value={userEmail}
            onChange={(e) => setUserEmail(e.target.value)}
            className="text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
          ></input>
        )}
      </td>
      <td className="flex gap-1 justify-center">
        <button
          onClick={(e) => deleteUser()}
          className={
            isSelected
              ? "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded"
              : "bg-blue-500 text-white font-bold py-2 px-4 rounded opacity-50 cursor-not-allowed"
          }
          disabled={!isSelected}
        >
          Delete
        </button>
        <button
          onClick={(e) => saveUser()}
          className={
            toggleName || toggleEmail
              ? "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded"
              : "bg-blue-500 text-white font-bold py-2 px-4 rounded opacity-50 cursor-not-allowed"
          }
          disabled={!(toggleName || toggleEmail)}
        >
          Save
        </button>
      </td>
    </tr>
  );
}

export default UserItem;
