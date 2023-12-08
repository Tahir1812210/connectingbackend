import { CanceledError } from '../services/api-client';
import { useEffect, useState } from "react";
import userService, { User } from "../services/user-service";

const useUsers = () =>
{
    const [users, setUsers] = useState<User[]>([]);
    const [error, setError] = useState<string | undefined>('');
    const [Loading, setLoading] = useState(false);
  
    useEffect(() => {
      setLoading(true);
      const { request, cancel } = userService.getAll<User>();
      request
        .then((res) => {
          setUsers(res.data);
          setLoading(false);
        })
        .catch((err) => {
          if (err instanceof CanceledError) {
            throw new CanceledError('Request canceled');
          } else {
            setError(err.message);
          }
        });
  
      return () => cancel();
    }, []);

    return {users, error , Loading, setUsers, setError}
}

export default useUsers