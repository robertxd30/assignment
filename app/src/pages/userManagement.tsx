import React, { useEffect, useState } from "react";
import { useAtom } from "jotai";
import { userAtom } from "../atoms";
import axios from "axios";
import UserItem from "../component/UserItem";
import { BACKEND_API_URL } from "../constants";

function UserManagement() {
  const [users, setUsers] = useAtom(userAtom);
  const [newUserName, setNewUserName] = useState("");
  const [newEmail, setNewEmail] = useState("");

  useEffect(() => {
    let config = {
      method: "get",
      url: `${BACKEND_API_URL}/users`,
    };
    axios(config).then(function (response) {
      setUsers(response.data);
    });
  }, []);

  const addNewUser = () => {
    let config = {
      method: "post",
      url: "http://localhost:8080/api/users",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      data: {
        name: newUserName,
        email: newEmail,
      },
    };

    axios(config)
      .then(function (response) {
        setUsers([...users, response.data])
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  return (
    <div className="App">
      <header className="App-header">
        <div className="flex gap-2 mb-5 text-black">
          <input
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            value={newUserName}
            placeholder="Input User name"
            onChange={(e) => setNewUserName(e.target.value)}
          ></input>
          <input
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            value={newEmail}
            placeholder="Input Email address"
            onChange={(e) => setNewEmail(e.target.value)}
          ></input>
          <button
            onClick={(e) => addNewUser()}
            className={
              "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded"
            }
          >
            New
          </button>
        </div>

        <table className="w-full text-black">
          <tbody>
            <tr>
              <th></th>
              <th>Username</th>
              <th>email</th>
              <th></th>
            </tr>
            {users.map((user, index) => (
              <UserItem
                key={index}
                _id={user._id}
                name={user.name}
                email={user.email}
              />
            ))}
          </tbody>
        </table>
      </header>
    </div>
  );
}

export default UserManagement;
