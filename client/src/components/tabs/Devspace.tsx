import axios from 'axios';
import useUserStore from '../../stores/userStore';

const Devspace = () => {
    const { user } = useUserStore();

    const joinDevspace = async () => {
        const response = await axios.post('/api/devspace/join', {
            userId: user._id
        });

        console.log(response.data);
    }
  return (
    <div>
        <button onClick={joinDevspace}>Join Devspace</button>
    </div>
  )
}

export default Devspace