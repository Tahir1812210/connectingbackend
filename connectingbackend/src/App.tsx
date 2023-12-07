import React, { useRef, useEffect, useState } from 'react';
import axios, { CancelToken, Canceler } from 'axios';

interface User {
  id: number;
  name: string;
}

class CanceledError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CanceledError';
  }
}

const App = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | undefined>('');
  const controller = useRef<AbortController | null>(null);

  useEffect(() => {
    controller.current = new AbortController();

    axios
      .get<User[]>('https://jsonplaceholder.typicode.com/users', {
        signal: controller.current?.signal,
      })
      .then((res) => setUsers(res.data))
      .catch((err) => {
        if (axios.isCancel(err)) {
          throw new CanceledError('Request canceled');
        } else {
          setError(err.message);
        }
      });

    return () => {
      if (controller.current) controller.current.abort();
    };
  }, []);

  const deleteUser = (user: User) => {
    const originalUsers = [...users];
    setUsers((prevUsers) => prevUsers.filter((u) => u.id !== user.id));
    axios
      .delete('https://jsonplaceholder.typicode.com/users/' + user.id)
      .catch((err) => {
        setError(err.message);
        setUsers(originalUsers);
      });
  };

  const addUser = () => {
    const originalUsers = [...users];
    const newUser = { id: 0, name: 'Mosh' };
    setUsers([newUser, ...users]);
    axios
      .post(
        'https://mega.nz/folder/CsAzxLqb#SsA8UbuuvYGSwyGwlh3Obg/folder/jxxWmTCQ',
        newUser
      )
      .then(({ data: savedUser }) => setUsers([savedUser, ...users]))
      .catch((err) => {
        setError(err.message);
        setUsers(originalUsers);
      });
  };

  const updateUser = (user: User) => {
    const originalUsers = [...users];
    const updatedUser = { ...user, name: user.name + '!' };
    setUsers(users.map((u) => (u.id === user.id ? updatedUser : u)));
    axios
      .patch(
        'https://jsonplaceholder.typicode.com/users/' + user.id,
        updateUser
      )
      .catch((err) => {
        setError(err.message);
        setUsers(originalUsers);
      });
  };

  return (
    <div>
      {error && <p className="text-danger">{error}</p>}
      <button className="btn btn-primary mb-3" onClick={addUser}>
        Add
      </button>
      <ul className="list-group">
        {users.map((user) => (
          <li
            key={user.id}
            className="list-group-item d-flex justify-content-between align-items-center"
          >
            {user.name}
            <div>
              <button
                className="btn btn-outline-secondary mx-1"
                onClick={() => updateUser(user)}
              >
                Update
              </button>
              <button
                className="btn btn-outline-danger"
                onClick={() => deleteUser(user)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
