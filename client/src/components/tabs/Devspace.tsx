import axios from 'axios';
import { useUserStore } from '../store/userStore';

const Devspace = () => {
    const { user } = useUserStore();

    const joinDevspace = async () => {
        const response = await axios.post('/api/devspace/join', {
            userId: user._id
        });
    }
  return (
    <div>
        <button onClick={joinDevspace}>Join Devspace</button>
    </div>
  )
}

export default Devspace